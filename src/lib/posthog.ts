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

export function trackPostHogEvent(event: string, properties?: Record<string, string | number | boolean>): void {
  try {
    if (import.meta.env.MODE === 'production' && posthog.__loaded) {
      posthog.capture(event, properties);
    }
  } catch {
    // Silent fail
  }
}
