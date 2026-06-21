-- Security fix migration — 2026-06-19
-- Addresses 2 CRITICAL findings from Supabase Security Advisor:
--   1) "Orders readable by email match without strong verification"
--   2) "RLS references user metadata" (user-mutable, auth bypass risk)
--
-- Strategy:
--   - Drop existing "Users read own orders" SELECT policy
--   - Recreate with:
--     * Registered users: STRICT user_id match (auth.uid() = user_id)
--     * Guest checkout (user_id IS NULL): require Supabase-managed email_verified
--       (NOT user_metadata.email_verified which is user-mutable via signUp options)
--
-- Backwards compatible: app code already passes user_id when known; guest checkout
-- still works for users who completed Stripe checkout without registering, as long
-- as they then sign up + verify email with the same address used at checkout.

DROP POLICY IF EXISTS "Users read own orders" ON public.orders;

CREATE POLICY "Users read own orders"
ON public.orders FOR SELECT TO authenticated
USING (
  -- Path 1 (preferred): registered user matches by user_id
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR
  -- Path 2 (guest checkout fallback): only for legacy/guest orders with user_id NULL
  -- Requires Supabase-managed email_verified flag (immutable by user)
  -- AND lowercase email match
  (
    user_id IS NULL
    AND (auth.jwt() ->> 'email_verified')::boolean = true
    AND lower(customer_email) = lower(auth.jwt() ->> 'email')
  )
);

COMMENT ON POLICY "Users read own orders" ON public.orders IS
  'Security fix 2026-06-19: Removed user_metadata reference (user-mutable, auth bypass risk). Registered users: strict user_id = auth.uid(). Guest fallback requires Supabase top-level email_verified.';
