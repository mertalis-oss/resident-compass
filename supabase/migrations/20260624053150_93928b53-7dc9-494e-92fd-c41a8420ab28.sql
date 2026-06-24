DROP POLICY IF EXISTS "Users read own orders" ON public.orders;

CREATE POLICY "Users read own orders"
ON public.orders FOR SELECT TO authenticated
USING (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR
  (
    user_id IS NULL
    AND (auth.jwt() ->> 'email_verified')::boolean = true
    AND lower(customer_email) = lower(auth.jwt() ->> 'email')
  )
);

COMMENT ON POLICY "Users read own orders" ON public.orders IS
  'Security fix 2026-06-19: Removed user_metadata reference (user-mutable). user_id match preferred; guest fallback requires Supabase-managed email_verified.';