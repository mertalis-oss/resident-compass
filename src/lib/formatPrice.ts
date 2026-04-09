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
