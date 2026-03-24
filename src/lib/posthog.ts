import posthog from 'posthog-js';

export function initPostHog(): void {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (key && import.meta.env.MODE === 'production') {
    posthog.init(key, {
      api_host: 'https://app.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
    });
  }
}

export function trackPostHogEvent(
  event: string,
  properties?: Record<string, string | number | boolean>,
  critical = false
): void {
  try {
    if (import.meta.env.MODE === 'production' && posthog.__loaded) {
      const transport = typeof navigator !== 'undefined' && navigator.sendBeacon ? 'sendBeacon' : 'xhr';
      posthog.capture(event, { ...properties, $set_once: { first_event: event } } as any, { transport } as any);

      // Analytics retry for critical events — fire again after 300ms with retry flag
      if (critical) {
        setTimeout(() => {
          try {
            posthog.capture(event, { ...properties, retry: true } as any, { transport } as any);
          } catch {}
        }, 300);
      }
    }
  } catch {
    if (critical) {
      console.warn('analytics failed for critical event:', event);
    }
  }
}
