-- Fix 1 & 3: Lock down profiles role escalation by hardcoding 'client' in WITH CHECK
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid()
  AND role = 'client'::user_role
);

-- Fix 2: Restrict process_stripe_payment RPC to service_role only
REVOKE EXECUTE ON FUNCTION public.process_stripe_payment(
  text, text, uuid, uuid, text, integer, integer, boolean
) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.process_stripe_payment(
  text, text, uuid, uuid, text, integer, integer, boolean
) FROM authenticated, anon;
GRANT EXECUTE ON FUNCTION public.process_stripe_payment(
  text, text, uuid, uuid, text, integer, integer, boolean
) TO service_role;