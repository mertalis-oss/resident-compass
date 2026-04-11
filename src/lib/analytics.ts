declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | null | undefined>,
) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params,
      timestamp: new Date().toISOString(),
      domain_scope: window.location.hostname.includes('planbasya') ? 'tr' : 'en',
    });
  }
}
