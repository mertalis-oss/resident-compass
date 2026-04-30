
-- 1. Add explicit admin-only RLS policies on email_unsubscribe_tokens
CREATE POLICY "Admins read unsubscribe tokens"
ON public.email_unsubscribe_tokens
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Block authenticated insert on unsubscribe tokens"
ON public.email_unsubscribe_tokens
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Block authenticated update on unsubscribe tokens"
ON public.email_unsubscribe_tokens
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Block authenticated delete on unsubscribe tokens"
ON public.email_unsubscribe_tokens
FOR DELETE
TO authenticated
USING (false);

-- 2. Lock down SECURITY DEFINER function execution
-- Revoke EXECUTE from anon and authenticated on all sensitive SECURITY DEFINER functions.
-- Trigger functions don't need EXECUTE grants. Edge functions use service_role which bypasses these grants.

REVOKE EXECUTE ON FUNCTION public.process_stripe_payment(text, text, uuid, uuid, text, integer, integer, boolean) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.auto_assign_founder_admin() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.lock_profile_role() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.enforce_ai_rate_limit() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.enforce_state_transition() FROM anon, authenticated, public;

-- has_role and check_visa_status are intentionally callable by signed-in users (used by AdminRoute, Dashboard, Login).
-- Revoke from anon and public, keep authenticated.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, user_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.check_visa_status(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_visa_status(uuid) TO authenticated;
