# PHASE 2.3 — Revised Tier 1+2 Injection (Stage-Gate Stop)

## Brand-Voice Guardrails Locked In
- Informal **"sen"** only (siz reserved for legal/admin).
- No transactional verbs (`satın al / ödeme yap`) → use `Süreci Başlat / Danışmanlığı Başlat`.
- Banned vocabulary: `optimize`, `stratejik karar vericiler`, `ölçeklendirilmiş`, `projeksiyon`, `entegrasyon`.
- No rule-of-three patterns, no FOMO/urgency hooks.

These rules will also gate Tier 3+4 review later.

---

## Step 1 — Inject Approved Keys into `src/lib/i18n.ts`

Add the 15 keys to BOTH `en` and `tr` resource trees, under their existing namespaces (`checkout`, `quiz`, `service`). EN values are sourced verbatim from current `defaultValue` strings in the components. TR values are the **exact** strings from the user message (no paraphrase).

| Key | EN (from existing defaultValue) | TR (locked) |
|-----|---------------------------------|-------------|
| `checkout.processing` | Processing... | Onaylanıyor... |
| `quiz.bridge1` | Based on your answers, this is the most optimized path for your situation. | Profiline en uygun yol bu. |
| `quiz.bridge2` | Strategic decision-makers with similar profiles prioritize this path. | Senin gibi profiller genelde bu yolu seçiyor. |
| `quiz.bridge3` | Fit rationale based on your financial picture, timeline, and income model. | Senin profiline göre seçildi. |
| `quiz.resultsPersonalized` | Results are fully scaled to your personal profile. | Sonuçlar profiline özel. |
| `service.canceledTitle` | Payment not completed | Şimdi Değilmiş |
| `service.canceledDesc` | Session ended. Resume planning whenever you are ready. | Şimdi vakti değilmiş. Hazır olduğunda kaldığın yerden devam ederiz. |
| `service.exitIntentTitle` | Before you close this session… | Gitmeden Önce... |
| `service.exitIntentDesc` | You've come this far. The right moment is yours to choose. | Buraya kadar geldin. Devam etmek için doğru zaman senin elinde. |
| `service.errorTitle` | Connection error | Bir Şey Ters Gitti |
| `service.errorBody` | The operation could not be completed. Refresh and try again. | İşlem tamamlanamadı. Sayfayı yenileyip tekrar dene. |
| `service.retry` | Retry | Yeniden Dene |
| `service.notFoundTitle` | Service unavailable | Bu Hizmet Şu An Aktif Değil |
| `service.finalCtaTitle` | Shall we take the first step? | İlk adımı atalım mı? |
| `service.finalCtaBody` | Your Plan B setup and formal process begin here. | Plan B kurulumun ve resmi sürecin burada başlar. |

Implementation detail: open `src/lib/i18n.ts`, locate the matching namespace blocks in the `en` and `tr` resource objects, and add/overwrite these 15 entries in both. Do NOT touch other keys, other locales (HI), or any unrelated structure.

## Step 2 — Dictionary Audit (Safety Brake)

For each of the 15 keys, programmatically verify after injection:
- `i18n.options.resources.en.translation.<key>` exists and is non-empty
- `i18n.options.resources.tr.translation.<key>` exists and is non-empty

(If the project nests resources differently, follow the actual structure already present in `i18n.ts`.) Any key failing the brake is **skipped** in Step 3.

## Step 3 — Strip `defaultValue` for Verified Tier 1+2 Keys Only

Scope (Tier 1+2 components only — confirmed against codebase):
- `src/components/home/Hero.tsx`
- `src/components/home/Philosophy.tsx`
- `src/components/home/Portals.tsx`
- `src/components/home/Testimonials.tsx`
- `src/components/home/CTASection.tsx`
- `src/components/home/TrustSignals.tsx`
- `src/components/home/SimplifiedAssessmentModal.tsx`
- `src/components/FocusedNavbar.tsx`
- `src/components/StickyMobileCTA.tsx`
- `src/components/ConciergeButton.tsx`
- `src/components/service/ServiceHero.tsx`
- `src/pages/ServicePage.tsx`
- `src/pages/MobilityAssessment.tsx`

Transform — strictly for keys whose Safety Brake passed:
```
t('key', { defaultValue: '…' })   →   t('key')
```
All other `t()` calls (keys that did NOT pass the brake) remain untouched, preserving their `defaultValue`.

Image `alt` keys (e.g. `cta.bgAlt`, `philosophy.imageAlt`, `portals.*.title`) are **not** in the approved batch and stay as-is.

## Step 4 — Vitest Smoke

Run `bunx vitest run`. Acceptance:
- All existing tests still pass.
- No new TypeScript regressions surfaced by the test runner.

If anything fails, halt and report — do not advance to Tier 3/4.

## Step 5 — STOP — Tier 3+4 Stage-Gate

After Step 4 succeeds, output:
1. Confirmation of which keys passed the Safety Brake.
2. List of component files modified with `defaultValue` strip counts.
3. Vitest output excerpt.
4. **Wait for explicit user approval** before drafting Tier 3 (PlanBForm, AdvisoryForm, RabbitHolePage, Success, ToS/Privacy/Refund, Index, service pages) and Tier 4 (admin) translation tables under the locked brand-voice rules.

---

## Out of Scope (this loop)
- Tier 3 + Tier 4 translation injection (gated).
- HI locale.
- `LanguageRouter.tsx`, sitemap generator, Stripe ledger flows.
- Post-Deploy Verification Report (runs only after Tier 4 completes).

**Implement Plan → execute Steps 1–4, then HALT and request Tier 3+4 approval.**
