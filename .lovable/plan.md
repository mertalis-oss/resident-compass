

# Batch 3: Sovereign Hybrid Model — 12-File Implementation

## Overview
Transition 4 EN advisory pages from Stripe checkout to a lead-capture AdvisoryForm, create 2 new destination pages, soften checkout tone, and add a MICE-specific form variant. TR pages remain completely untouched.

---

## File 1: `src/lib/i18n.ts`

**Tone shifts in existing keys:**
- EN line 8: `ctaStart` → `'Begin Your Advisory'`
- EN line 38: `microSecure` → `'Secure advisory process'`
- EN line 58: `ctaLabel` → `'Continue Consultation'`
- TR line 84: `ctaStart` → `'Danışmanlığı Başlat'`
- TR line 114: `microSecure` → `'Güvenli danışmanlık süreci'`
- TR line 134: `ctaLabel` → `'Danışmanlığa Devam Et'`
- HI line 157: `ctaStart` → `'अपनी सलाह शुरू करें'`
- HI line 187: `microSecure` → `'सुरक्षित सलाह प्रक्रिया'`
- HI line 207: `ctaLabel` → `'परामर्श जारी रखें'`

**New keys in each checkout object:** `advisorySubtitle`, `initializeLabel`

**New `advisory` namespace** added to EN (after line 323), TR (after ~line 460), HI (after ~line 590):
- Form labels: `nameLabel`, `emailLabel`, `whatsappLabel`, `whatsappPlaceholder`, `destinationLabel`, `timelineLabel`, `notesLabel`, `notesPlaceholder`, `submitLabel`, `submitting`, `successMessage`
- Destinations object: `{ thailand, vietnam, cambodia, global }`
- Timelines object: `{ '1-3', '3-6', '6-12', flexible }`
- MICE keys: `eventDestinationLabel`, `eventDatesLabel`, `eventDatesPlaceholder`, `companyLabel`, `groupSizeLabel`, `eventTypeLabel`
- `groupSizes` object: `{ '10-20', '20-50', '50-100', '100-300', '300+' }`
- `eventTypes` object: `{ retreat, summit, incentive, offsite, conference, other }`
- EN success: `"We'll personally review your situation within 24 hours."`
- TR success: `"Durumunuzu 24 saat içinde şahsen inceleyip dönüş yapacağız."`

---

## File 2: `src/components/service/ServiceCheckout.tsx`

- Line 256-258: Add `variant="outline"` to the Layer 1 trigger Button
- Line 260: Replace `scope === 'tr' ? 'Süreci Başlat' : 'Initialize Protocol'` → `t('checkout.initializeLabel')`
- After line 254 (price): Add `<p className="text-xs text-muted-foreground mt-1">{t('checkout.advisorySubtitle')}</p>`
- Lines 262-266: Replace hardcoded advisory text → `t('checkout.advisorySubtitle')`
- Move Stripe trust badge (lines 286-289) from modal header to after line 394 (below sticky CTA footer), preserving `{{currencyLabel}}`

---

## File 3: `src/components/advisory/AdvisoryForm.tsx` (NEW)

**Props:** `variant?: 'individual' | 'mice'` (default `'individual'`), `defaultDestination?: string`, `source_page: string`

**Individual fields:** Name (req), Email (req), WhatsApp (opt), Destination (select, req), Timeline (select, req), Notes (textarea)

**MICE fields:** Name (req), Email (req), WhatsApp (opt), Company (req), Event Type (select, req), Group Size (select, req), Event Destination (select, opt), Event Dates (text, req, placeholder from i18n), Notes (textarea)

**Guards implemented:**
- Anti-bot honeypot: hidden `company_website` input, if filled → silently skip DB insert but still show success
- Input normalization: `email.trim().toLowerCase()`, WhatsApp cleaned to digits + leading `+`
- `safeVariant = variant || 'individual'`
- `defaultDestination` fallback: if not in i18n destinations list → `'global'`
- Double-submit: `isSubmitting` state disables button + shows loading text
- SSR safety: `typeof window !== 'undefined'`, `typeof document !== 'undefined'`

**Data payload:**
```
{
  name,
  email: email.trim().toLowerCase(),
  customer_whatsapp: cleanedWhatsapp,
  source_domain: typeof window !== 'undefined' ? window.location.hostname || 'unknown' : 'unknown',
  created_from: safeVariant === 'mice' ? 'mice_form' : 'advisory_form',
  quiz_answers: {
    ...all_fields,
    source_page,
    submitted_at: new Date().toISOString(),
    fingerprint: `${email.trim().toLowerCase()}-${source_page}-${safeVariant}`,
    referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct'
  }
}
```

**Flow:** DB insert (try/catch, silent fail) → THEN fire PostHog (`mice_form_submitted` or `advisory_form_submitted` with `{ source_page, variant, destination: destination || 'unspecified', timeline: timeline || 'unspecified' }`) → show success state

**UX:** Wrapper `min-h-[420px]`. Success state: `flex items-center justify-center animate-fade-in` + `scrollIntoView({ behavior: 'smooth' })` via `useRef`. No auto-reset.

---

## File 4: `src/pages/en/WellnessPageEN.tsx`

