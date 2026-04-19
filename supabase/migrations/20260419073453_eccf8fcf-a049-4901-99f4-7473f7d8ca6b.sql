DROP POLICY IF EXISTS "Service role manages webhooks" ON public.stripe_webhook_events;
DROP POLICY IF EXISTS "Service role can manage send state" ON public.email_send_state;
DROP POLICY IF EXISTS "Service role can update send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Service role can insert send log" ON public.email_send_log;