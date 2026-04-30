## Add Turkish Vietnam Destination Page (revised routing)

Create the TR counterpart to `VietnamPageEN.tsx` under the existing `/tr/*` namespace.

### 1. New file: `src/pages/tr/VietnamPage.tsx`

Mirror `src/pages/en/VietnamPageEN.tsx` structure (Hero → Context → Pathways → Form → Footer + StickyMobileCTA), substituting:

- TR copy from your message (Kuzeyin Sessiz Güzergahı, Neden Vietnam, Güzergahlar, etc.).
- Lead capture: use `PlanBForm` (TR pages pattern) instead of `AdvisoryForm`, wrapped in `<section id="vietnam-form">` with `formSubmitted` state and a WhatsApp fallback CTA after submit.
- Hero CTA button → `scrollToForm()` (smooth scroll to `#vietnam-form`); secondary WhatsApp CTA via `buildWhatsAppUrl` + `trackPostHogEvent('whatsapp_click', { source: 'vietnam_tr' }, true)`.
- Same Unsplash hero background, same icon set, same motion/grid/typography classes used in EN page (design parity preserved).
- `useEffect(() => window.scrollTo(0,0), [])` on mount.
- `<SEOHead>` with TR title/description, **`canonical="https://planbasya.com/tr/vietnam"`**, `schemaType="Service"`, `serviceName="Vietnam Danışmanlığı"`. Hreflang is auto-emitted by `SEOHead`.
- `<FocusedNavbar />`, `<TrustBar />`, `<StickyMobileCTA onClick={scrollToForm} />`, footer identical to EN.

### 2. Register route in `src/App.tsx`

Import the page and add under the existing `/tr/*` block, **above** the `*` catch-all:

```tsx
import VietnamPage from "./pages/tr/VietnamPage";
...
<Route path="/tr/vietnam" element={<VietnamPage />} />
```

### 3. Skip `useDomainScope.ts`

`/tr` prefix is already in `TR_ROUTE_PREFIXES`, so scope detection works as-is.

### 4. Update `public/sitemap.xml`

If a Vietnam TR entry exists referencing `/destinasyonlar/vietnam`, change it to `https://planbasya.com/tr/vietnam` with hreflang alternate pointing to `https://planbasia.com/destinations/vietnam`. If no entry exists yet, add it following the existing TR `<url>` pattern.

### Out of scope (per "No Refactoring" rule)

- Not touching the EN page or shared components.
- TR navbar link to the new page is a separate follow-up.

### Verification after build

- `/tr/vietnam` on planbasya.com renders the TR Vietnam page.
- Hero CTA + Sticky CTA scroll to `#vietnam-form`.
- `PlanBForm` submit shows TR success state with WhatsApp fallback.
- `<html lang="tr">` and canonical `https://planbasya.com/tr/vietnam` present in head.
