import { trackEvent } from './analytics';
import { getSessionId, getStoredUtms } from './utmStorage';

export const captureCTAClick = ({ type, site }: { type: string; site?: string }) => {
  const utms = getStoredUtms();
  trackEvent('cta_click', {
    type,
    site,
    session_id: getSessionId(),
    utm_source: utms.utm_source,
    utm_medium: utms.utm_medium,
    utm_campaign: utms.utm_campaign,
  });
};
