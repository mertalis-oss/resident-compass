
-- 1. Ledger payment-level idempotency (one payment row per enrollment)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_enrollment_payment
  ON public.ledger_transactions (enrollment_id)
  WHERE tx_type = 'payment';

-- 2. Strict state validation in process_stripe_payment
CREATE OR REPLACE FUNCTION public.process_stripe_payment(p_event_id text, p_event_type text, p_enrollment_id uuid, p_user_id uuid, p_payment_intent text, p_amount_cents integer, p_expected_amount_cents integer, p_is_refund boolean DEFAULT false)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_enrollment RECORD;
  v_row_count INT;
  v_refundable_balance INT;
BEGIN
  -- Service-role-only gate (deterministic, NULL-safe)
  IF COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role' THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  -- Atomic Idempotency
  INSERT INTO stripe_webhook_events (id, type) VALUES (p_event_id, p_event_type) ON CONFLICT (id) DO NOTHING;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  -- Concurrency Protection
  SELECT * INTO v_enrollment FROM enrollments WHERE id = p_enrollment_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Enrollment % not found', p_enrollment_id; END IF;

  -- Spoof Protection
  IF v_enrollment.user_id != p_user_id THEN RAISE EXCEPTION 'Spoofing attempt.'; END IF;

  -- Strict State Validation (V44): reject payments on enrollments not pending deposit
  IF NOT p_is_refund AND v_enrollment.status <> 'pending_deposit' THEN
    RAISE EXCEPTION 'Invalid state transition: Enrollment is not pending a deposit.';
  END IF;

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
$function$;

-- 3. Orders RLS: NULL JWT email guard
DROP POLICY IF EXISTS "Users read own orders" ON public.orders;
CREATE POLICY "Users read own orders"
ON public.orders FOR SELECT TO authenticated
USING (
  auth.jwt() ->> 'email' IS NOT NULL
  AND lower(customer_email) = lower(auth.jwt() ->> 'email')
);
