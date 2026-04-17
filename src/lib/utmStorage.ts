const UTM_KEY = 'utms';
const SID_KEY = 'sid';
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface StoredUtms {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  timestamp: number;
}

const isValid = (v?: string | null): v is string => !!v && v.trim().length > 0;

export function getStoredUtms(): Partial<StoredUtms> {
  try {
    const data = localStorage.getItem(UTM_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function generateSid(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch { /* fallthrough */ }
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function getSessionId(): string {
  try {
    if (typeof sessionStorage === 'undefined') return generateSid();
    const existing = sessionStorage.getItem(SID_KEY);
    if (existing) return existing;
    const sid = generateSid();
    sessionStorage.setItem(SID_KEY, sid);
    return sid;
  } catch {
    return generateSid();
  }
}

export function captureUtms(): void {
  try {
    // Ensure session id exists on boot
    try {
      if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(SID_KEY)) {
        sessionStorage.setItem(SID_KEY, generateSid());
      }
    } catch { /* ignore */ }

    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get('utm_source');
    const utm_medium = params.get('utm_medium');
    const utm_campaign = params.get('utm_campaign');

    const hasNew = isValid(utm_source) || isValid(utm_medium) || isValid(utm_campaign);
    if (!hasNew) return;

    const existing = getStoredUtms();
    const isExpired = !existing.timestamp || Date.now() - existing.timestamp > EXPIRY_MS;
    const isEmpty = !existing.utm_source && !existing.utm_medium && !existing.utm_campaign;

    if (isExpired || isEmpty) {
      const payload: StoredUtms = {
        timestamp: Date.now(),
        ...(isValid(utm_source) && { utm_source }),
        ...(isValid(utm_medium) && { utm_medium }),
        ...(isValid(utm_campaign) && { utm_campaign }),
      };
      localStorage.setItem(UTM_KEY, JSON.stringify(payload));
    }
  } catch {
    // Silently fail — localStorage might be unavailable
  }
}
