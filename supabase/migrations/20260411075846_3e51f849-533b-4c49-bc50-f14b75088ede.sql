
-- 1. Fix privilege escalation: prevent users from changing their own role
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Users update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role IS NOT DISTINCT FROM (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()));

-- 2. Lock down stripe_webhook_events for authenticated users
-- Block authenticated INSERT
CREATE POLICY "Block authenticated insert on webhook events"
ON public.stripe_webhook_events
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Block authenticated DELETE
CREATE POLICY "Block authenticated delete on webhook events"
ON public.stripe_webhook_events
FOR DELETE
TO authenticated
USING (false);

-- Block authenticated SELECT
CREATE POLICY "Block authenticated select on webhook events"
ON public.stripe_webhook_events
FOR SELECT
TO authenticated
USING (false);

-- Block authenticated UPDATE
CREATE POLICY "Block authenticated update on webhook events"
ON public.stripe_webhook_events
FOR UPDATE
TO authenticated
USING (false);
