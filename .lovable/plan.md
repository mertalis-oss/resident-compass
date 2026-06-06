# Phase 2.4 — Revised Pipeline (3 Overrides Applied)

Overrides 1–3 acknowledged and folded in. No file writes happen until you approve this plan.

---

## Override Acknowledgements

### Override 1 — Tier 3B legal extraction EXCLUSION
Tier 3B files are removed from the integrity-test walker entirely (not merely flagged). Hardcoded exclusion set inside `src/lib/i18n.test.ts`:
```ts
const EXCLUDED_PATHS = new Set([
  'src/pages/TermsOfService.tsx',
  'src/pages/PrivacyPolicy.tsx',
  'src/pages/RefundPolicy.tsx',
]);
```
The walker skips these by normalized relative path before reading file contents. Documented inline as `// TEMPORARY TECHNICAL DEBT — re-enable after legal-review loop`.

### Override 2 — Stripe canonical-apex stripping (Option B)
Replace the current strict `includes(v)` check in `sanitizeHost` (`supabase/functions/create-checkout-session/index.ts`, lines 18–25) with:
```ts
function sanitizeHost(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const v = raw.trim().toLowerCase();
  if (!v || v.length > 64) return null;
  if (!HOST_RE.test(v)) return null;
  if (v.includes('/') || v.includes(':') || v.includes('?') || v.includes('#')) return null;
  const stripped = v.replace(/^www\./, '');
  return (ALLOWED_DOMAINS as readonly string[]).includes(stripped) ? stripped : null;
}
```
Effect: `www.planbasia.com` → `planbasia.com`, `www.planbasya.com` → `planbasya.com`, every other www-prefixed input still rejected. `resolveReturnHost` consumers unchanged — they always receive the clean apex. Return/cancel URLs never scatter across www subdomains.

### Override 3 — Granular `/tools` SEO registry
Update `src/config/routeMapping.ts`:
```ts
export const INDEXABLE_TOOL_PATHS = new Set<string>([
  '/tools/dtv-visa-calculator',
]);

export const NOINDEX_PATHS = new Set<string>([
  '/tools/mobility-assessment',
  '/tools/internal-checkout',
  '/admin',
  '/login',
  '/dashboard',
  '/success',
  '/checkout',
  '/tr/rabbit-hole',
]);
```
- Remove blanket `'/tools'` from `NOINDEX_PATHS`.
- `isNoIndex(path)` short-circuit: if `INDEXABLE_TOOL_PATHS.has(path)` → return `false` before prefix scan (prevents a future broader `/tools` rule from accidentally re-blocking the calculator).
- `EN_OWNED_PREFIXES` keeps `/tools` so cross-domain routing still treats the calculator as EN-owned.
- Sitemap split (`public/sitemap.xml`) must add `https://planbasia.com/tools/dtv-visa-calculator` in this loop's sitemap edit (EN-only, no TR alternate since no TR mapping exists). `sitemap-tr.xml` untouched.

---

## Execution Order (after sign-off)

### Step 1 — Infrastructure (this loop, writes only after approval)

**1a. Create `src/lib/i18n.test.ts`**
- `beforeAll` 5-second `Promise.race` init guard against `i18n.isInitialized`.
- **Resource-tree failsafe:** assert `i18n.options.resources?.en?.translation` and `…tr.translation` are objects; throw a clear `i18n resources missing for locale X` error immediately if either is undefined (does not silently pass).
- Recursive walker over `src/`, skip: `node_modules`, `*.d.ts`, `src/lib/i18n.ts`, this test file itself, `src/test/**`, and the `EXCLUDED_PATHS` set from Override 1.
- Per-file preprocessing: strip `/* … */` (DOTALL) then strip `// …` per line (line numbers preserved by replacing with empty same-line content).
- Static key regex: `/\bt\(\s*(['"\`])([^'"\`\n]+)\1/g` — captures namespaced keys, dashes, underscores, dots.
- Dynamic-key regex: `/\bt\(\s*(\`[^\`]*\$\{|[A-Za-z_$][A-Za-z0-9_$]*\s*[,)])/g` — emitted as `console.warn`, **deduped by `file:line`, hard-capped at 50 lines**, followed by `console.warn('[i18n] dynamic key warnings truncated: showing 50 of N total')`.
- Validation via `getByPath(tree, 'a.b.c')`:
  - missing in EN or TR → **FAIL** with sorted output `key [EN ✗ TR ✓] file:line`.
  - present but empty string → **WARN only**, counted in summary.
