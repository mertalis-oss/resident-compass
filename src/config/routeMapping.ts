/**
 * Cross-Domain Route Mapping — Single Source of Truth
 *
 * Reconciliation: This map is manually reconciled against `<Route path>`
 * entries in `src/App.tsx`. Do not add a key here unless the path is an
 * active route. Use explicit `null` for routes that have no equivalent on
 * the other domain — the redirect/SEO layers will never infer a path.
 *
 * Consumers: CrossDomainRedirect, SEOHead, sitemap split (manual).
 */

export const EN_TO_TR: Record<string, string | null> = {
  '/': '/',
  '/visas/thailand-dtv': '/vizeler/dtv-vize',
  '/visas/soft-power': '/vizeler/soft-power',
  '/relocation/nomad-incubator': '/yerlesim/nomad-incubator',
  '/experiences/expeditions': '/deneyimler/expeditions',
  '/experiences/wellness': null, // EN-only
  '/corporate/mice': '/deneyimler/mice',
  '/destinations/vietnam': '/tr/vietnam',
  '/destinations/cambodia': '/tr/cambodia',
  '/privacy-policy': null,
  '/terms-of-service': null,
  '/refund-policy': null,
};

export const TR_TO_EN: Record<string, string | null> = {
  '/': '/',
  '/tr': '/',
  '/vizeler/dtv-vize': '/visas/thailand-dtv',
  '/vizeler/soft-power': '/visas/soft-power',
  '/yerlesim/nomad-incubator': '/relocation/nomad-incubator',
  '/deneyimler/expeditions': '/experiences/expeditions',
  '/deneyimler/mice': '/corporate/mice',
  '/tr/vietnam': '/destinations/vietnam',
  '/tr/cambodia': '/destinations/cambodia',
  '/tr/rabbit-hole': null, // stealth, noindex
};

/** Path prefixes whose canonical ownership is the EN/global domain (planbasia.com). */
export const EN_OWNED_PREFIXES = [
  '/visas',
  '/relocation',
  '/experiences',
  '/destinations',
  '/corporate',
  '/checkout',
  '/tools',
  '/success',
  '/dashboard',
  '/login',
  '/admin',
  '/wellness',
  '/expeditions',
  '/corporate-retreats',
  '/residency',
  '/privacy-policy',
  '/terms-of-service',
  '/refund-policy',
];

/** Path prefixes whose canonical ownership is the TR domain (planbasya.com). */
export const TR_OWNED_PREFIXES = ['/tr', '/vizeler', '/yerlesim', '/deneyimler'];

/** Routes that must never appear in sitemaps or hreflang tags. */
export const NOINDEX_PATHS = new Set<string>([
  '/admin',
  '/login',
  '/dashboard',
  '/success',
  '/checkout',
  '/tools',
  '/tr/rabbit-hole',
]);

function startsWithPrefix(path: string, prefixes: readonly string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(p + '/'));
}

export function isNoIndex(path: string): boolean {
  if (NOINDEX_PATHS.has(path)) return true;
  for (const p of NOINDEX_PATHS) {
    if (path === p || path.startsWith(p + '/')) return true;
  }
  return false;
}

export function isMappedRoute(path: string): boolean {
  return (
    Object.prototype.hasOwnProperty.call(EN_TO_TR, path) ||
    Object.prototype.hasOwnProperty.call(TR_TO_EN, path)
  );
}

export function isEnOwned(path: string): boolean {
  if (path === '/') return false; // home is dual
  return startsWithPrefix(path, EN_OWNED_PREFIXES);
}

export function isTrOwned(path: string): boolean {
  if (path === '/') return false; // home is dual
  return startsWithPrefix(path, TR_OWNED_PREFIXES);
}
