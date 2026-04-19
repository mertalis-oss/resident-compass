DROP POLICY IF EXISTS "Service role can read send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Admins read email send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Admins read email send state" ON public.email_send_state;

ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_send_state ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.email_send_log FROM anon, authenticated;
REVOKE ALL ON public.email_send_state FROM anon, authenticated;