# Hosting Limitation — Cross-Domain Strategy

## TL;DR
Lovable hosting katmanı **edge-level rewrite/redirect desteklemiyor**. `vercel.json`, `netlify.toml`, `_redirects`, `_headers` gibi dosyalar bu projede etkisizdir. SPA fallback'i (deep link refresh) otomatik çalışır; başka hiçbir edge davranışı yapılandırılamaz.

Bu nedenle `planbasia.com` (EN/global) ↔ `planbasya.com` (TR) izolasyonu **tamamen uygulama katmanında** uygulanır.

## Savunma Katmanları (sırasıyla)

1. **`index.html` IIFE** — React bundle yüklenmeden önce `document.documentElement.lang` host'a göre kilitlenir.
2. **`src/components/CrossDomainRedirect.tsx`** — Birincil savunma. `BrowserRouter` içinde `LanguageRouter`'ın hemen üstünde mount edilir. `src/config/routeMapping.ts` referansıyla yalnız bilinen + sahipliği yanlış yola düşmüş rotaları `window.location.replace()` ile karşı domaine atar. Localhost/`.lovable.app` bypass edilir, loop guard var, eşleşmeyen rotalar yerel `NotFound`'a düşer.
3. **`src/components/LanguageRouter.tsx`** — i18n dil ataması (mevcut davranış korunur).
4. **`src/components/SEOHead.tsx`** — Self-canonical + yalnız `routeMapping.ts`'te tanımlı + her iki tarafı da indexable çiftler için `hreflang` emit eder. `NOINDEX_PATHS` listesindeki rotalarda hiçbir hreflang üretmez.
5. **Sitemap split** — `public/sitemap.xml` yalnız EN-sahipli indexable URL'ler, `public/sitemap-tr.xml` yalnız TR-sahipli. `public/robots.txt` iki sitemap'i ayrı `Sitemap:` satırlarıyla duyurur.
6. **`supabase/functions/create-checkout-session/index.ts`** — Stripe `return_url`/`cancel_url` host'u allowlist + sanitizer üzerinden: body `source_domain` → `Origin` header → `planbasia.com` fallback.

## Neden edge yok
Lovable preview ve published deployment'larda yalnız SPA fallback ve statik dosya servisi vardır. Bu yüzden 301 redirect'leri sunucu seviyesinde yapamıyoruz; JS tabanlı `window.location.replace()` kullanıyoruz. Bu yaklaşım crawlerlar için de yeterlidir: Googlebot JS execute eder ve `replace` sonrası canonical/hreflang'leri görür.

## Eklenmemesi gereken dosyalar
- `vercel.json`, `netlify.toml`, `public/_redirects`, `public/_headers` — Lovable bunları okumaz; eklenirse yanıltıcı olur.
