
-- 1. Enum
CREATE TYPE ledger_tx_type AS ENUM ('payment', 'refund');

-- 2. DLQ Table
CREATE TABLE stripe_webhook_failures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL,
  event_type text,
  error_message text,
  payload jsonb,
  retry_count int DEFAULT 0,
  processing_time_ms int,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE stripe_webhook_failures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage webhook failures" ON stripe_webhook_failures FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- 3. Webhook Metrics
CREATE TABLE stripe_webhook_metrics (
  event_type text PRIMARY KEY,
  success_count int DEFAULT 0,
  failure_count int DEFAULT 0,
  last_processed_at timestamptz DEFAULT now()
);
ALTER TABLE stripe_webhook_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read webhook metrics" ON stripe_webhook_metrics FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- 4. Immutable Ledger
CREATE TABLE ledger_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  enrollment_id uuid REFERENCES enrollments(id),
  tx_type ledger_tx_type NOT NULL,
  amount_cents int NOT NULL,
  stripe_event_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_stripe_event UNIQUE (stripe_event_id)
);
ALTER TABLE ledger_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read ledger" ON ledger_transactions FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role));
CREATE POLICY "Users read own ledger" ON ledger_transactions FOR SELECT USING (user_id = auth.uid());

-- Immutability triggers
CREATE OR REPLACE FUNCTION prevent_ledger_modification() RETURNS trigger AS $$
BEGIN RAISE EXCEPTION 'Ledger is strictly immutable'; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER block_ledger_update BEFORE UPDATE ON ledger_transactions FOR EACH ROW EXECUTE FUNCTION prevent_ledger_modification();
CREATE TRIGGER block_ledger_delete BEFORE DELETE ON ledger_transactions FOR EACH ROW EXECUTE FUNCTION prevent_ledger_modification();

-- 5. Atomic FinTech RPC
CREATE OR REPLACE FUNCTION process_stripe_payment(
  p_event_id text, p_event_type text, p_enrollment_id uuid, p_user_id uuid,
  p_payment_intent text, p_amount_cents integer, p_expected_amount_cents integer, p_is_refund boolean DEFAULT false
) RETURNS boolean AS $$
DECLARE
  v_enrollment RECORD;
  v_row_count INT;
  v_refundable_balance INT;
BEGIN
  -- Atomic Idempotency
  INSERT INTO stripe_webhook_events (id, type) VALUES (p_event_id, p_event_type) ON CONFLICT (id) DO NOTHING;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  -- Concurrency Protection
  SELECT * INTO v_enrollment FROM enrollments WHERE id = p_enrollment_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Enrollment % not found', p_enrollment_id; END IF;

  -- Spoof Protection
  IF v_enrollment.user_id != p_user_id THEN RAISE EXCEPTION 'Spoofing attempt.'; END IF;

  -- Refund Balance Validation
  IF p_is_refund THEN
    SELECT COALESCE(SUM(CASE WHEN tx_type='payment' THEN amount_cents WHEN tx_type='refund' THEN -amount_cents END), 0)
    INTO v_refundable_balance
    FROM ledger_transactions WHERE enrollment_id = p_enrollment_id;
    IF p_amount_cents > v_refundable_balance THEN
      RAISE EXCEPTION 'Refund amount (% cents) exceeds refundable balance (% cents).', p_amount_cents, v_refundable_balance;
    END IF;
  ELSE
    IF p_amount_cents != p_expected_amount_cents THEN RAISE EXCEPTION 'Amount mismatch'; END IF;
  END IF;

  -- State Change
  IF p_is_refund THEN
    UPDATE enrollments SET status = 'refunded' WHERE id = p_enrollment_id;
  ELSE
    UPDATE enrollments SET status = 'deposit_paid', payment_intent_id = p_payment_intent WHERE id = p_enrollment_id AND status = 'pending_deposit';
  END IF;

  GET DIAGNOSTICS v_row_count = ROW_COUNT;
  IF v_row_count = 0 THEN RAISE EXCEPTION 'State transition failed'; END IF;

  -- Immutable Ledger Record
  INSERT INTO ledger_transactions (user_id, enrollment_id, tx_type, amount_cents, stripe_event_id)
  VALUES (p_user_id, p_enrollment_id, CASE WHEN p_is_refund THEN 'refund'::ledger_tx_type ELSE 'payment'::ledger_tx_type END, p_amount_cents, p_event_id);

  -- Observability Metrics
  INSERT INTO stripe_webhook_metrics (event_type, success_count, last_processed_at) VALUES (p_event_type, 1, now()) ON CONFLICT (event_type) DO UPDATE SET success_count = stripe_webhook_metrics.success_count + 1, last_processed_at = now();

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
