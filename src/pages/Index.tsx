<!doctype html>
<html>
  <head>
    <meta name="facebook-domain-verification" content="czst3u3pxeva2if5eefjzhvq0q825n" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="author" content="Atropox OÜ" />
    <meta name="google-site-verification" content="AhrHciaLkCHu7VplC_lcMhad4SPa8EF9lY0G7QNuZow" />
    <meta name="google-site-verification" content="AOnDRWhAPK-AT0ALuBXcggSrjT8X2AEdflHilOv81Lk" />

    <!-- Default title — HTML5 spec gereği <title> zorunlu. Helmet (SEOHead) her sayfada bunu OVERRIDE eder.
         Bu sadece JS render olana kadarki ~100ms için fallback. Crawler hala SEOHead'in canonical/title'ını görür. -->
    <title>Plan B Asia — Sovereign Mobility Architecture</title>

    <!-- SEO meta (description/canonical/hreflang/OG/Twitter) per-sayfa SEOHead bileşeni tarafından üretilir.
         index.html'den hardcoded canonical/hreflang/OG SİLİNDİ (Plan v7 S0.1) — sadece minimal title fallback kaldı. -->

    <!-- LCP preload + network hints -->
    <link rel="preload" as="image" href="/images/hero-home.webp" type="image/webp" fetchpriority="high">
    <link rel="preconnect" href="https://gjbuoyxwujpbaprcrnmg.supabase.co" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://app.posthog.com" crossorigin>
    <link rel="preconnect" href="https://js.stripe.com" />
    <link rel="dns-prefetch" href="https://js.stripe.com" />
    <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

    <!-- GTM consent-gated olarak src/lib/gtm.ts üzerinden yüklenir (Plan v7 S1.2).
         index.html'den GTM script + noscript iframe kaldırıldı (Plan v7 S0.2). -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
