# Update Edge Function CORS for Vercel Previews

## Scope
Add `*.vercel.app` to the CORS allowlist in 4 Supabase Edge Functions so preview deployments from the Vercel-hosted planbasya.com pipeline do not fail with CORS errors.

## Files to edit
- `supabase/functions/submit-lead/index.ts`
- `supabase/functions/create-checkout-session/index.ts`
- `supabase/functions/verify-checkout-session/index.ts`
- `supabase/functions/replay-webhook/index.ts`

## Change in each file
1. Add right after the existing `LOVABLE_PREVIEW` regex:
   ```ts
   const VERCEL_PREVIEW = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
   ```
2. Update the origin check in `resolveOrigin` (or equivalent) to include `VERCEL_PREVIEW`:
   ```ts
   if (ALLOWED_ORIGINS.has(o) || LOVABLE_PREVIEW.test(o) || VERCEL_PREVIEW.test(o)) return o;
   ```
3. Keep `LOVABLE_PREVIEW` unchanged for backward compatibility.

## No other changes
No logic, auth, error handling, or response shape changes. Pure CORS allowlist expansion.

## Post-change actions
- Auto-deploy via Lovable-managed Supabase Edge Functions (no manual deploy step).