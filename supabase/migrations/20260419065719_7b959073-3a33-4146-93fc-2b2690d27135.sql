-- Admin SELECT on suppressed_emails
CREATE POLICY "Admins can read suppressed emails"
ON public.suppressed_emails FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::user_role));

-- Explicit block policies on webhook_logs for authenticated/anon
CREATE POLICY "Block authenticated insert on webhook logs"
ON public.webhook_logs FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Block authenticated update on webhook logs"
ON public.webhook_logs FOR UPDATE TO authenticated
USING (false);

CREATE POLICY "Block authenticated delete on webhook logs"
ON public.webhook_logs FOR DELETE TO authenticated
USING (false);

-- Service role explicit ALL
CREATE POLICY "Service role manages webhook logs"
ON public.webhook_logs FOR ALL TO service_role
USING (true) WITH CHECK (true);