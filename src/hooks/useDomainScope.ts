export type DomainScope = 'tr' | 'global' | 'both';

export function getDomainScope(): DomainScope {
  if (typeof window === 'undefined') return 'global';
  const host = window.location.hostname
    .replace(/^www\./i, '')
    .toLowerCase()
    .replace(/\.$/, '');
  if (host === 'planbasya.com') return 'tr';
  if (host === 'planbasia.com') return 'global';
  return 'global'; // Strict fallback
}

export function useDomainScope(): DomainScope {
  return getDomainScope();
}
