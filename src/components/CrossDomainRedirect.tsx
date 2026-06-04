import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  isMappedRoute,
  isEnOwned,
  isTrOwned,
} from '@/config/routeMapping';

const EN_HOST = 'planbasia.com';
const TR_HOST = 'planbasya.com';

const BYPASS_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

function shouldBypass(hostname: string): boolean {
  if (BYPASS_HOSTS.has(hostname)) return true;
  if (hostname.endsWith('.lovable.app')) return true;
  return false;
}

/**
 * Cross-Domain Redirect Layer.
 *
 * Hard redirects (window.location.replace) requests that land on the wrong
 * domain for the current path, but ONLY when:
 *   1. The host is a real production domain (preview/local bypassed).
 *   2. The target host strictly differs from the current host (loop guard).
 *   3. The path matches the OTHER domain's owned prefixes.
 *   4. The path resolves to a known, registered route via routeMapping.
 *
 * Unknown/unmapped paths stay on the current domain and fall through to the
 * local NotFound layout. This prevents broken redirects and SEO leakage.
 */
export default function CrossDomainRedirect() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hostname = window.location.hostname.toLowerCase();
    if (shouldBypass(hostname)) return;

    const path = location.pathname || '/';

    let target: string | null = null;
    if (hostname === EN_HOST || hostname === 'www.' + EN_HOST) {
      // On EN domain but path belongs to TR
      if (isTrOwned(path) && isMappedRoute(path)) target = TR_HOST;
    } else if (hostname === TR_HOST || hostname === 'www.' + TR_HOST) {
      // On TR domain but path belongs to EN
      if (isEnOwned(path) && isMappedRoute(path)) target = EN_HOST;
    }

    if (!target) return;
    if (target === hostname) return; // loop guard

    const url = 'https://' + target + path + window.location.search + window.location.hash;
    window.location.replace(url);
  }, [location.pathname, location.search, location.hash]);

  return null;
}
