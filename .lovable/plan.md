

# V43 — Atomic Security Seal

Single migration. Surgical hardening of payment RPC + ledger + profile role lock. Adapts spec to the actual schema (ledger table is `ledger_transactions`; existing RPC uses `RETURNS boolean`).

## 1. Reality check (from current schema)

- Payment RPC is `process_stripe_payment(...) RETURNS boolean` — keep that signature; do NOT change to `void` (would break `stripe-webhook` edge function callsite).
- Ledger table is `public.ledger_transactions` (no `payment_intent_id` column; uses `stripe_event_id text NOT NULL`). Atomic idempotency is already enforced upstream by `stripe_webhook_events.id` PK + `ON CONFLICT DO NOTHING`. We will additionally enforce `UNIQUE(stripe_event_id)` on `ledger_transactions` as a defense-in-depth atomic seal.
- `prevent_ledger_modification()` exists but no triggers are attached (per `<db-triggers>` "no triggers"). We must wire it up + revoke writes.
- `lock_profile_role()` trigger does not yet exist (V41 plan referenced it but findings still show escalation path). We will create it now.
- Findings to mark fixed after apply: `profiles_role_escalation_via_has_role`, `orders_no_user_read_policy`, `email_unsubscribe_tokens_no_anon_block` (from prior turn — still pending).

## 2. Migration contents (single file)

**A. Payment RPC hardening** — `CREATE OR REPLACE FUNCTION public.process_stripe_payment(...)` keeping existing signature + body, adding at top:
```sql
SET search_path = public  -- already set
-- new first statement inside body:
IF COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role' THEN
  RAISE EXCEPTION 'unauthorized';
END IF;
```
Then:
```sql
REVOKE EXECUTE ON FUNCTION public.process_stripe_payment(text,text,uuid,uuid,text,integer,integer,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_stripe_payment(text,text,uuid,uuid,text,integer,integer,boolean) TO service_role;
```

**B. Ledger atomic seal + immutability**
```sql
ALTER TABLE public.ledger_transactions
  ADD CONSTRAINT ledger_transactions_stripe_event_id_key UNIQUE (stripe_event_id);

DROP TRIGGER IF EXISTS ledger_immutable_update ON public.ledger_transactions;
DROP TRIGGER IF EXISTS ledger_immutable_delete ON public.ledger_transactions;
CREATE TRIGGER ledger_immutable_update BEFORE UPDATE ON public.ledger_transactions
  FOR EACH ROW EXECUTE FUNCTION public.prevent_ledger_modification();
CREATE TRIGGER ledger_immutable_delete BEFORE DELETE ON public.ledger_transactions
  FOR EACH ROW EXECUTE FUNCTION public.prevent_ledger_modification();

REVOKE INSERT, UPDATE, DELETE ON public.ledger_transactions FROM anon, authenticated;
GRANT INSERT ON public.ledger_transactions TO service_role;
```

**C. Profiles practical role lock**
```sql
CREATE OR REPLACE FUNCTION public.lock_profile_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
       AND NOT public.has_role(auth.uid(), 'admin'::user_role) THEN
      RAISE EXCEPTION 'role change not allowed directly';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lock_profile_role_trigger ON public.profiles;
CREATE TRIGGER lock_profile_role_trigger BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.lock_profile_role();

REVOKE UPDATE (role) ON public.profiles FROM authenticated;
```

**D. Harden `handle_new_user()`** — explicit `role = 'client'` to remove default-reliance:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), 'client'::user_role);
  RETURN NEW;
END;
$$;
```

**E. Resolve carry-over findings from prior turn**
- `orders` SELECT-own:
  ```sql
  CREATE POLICY "Users read own orders" ON public.orders FOR SELECT TO authenticated
    USING (lower(customer_email) = lower(auth.jwt() ->> 'email'));
  ```
- `email_unsubscribe_tokens` + `suppressed_emails` — drop `public`-targeted runtime-check policies, recreate targeted at `service_role` directly. Admin SELECT on `suppressed_emails` already exists — keep.

## 3. Code-side verification (no edits expected)

- `supabase/functions/stripe-webhook/index.ts` already calls the RPC via service-role client → JWT claim role = `service_role` → passes new gate.
- No client-side calls to `process_stripe_payment`.
- No client writes to `ledger_transactions`.
- Admin profile edits flow through admin UI as authenticated admin → `has_role(...,'admin')` branch passes.

## 4. Mark findings fixed (after migration applies)

`supabase_lov`:
- `profiles_role_escalation_via_has_role`
- `orders_no_user_read_policy`
- `email_unsubscribe_tokens_no_anon_block`

## 5. Frozen / untouched

V40 scoring engine, V32.x guards, brand copy, navigation, i18n, edge function generic error responses, prior `webhook_logs` / `suppressed_emails` admin policies.

## 6. Verification (deltas only)

1. Anon/authenticated `SELECT process_stripe_payment(...)` → `permission denied` (EXECUTE revoked).
2. Service-role webhook call → succeeds, ledger row inserted, second replay of same `stripe_event_id` → `ON CONFLICT` no-op + new UNIQUE constraint blocks any direct dup.
3. Authenticated `UPDATE profiles SET role='admin' WHERE id=auth.uid()` → trigger raises `role change not allowed directly`.
4. Admin updating another user's role via admin UI → succeeds.
5. Authenticated `INSERT/UPDATE/DELETE ledger_transactions` → `permission denied`; service-role insert → ok; update/delete → trigger blocks.
6. Authenticated `SELECT * FROM orders WHERE customer_email = <my jwt email>` → returns own rows only.
7. Anon `SELECT * FROM email_unsubscribe_tokens` → 0 rows / denied (policies now scoped to `service_role`).

