# Fix Checkout: boolean payload + in-flight guard

## Scope
Single file: `src/components/service/ServiceCheckout.tsx`.

## Bug 1 — agreed_to_terms type
Line 70 currently sends `agreed_to_terms: "true"` (string). Zod schema expects boolean → 400.
Change to `agreed_to_terms: isAgreed` (already a boolean from the Checkbox state). Since the button is disabled unless `isAgreed` is true, this is always `true` at call time.

## Bug 2 — Infinite retry storm
Add a useRef in-flight guard inside `handleCheckout` and ensure no auto-retry:

1. Add a dedicated `inFlightRef = useRef(false)` (separate from the existing `clickLock` which only guards modal opening).
2. At the top of `handleCheckout`: if `inFlightRef.current` is true, return immediately. Otherwise set it to true.
3. On error path (catch block AND the `INVALID_PRICE_ID` rescue path): reset `inFlightRef.current = false` alongside `setIsCheckoutLoading(false)`. Do NOT auto-retry — user must click again.
4. On success (redirect via `window.location.href`): leave the ref true so any late re-renders don't fire a second request before navigation.
5. Also reset `inFlightRef.current = false` in `handleModalChange` when the dialog closes.

No `useEffect` currently triggers checkout — confirmed by reading the file. No removal needed.

## Out of scope
- No edge function changes.
- No styling, copy, or analytics changes.
- No changes to `clickLock` modal-open guard.

## Verification
- Click "Danışmanlığa Devam Et" on `/vizeler/dtv-vize`, accept terms, click CTA → exactly one POST to `create-checkout-session` in Network tab → 200 with `url` → Stripe Checkout opens.
- If the function errors, toast appears and a second manual click is required to retry.