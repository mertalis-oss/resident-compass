

# V44 — Financial-Grade Exploit-Proofing

Single migration. Four micro-patches. Adapts §1 to actual schema.

## Reality check

- `ledger_transactions` has **no `payment_intent_id` column** — it has `stripe_event_id` and `enrollment_id`. The spec's `WHERE tx_type='payment'` partial unique index on `payment_intent_id` cannot be created as written.
- `enrollments.payment_intent_id` IS the canonical payment intent. Each successful payment writes one ledger row keyed by `enrollment_id` + `tx_type='payment'`. The correct dedupe surface is therefore `(enrollment_id) WHERE tx_type='payment'` — guarantees one payment row per enrollment regardless of how many Stripe event IDs Stripe replays for the same intent.
- §2, §3, §4 map cleanly to existing schema.

## Migration contents

**1. Ledger payment-level idempotency (adapted)**
```sql
CREATE UNIQUE INDEX IF NOT EXISTS uniq_enrollment_payment
  ON public.ledger_transactions (enrollment_id)
  WHERE tx_type = 'payment';
```
Effect: a second `payment_intent.succeeded` / `charge.succeeded` for the same enrollment cannot double-insert, even if Stripe rotates event IDs.

**2. Strict state validation in `process_stripe_payment`**
`CREATE OR REPLACE FUNCTION` keeping signature + body, inserting right after the `FOR UPDATE` lock + spoof check:
```sql
IF NOT p_is_refund AND v_enrollment.status <> 'pending_deposit' THEN
  RAISE EXCEPTION 'Invalid state transition: Enrollment is not pending a deposit.';
END IF;
```
Removes reliance on the silent `WHERE status='pending_deposit'` row-count fallback for double-payment detection.

**3. Orders RLS NULL guard**
```sql
DROP POLICY IF EXISTS "Users read own orders" ON public.orders;
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT TO authenticated
USING (
  auth.jwt() ->> 'email' IS NOT NULL
  AND lower(customer_email) = lower(auth.jwt() ->> 'email')
);
```

**4. `search_path` confirmation**
Already present (`SET search_path TO 'public'`). Re-asserted in the `CREATE OR REPLACE` from §2. No additional change.

## Frozen / untouched

V43 ledger immutability triggers, profile role lock, service-role gate on RPC, EXECUTE revocations, V40 scoring, brand copy, edge functions.

## Verification (deltas only)

1. Two distinct event IDs targeting same enrollment → first succeeds, second fails on `uniq_enrollment_payment` (or earlier on state check) — no duplicate ledger row.
2. Enrollment already in `deposit_paid` + replay payment event → raises `Invalid state transition...`.
3. Authenticated user with NULL JWT email → 0 rows from `orders`.
4. Authenticated user with matching email → own rows only.
5. `process_stripe_payment` header still shows `SECURITY DEFINER` + `SET search_path TO 'public'`.

