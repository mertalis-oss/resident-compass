## Performance Pass — LCP, INP, Idle Loading (Zero Visual Diff)

### 1. `index.html` — Critical Path

- Add to `<head>`:
  - `<link rel="preload" as="image" href="/images/hero-home.webp" type="image/webp" fetchpriority="high">`
  - `<link rel="preconnect" href="https://gjbuoyxwujpbaprcrnmg.supabase.co" crossorigin>`
  - `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
  - `<link rel="preconnect" href="https://app.posthog.com" crossorigin>`
- Replace inline GTM IIFE with a deferred loader: `window.addEventListener('load', () => setTimeout(loadGTM, 1500))` where `loadGTM` injects the GTM script and seeds `dataLayer`. The `<noscript>` iframe in `<body>` stays.
- Skip `<link rel="preload" as="style" href="/assets/index.css">` — Vite hashes the CSS filename per build (`/assets/index-[hash].css`); a static href would 404. Vite already injects its own preload for the hashed CSS.

### 2. `src/components/home/Hero.tsx` — LCP element

- Switch import: drop `import heroImage from '@/assets/hero-beach.jpg'`; use the literal string `/images/hero-home.webp` for the `<img src>` so it matches the preload exactly.
- Add `decoding="async"` (keep `fetchPriority="high"`, existing width/height).
- Kill the entrance animation on the H1's first line: render the first line as a plain `<span className="block">` (no `motion.span`, no opacity/transform). Subsequent lines keep their staggered `motion.span` so visual rhythm is preserved (the first line is what paints LCP).
- No other layout/copy changes.

### 3. `src/main.tsx` — Idle utility

- Add `runIdle` helper:
  ```ts
  const runIdle = (cb: () => void) =>
    'requestIdleCallback' in window
      ? (window as any).requestIdleCallback(cb)
      : setTimeout(cb, 50);
  ```
- Wrap `initPostHog()` and `captureUtms()` in `runIdle(...)` so they don't compete with hydration.

### 4. `src/App.tsx` — Route splitting + critical prefetch

- Convert all non-entry route components to `React.lazy`:
  - Eager: `Index`, `NotFound`, `Login`, `LanguageRouter`, `ErrorBoundary`, `ProtectedRoute`, `AdminRoute`.
  - Lazy: `Dashboard`, `ServicePage`, `Success`, `MobilityAssessment`, `TermsOfService`, `PrivacyPolicy`, `RefundPolicy`, all `pages/en/*`, all `pages/tr/*`, all `pages/admin/*`.
- Wrap `<Routes>` in `<Suspense fallback={null}>` (null fallback = no flash, matches current UX).
- **Conversion-critical prefetch** — after mount, on `runIdle`, trigger import calls for `MobilityAssessment` and `Success` (the `/checkout/advisory` + `/success` chunks) so navigation latency stays low without blocking initial render. Implement as a tiny `useEffect` inside `App` that calls the lazy components' underlying `import()` factories.

### 5. Passive listeners audit

- Ripgrep across `src/` for `addEventListener('scroll'|'touchstart'|'wheel', …)` showed only one site: `src/components/StickyMobileCTA.tsx`, which already passes `{ passive: true }`. No change needed; will re-confirm during edit.

### 6. Image hygiene

- Audit homepage components (`Portals.tsx`, `TrustSignals.tsx`, `Testimonials.tsx`, `Philosophy.tsx`, `FocusedNavbar.tsx`) and add `loading="lazy" decoding="async"` plus `width`/`height` attributes to any `<img>` missing them. Do not touch the hero `<img>`.
- Logo in `FocusedNavbar` stays eager (above-the-fold) but gets explicit `width`/`height` if missing.

### Out of Scope (explicit)

- No visual, copy, color, spacing, typography, or animation-curve changes beyond removing the LCP-blocking H1 first-line fade.
- No critical-CSS extraction, no AVIF, no new dependencies, no service-worker work.
- No edits to generated files (`src/integrations/supabase/{client,types}.ts`).
- No CSS preload (hashed filename).

### Files Touched

1. `index.html` — preload/preconnect, deferred GTM loader.
2. `src/components/home/Hero.tsx` — switch hero src, kill H1 first-line motion.
3. `src/main.tsx` — `runIdle` for PostHog + UTM.
4. `src/App.tsx` — `React.lazy` + `Suspense` + idle prefetch of checkout/success.
5. Homepage `<img>` audit pass — add `loading="lazy" decoding="async"` + width/height where missing.

### Verification

- Manual: `/` and `/tr` render hero immediately, no layout shift, navbar logo crisp, route navigation works.
- Build succeeds (auto by harness).
- Visual diff at 1154×638 and 390×844: none.
