import { captureCTAClick } from './tracking';
import { WHATSAPP_NUMBER } from './constants';

export const buildWaUrl = (
  source: 'VIP_MODAL' | 'VIP_FOOTER',
  score?: number,
  site?: string,
): string | null => {
  const safeNumber = String(WHATSAPP_NUMBER).replace(/\D/g, '');
  if (!safeNumber) return null;

  const metaParts = [
    source,
    score ? `Score: ${score}` : null,
    site ? `Site: ${site}` : null,
  ].filter(Boolean);
  const meta = metaParts.length ? ` (${metaParts.join(' | ')})` : '';

  return `https://wa.me/${safeNumber}?text=${encodeURIComponent(
    'Plan B Asia — Qualified case inquiry' + meta,
  )}`;
};

export const handleVipWhatsAppClick = (
  e: { preventDefault: () => void },
  source: 'VIP_MODAL' | 'VIP_FOOTER',
  clickLock: { current: boolean },
  score?: number,
  site?: string,
) => {
  e.preventDefault();
  if (typeof window === 'undefined') return;
  if (clickLock.current) return;
  clickLock.current = true;

  const url = buildWaUrl(source, score, site);
  if (!url) {
    if (import.meta.env.DEV) console.error('[WA ERROR] Invalid number');
    clickLock.current = false;
    return;
  }

  try {
    const eventType = source === 'VIP_MODAL' ? 'vip_whatsapp_modal' : 'vip_whatsapp_footer';
    captureCTAClick({ type: eventType, site });
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[Tracking Failed, Proceeding]', err);
  }

  const newTab = window.open('about:blank', '_blank', 'noopener,noreferrer');
  let navigated = false;

  setTimeout(() => {
    if (newTab && !newTab.closed) {
      try {
        newTab.location.href = url;
        navigated = true;
      } catch {
        /* block fallback */
      }
    }
    if (!navigated) window.location.href = url;
  }, 50);

  setTimeout(() => {
    clickLock.current = false;
  }, 1000);

  if (typeof document !== 'undefined') {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') clickLock.current = false;
    };
    document.addEventListener('visibilitychange', onVisibility, { once: true });
  }
};
