

# V32.3 — Final Hardening Layer (Paranoid Mode)

Five tactical micro-fixes layered on V32.2. All optional-but-elite. No architectural changes.

## 1. `SimplifiedAssessmentModal.tsx`

**a. Strict submit ref check (StrictMode-safe):**
```ts
if (submittingRef.current === true) return;
submittingRef.current = true;
```

**b. 2s submit cooldown ref (network-retry/double-click double-insert guard):**
```ts
const lastSubmitRef = useRef<number>(0);
// inside handleSubmit, after the strict ref + honeypot + timing + email guards:
if (Date.now() - lastSubmitRef.current < 2000) return;
lastSubmitRef.current = Date.now();
```

**c. Tightened email regex (TLD ≥ 2 chars):**
```ts
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
```

**d. VIP timer null-after-clear (steril cleanup):**
```ts
useEffect(() => {
  if (isHighIntent && submitted) {
    setShowVipEscape(false);
    if (vipTimer.current) { clearTimeout(vipTimer.current); vipTimer.current = null; }
    vipTimer.current = setTimeout(() => setShowVipEscape(true), 2000);
  }
  return () => {
    if (vipTimer.current) { clearTimeout(vipTimer.current); vipTimer.current = null; }
  };
}, [isHighIntent, submitted]);
```
Same `vipTimer.current = null` discipline applied in the auto-reset-on-close effect.

**e. Warm copy refinement (brand-aligned filter signal):**
```
"We'll reach out if there's a strong fit."
```
(replaces "Thank you. You're on the list — we'll be in touch with relevant updates.")

## 2. Pre-execute verification gates

Before code edits run, two grep-style checks during execute:
- `grep "checkout/advisory" src/App.tsx` → if empty, surface a single delivery-message warning (route missing). `safeNavigate` hard-fallback already prevents crash; user will need to add the route after deploy.
- `grep -ri "whatsapp\|wa.me\|buildWhatsAppUrl" src/components/home/Hero.tsx` → must be empty after rewire. Mission-accomplished gate.

## 3. Frozen / Deferred (explicit)
- `safeNavigate` duplication (Hero + Modal) — deferred to post-launch refactor into `src/lib/navigation.ts`. Acknowledged drift risk, accepted as non-blocker.
- DB-level `UNIQUE(email, created_from, submit_timestamp)` constraint — skipped in favor of frontend 2s cooldown ref. No migration this pass.
- All V32 + V32.1 + V32.2 logic intact (stateless string-enum scoring, body scroll lock, auto-reset on close, anti-bot 1.5s timing + honeypot, hot/warm success states, VIP 2s reveal, dual-touch UTM payload, try/catch/finally submit, i18n null guard, Safari-safe non-smooth modal scroll, RAF+200ms safeNavigate w/ same-route short-circuit, simplified ghost-click filter).
- TR Hero, Footer "Direct line" (V25), `vipWhatsApp.ts`, `tracking.ts`, `getSessionId` — untouched.

## Verification (deltas only)
1. React StrictMode double-invoke → second invocation hits `submittingRef.current === true` and returns; no duplicate insert.
2. User clicks submit twice within 2s after a slow-network resolve → second click hits `lastSubmitRef` cooldown, silent skip.
3. Email `a@b.c` → rejected (TLD too short); `a@b.co` → accepted.
4. Modal close mid-2s VIP timer → cleared and nulled; reopen starts fresh.
5. Warm submit → renders "We'll reach out if there's a strong fit." Zero CTAs, zero WhatsApp DOM nodes.
6. `grep "wa.me\|whatsapp" src/components/home/Hero.tsx` → empty.
7. If `/checkout/advisory` route absent → delivery message flags it; anchor click degrades to hard nav (no crash, but 404 surface until route added).

