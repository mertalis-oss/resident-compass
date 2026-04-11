
-- 1. Fix leads: remove open UPDATE policy, add staff-only UPDATE
DROP POLICY IF EXISTS "Allow upsert on leads" ON public.leads;

CREATE POLICY "Staff update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'agent'::user_role))
WITH CHECK (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'agent'::user_role));

-- 2. Fix ledger_transactions: change from public to authenticated
DROP POLICY IF EXISTS "Admins read ledger" ON public.ledger_transactions;
DROP POLICY IF EXISTS "Users read own ledger" ON public.ledger_transactions;

CREATE POLICY "Admins read ledger"
ON public.ledger_transactions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Users read own ledger"
ON public.ledger_transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 3. Fix stripe_webhook_failures: change from public to authenticated
DROP POLICY IF EXISTS "Admins manage webhook failures" ON public.stripe_webhook_failures;

CREATE POLICY "Admins manage webhook failures"
ON public.stripe_webhook_failures
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::user_role));

-- 4. Fix stripe_webhook_metrics: change from public to authenticated
DROP POLICY IF EXISTS "Admins read webhook metrics" ON public.stripe_webhook_metrics;

CREATE POLICY "Admins read webhook metrics"
ON public.stripe_webhook_metrics
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::user_role));

-- 5. Fix enqueue_email search_path
CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name text, payload jsonb)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$function$;
