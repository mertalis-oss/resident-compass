

## Phase 1: Fetch & Render Contract - Plan

### Problem Analysis

The database has 24 services, but category pages use **single-slug fetching** (`useServiceFetch` enforces "exactly 1 row" validation). This causes pages to fail when:
- SoftPowerPage hardcodes `BUNDLE_SLUGS = ['thai-language-6m', ...]` but actual DB slugs are `language-thai6`, `language-En6`, etc.
- MICEPage fetches `mice-corporate` which is `is_active=false`
- NomadIncubatorPage fetches `nomad-incubator` which is `is_active=false`
- DTVVizePage only fetches slug `dtv-vize` but there are 2 active TR DTV services (`dtv-vize`, `dtv-vize-ref`) plus `Kapsamlı Yerlesim`

There is **no `scope` column** in the database. The relevant columns are `category` and `visible_on`.

### Database State (Active TR Services)

| Category | Slug | Price | Stripe ID |
|---|---|---|---|
| residency | dtv-vize | $150 | price_1Sfv... |
| residency | dtv-vize-ref | $875 | price_1TJS... |
| residency | Kapsamlı Yerlesim | $5000 | price_1TJ7... |
| soft-power | language-thai6 | $1350 | price_1TJR... |
| soft-power | language-En6 | $1499 | price_1TJR... |
| soft-power | language-thai9-... | $1749 | price_1TJR... |
| soft-power | language-En12 | $2199 | price_1TJR... |
| expeditions | expedition-jungle | $0 | placeholder |
| corporate-retreats | mice-corporate | $0 | inactive |

### Implementation Steps

#### 1. Create `useServicesList` hook
New file: `src/hooks/useServicesList.ts`
- Accepts a `category` pattern string (e.g. `'residency'`, `'soft-power'`)
- Accepts a `scope` filter (`'tr' | 'global'`)
- Fetches using `.ilike('category', categoryPattern).eq('is_active', true).in('visible_on', [scope, 'both']).order('price', { ascending: true })`
- Filters results to only those with valid `stripe_price_id` starting with `price_`
- Returns `{ services: Service[], isLoading, hasError, errorDetail }`
- Includes `console.log("Fetched services for category:", category, "length:", data?.length)`
- Same 8s timeout + AbortController + race-condition safety as existing hook

#### 2. Update DTVVizePage.tsx
- Replace `useServiceFetch('dtv-vize')` with `useServicesList('residency', 'tr')`
- Keep existing Hero section (uses first service for price display)
- Replace single `<ServiceCheckout service={service} />` with a responsive grid:
  ```
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
    {services.map(s => <ServiceCheckout key={s.id} service={s} />)}
  </div>
  ```
- FOMOBlock uses `services[0]` as the anchor service
- PlanBForm uses `services[0]?.id`

#### 3. Update SoftPowerPage.tsx
- Replace hardcoded `BUNDLE_SLUGS` fetch with `useServicesList('soft-power', 'tr')`
- The fetched array directly feeds into `BundleSelector` (already accepts arrays)
- Remove the broken slug-based fetch logic

#### 4. Update MICEPage.tsx
- Replace `useServiceFetch('mice-corporate')` with `useServicesList('corporate-retreats', 'tr')`
- Since `mice-corporate` is inactive, this may return 0 services (show WhatsApp lead-gen fallback as it does now)

#### 5. Update ExpeditionsPage.tsx
- Replace `useServiceFetch('expedition-jungle')` with `useServicesList('expeditions', 'tr')`
- `expedition-jungle` has placeholder price ID, so it will be filtered out; fallback UI shown

#### 6. Update NomadIncubatorPage.tsx
- Replace `useServiceFetch('nomad-incubator')` with `useServicesList('residency', 'tr')` or keep as lead-gen since service is inactive

#### 7. Keep `useServiceFetch` intact
- It is still used by `ServicePage.tsx` (EN dynamic slug routing) which correctly needs single-service fetch

### What This Changes
- Category pages become **multi-product grids** instead of single-product pages
- Products are grouped by `category` column (not a non-existent `scope` column)
- Filtered by `visible_on` matching domain scope
- Only services with valid `price_` Stripe IDs are rendered
- Debug logging added for validation

### What This Does NOT Change
- Core routing, layout hierarchy, or component structure
- `useServiceFetch` (still used by EN ServicePage)
- Stripe checkout flow or webhook logic
- RLS policies or database schema

### Risks & Notes
- MICE and NomadIncubator services are currently `is_active=false` with placeholder Stripe IDs, so those pages will show fallback UI until you activate them in admin
- `expedition-jungle` has a placeholder Stripe ID, so it will be filtered out
- The `Kapsamlı Yerlesim` slug has non-ASCII characters (Turkish) which may cause URL issues if linked directly

