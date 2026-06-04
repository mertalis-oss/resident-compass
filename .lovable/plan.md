
# planbasia.com ↔ planbasya.com İzolasyonu — Uygulama Planı

## Doğrulanmış Bulgular
- Lovable hosting'de edge rewrite/redirect **yok** → tüm savunma app katmanında.
- `App.tsx` tek route registry; `routeMapping.ts` ona karşı elle reconcile edilecek.
- **Hero.tsx:42-46** `safeNavigate('/tr/mobility-assessment')` → App.tsx'te o route yok → 404. Kök neden bu.
- `i18n.ts` 24 dosyada ~240 `defaultValue:` çağrısı → Tier 1+2 onay kapısı zorunlu.
- `public/sitemap.xml` elle bakımlı (generator script yok) → mevcut mekanizma korunup ikinci dosya elle eklenecek.
- `public/robots.txt` zaten iki `Sitemap:` satırı içeriyor; ikinci satır `planbasya.com/sitemap.xml` → `sitemap-tr.xml` olarak güncellenecek.
- `create-checkout-session/index.ts` şu an `req.headers.origin`'i kullanıyor; `source_domain` body alanı var ama URL'lerde kullanılmıyor. Allowlist + sanitizer eklenip body→Origin→fallback sırası kurulacak.

---

## PHASE 0 — Hosting Doc + Stripe Sanitizer

### 0.1 Yeni `docs/HOSTING_LIMITATION.md`
Lovable hosting edge rewrite/redirect desteklemiyor. Cross-domain izolasyon birincil olarak `CrossDomainRedirect.tsx` üzerinden; ikincil savunma `index.html` IIFE, `LanguageRouter`, `SEOHead` hreflang, sitemap split ve `robots.txt`.

### 0.2 `supabase/functions/create-checkout-session/index.ts`
- `const ALLOWED_DOMAINS = ['planbasia.com','planbasya.com'] as const;`
- `sanitizeHost(raw): string | null`:
  - tip kontrolü + uzunluk ≤ 64
  - regex `/^[a-z0-9.-]+$/`
  - `/`, `:`, `?`, `#` içermez
  - `(ALLOWED_DOMAINS as readonly string[]).includes(raw)` tam eşleşme
- Resolve sırası:
  1. `body.source_domain` → `sanitizeHost`
  2. yoksa `new URL(req.headers.get('origin') ?? '').hostname` → `sanitizeHost`
  3. ikisi de `null` ise → `'planbasia.com'`
- `success_url`/`cancel_url` yalnızca `https://${validatedHost}${path}`.
- Stripe çağrıları, ledger, metadata, anti-duplicate, CORS allowlist **olduğu gibi**.

---

## PHASE 1 — ROUTE_MAP + CrossDomainRedirect + SEOHead

### 1.1 Yeni `src/config/routeMapping.ts`
```ts
export const EN_TO_TR: Record<string, string | null> = {
  '/': '/',
  '/visas/thailand-dtv':         '/vizeler/dtv-vize',
  '/visas/soft-power':           '/vizeler/soft-power',
  '/relocation/nomad-incubator': '/yerlesim/nomad-incubator',
  '/experiences/expeditions':    '/deneyimler/expeditions',
  '/corporate/mice':             '/deneyimler/mice',
  '/destinations/vietnam':       '/tr/vietnam',
  '/destinations/cambodia':      '/tr/cambodia',
  '/destinations/wellness':      null,
  // App.tsx <Route path> taranıp eksiksiz doldurulacak; eşleşmeyen mapping atılır.
};
export const TR_TO_EN: Record<string, string | null> = /* invert + null'lar korunur */;

export const EN_OWNED_PREFIXES = ['/visas','/relocation','/experiences',
  '/destinations','/corporate','/checkout','/tools','/success','/dashboard',
  '/login','/admin','/wellness','/expeditions','/corporate-retreats','/residency'];
export const TR_OWNED_PREFIXES = ['/tr','/vizeler','/yerlesim','/deneyimler'];

export const NOINDEX_PATHS = new Set<string>([
  '/admin','/login','/dashboard','/success','/checkout','/tr/rabbit-hole',
]);

export const isNoIndex = (p: string) => /* tam eşleşme veya prefix+'/' */;
export const isMappedRoute = (p: string) =>
  Object.prototype.hasOwnProperty.call(EN_TO_TR, p) ||
  Object.prototype.hasOwnProperty.call(TR_TO_EN, p);
```
Yorum satırında "App.tsx ile elle reconcile edildi — TARIH" notu.

