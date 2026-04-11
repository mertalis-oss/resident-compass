

# Growth Infrastructure & Enterprise Grid — Execution Plan

## 16 Files Modified

### Phase 1: ServiceCheckout.tsx — Layout Prop, Z-999, Conversion Tracking

**File**: `src/components/service/ServiceCheckout.tsx`

- Add `import { cn } from '@/lib/utils'` and `import { trackEvent } from '@/lib/analytics'` at top
- Add `layout?: 'standalone' | 'grid'` to Props interface (default `'standalone'`)
- Extract L250-277 card div into a `card` const variable
- Conditional render: `layout === 'grid'` renders `card` directly; `'standalone'` wraps in `<section id="checkout-section">` + `container`
- Dialog (L282-407): rendered OUTSIDE conditional, add `className="relative z-[999]"` to DialogContent, add `id={`checkout-dialog-${service.id ?? service.slug ?? 'default'}`}`
- Update `handleModalChange` (L44): add overflow check: `if (!open && document.body.style.overflow === 'hidden') document.body.style.overflow = '';`
- Card classes: use `cn()` with `Boolean(service.is_featured)` for ring/scale
- CTA onClick (L270): fire `trackEvent('checkout_click', { service: service.slug || service.id || 'unknown_service', price: service.price, currency: service.currency || 'USD' })` before `setModalOpen(true)`
- Add secondary useEffect: `useEffect(() => { if (!modalOpen && document.body.style.overflow === 'hidden') document.body.style.overflow = ''; }, [modalOpen]);`
- Existing unmount cleanup (L54-58) stays

### Phase 2: Grid Pages — Offset + Grid + layout="grid" (7 files)

All get `scroll-mt-28 md:scroll-mt-36` and `layout="grid"` on ServiceCheckout.

| File | Grid classes update |
|------|-------------------|
| DTVVizePage.tsx L104,L111 | Add `xl:grid-cols-3 gap-6 md:gap-8 min-h-[420px] md:min-h-[480px] items-stretch auto-rows-fr` |
| DTVPageEN.tsx L108,L116 | Same + add `xl:grid-cols-3` |
| ExpeditionsPage.tsx L68,L71 | Update offset + grid classes + `gap-6 md:gap-8 items-stretch auto-rows-fr` |
| MICEPage.tsx L78,L81 | Same |
| NomadIncubatorPage.tsx L86,L92 | Same |

**SoftPower Architecture Change (TR L69-89, EN L70-90)**:
- Remove `BundleSelector` import, `selectedBundle` state, conditional render
- Map ALL `bundles` into grid with `<ServiceCheckout layout="grid" />`
- Add empty-state CLS guard: `if (!bundles?.length) return <div className="min-h-[420px]" />`
- Grid classes: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 min-h-[420px] md:min-h-[480px] items-stretch auto-rows-fr`

### Phase 3: ServicePage.tsx — Offset Only

L271: `scroll-mt-24 md:scroll-mt-32` → `scroll-mt-28 md:scroll-mt-36`

### Phase 4: SEOHead.tsx — Canonical Normalization

L38-39 → `const cleanPath = currentPath.split(/[?#]/)[0];` + `const absoluteUrl = \`${baseUrl}${cleanPath}\`.toLowerCase().replace(/\/$/, '') || baseUrl;`

### Phase 5: index.html — GTM (GTM-MTGTMBGR) + OG Image Fix

Replace with exact GTM snippet using ID `GTM-MTGTMBGR`. Replace lovable.dev OG image with `https://planbasia.com/images/hero-home.webp`. Add `<noscript>` GTM iframe in `<body>`. Keep existing hreflang + Stripe preconnect.

### Phase 6: analytics.ts — DataLayer Rewrite

Replace gtag-based implementation with `window.dataLayer.push()` pattern including `timestamp` and `domain_scope`.

### Phase 7: Conversion Event Chain

**PlanBForm.tsx**: Import `trackEvent`. After L56 (`setSubmitted(true)`), add `trackEvent('form_submit', { service: serviceId || 'general' })`.

**Success.tsx**: Import `trackEvent`. Add deduplicated `useEffect` with `firedRef` pattern firing `trackEvent('purchase_success', { session_id: sessionId })` when `status === 'paid'`, alongside existing PostHog event at L50-56.

### Phase 8: robots.txt

```
User-agent: *
Allow: /
Sitemap: https://planbasia.com/sitemap.xml
Sitemap: https://planbasya.com/sitemap.xml
Host: https://planbasia.com
```

### Phase 9: sitemap.xml — xhtml Hreflang Parity

Full rewrite with `xmlns:xhtml` namespace. Dual pages (Home, DTV, Soft Power, Nomad, Expeditions, MICE) get TWO `<url>` blocks each with 3 `<xhtml:link>` alternates (en, tr, x-default→EN). EN-only pages (Wellness, Vietnam, Cambodia, Privacy, Terms, Refund) get ONE block with 2 alternates (en, x-default only).

