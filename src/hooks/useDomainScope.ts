export type DomainScope = 'tr' | 'global';

export function getDomainScope(): DomainScope {
  if (typeof window === 'undefined') return 'global';
  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname;

  // Production domain match
  const isTRDomain = host === 'planbasya.com' || host.endsWith('.planbasya.com');
  // Preview/localhost: treat /tr paths as TR scope
  const isPreviewTR = (host.includes('lovable') || host === 'localhost') && path.startsWith('/tr');

  return (isTRDomain || isPreviewTR) ? 'tr' : 'global';
}

export function useDomainScope(): DomainScope {
  return getDomainScope();
}
