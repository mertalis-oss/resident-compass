
## Goal
Fix `planbasya.com/vizeler/dtv-vize` (and all other deep links) returning 404 on the Vercel deployment, and add baseline security headers to both domains served by Vercel.

## Context
- `planbasya.com` is now connected directly to a separate Vercel project (DNS A `76.76.21.21`, Cloudflare DNS-only). Vercel has no implicit SPA fallback, so deep-link refreshes 404.
- `planbasia.com` flows Cloudflare → Lovable proxy → Vercel; Lovable's proxy currently masks the missing fallback.
- The project's existing `docs/HOSTING_LIMITATION.md` only forbids these config files for the Lovable-hosted path. It does not apply to a separate Vercel deployment of the same repo. The doc needs a small clarifying note so future maintainers don't delete `vercel.json` thinking it's dead config.

## Changes

### 1. Create `vercel.json` at project root
Exact content provided by the user:
- `headers` block applied to `/(.*)`:
  - `Content-Security-Policy` — allows Stripe, GTM, PostHog, Cloudflare Turnstile, Google Fonts, Supabase, GA; `frame-ancestors 'none'`; `upgrade-insecure-requests`.
  - `X-Frame-Options: DENY`
  - `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(self "https://js.stripe.com")`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Content-Type-Options: nosniff`
- `rewrites`: `/((?!api/|images/|.*\..*).*)` → `/index.html` (SPA fallback that skips API routes and any path with a file extension).

### 2. Update `docs/HOSTING_LIMITATION.md`
Add a short subsection noting that `vercel.json` IS used because the TR domain (`planbasya.com`) is served by a separate Vercel project. Keep the existing "do not add to Lovable-only deployments" guidance intact.

## CSP risk review (pre-flight)
The CSP in the file allows the origins currently used by the app:
- Stripe (`js.stripe.com`, `api.stripe.com`), Supabase (`*.supabase.co`), PostHog (`app.posthog.com`), GTM/GA (`googletagmanager.com`, `google-analytics.com`), Google Fonts, Cloudflare Turnstile.
- `'unsafe-inline'` is permitted for both `script-src` and `style-src` (required by current GTM snippet + Tailwind/inline styles). Acceptable for now; tightening to nonces is out of scope.
- No `worker-src`/`media-src` overrides — fine since the app doesn't use service workers or video.

If any third-party domain is later added (e.g., a new analytics provider), CSP must be updated or requests will be blocked.

## Out of scope
- No code changes to React, routing, or Supabase functions.
- No changes to `public/robots.txt`, sitemaps, or `routeMapping.ts`.
- No Lovable-side hosting changes.

## Verification (post-deploy, manual)
1. `curl -I https://planbasya.com/vizeler/dtv-vize` → expect `200` and the five security headers.
2. Browser load of the same URL → TR DTV page renders, no CSP violations in console.
3. `curl -I https://planbasya.com/` → headers present, still 200.
4. Spot-check `https://planbasia.com/visas/thailand-dtv` for no CSP regressions in console.
