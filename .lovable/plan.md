

# Batch 2.5 Final — formatPrice Utility + i18n Keys + Global Pricing Audit

## 8 Files Changed

### 1. `src/hooks/useDomainScope.ts` — Type fix
- Change `'tr' | 'global'` → `'tr' | 'en'`
- Change fallback `return 'global'` → `return 'en'` (line 4)
- Change final return `'tr' : 'global'` → `'tr' : 'en'` (line 13)

### 2. `src/lib/formatPrice.ts` — NEW single source of truth

```ts
import type { DomainScope } from '@/hooks/useDomainScope';

const VALID_CURRENCIES = ['USD', 'EUR'];

export function resolveCurrency(
  currency: string | null | undefined,
  scope: DomainScope
): string {
  const normalized = (currency || '').toUpperCase();
  return VALID_CURRENCIES.includes(normalized) ? normalized : (scope === 'tr' ? 'USD' : 'EUR');
}

export function formatPrice(price: number, currency: string, scope: DomainScope): string {
  const safeCurrency = resolveCurrency(currency, scope);
  return new Intl.NumberFormat(scope === 'tr' ? 'tr-TR' : 'en-US', {
    style: 'currency',
    currency: safeCurrency,
    currencyDisplay: 'narrowSymbol',
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function renderPrice(
  price: number | null | undefined,
  currency: string,
  scope: DomainScope
): { display: string; isPrivate: boolean; resolvedCurrency: string } {
  const resolvedCurrency = resolveCurrency(currency, scope);
  if (price == null || price === 0) {
    return {
      display: scope === 'tr' ? 'Özel Danışmanlık' : 'Private Engagement',
      isPrivate: true,
      resolvedCurrency,
    };
  }
  return {
    display: formatPrice(price, currency, scope),
    isPrivate: false,
    resolvedCurrency,
  };
}
```

Key design decisions:
- **No hooks** — pure functions only, scope always passed as parameter (Guard 1)
- **No `window` access** — components resolve scope via `useDomainScope()` hook and pass it in (Guard 2)
- **NaN-safe** — uses `price == null || price === 0` instead of `!price` (Guard 3)
- `resolveCurrency` exported separately for `stripeTrust` label sync (Currency Label Consistency)

### 3. `src/lib/i18n.ts` — Add missing keys

**EN `checkoutKeys`** (after line 55): add `stripeTrust`, `connectionSlow`, `ctaLabel`, `redirecting`

**TR `checkoutKeysTr`** (after line 126): add `mustAccept`, `stripeTrust`, `connectionSlow`, `ctaLabel`, `redirecting`

**HI `checkoutKeysHi`** (after line 194): add `mustAccept`, `stripeTrust`, `connectionSlow`, `ctaLabel`, `redirecting`

**EN translation** (~line 305, alongside `service`/`checkout`): add `softPower: { bundleIntro, bundleRequired }`

**TR translation** (~line 430, alongside existing keys): add `softPower: { bundleIntro, bundleRequired }`

### 4. `src/components/service/ServiceCheckout.tsx`
- Import `renderPrice`, `resolveCurrency` from `@/lib/formatPrice`
- Remove inline `formatPrice` (lines 232-233)
- Replace `priceDisplay` with `renderPrice(service.price, service.currency || 'USD', scope)`
- Derive `currencyLabel` from `resolveCurrency(service.currency, scope)` — same resolved value feeds both price and `stripeTrust` text
- Wrap numeric price in `<span className="whitespace-nowrap">` — skip `whitespace-nowrap` when `isPrivate` (Guard 4)
- Remove all `defaultValue` fallbacks from `t()` calls that now have keys in i18n.ts
- Replace CTA labels: `t('checkout.redirecting')` / `t('checkout.ctaLabel')` — remove scope branching since i18n resolves by language

### 5. `src/components/service/BundleSelector.tsx`
- Import `formatPrice` from `@/lib/formatPrice`, `useDomainScope` from hook
- Remove inline `formatPrice` (lines 10-11)
- Add `const scope = useDomainScope()` inside component
- Call `formatPrice(bundle.price, bundle.currency || 'USD', scope)`
- Wrap price in `<span className="whitespace-nowrap">`
- Remove `defaultValue` from `t('softPower.bundleIntro')` and `t('softPower.bundleRequired')`

### 6. `src/components/service/ServiceHero.tsx`
- Import `renderPrice` from `@/lib/formatPrice`, `useDomainScope` from hook
- Remove inline `formatPrice` (lines 6-13)
- Add `const scope = useDomainScope()` inside component
- Use `renderPrice(service.price, service.currency || 'USD', scope)`
- If `isPrivate`: show label with `font-heading text-lg` (no `whitespace-nowrap`), hide price anchor lines
- If not `isPrivate`: show price with `whitespace-nowrap`, keep anchor lines

### 7. `src/components/service/FOMOBlock.tsx`
- Import `renderPrice` from `@/lib/formatPrice`, `useDomainScope` from hook
- Remove inline `formatPrice` (lines 6-7)
- Replace `isTR` (from `i18n.language`) with `const scope = useDomainScope()` and `scope === 'tr'`
- Use `renderPrice(service.price, service.currency || 'USD', scope)`
- If `isPrivate`: show label text, maintain container structure
- If not `isPrivate`: show price with `whitespace-nowrap`

### 8. `src/pages/tr/DTVVizePage.tsx`
- Import `formatPrice` from `@/lib/formatPrice`
- Remove inline `formatPrice` (lines 36-37)
- Pass `'tr'` as scope explicitly in all calls

## NOT Modified
- Admin files (internal tools — not customer-facing)
- All TR page components except DTVVizePage formatPrice swap
- Routing, Stripe edge functions, webhooks, RLS
- Dialog/Radix A11y behavior
- No new dependencies

