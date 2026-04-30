## Add Turkish Cambodia Destination Page

### 1. Create `src/pages/tr/CambodyaPage.tsx`

Mirror `src/pages/tr/VietnamPage.tsx` exactly (same structure, classes, motion, footer, sticky CTA pattern), substituting:

- **Icons**: `MapPin, Shield, Zap, Globe, Building2, Users, Briefcase, MessageCircle`
- **Hero image**: `https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop`
- **SEOHead**: title `"Kamboçya — Hızlı. Sakin. Esnek. | Plan B Asya"`, description `"Kamboçya'da concierge karşılama ve stratejik konumlanma."`, canonical `https://planbasya.com/tr/cambodia`, schemaType `Service`, serviceName `Kamboçya Danışmanlığı`.
- **Hero**: badge "Destinasyon Danışmanlığı", H1 "Hızlı. Sakin. Esnek." + accent "Kamboçya.", subheading "Concierge karşılama ve stratejik konumlanma.", primary CTA "Danışmanlığı Başlat" → `scrollToForm()`, secondary "WhatsApp ile Konuş" → handler.
- **Context** (caption "Neden Kamboçya", H2 "Hız ve Sükunetin Kesişimi"):
  - Zap / Hızlı Kurulum / "Şirket kaydı ve bankacılık günler içinde tamamlanır. Kamboçya'nın düzenleyici ortamı hızı destekler."
  - Shield / Sakin Operasyon / "Düşük yaşam maliyeti, minimal bürokratik yük ve uluslararası girişimcilere açık ortam."
  - Globe / Stratejik Konum / "Tayland, Vietnam ve Laos arasındaki köprü. Büyüyen dijital altyapı ve ASEAN entegrasyonu."
- **Pathways** (caption "Güzergahlar", H2 "Kamboçya'ya Giriş Yolunuz"):
  - Building2 / Phnom Penh Üssü / "Kamboçya'nın dinamik başkentinde iş merkezini kur. Bankacılık, ko-çalışma ve topluluk."
  - Users / Siem Reap Retreatı / "Angkor'un kapısından uzaktan çalışma ve kültürel bütünleşme. Yaratıcı ve wellness profesyonelleri için ideal."
  - Briefcase / Şirket Kuruluşu / "Dijital işletmeler için şirket tescili, çalışma izinleri ve vergi verimli yapılandırma."
- **Form** `<section id="cambodia-form">` (caption "Danışmanlığı Başlat", H2 "Kamboçya Sürecinizi Başlatın"): `<PlanBForm serviceId="cambodia-tr" onSubmitSuccess={() => setFormSubmitted(true)} />`. Post-submit: "Talebiniz alındı. En kısa sürede geri döneceğiz." + WhatsApp button "WhatsApp ile İletişime Geçin".
- **Analytics**: `trackPostHogEvent('whatsapp_click', { source: 'cambodia_tr', intent: 'cambodia-advisory' }, true)`.
- **WhatsApp message**: `Sayfa: Kamboçya | Domain: <hostname> | Merhaba, Kamboçya danışmanlığı hakkında bilgi almak istiyorum.` via `buildWhatsAppUrl`.
- **StickyMobileCTA** `onClick={scrollToForm}`, footer identical to Vietnam TR.

### 2. Register route in `src/App.tsx`

- Add import: `import CambodyaPage from "./pages/tr/CambodyaPage";`
- Add route under `/tr/*` block, above catch-all: `<Route path="/tr/cambodia" element={<CambodyaPage />} />`

### 3. Update `public/sitemap.xml`

Convert the existing Cambodia entry from EN-only to dual-locale (matching Vietnam pattern):

- Update existing `https://planbasia.com/destinations/cambodia` block: add `hreflang="tr"` alternate `https://planbasya.com/tr/cambodia`. Rename comment to `<!-- Cambodia (Dual) -->`.
- Add new `<url>` block for `https://planbasya.com/tr/cambodia` with both `hreflang` alternates and `x-default` pointing to EN.

### Out of scope

- No edits to `CambodiaPageEN.tsx`, shared components, navbar, or `useDomainScope.ts` (`/tr` already covered).

### Verification

- `/tr/cambodia` renders page; Hero CTA + StickyMobileCTA both smooth-scroll to `#cambodia-form`; WhatsApp success state appears only after `PlanBForm` submit; sitemap has both EN and TR Cambodia URLs with correct hreflang pairs.
