# Phase 2.4 — Tier 3A Marketing & Funnel (DRAFT / Awaiting Sign-Off)

## Status
- **Step 1 infrastructure: SHIPPED** — `src/lib/i18n.test.ts`, `package.json` script, Override 2 (`sanitizeHost` www-strip), Override 3 (granular `/tools` SEO registry + sitemap entry).
- **Step 3 draft proposals: AUTHORED** (this file) — no source-component commits, no `src/lib/i18n.ts` injection.

## Locked Brand Voice (enforced in every TR row below)
- Informal **"sen"** (formal "siz" reserved for legal/admin).
- Banned verbs: `satın al`, `ödeme yap` → use `Süreci Başlat` / `Danışmanlığı Başlat`.
- Banned vocab: `optimize`, `projeksiyon`, `stratejik karar vericiler`, `ölçeklendirilmiş`, `entegrasyon`.
- No rule-of-three list patterns • no FOMO/urgency • no passive corporate jargon.

## Diagnostic Results — `bunx vitest run src/lib/i18n.test.ts`
- **Scanned:** 138 files, 313 static `t()` calls, 7 dynamic sites, 0 empty values.
- **Missing keys:** 190 (test fails as designed — this is the Tier 3+4 dictionary gap the safety brake exists to surface).
- **Tier 3B legal files excluded** from the walker per Override 1 (technical debt; re-enabled after legal-review loop).
- **Dynamic warnings:** 7 unique sites, well under the 50-line cap; no truncation needed.

## Tier 3A — Temporary Review Artifact (DO NOT TREAT AS SOURCE-OF-TRUTH)
Full proposal array for the 56 extracted keys. Removed from this file once Tier 3A commits land.

