export type DomainScope = 'tr' | 'en';

export function getDomainScope(): DomainScope {
  if (typeof window === 'undefined') return 'en';
  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname;

  // Production domain match
  const isTRDomain = host === 'planbasya.com' || host.endsWith('.planbasya.com');
  // Preview/localhost: treat /tr paths as TR scope
  const isPreviewTR = (host.includes('lovable') || host === 'localhost') && path.startsWith('/tr');

  return (isTRDomain || isPreviewTR) ? 'tr' : 'en';
}

export function useDomainScope(): DomainScope {
  return getDomainScope();
}
