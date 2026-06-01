-- 1) Harden email_send_state: explicitly block anon and revoke any default grants
REVOKE ALL ON public.email_send_state FROM anon;
REVOKE ALL ON public.email_send_state FROM PUBLIC;

CREATE POLICY "Block anon select on email send state"
ON public.email_send_state
FOR SELECT
TO anon
USING (false);

-- 2) Harden leads: explicitly block any non-staff INSERT and revoke INSERT grants
REVOKE INSERT ON public.leads FROM anon;
REVOKE INSERT ON public.leads FROM authenticated;
REVOKE INSERT ON public.leads FROM PUBLIC;

CREATE POLICY "Block non-staff insert on leads"
ON public.leads
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

-- 3) Harden orders: add user_id linkage column and tighten ownership policy.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid;
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- Drop the spoofable email-only policy and replace with a stricter one:
-- Primary: match by user_id. Secondary: email match ONLY when user_id is unset
-- AND the JWT email is verified, to prevent reuse-after-deletion read access.
DROP POLICY IF EXISTS "Users read own orders" ON public.orders;

CREATE POLICY "Users read own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR (
    user_id IS NULL
    AND (auth.jwt() ->> 'email') IS NOT NULL
    AND COALESCE((auth.jwt() -> 'user_metadata' ->> 'email_verified')::boolean, (auth.jwt() ->> 'email_verified')::boolean, false) = true
    AND lower(customer_email) = lower(auth.jwt() ->> 'email')
  )
);