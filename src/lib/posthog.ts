// src/lib/posthog.ts
// Consent-gated PostHog init (GDPR/KVKK uyumu)
// opt_out_capturing_by_default: true → kullanıcı izin verene kadar event kaydı YOK
// persistence: 'memory' → localStorage/cookie YAZMAZ (consent-free baseline)
// IP + posta kodu property_blacklist → coğrafi konum sadece ülke seviyesi anonim

import posthog from "posthog-js";
import { hasConsent, onConsentChanged } from "@/lib/consent";

let posthogInited = false;

export function initPostHog(): void {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key || import.meta.env.MODE !== "production") return;
  if (posthogInited) return;

  posthog.init(key, {
    api_host: "https://app.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    // GDPR/ePrivacy — kullanıcı izin verene kadar capture yapma
    opt_out_capturing_by_default: true,
    persistence: "memory",
    disable_session_recording: true,
    autocapture: false,
    // IP + posta kodu blacklist — coğrafi konum ülke seviyesi anonim
    property_blacklist: ["$ip", "$geoip_postal_code"],
    ip: false,
  });
  posthogInited = true;

  // Anlık consent kontrolü — daha önce kabul edilmişse capture aç
  if (hasConsent("analytics")) {
    posthog.opt_in_capturing();
  }

  // Consent değişimini dinle (banner ile değişebilir)
  onConsentChanged(() => {
    if (hasConsent("analytics")) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  });
}

export function trackPostHogEvent(
  event: string,
  properties?: Record<string, string | number | boolean>,
  critical = false
): void {
  try {
    if (
      import.meta.env.MODE === "production" &&
      (posthog as unknown as { __loaded?: boolean }).__loaded &&
      hasConsent("analytics")
    ) {
      const transport = typeof navigator !== "undefined" && navigator.sendBeacon ? "sendBeacon" : "xhr";
      posthog.capture(event, { ...properties, $set_once: { first_event: event } } as never, { transport } as never);

      // Critical event'ler için 300ms sonra retry — analytics drop riskini azalt
      if (critical) {
        setTimeout(() => {
          try {
            posthog.capture(event, { ...properties, retry: true } as never, { transport } as never);
          } catch {
            /* silent */
          }
        }, 300);
      }
    }
  } catch {
    if (critical) {
      console.warn("analytics failed for critical event:", event);
    }
  }
}