| Key | EN Current | Proposed TR | Source File:Line |
|---|---|---|---|
| seo.homeTitle | Plan B Asia — Sovereign Mobility Architecture | Plan B Asya — Egemen Mobilite Mimarisi | Index.tsx:20 |
| footer.privacy | Privacy | Gizlilik | Index.tsx:42 |
| footer.terms | Terms | Şartlar | Index.tsx:45 |
| footer.refund | Refund Policy | İade Politikası | Index.tsx:48 |
| rabbitHole.seoTitle | Private Wellness Experiences — Plan B Asia | Özel Wellness Deneyimleri — Plan B Asya | RabbitHolePage.tsx:36 |
| rabbitHole.badge | Private Wellness Experiences | Özel Wellness Deneyimleri | RabbitHolePage.tsx:60 |
| rabbitHole.heroTitle | Derinlere Dalış | Derinlere Dalış | RabbitHolePage.tsx:63 |
| rabbitHole.heroSub | İçsel Keşif Yolculuğu | İçsel Keşif Yolculuğu | RabbitHolePage.tsx:65 |
| rabbitHole.heroDesc | Bilinçaltının katmanlarını keşfet. Binlerce yıllık geleneksel pratiklerin modern güvenlik standartlarıyla buluştuğu eşsiz deneyimler. | Bilinçaltının katmanlarını keşfet. Binlerce yıllık geleneksel pratikler, modern güvenlik standartlarıyla buluşuyor. | RabbitHolePage.tsx:69 |
| rabbitHole.ctaExplore | Deneyimleri Keşfet | Deneyimleri Keşfet | RabbitHolePage.tsx:73 |
| rabbitHole.ctaSafety | Güvenlik İlkelerimiz | Güvenlik İlkelerimiz | RabbitHolePage.tsx:76 |
| rabbitHole.programsLabel | Programlar | Programlar | RabbitHolePage.tsx:87 |
| rabbitHole.programsTitle | Doğa Ana'nın Hediyeleri | Doğa Ana'nın Hediyeleri | RabbitHolePage.tsx:88 |
| rabbitHole.principlesLabel | Taahhütlerimiz | Taahhütlerimiz | RabbitHolePage.tsx:115 |
| rabbitHole.principlesTitle | Güvenlik İlkelerimiz | Güvenlik Yaklaşımımız | RabbitHolePage.tsx:116 |
| rabbitHole.ctaTitle | Bu Yolculuk Sana Uygun mu? | Bu Yolculuk Sana Uygun mu? | RabbitHolePage.tsx:136 |
| rabbitHole.ctaBody | Gizli, bağlayıcı olmayan bir görüşme ile senin için doğru olup olmadığını birlikte değerlendirelim. | Gizli, bağlayıcı olmayan bir görüşmede senin için doğru olup olmadığını birlikte değerlendirelim. | RabbitHolePage.tsx:137 |
| rabbitHole.legalDisclaimer | Sunulan tüm hizmetler danışmanlık ve yönlendirme kapsamındadır. Plan B Asia sadece aracıdır. Herhangi bir yasa dışı faaliyet teşvik edilmez veya desteklenmez. | Sunulan tüm hizmetler danışmanlık ve yönlendirme kapsamındadır. Plan B Asya yalnızca aracı konumundadır. Hiçbir yasa dışı faaliyet teşvik edilmez. | RabbitHolePage.tsx:141 |
| rabbitHole.ctaBtn | Değerlendirme Başlat | Değerlendirme Başlat | RabbitHolePage.tsx:145 |
| rabbitHole.backHome | Ana Sayfaya Dön | Ana Sayfaya Dön | RabbitHolePage.tsx:153 |
| success.verifying | We're verifying your payment... | Ödemen doğrulanıyor... | Success.tsx:104 |
| success.pageTitle | Order Confirmed — Plan B Asia | Sürecin Onaylandı — Plan B Asya | Success.tsx:120 |
| success.timeoutTitle | Payment received | Ödemen alındı | Success.tsx:127 |
| success.timeoutBody | Ödemeniz sistemimize ulaşmıştır. Teknik doğrulama süreci devam ediyor. Her durumda sizinle manuel olarak iletişime geçeceğiz. | Ödemen sistemimize ulaştı. Teknik doğrulama sürüyor. Her halükarda seninle manuel iletişime geçeceğiz. | Success.tsx:130 |
| success.teamWorking | Ekibimiz şu an planınızı hazırlıyor. | Ekibimiz şu an planını hazırlıyor. | Success.tsx:133 |
| success.timeoutCta | Didn't receive confirmation? Contact us on WhatsApp. | Onay e-postası gelmedi mi? WhatsApp üzerinden bize yaz. | Success.tsx:136 |
| success.contactSupport | Contact Support | Bize Ulaş | Success.tsx:140 |
| success.title | Order Successfully Received | Sürecin Başarıyla Alındı | Success.tsx:162 |
| success.dopamine | You just removed a major uncertainty from your path. | Yolundaki büyük bir belirsizliği az önce ortadan kaldırdın. | Success.tsx:165 |
| success.vipNote | Size özel süreciniz başlatıldı. Şu anda sistemde önceliklendirildiniz. Genellikle birkaç saat, en geç 24 saat içinde sizinle iletişime geçiyoruz. | Sana özel sürecin başlatıldı. Şu an sistemde önceliklisin. Genelde birkaç saat, en geç 24 saat içinde seninle iletişime geçiyoruz. | Success.tsx:171 |
| success.nextStepsLabel | What happens now | Şimdi ne oluyor | Success.tsx:177 |
| success.step1 | Our team reviews your case | Ekibimiz durumunu inceliyor | Success.tsx:180 |
| success.step2 | We contact you within 24 hours | 24 saat içinde seninle iletişime geçiyoruz | Success.tsx:181 |
| success.step3 | You receive your personalized next steps | Sana özel sonraki adımları alıyorsun | Success.tsx:182 |
| success.relief | No further action is required from your side right now. | Şu an senin tarafından ek bir işlem gerekmiyor. | Success.tsx:194 |
| success.avgResponse | Avg. first response: 2h | Ortalama ilk yanıt: 2 saat | Success.tsx:197 |
| success.whatsappPush | We already have your request. Most clients message us here to get faster responses. | Talebin elimizde. Müşterilerimizin çoğu daha hızlı yanıt almak için bize buradan yazıyor. | Success.tsx:202 |
| success.whatsappCta | Message Us on WhatsApp | WhatsApp'tan Yaz | Success.tsx:210 |
| form.error | Something went wrong. Please try again. | Bir şey ters gitti. Tekrar dene. | PlanBForm.tsx:54 |
| form.submitting | Submitting… | Gönderiliyor… | PlanBForm.tsx:97 |
| service.bundleLabel | Bundle Contents | Paket İçeriği | ServiceBundleItems.tsx:53 |
| service.bundleContext | Everything you need in one structured process. | Tek bir yapılandırılmış süreçte ihtiyacın olan her şey. | ServiceBundleItems.tsx:56 |
| service.deliveryDays | Delivery Days | Teslim Süresi | ServiceDeliveryInfo.tsx:19 |
| service.location | Location | Lokasyon | ServiceDeliveryInfo.tsx:27 |
| service.capacity | Capacity | Kapasite | ServiceDeliveryInfo.tsx:35 |
| service.faqLabel | Frequently Asked Questions | Sıkça Sorulan Sorular | ServiceFAQ.tsx:16 |
| service.faqPush | Still unsure? Start your process and we'll guide you step by step. | Hâlâ kararsız mısın? Süreci başlat, adım adım yanındayız. | ServiceFAQ.tsx:31 |
| service.fallbackTitle | Not available in your region (yet) | Bölgende henüz mevcut değil | ServiceFallback.tsx:14 |
| service.fallbackBody | We're expanding fast. You can still start with these: | Hızla büyüyoruz. Bu hizmetlerle başlayabilirsin: | ServiceFallback.tsx:17 |
| service.getStarted | Get Started | Süreci Başlat | ServiceFallback.tsx:35 |
| service.whatYouGet | What you'll get: | Sana sunulanlar: | ServiceFeatures.tsx:16 |
| service.featuresContext | Designed to give you clarity, speed, and a clear path forward. Based on real cases and proven processes. | Sana netlik ve hız kazandırmak için tasarlandı. Gerçek vakalardan ve denenmiş süreçlerden doğdu. | ServiceFeatures.tsx:19 |
| service.upsellLabel | Clients who chose this service often also needed: | Bu hizmeti seçen danışanların sıklıkla ihtiyaç duyduğu: | ServiceUpsell.tsx:36 |
| service.learnMore | Learn More | Daha Fazla | ServiceUpsell.tsx:52 |

Duplicate rows (`success.pageTitle` Success.tsx:152 and `success.teamWorking` Success.tsx:168) share the same proposed TR as their first occurrence — listed once above for clarity.

## Out of Scope
Tier 3A source-component commits • Tier 3B legal content (TermsOfService, PrivacyPolicy, RefundPolicy) • Tier 4 admin pipeline • TR Wellness page (PR-2) • HI locale • `LanguageRouter.tsx` • Post-Deploy Verification Report.

## HALT
Awaiting explicit sign-off before:
1. Injecting all 56 keys into `src/lib/i18n.ts` (`en` + `tr` trees).
2. Stripping `defaultValue` from the 7 Tier 3A source files.
3. Re-running `test:i18n` to confirm green.
4. Starting Tier 4 (admin) pipeline.
