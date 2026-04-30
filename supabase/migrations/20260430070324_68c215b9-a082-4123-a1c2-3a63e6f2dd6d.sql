
-- 1. Explicit RLS policies on email_send_state
CREATE POLICY "Admins read email send state"
ON public.email_send_state
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Block authenticated insert on email send state"
ON public.email_send_state
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Block authenticated update on email send state"
ON public.email_send_state
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Block authenticated delete on email send state"
ON public.email_send_state
FOR DELETE
TO authenticated
USING (false);

-- 2. Idempotent re-revoke of EXECUTE on sensitive SECURITY DEFINER functions.
-- Excludes has_role, check_visa_status (intentional client access)
-- and trigger-only functions (per instruction).
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
