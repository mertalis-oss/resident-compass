// src/lib/metaPixel.ts
// Meta (Facebook/Instagram) Pixel — consent-gated client-side tracking.
// Pixel ID: 1110709748785007 (Plan B Asia)
// Conversions API (server-side) handled separately via Supabase edge function.

import { hasConsent, onConsentChanged } from "@/lib/consent";

const PIXEL_ID = "1110709748785007";
let pixelLoaded = false;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function loadPixel(): void {
  if (pixelLoaded || typeof window === "undefined" || typeof document === "undefined") return;
  if (window.fbq) {
    pixelLoaded = true;
    return;
  }
  pixelLoaded = true;

  // Standard Meta Pixel base code (mirrored from Meta documentation)
  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any) {
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e);
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq!("init", PIXEL_ID);
  window.fbq!("track", "PageView");
}

export function initMetaPixelWithConsent(): void {
  if (hasConsent("marketing")) loadPixel();
  onConsentChanged(() => {
    if (hasConsent("marketing") && !pixelLoaded) loadPixel();
  });
}

export function trackPixelEvent(
  event: string,
  params?: Record<string, string | number | boolean>
): void {
  try {
    if (typeof window !== "undefined" && window.fbq && hasConsent("marketing")) {
      window.fbq("track", event, params);
    }
  } catch {
    /* silent */
  }
}
