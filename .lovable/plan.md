# Read-Only QA Verification Pass — Phase 2 / Tier 3A

Comprehensive smoke + SEO + route-ownership + UI/UX audit. **Zero source edits.** Output a single consolidated markdown report in chat.

---

## Execution Steps

### Step 1 — Infrastructure & Static Checks (parallel shell)
- `bun run test:i18n` → capture: files scanned, static keys extracted, missing keys, dynamic warnings. **Guard:** if extracted=0, flag as suite failure.
- `bunx vitest run` → full suite pass/fail. Separate Phase-2 regressions from pre-existing legacy failures.
- Grep audits (read-only):
  - `supabase/functions/create-checkout-session/index.ts` → confirm `v.replace(/^www\./, '')` Option-B apex strip present and active in `sanitizeHost`
  - `src/config/routeMapping.ts` → confirm `INDEXABLE_TOOL_PATHS` contains `/tools/dtv-visa-calculator` and `isNoIndex()` short-circuits it
  - `public/sitemap.xml` + `public/sitemap-tr.xml` → parse URL counts + cross-ownership leak check
  - `public/robots.txt` → verify both sitemap directives + no global Disallow

### Step 2 — Cross-Domain Redirect & Route Ownership (code-level)
- Trace `src/components/CrossDomainRedirect.tsx` + `routeMapping.ts` logic against scenarios:
  - `planbasia.com/vizeler/dtv-vize` → expected `replace()` to `planbasya.com/vizeler/dtv-vize`
  - `planbasya.com/visas/thailand-dtv` → expected `replace()` to `planbasia.com/visas/thailand-dtv`
  - Query/hash preservation via `window.location.search + hash` concatenation
  - `planbasia.com/vizeler/unknown-page-test` → `isMappedRoute()` returns false → no redirect → falls to `<NotFound />`
  - Loop guard: `target === hostname` early return; localhost + `*.lovable.app` bypass
- Sitemap ownership quantification:
  - EN sitemap: count `<loc>`, assert 0 `planbasya.com` or TR-prefixed paths
  - TR sitemap: count `<loc>`, assert 0 `planbasia.com` or EN-prefixed paths
  - Hreflang cross-leak audit per `<xhtml:link>` entries

### Step 3 — SPA Smoke Test (browser, desktop 1366×768)
Routes: `/`, `/visas/thailand-dtv`, `/relocation/nomad-incubator`, `/experiences/wellness`, `/tools/dtv-visa-calculator`, `/tr`, `/vizeler/dtv-vize`, `/deneyimler/mice`, `/login`, `/nonexistent-route-test`.

Per route capture: console errors, `<html lang>`, `<title>`, canonical href, visible H1 text. For `/nonexistent-route-test`: verify `<NotFound />` redirect-to-home (current behavior per code) and report — explicitly note that current NotFound is a `<Navigate>` redirect, not a 404 UI.

If browser session unavailable: degrade to static route-register evaluation and flag the limitation honestly.

### Step 4 — SEO Surface Audit (3 representative routes)
For `/`, `/visas/thailand-dtv`, `/tools/dtv-visa-calculator` — extract from rendered DOM via `browser--extract`:
- Self-canonical match against current URL (hostname per ownership)
- Hreflang entries all absent from `NOINDEX_PATHS`
- `x-default` points to `https://planbasia.com/`
- DTV calculator: self-canonical present, no noindex, in EN sitemap, single H1

### Step 5 — UI/UX Visual Review
- Desktop: Home hero overflow + font load (1 screenshot)
- Service page (`/visas/thailand-dtv`): `formatPrice` output — no decimal leak, no raw 0
- Mobile 390×844: Sticky CTA appears past ~40% scroll, hides on input focus
- AdvisoryForm code grep: confirm `company_website` honeypot is rendered with hidden/sr-only styling

### Step 6 — Consolidated Report Output
Single markdown block following user's exact template:
1. Infrastructure & Testing Matrix
2. Cross-Domain Redirect & Route Ownership Isolation
3. SPA Smoke Testing Surface (10 routes)
4. SEO Surface Properties Audit
5. UI/UX Visual Component Stability
6. (skipped per template numbering)
7. Critical Engineering Findings (P0/P1/P2)
8. Release Sign-off Recommendation (GREEN/YELLOW/RED + one-liner)
- APPENDIX A: Translation collision audit (filtered for noise)

---

## Halt Condition
Stop immediately after the consolidated report prints. No edits, no follow-ups unless user approves a P0/P1 remediation.

## Files Touched
**None.** Read-only verification only.

## Tooling
- `code--exec` for shell (test:i18n, vitest, grep, xml parse)
- `code--view` for code excerpts
- `browser--view_preview`, `browser--read_console_logs`, `browser--extract`, `browser--screenshot` for smoke + SEO surface
- `browser--set_viewport_size` for mobile 390×844 sweep