### 1.2 Yeni `src/components/CrossDomainRedirect.tsx`
- `useLocation()` kullanır, render `null`.
- **Bypass:** `hostname` ∈ {`localhost`,`127.0.0.1`,`0.0.0.0`} veya `.lovable.app` ile bitiyorsa.
- **Target hesabı:**
  - host `planbasia.com` AND path `TR_OWNED_PREFIXES`'ten birine başlıyor AND `isMappedRoute(path)` → `planbasya.com`
  - host `planbasya.com` AND path `EN_OWNED_PREFIXES`'ten birine başlıyor AND `isMappedRoute(path)` → `planbasia.com`
  - değilse → `null` (yerel NotFound'a doğal düşüş)
- **Loop guard:** `target && target !== window.location.hostname`.
- **Eylem:** `window.location.replace('https://' + target + pathname + search + hash)`.

### 1.3 `src/App.tsx`
`<BrowserRouter>` içinde `<LanguageRouter />`'ın **hemen üstüne** `<CrossDomainRedirect />`. Diğer hiçbir route/ProtectedRoute/Suspense dokunulmaz.

### 1.4 `src/components/SEOHead.tsx` — Double-Indexability
```text
const cleanPath = location.pathname || '/';
const noIdx = noIndex || isNoIndex(cleanPath);

if (noIdx) {
  emit <meta name="robots" content="noindex,nofollow">
  // HİÇBİR hreflang / x-default emit edilmez
} else {
  const enPath = scope === 'en' ? cleanPath : TR_TO_EN[cleanPath];
  const trPath = scope === 'tr' ? cleanPath : EN_TO_TR[cleanPath];

  if (enPath && !isNoIndex(enPath))
    <link hreflang="en" href={`https://planbasia.com${enPath}`}/>
  if (trPath && !isNoIndex(trPath))
    <link hreflang="tr" href={`https://planbasya.com${trPath}`}/>
  // hreflang="hi" yalnız scope==='en' && enPath geçerli ise mevcut davranış korunur
  <link hreflang="x-default" href="https://planbasia.com/"/>
}
```
Canonical her zaman self-domain + cleanPath.

---

## PHASE 1.5 — Sitemap Bölünmesi (manuel)
- `public/sitemap.xml` (planbasia): `EN_OWNED_PREFIXES` ∩ EN_TO_TR keys ∩ `!isNoIndex`. TR karşılığı varsa `<xhtml:link rel="alternate" hreflang="tr" href="https://planbasya.com{trPath}"/>` + self + x-default.
- `public/sitemap-tr.xml` (planbasya): tersine.
- `public/robots.txt`: ikinci `Sitemap:` satırı `https://planbasya.com/sitemap-tr.xml` olur.

---

## PHASE 2 — i18n İki Aşamalı Onay Kapısı

