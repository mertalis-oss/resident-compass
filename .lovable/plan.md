

# V46 — Email Privacy Lockdown (Lean)

## Migration

```sql
-- Drop redundant service-role policies (RLS bypass makes them noise)
DROP POLICY IF EXISTS "Service role can read send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Admins read email send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Admins read email send state" ON public.email_send_state;

-- Ensure RLS is ON (default Deny-All for anon/authenticated)
ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_send_state ENABLE ROW LEVEL SECURITY;

-- Revoke all grants from external roles
REVOKE ALL ON public.email_send_log FROM anon, authenticated;
REVOKE ALL ON public.email_send_state FROM anon, authenticated;
```

## Findings management

After migration applies:
- **Mark fixed**: `email_send_log_public_exposure`, `email_send_state_no_policy` — resolved via RLS + REVOKE lockdown.
- **Ignore** (architectural): the `RLS enabled no policy` finding on these tables (intentional Deny-All) and the `profiles_role_update_bypass` finding (already mitigated by `lock_profile_role` trigger + column REVOKE + has_role pattern; static linter can't read triggers).

## Frozen / untouched

V44 ledger idempotency, V43 immutability triggers, profile role lock, payment RPC service-role gate, all app code.

## Verification

1. Anon/authenticated `SELECT * FROM email_send_log` → 0 rows / permission denied.
2. Anon/authenticated `SELECT * FROM email_send_state` → 0 rows / permission denied.
3. Service-role edge functions (`process-email-queue`) continue to read/write both tables (bypasses RLS).
4. Linter: 2 PII findings cleared; 2 architectural findings marked ignored with rationale.

