

# Phases 2, 3, 4 — Production Patch

## Phase 2: EN Category Pages + Navbar + Routes

### 2a. Create `src/pages/en/SoftPowerPageEN.tsx`
Thin copy of `src/pages/tr/SoftPowerPage.tsx` with these changes:
- Line 31: `useServicesList('soft-power', 'global')` instead of `'tr'`
- All Turkish UI strings translated to English (SEO title, course names, section headers, legal text, button labels)
- Grid wrapped with `min-h-[400px]` per CLS fix
- Empty state fallback: "Packages currently being updated. Please check back soon."
- `encodeURIComponent(slug)` used in any dynamic link construction

### 2b. Create `src/pages/en/NomadIncubatorPageEN.tsx`
Thin copy of `src/pages/tr/NomadIncubatorPage.tsx` with:
- `useServicesList('residency', 'global')` instead of `'tr'`
- All Turkish strings translated to English
- Same CLS and empty state fixes

### 2c. Routes in `src/App.tsx`
Add 2 imports + 2 routes **above** the existing `/:slug` catch-all (before line 55):
```
<Route path="/residency/soft-power" element={<SoftPowerPageEN />} />
<Route path="/residency/nomad-incubator" element={<NomadIncubatorPageEN />} />
```

### 2d. Navbar (`src/components/FocusedNavbar.tsx`)
Add to `EN_NAV_GROUPS` Lifestyle items (lines 41-44):
```
{ to: '/residency/soft-power', label: 'Soft Power' },
{ to: '/residency/nomad-incubator', label: 'Nomad Incubator' },
```

---

## Phase 3: Hero CRO & Quiet Luxury UI

### 3a. i18n keys (`src/lib/i18n.ts`)

**EN hero block** (line 217):
- `title`: `'Live Legally in Asia.\nLeave the Bureaucracy to Us.'`
- Add `ctaMicro: '2 minutes • Instant results'`
- Add `trustStrip: ['150+ Consultations', 'Applicants from 12 Countries', '24h Avg. Response']`
- Change `explore`: `'How it Works'`

**TR hero block** (line 366):
- `title`: `'Asya\'da Yasal Güvenceyle Yaşayın.\nBürokrasiyi Bize Bırakın.'`
- Add `ctaMicro: '2 dakika • Anında sonuç'`
- Add `trustStrip: ['150+ Danışmanlık', '12 Ülkeden Başvuru', '24 Saat Geri Dönüş']`
- Change `explore`: `'Nasıl Çalışır?'`

### 3b. Hero component (`src/components/home/Hero.tsx`)

1. **Subtitle** (line ~81): add `font-light leading-[1.6]`
2. **Hook text** (line ~90): add `font-light leading-[1.6]`
3. **CTA microcopy**: After the dual CTA motion.div, add muted text `{t('hero.ctaMicro')}` with `text-white/60`
4. **Secondary CTA** (line ~109): Replace outline classes with glassmorphic: `border border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md text-xs tracking-[0.15em] uppercase px-8 py-4 h-auto rounded-md`
5. **Trust Strip**: After ctaSub, add a `flex-wrap` row with 3 stats from `t('hero.trustStrip', {returnObjects: true})`, each in `text-white/60` separated by `•`
6. **Scroll indicator** text: already uses `t('hero.explore')` — i18n change handles it

---

## Phase 4: Portals Anchor (`src/components/home/Portals.tsx`)

Change root `<section>` to:
```html
<section id="portals-section" className="scroll-mt-24 section-editorial bg-background">
```

---

## Files Summary

| File | Action |
|---|---|
| `src/pages/en/SoftPowerPageEN.tsx` | Create — EN copy, scope='global', CLS fix, empty state |
| `src/pages/en/NomadIncubatorPageEN.tsx` | Create — EN copy, scope='global', CLS fix, empty state |
| `src/App.tsx` | Add 2 imports + 2 routes above catch-all |
| `src/components/FocusedNavbar.tsx` | Add 2 items to EN_NAV_GROUPS |
| `src/lib/i18n.ts` | Update hero title + add ctaMicro, trustStrip, explore keys |
| `src/components/home/Hero.tsx` | Typography, glassmorphic CTA, microcopy, trust strip (text-white/60) |
| `src/components/home/Portals.tsx` | Add `id="portals-section"` + `scroll-mt-24` |

## Not Touched
- TR category pages (zero modifications)
- Database (no slug mutations)
- Stripe logic, webhooks, RLS
- `useServiceFetch` or `useServicesList`

