-- Phase 1: REVOKE EXECUTE from PUBLIC/anon/authenticated on internal trigger & background functions
-- and explicitly GRANT to service_role (defense in depth).
-- Does NOT touch: has_role, check_visa_status, leads policies/grants, sensitive table RLS.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'update_updated_at_column'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'auto_assign_founder_admin'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.auto_assign_founder_admin() FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.auto_assign_founder_admin() TO service_role;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'lock_profile_role'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.lock_profile_role() FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.lock_profile_role() TO service_role;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'enforce_state_transition'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.enforce_state_transition() FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.enforce_state_transition() TO service_role;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'enforce_ai_rate_limit'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.enforce_ai_rate_limit() FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.enforce_ai_rate_limit() TO service_role;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'prevent_ledger_modification'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.prevent_ledger_modification() FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.prevent_ledger_modification() TO service_role;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'enqueue_email'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'read_email_batch'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'delete_email'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'move_to_dlq'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'process_stripe_payment'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.process_stripe_payment(text, text, uuid, uuid, text, integer, integer, boolean) FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.process_stripe_payment(text, text, uuid, uuid, text, integer, integer, boolean) TO service_role;
  END IF;
END $$;