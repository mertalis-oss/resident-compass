## Plan: Harden `email_send_state` and re-confirm SECURITY DEFINER lockdown

### Current state (verified against the live database)

- `email_send_state` — RLS is enabled but has **zero policies**. Default-deny is active, but the linter wants the intent declared explicitly.
- All sensitive `SECURITY DEFINER` functions (`process_stripe_payment`, `enqueue_email`, `read_email_batch`, `move_to_dlq`, `delete_email`, `auto_assign_founder_admin`, `lock_profile_role`, `handle_new_user`, `enforce_ai_rate_limit`, `enforce_state_transition`) **already** have `EXECUTE` revoked from `anon` and `authenticated` (from the previous migration). Only `service_role` and `postgres` retain access.
- `has_role` and `check_visa_status` retain `EXECUTE` for `authenticated` — intentional, untouched.
- Trigger-only helpers `update_updated_at_column` and `prevent_ledger_modification` still have `EXECUTE` for `anon`/`authenticated`. Per your instruction "do not modify trigger functions", these are left as-is.

### Changes (single migration)

**1. `email_send_state` — add explicit policies**

- `SELECT` policy: admins only, via `public.has_role(auth.uid(), 'admin'::user_role)`.
- `INSERT`, `UPDATE`, `DELETE` policies: explicit deny (`WITH CHECK false` / `USING false`) for the `authenticated` role.
- `service_role` bypasses RLS, so the email queue edge function continues to read/write normally.

**2. `SECURITY DEFINER` functions — idempotent re-revoke**

Re-issue `REVOKE EXECUTE ... FROM anon, authenticated, public` on the sensitive functions (no-op where already revoked, hardens anything that drifted). Excludes `has_role`, `check_visa_status`, and trigger-only functions per your instruction.

### What this does NOT change

- `has_role`, `check_visa_status` — untouched (intentional client access).
- `update_updated_at_column`, `prevent_ledger_modification` — untouched (trigger functions, per your instruction).
- Edge functions, app code, types — no client-side changes needed.

### Expected linter outcome

- `email_send_state_no_policy` warning → resolved.
- The remaining `SUPA_authenticated_security_definer_function_executable` warning will continue to flag `has_role` and `check_visa_status` only. Already documented as intentional in the security findings.

### Approval

Once approved, I'll switch to build mode and run the single migration.