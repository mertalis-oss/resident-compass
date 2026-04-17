

# Absolute Execute — Final Wiring

## Pre-flight audit (must verify before coding)
- `src/lib/vipWhatsApp.ts` — likely missing → CREATE per spec
- `src/lib/tracking.ts` — unknown state → READ first; EXTEND with `captureCTAClick` only if missing
- `src/lib/utmStorage.ts` — has `captureUtms` + `getStoredUtms`; missing `sid`/`getSessionId` → EXTEND
- `src/components/home/SimplifiedAssessmentModal.tsx` — likely missing → flag before creating; if missing, ask whether to scaffold full modal (intent/timeline/budget → score) or skip wiring this pass
- `src/lib/constants.ts` — `WHATSAPP_NUMBER='66647036510'` ✅
- `src/components/service/ServiceFooter.tsx` — exists, no WA link → EXTEND

## Files (extend, don't overwrite)

### 1. `src/lib/vipWhatsApp.ts` — CREATE
Verbatim per spec. Pure TS. Imports `captureCTAClick` + `WHATSAPP_NUMBER` only.

### 2. `src/lib/tracking.ts` — READ then EXTEND
- If `captureCTAClick` exists: leave as-is.
- Else: append the spec'd wrapper using existing `trackEvent` + `getSessionId`.
- Do not touch existing `captureLeadSubmitted` / `capturePurchase` / etc.

### 3. `src/lib/utmStorage.ts` — EXTEND
- Inside existing `captureUtms()` boot path, append `sid` generation (`crypto.randomUUID()` with `Math.random().toString(36).substring(2,15)` fallback) gated on `!sessionStorage.getItem('sid')`.
- Export new `getSessionId()` helper. Existing `captureUtms` / `getStoredUtms` untouched.

### 4. `src/components/home/SimplifiedAssessmentModal.tsx`
- If exists: confirm single `const isHighIntent = score >= 5`; wire VIP CTA `onClick={(e) => handleVipWhatsAppClick(e, 'VIP_MODAL', clickLock, score, sourceSite)}`. Add `clickLock = useRef(false)` if absent.
- If missing: SKIP and surface in delivery message — will not scaffold full scoring modal in same pass without explicit go-ahead (too large + risks duplicating future direction).

### 5. `src/components/service/ServiceFooter.tsx` — EXTEND
- Add `clickLock = useRef(false)` + `sourceSite = useDomainScope()`.
- Add link: copy `Direct line (existing clients & qualified cases)`, classes `opacity-60 text-xs hover:opacity-100 transition-opacity`, `href={buildWaUrl('VIP_FOOTER', undefined, sourceSite) ?? '#'}`, `target="_blank" rel="noopener noreferrer"`, `onClick={(e) => handleVipWhatsAppClick(e, 'VIP_FOOTER', clickLock, undefined, sourceSite)}`.
- Existing footer markup untouched.

## Frozen / out of scope
UTM dual-touch payload, scroll lock, z-index armor, banned semantics, V1–V24 contracts. No new hooks/states beyond `clickLock`.

## Verification
1. `grep "from 'react'" src/lib/vipWhatsApp.ts` → empty.
2. New tab → `sessionStorage.sid` populated; reload → unchanged.
3. Footer click → `about:blank` opens, redirects to `wa.me/66647036510?text=Plan%20B%20Asia%20%E2%80%94%20Qualified%20case%20inquiry%20(VIP_FOOTER%20%7C%20Site%3A%20tr)`; PostHog `cta_click {type:'vip_whatsapp_footer', session_id, ...utms}`.
4. Popup blocked → current tab navigates (no dead click).
5. Double-click within 1s → ignored; visibility-return releases lock early.
6. If modal missing → delivery message lists it as deferred with explicit ask.

