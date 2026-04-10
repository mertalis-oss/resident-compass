

# 9-Phase Sovereign Architecture — Execution Plan

## Phase 1: FOMO Purge & Anchor Rescue

Remove `FOMOBlock` import + usage from 8 files. Add scroll offset + CLS guard. Delete component file.

| File | Changes |
|------|---------|
| `src/pages/tr/DTVVizePage.tsx` | Remove L14 import, remove L103-104. L107 `<div id="checkout">` → `<div id="checkout" className="scroll-mt-24 md:scroll-mt-32">`. L114 grid → add `min-h-[480px]`. |
| `src/pages/en/DTVPageEN.tsx` | Remove L13 import, remove L107-108. L111 `<div id="checkout">` → add `className="scroll-mt-24 md:scroll-mt-32"`. L119 grid `min-h-[400px]` → `min-h-[480px]`. |
| `src/pages/tr/SoftPowerPage.tsx` | Remove L16 import, remove L68-69. Restructure L72-93: wrap BundleSelector + badge + checkout in `<section id="checkout" className="scroll-mt-24 md:scroll-mt-32">` replacing the `<div id="checkout">`. |
| `src/pages/en/SoftPowerPageEN.tsx` | Remove L16 import, remove L69-70. Same restructure as TR SoftPower (L72-94). |
| `src/pages/tr/ExpeditionsPage.tsx` | Remove L16 import, remove L69 from fragment. L70 `<div id="checkout">` → add `className="scroll-mt-24 md:scroll-mt-32"`. L73 grid → add `min-h-[480px]`. |
| `src/pages/tr/MICEPage.tsx` | Remove L16 import, remove L79 `<FOMOBlock>`. L80 `<div id="checkout">` → add scroll offset. L83 grid → add `min-h-[480px]`. |
| `src/pages/tr/NomadIncubatorPage.tsx` | Remove L16 import, remove L87 `<FOMOBlock>`. L88 `<div id="checkout">` → add scroll offset. L94 grid → add `min-h-[480px]`. |
| `src/pages/ServicePage.tsx` | Remove L27 import, remove L271. L273 `<div id="checkout">` → add `className="scroll-mt-24 md:scroll-mt-32"`. |
| **DELETE** `src/components/service/FOMOBlock.tsx` | After all refs removed. |

## Phase 2: Sovereign Checkout V2 (ServiceCheckout.tsx)

Layer 1 card only (L238-266). Zero Stripe logic changes.

- L243 card div: → `relative flex flex-col justify-between rounded-2xl border border-muted/40 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 min-h-[420px] p-6 md:p-7`
- L244 title: → `text-lg font-semibold tracking-tight text-foreground`
- L246 subtitle: add `mt-1`
- L248 divider: → `border-t border-border my-4 opacity-50`
- L252 price: add `font-medium tracking-tight`
- L257-263 button: wrap in `<div className="mt-auto">`, add `w-full rounded-xl font-medium h-12`, add `aria-label={`Begin advisory for ${service.title}`}`, add `disabled={modalOpen}`

## Phase 3: I18N Tone Polish (i18n.ts)

- L61: `'Initialize Protocol'` → `'Begin Advisory'`
- L139: `'Süreci Başlat'` → `'Danışmanlığı Başlat'`
- L214: `'प्रोटोकॉल प्रारंभ करें'` → `'सलाह शुरू करें'`

## Phase 4: HTML SEO (index.html)

Add to `<head>` before closing:
- Google verification meta (placeholder)
- Hreflang: en → planbasia.com, tr → planbasya.com, x-default → planbasia.com
- Stripe preconnect + dns-prefetch
- Canonical: add trailing slash

## Phase 5: Robots.txt & Sitemap.xml

**robots.txt**: Replace with `Crawl-delay: 5` + sitemap link.

**sitemap.xml** (NEW): Static sitemap — 1.0 home, 0.9 services (dtv, soft-power, nomad-incubator + TR equivalents), 0.8 destinations/experiences, 0.5 legal.

## Phase 6: Security

Verify `rel="noopener noreferrer"` on external `target="_blank"` links in modified files. WhatsApp uses `window.open` — no HTML attrs needed.

## Phase 7: Smooth Scroll

Already at `src/index.css` L113-115. No changes needed.

## Phase 8: Scroll Lock & Cleanup (ServiceCheckout.tsx)

- Add `useEffect` import (already has `useRef` → add `useEffect` to imports at L1)
- `handleModalChange` (L44): add `document.body.style.overflow = open ? 'hidden' : ''`
- Add cleanup effect: `useEffect(() => { return () => { document.body.style.overflow = ''; }; }, []);`

## Phase 9: Double-Click Guard

Layer 1 button: `disabled={modalOpen}` — uses existing `modalOpen` state (L41). No new state created.

---

**Summary**: 10 files modified, 1 deleted, 1 new static file, 2 static files updated. Build verification via `grep -r "FOMOBlock" src/` + build.

