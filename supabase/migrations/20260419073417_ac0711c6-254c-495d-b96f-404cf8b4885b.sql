-- A. Payment RPC hardening: service-role-only gate + EXECUTE lockdown
CREATE OR REPLACE FUNCTION public.process_stripe_payment(
  p_event_id text,
  p_event_type text,
  p_enrollment_id uuid,
  p_user_id uuid,
  p_payment_intent text,
  p_amount_cents integer,
  p_expected_amount_cents integer,
  p_is_refund boolean DEFAULT false
)
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

REVOKE EXECUTE ON FUNCTION public.process_stripe_payment(text,text,uuid,uuid,text,integer,integer,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_stripe_payment(text,text,uuid,uuid,text,integer,integer,boolean) TO service_role;

-- B. Ledger atomic seal + immutability
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ledger_transactions_stripe_event_id_key'
  ) THEN
    ALTER TABLE public.ledger_transactions
      ADD CONSTRAINT ledger_transactions_stripe_event_id_key UNIQUE (stripe_event_id);
  END IF;
END$$;

DROP TRIGGER IF EXISTS ledger_immutable_update ON public.ledger_transactions;
DROP TRIGGER IF EXISTS ledger_immutable_delete ON public.ledger_transactions;
CREATE TRIGGER ledger_immutable_update BEFORE UPDATE ON public.ledger_transactions
  FOR EACH ROW EXECUTE FUNCTION public.prevent_ledger_modification();
CREATE TRIGGER ledger_immutable_delete BEFORE DELETE ON public.ledger_transactions
  FOR EACH ROW EXECUTE FUNCTION public.prevent_ledger_modification();

REVOKE INSERT, UPDATE, DELETE ON public.ledger_transactions FROM anon, authenticated;
GRANT INSERT ON public.ledger_transactions TO service_role;

-- C. Profiles practical role lock
CREATE OR REPLACE FUNCTION public.lock_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
       AND NOT public.has_role(auth.uid(), 'admin'::user_role) THEN
      RAISE EXCEPTION 'role change not allowed directly';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lock_profile_role_trigger ON public.profiles;
CREATE TRIGGER lock_profile_role_trigger BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.lock_profile_role();

REVOKE UPDATE (role) ON public.profiles FROM authenticated;

-- D. Harden handle_new_user with explicit client role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'client'::user_role);
  RETURN NEW;
END;
$$;

-- E. Carry-over findings
-- E1. orders SELECT-own
DROP POLICY IF EXISTS "Users read own orders" ON public.orders;
CREATE POLICY "Users read own orders"
ON public.orders FOR SELECT TO authenticated
USING (lower(customer_email) = lower(auth.jwt() ->> 'email'));

-- E2. email_unsubscribe_tokens — recreate policies targeted at service_role directly
DROP POLICY IF EXISTS "Service role can insert tokens" ON public.email_unsubscribe_tokens;
DROP POLICY IF EXISTS "Service role can mark tokens as used" ON public.email_unsubscribe_tokens;
DROP POLICY IF EXISTS "Service role can read tokens" ON public.email_unsubscribe_tokens;

CREATE POLICY "Service role can insert tokens"
ON public.email_unsubscribe_tokens FOR INSERT TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can mark tokens as used"
ON public.email_unsubscribe_tokens FOR UPDATE TO service_role
USING (true) WITH CHECK (true);

CREATE POLICY "Service role can read tokens"
ON public.email_unsubscribe_tokens FOR SELECT TO service_role
USING (true);

-- E3. suppressed_emails — recreate service-role policies targeted at service_role directly
DROP POLICY IF EXISTS "Service role can insert suppressed emails" ON public.suppressed_emails;
DROP POLICY IF EXISTS "Service role can read suppressed emails" ON public.suppressed_emails;

CREATE POLICY "Service role can insert suppressed emails"
ON public.suppressed_emails FOR INSERT TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can read suppressed emails"
ON public.suppressed_emails FOR SELECT TO service_role
USING (true);