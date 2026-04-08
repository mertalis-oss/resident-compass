

# V.38 Batch 1 — Final Execution Plan

## Scope Summary
Create 4 new EN pages, restructure EN navigation into 4 groups, add 6 routes + 2 redirects, normalize DB category, update cross-sell and portal links, add cross-bridge funnels to 2 existing pages.

---

## 1. Database Migration

```sql
UPDATE services SET category = 'soft-power' 
WHERE category = 'Soft Power' AND visible_on = 'global';
```

---

## 2. Files to Create (4)

### `src/pages/en/DTVPageEN.tsx`
Thin copy of `DTVVizePage.tsx` with:
- `useServicesList('residency', 'global')` — 3 active products
- All strings EN. H1: "The 5-Year Freedom Protocol."
- Hero CTA: WhatsApp via `buildWhatsAppUrl('Page: DTV | Intent: strategic-review | ...')`
- `useEffect` scroll-to-top on mount
- SEOHead with explicit canonical `/visas/thailand-dtv`
- Cross-bridge at bottom → `/relocation/nomad-incubator`
- Empty state: fallback text + WhatsApp CTA button

### `src/pages/en/ExpeditionsPageEN.tsx`
Thin copy of `ExpeditionsPage.tsx` with:
- `useServicesList('expeditions', 'global')` — likely 0 valid (placeholder Stripe IDs)
- H1: "The Art of Strategic Movement."
- EN expedition info cards
- Empty state + WhatsApp CTA ("Speak with Strategic Advisor")
- Canonical: `/experiences/expeditions`

### `src/pages/en/WellnessPageEN.tsx`
New page:
- `useServicesList('wellness', 'global')` — likely 0 valid
- H1: "Spiritual & Somatic Sovereignty."
- 4 modality info cards (Breathwork, Recovery, Somatic, Vipassana) — no pricing
- WhatsApp Hero CTA, empty state + WhatsApp CTA
- No cross-bridge outbound (funnel destination)
- Canonical: `/experiences/wellness`

### `src/pages/en/MICEPageEN.tsx`
Thin copy of `MICEPage.tsx` with:
- `useServicesList('corporate-retreats', 'global')` — likely 0 valid
- H1: "The Architecture of Influence."
- WhatsApp-first all CTAs, no pricing outside checkout
- PlanBForm for lead-gen
- Canonical: `/corporate/mice`

**All new pages include:**
- `useEffect(() => { window.scrollTo(0, 0); }, [])` for scroll restoration
- WhatsApp intent parameter in `buildWhatsAppUrl` (e.g., `intent=dtv`)
- SEOHead with explicit canonical URL
- `min-h-[400px]` grid wrapper, `max-w-md mx-auto` for single items
- Empty state: "Elite protocols are currently being updated by our strategic advisors." + WhatsApp CTA
- "Strategic Advisor" terminology throughout

---

## 3. Files to Edit (6)

### `src/pages/en/SoftPowerPageEN.tsx`
Add cross-bridge section before footer:
- "Learning is the Beginning. Living is the Goal."
- CTA: "BUILD YOUR ISLAND BASE" → `/relocation/nomad-incubator`
- Add `useEffect` scroll-to-top

### `src/pages/en/NomadIncubatorPageEN.tsx`
Add cross-bridge section before footer:
- "Peak Performance Environment."
- CTA: "EXPLORE WELLNESS PROTOCOLS" → `/experiences/wellness`
- Scarcity: "Limited to 10 Founder-level orchestrations per quarter."
- Add `useEffect` scroll-to-top

### `src/App.tsx`
Add `RedirectWithQuery` helper that preserves `location.search` + `hash`.

New routes (above catch-alls):
```
/visas/thailand-dtv         → DTVPageEN
/visas/soft-power           → SoftPowerPageEN
/relocation/nomad-incubator → NomadIncubatorPageEN
/experiences/expeditions    → ExpeditionsPageEN
/experiences/wellness       → WellnessPageEN
/corporate/mice             → MICEPageEN
```

Redirects:
```
/residency/soft-power       → /visas/soft-power
/residency/nomad-incubator  → /relocation/nomad-incubator
```

### `src/components/FocusedNavbar.tsx`
Replace `EN_NAV_GROUPS` with 4 groups:

| Group | Items |
|---|---|
| Visas | Thailand DTV → `/visas/thailand-dtv`, Soft Power → `/visas/soft-power` |
| Relocation | Nomad Incubator → `/relocation/nomad-incubator` |
| Experiences | Expeditions → `/experiences/expeditions`, Wellness → `/experiences/wellness` |
| Corporate | MICE & Events → `/corporate/mice` |

Add 120ms hover delay via `setTimeout`/`clearTimeout` on desktop `onMouseEnter`/`onMouseLeave`.

### `src/components/service/ComparisonCrossSell.tsx`
Update EN `href` values to new routes:
- `/residency/dtv-thailand` → `/visas/thailand-dtv`
- `/residency/Relocation Eng` → `/relocation/nomad-incubator`
- `/corporate-retreats/mice-thailand` → `/corporate/mice`
- `/expeditions/ha-giang-motor-expedition` → `/experiences/expeditions`
- `/wellness/thailand-retreat` → `/experiences/wellness`

Add new cross-sell entries for `soft-power` EN and `wellness` slugs.

### `src/components/home/Portals.tsx`
Update portal hrefs to new EN routes:
- `/residency/dtv-thailand` → `/visas/thailand-dtv`
- `/expeditions/ha-giang-motor-expedition` → `/experiences/expeditions`
- `/wellness/thailand-retreat` → `/experiences/wellness`

---

## Safety Protocols Applied

- **Scroll restoration**: `useEffect` with `window.scrollTo(0,0)` on every new EN page
- **WhatsApp intent tracking**: All CTAs use `buildWhatsAppUrl('Page: [name] | Intent: [slug] | Domain: ...')`
- **Canonical tags**: Each page gets explicit canonical in SEOHead
- **TR isolation**: Zero modifications to any TR file, TR_NAV_GROUPS, or TR routes
- **Empty state lead capture**: WhatsApp CTA button always visible below fallback text

## Batch 2-3-4 Guardrails (Acknowledged)
- Batch 2: StickyMobileCTA z-index + pb-safe, single button rule, real trust strip metrics only
- Batch 3: Muted Gold for dividers/badges only (no solid gold buttons), Playfair Display + Inter
- Batch 4: `ease-out` transitions, `shadow-sm` → `shadow-md` hover only, zero scroll animations/parallax

## NOT Touched
- All TR pages, TR_NAV_GROUPS, TR routes
- Stripe checkout logic, webhooks, RLS
- `useServiceFetch` or `useServicesList` hooks
- StickyMobileCTA, Hero homepage, palette, typography