- Final `expect(missing).toEqual([])`.

**1b. `package.json` — append script**
```json
"test:i18n": "bunx vitest run src/lib/i18n.test.ts"
```
(No pre-commit hook installed — project has no Husky / lint-staged config; per directive, no new tooling added.)

**1c. Apply Override 2 + Override 3 file edits**
- `supabase/functions/create-checkout-session/index.ts` — replace `sanitizeHost` body only.
- `src/config/routeMapping.ts` — add `INDEXABLE_TOOL_PATHS`, update `NOINDEX_PATHS`, update `isNoIndex()` short-circuit.
- `public/sitemap.xml` — add `/tools/dtv-visa-calculator` entry (EN-only, no `xhtml:link tr`).

**1d. Run `bunx vitest run src/lib/i18n.test.ts`** and dump to chat:
- pass/fail status,
- full missing-key list (expected empty if Tier 1+2 work was clean),
- empty-string warning count,
- truncated dynamic-key warning block + total-count summary line.

### Step 3 — Tier 3A Marketing Draft (Review-Only, no source commits)

**Scope (parsed only):**
`src/pages/Index.tsx`, `src/pages/tr/RabbitHolePage.tsx`, `src/pages/Success.tsx`, `src/pages/ServicePage.tsx` + all `src/components/service/*.tsx`, `src/components/PlanBForm.tsx`, `src/components/advisory/AdvisoryForm.tsx`.

**Excluded (untouched, hard-coded):** `TermsOfService.tsx`, `PrivacyPolicy.tsx`, `RefundPolicy.tsx`.

**Pipeline:**
1. Extract every `t('key', { defaultValue: '...' })` into `{ key, en, file, line, bucket }`. Bucket inferred from key namespace + suffix (`hero`/`cta`/`body`/`form`).
2. Compose TR strings under **locked brand-voice rules**: informal "sen" only • banned verbs `satın al`, `ödeme yap` → `Süreci Başlat` / `Danışmanlığı Başlat` • banned vocab `optimize`, `projeksiyon`, `stratejik karar vericiler`, `ölçeklendirilmiş`, `entegrasyon` • no rule-of-three • no FOMO/urgency • active voice only.
3. **Deterministic stratified sample (fixed seed = 1337):** per bucket, FNV-1a hash `${key}|${file}|1337` → sort asc → take first N. Output exactly 3 hero + 3 cta + 2 body + 2 form = 10 rows.
4. Render gate table in chat:
   ```
   | Key | EN Current | Proposed TR | hasEN | hasTR | Source File | Tier |
   ```
   `hasEN`/`hasTR` reflect live dictionary state BEFORE injection.
5. **Persistence:** full proposal array written to `.lovable/plan.md` under a clearly labeled **"Phase 2.4 Tier 3A — Temporary Review Artifact (DO NOT TREAT AS SOURCE-OF-TRUTH)"** section. Will be deleted from `plan.md` once Tier 3A commits land.
6. **Translation Collision Audit** across the full proposal array, grouped by proposed TR string, `count ≥ 2`:
   ```
   | EN Key | Proposed TR Value | Collision Count | Source Files |
   ```
   Rows with values in `{ 'Devam Et', 'Gönder', 'İleri', 'Yeniden Dene', 'Geri', 'Kapat' }` prefixed `[expected]` — informational, never blocking.

### HALT

After Step 1d output + Step 3 sample + collision report print to chat, stop. Wait for explicit sign-off before:
- injecting any new keys into `src/lib/i18n.ts`,
- stripping `defaultValue` in Tier 3A components,
- starting Tier 4 (admin) pipeline.

---

## Files Touched This Loop (post-approval)
- **Create:** `src/lib/i18n.test.ts`
- **Edit:** `package.json` (script only)
- **Edit:** `supabase/functions/create-checkout-session/index.ts` (Override 2 — `sanitizeHost` body)
- **Edit:** `src/config/routeMapping.ts` (Override 3 — `INDEXABLE_TOOL_PATHS`, `NOINDEX_PATHS`, `isNoIndex` short-circuit)
- **Edit:** `public/sitemap.xml` (Override 3 — add DTV calculator entry)
- **Edit:** `.lovable/plan.md` (append temporary Tier 3A review artifact)

## Out of Scope
Tier 3A source-component commits • Tier 3B legal content • Tier 4 admin • TR Wellness page (PR-2 backlog) • HI locale • `LanguageRouter.tsx` • sitemap generator script • Stripe ledger • Post-Deploy Verification Report.