- Remove imports: `ServiceCheckout` (line 9), `FOMOBlock` (line 14), `useServicesList` (line 15)
- Add import: `AdvisoryForm`
- Remove lines 73-98 (FOMOBlock + ServiceCheckout grid + empty state)
- Keep `SocialProofMini` (line 71) as template fatigue guard
- Insert `<AdvisoryForm source_page="wellness" defaultDestination="thailand" />` after SocialProofMini, wrapped in `<div id="checkout">`
- Remove `hasServices` const and `isLoading`/`services` destructuring (no longer needed)

---

## File 5: `src/pages/en/MICEPageEN.tsx`

- Remove imports: `ServiceCheckout` (line 10), `FOMOBlock` (line 15), `useServicesList` (line 16)
- Add import: `AdvisoryForm`
- Remove lines 75-100 (FOMOBlock + ServiceCheckout grid + empty state)
- Line 62: Update headline → `"From Leadership Retreats to Global Events."` accent `"Southeast Asia."`
- Features grid (lines 105-120) stays as template fatigue guard before form
- Insert `<AdvisoryForm variant="mice" source_page="mice" />` after Features grid (NO defaultDestination)

---

## File 6: `src/pages/en/ExpeditionsPageEN.tsx`

- Remove imports: `ServiceCheckout` (line 10), `FOMOBlock` (line 15), `useServicesList` (line 16)
- Add import: `AdvisoryForm`
- Remove lines 65-69 ("View Packages" button)
- Remove lines 80-105 (FOMOBlock + ServiceCheckout grid + empty state)
- Routes grid (lines 118-135) stays as template fatigue guard
- Insert `<AdvisoryForm source_page="expeditions" defaultDestination="thailand" />` after Routes grid

---

## File 7: `src/pages/en/NomadIncubatorPageEN.tsx`

- Remove imports: `ServiceCheckout` (line 11), `FOMOBlock` (line 16), `useServicesList` (line 18)
- Add import: `AdvisoryForm`
- Lines 64-66: Update headline → `"Arrive Ready."` accent `"Build Immediately."`
- Remove lines 84-109 (FOMOBlock + ServiceCheckout + empty state)
- Line 163-164: `"Purchase Consulting Package ↑"` → `"View Advisory Packages ↑"`
- `ExpectationOutcome` (line 80) stays as template fatigue guard
- Insert `<AdvisoryForm source_page="nomad_incubator" defaultDestination="thailand" />` after 360° Life Setup section (after line 131)

---

## File 8: `src/pages/en/SoftPowerPageEN.tsx`

- **KEEP** BundleSelector + ServiceCheckout (Stripe valid — paid service)
- Line 57: Update headline → `"Stay Longer. Learn Deeper."` accent `"Move Naturally."`
- Line 140-141: `"Purchase Consulting Package ↑"` → `"View Advisory Packages ↑"`
- No structural changes

---

## File 9: `src/pages/en/VietnamPageEN.tsx` (NEW)

- Route: `/destinations/vietnam`
- Hero: Unsplash Ha Giang mountains image
- Headline: `"The Quiet Route North."` accent `"Vietnam."` (5 words)
- Subtext: `"Cultural study and soft landing in Asia's emerging frontier."` (10 words)
- Structure: FocusedNavbar + TrustBar → Hero → Context (3 cards: Cultural Immersion, Soft Landing, Emerging Market) → Pathways (3 route cards) → `<AdvisoryForm source_page="vietnam" defaultDestination="vietnam" />` → Footer
- Uses SEOHead, StickyMobileCTA, WhatsApp CTA. No Stripe.

---

## File 10: `src/pages/en/CambodiaPageEN.tsx` (NEW)

- Route: `/destinations/cambodia`
- Hero: Unsplash Angkor/Phnom Penh golden hour image
- Headline: `"Fast. Calm. Flexible."` accent `"Cambodia."` (4 words)
- Subtext: `"Concierge arrival and strategic positioning."` (6 words)
- Same hierarchy as Vietnam. `<AdvisoryForm source_page="cambodia" defaultDestination="cambodia" />`
- No Stripe.

---

## File 11: `src/App.tsx`

- Add imports: `VietnamPageEN`, `CambodiaPageEN`
- Add 2 routes after line 73 (above catch-alls):
  - `/destinations/vietnam` → `VietnamPageEN`
  - `/destinations/cambodia` → `CambodiaPageEN`

---

## File 12: `src/components/FocusedNavbar.tsx`

- Add to EN_NAV_GROUPS "Experiences" items (lines 48-51):
  - `{ to: '/destinations/vietnam', label: 'Vietnam' }`
  - `{ to: '/destinations/cambodia', label: 'Cambodia' }`
- No top-level nav additions. Experiences goes from 2 to 4 items.

---

## Technical Notes

- **Database:** `leads` table has anon INSERT with `WITH CHECK (true)` — no RLS blockage
- **No migrations needed** — all fields map to existing `leads` columns
- **`animate-fade-in`** is already available as a Tailwind utility in the project
- **No new dependencies** required
- **TR pages, admin pages, Stripe functions, DTVPageEN** — all remain completely untouched
- **SoftPowerPageEN** keeps Stripe (BundleSelector + ServiceCheckout) — only copy changes

