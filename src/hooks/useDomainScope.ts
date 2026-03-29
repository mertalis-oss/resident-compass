export type DomainScope = 'tr' | 'global';

export function getDomainScope(): DomainScope {
  if (typeof window === 'undefined') return 'global';
  const host = window.location.hostname.toLowerCase();
  if (host === 'planbasya.com' || host.endsWith('.planbasya.com')) return 'tr';
  return 'global';
}

export function useDomainScope(): DomainScope {
  return getDomainScope();
}