### 2.1 Envanter
Geçici `scripts/audit-i18n-keys.ts`: regex `t\(\s*['"]([^'"]+)['"]\s*,\s*\{\s*defaultValue:\s*['"`]([^'"`]+)` → `{file,key,currentEN,hasEN,hasTR,tier}`.

### 2.2 Tier sınıflandırma
- **Tier 1+2 (marka-kritik):** Hero, FocusedNavbar, Philosophy, Testimonials, CTASection, Portals, TrustSignals, StickyMobileCTA, ConciergeButton, ServiceHero, ServicePage, MobilityAssessment.
- **Tier 3:** PlanBForm, AdvisoryForm, RabbitHolePage, Success, ToS/Privacy/Refund, Index, `service/*`.
- **Tier 4:** Admin* + sistem.

### 2.3 ONAY KAPISI — DURUR
Kullanıcıya markdown tablo:
```
| Tier | File | Key | EN current | Proposed TR |
```
Sovereign Strategic Advisor tonu (Süreci Başlat / Danışmanlığı Başlat / Stratejik İnceleme). Transaksiyonel ("satın al", "şimdi al", "ödeme yap") yasak. **Kullanıcı onayı bekle.**

### 2.4 Onay sonrası
`i18n.ts`'e EN+TR enjekte → **Safety Brake** (`hasEN && hasTR`) → yalnız doğrulanan key'lerden `defaultValue` parametresi silinir; doğrulanmayanlar olduğu gibi kalır.

### 2.5 Tier 3+4
Aynı pipeline otomatik; her dosya değişiminden sonra rota üzerinde smoke kontrol.

---

## PHASE 3 — `index.html` Failsafe Lang
`<head>` en başına:
```html
<script>
(function () {
  var h = window.location.hostname;
  document.documentElement.lang =
    (h === 'planbasya.com' || h.endsWith('.planbasya.com')) ? 'tr' : 'en';
})();
</script>
```
`main.tsx` ve `LanguageRouter`'daki mevcut lang ataması yedek olarak kalır.

---

## PHASE 4 — Hero CTA + Analytics Dedup

### 4.1 `src/components/home/Hero.tsx`
- Satır 42-46 `if (isTR) { safeNavigate('/tr/mobility-assessment') } else { setAssessmentOpen(true) }` **tamamen** kaldırılır.
- Yeni `handlePrimaryCTA`:
  ```text
  setAssessmentOpen(true);   // UI önce — koşulsuz, anında, senkron
  trackOnce('hero_primary_assessment');
  ```
- 213-219'daki `{!isTR && <SimplifiedAssessmentModal …>}` → **koşulsuz** mount; `sourceSite={isTR ? 'tr' : 'global'}`.

### 4.2 Dedup Guard (yalnız analytics)
```text
const lastFireMs = useRef(0);
const trackOnce = (type: string) => {
  const now = Date.now();
  if (now - lastFireMs.current < 500) return;
  lastFireMs.current = now;
  try { captureCTAClick({ type, site: isTR ? 'tr' : 'global' }); } catch {}
  if (import.meta.env.DEV) console.log('[CTA]', type, { isTR });
};
```
Mobil için `visibilityState` filtresi YOK (sadece try/catch). UI state asla kilitlenmez.

### 4.3 Dev-Only Debug
`Hero.tsx` ve `SimplifiedAssessmentModal.tsx` içine `import.meta.env.DEV` arkasında: CTA click, modal open değişimi, mount/unmount, portal render logları. Production'da Vite tree-shake → sıfır footprint.

---

## Yürütme Sırası
```
1. PHASE 0   docs + Stripe sanitizer
2. PHASE 3   index.html IIFE
3. PHASE 4   Hero + dedup + dev logs
4. PHASE 1.1 routeMapping.ts (App.tsx reconcile)
5. PHASE 1.2-1.3 CrossDomainRedirect + App.tsx mount
6. PHASE 1.4 SEOHead hreflang refactor
7. PHASE 1.5 sitemap.xml + sitemap-tr.xml + robots.txt
8. PHASE 2.1-2.2 envanter + tier tablosu
9. PHASE 2.3 **DURAKLAT** → kullanıcıya Tier 1+2 tablo
10. PHASE 2.4-2.5 onay sonrası kalan kademe
11. POST-DEPLOY DOĞRULAMA RAPORU
```

---

## POST-DEPLOY DOĞRULAMA RAPORU (zorunlu çıktı)
```
## Canonical
planbasia.com/                    → https://planbasia.com/
planbasia.com/visas/thailand-dtv  → https://planbasia.com/visas/thailand-dtv
planbasya.com/                    → https://planbasya.com/
planbasya.com/vizeler/dtv-vize    → https://planbasya.com/vizeler/dtv-vize

## Hreflang örneği (planbasia.com/visas/thailand-dtv)
<link rel="alternate" hreflang="en"        href="https://planbasia.com/visas/thailand-dtv"/>
<link rel="alternate" hreflang="tr"        href="https://planbasya.com/vizeler/dtv-vize"/>
<link rel="alternate" hreflang="x-default" href="https://planbasia.com/"/>

## Redirect davranışı
planbasia.com/vizeler/dtv-vize    → JS replace → planbasya.com/vizeler/dtv-vize
planbasya.com/visas/thailand-dtv  → JS replace → planbasia.com/visas/thailand-dtv
planbasia.com/visas/unknown-x     → kalır, NotFound (mapping yok)
planbasia.com/admin               → kalır (noindex, redirect yok)
*.lovable.app/vizeler/dtv-vize    → bypass, redirect yok

## Sitemap üyelikleri
sitemap.xml      → N EN path, 0 TR path, 0 NOINDEX
sitemap-tr.xml   → M TR path, 0 EN path, 0 NOINDEX

## Stripe return_url
body source_domain='planbasya.com'             → https://planbasya.com/success?...
body source_domain='https://planbasia.com'     → REJECT → Origin fallback
body source_domain='planbasia.com.evil.com'    → REJECT → Origin fallback
body source_domain='planbasia.com?x=1'         → REJECT → Origin fallback
no body, Origin=https://planbasya.com          → https://planbasya.com/success?...
both fail                                       → https://planbasia.com/success?...

## Leakage Proof
planbasia.com TR-prefix mapped path → JS replace → planbasya
planbasya.com EN-prefix mapped path → JS replace → planbasia
hreflang yalnız ROUTE_MAP'te tanımlı + indexable çiftlerde emit
NOINDEX_PATHS sitemap dışı + hreflang dışı
```

---

## Kapsam DIŞINDA
- Lovable edge-level rewrite (mümkün değil; doc'a yazıldı).
- HI dili (mevcut davranış korunur).
- `LanguageRouter.tsx` (dokunulmaz).
- Sitemap generator script (mevcut elle yönetim korunur).
- Stripe ledger/anti-duplicate akışı (dokunulmaz).

**ONAYLA → sıralı uygulama; Phase 2.3'te DURUR; kullanıcı onayı sonrası Phase 2.4-2.5 + Post-Deploy Raporu.**
