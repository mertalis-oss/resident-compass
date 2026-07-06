// src/lib/tiktokPixel.ts
// TikTok Pixel — consent-gated client-side tracking.
// Pixel ID: D91M5IJC77U2B9GAH8N0 (Plan B Asia, client-side mode)
// Server-side hybrid via TikTok Events API planned for Sprint 4.

import { hasConsent, onConsentChanged } from "@/lib/consent";

const PIXEL_ID = "D91M5IJC77U2B9GAH8N0";
let pixelLoaded = false;

declare global {
  interface Window {
    ttq?: TikTokQueue;
    TiktokAnalyticsObject?: string;
  }
}

interface TikTokQueue {
  load: (id: string) => void;
  page: () => void;
  track: (event: string, params?: Record<string, unknown>) => void;
  identify: (params: Record<string, unknown>) => void;
  instances: (id: string) => TikTokQueue;
  _i?: Record<string, unknown>;
  _u?: string;
  _t?: number;
  _o?: Record<string, unknown>;
  methods?: string[];
  setAndDefer?: (target: unknown, method: string) => void;
  push?: (...args: unknown[]) => void;
}

function loadPixel(): void {
  if (pixelLoaded || typeof window === "undefined" || typeof document === "undefined") return;
  if (window.ttq) {
    pixelLoaded = true;
    return;
  }
  pixelLoaded = true;

  // Standard TikTok Pixel base code (mirrored from TikTok Pixel documentation)
  /* eslint-disable */
  (function (w: any, d: any, t: string) {
    w.TiktokAnalyticsObject = t;
    const ttq: any = (w[t] = w[t] || []);
    ttq.methods = [
      "page", "track", "identify", "instances", "debug", "on", "off", "once",
      "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent",
      "revokeConsent", "grantConsent",
    ];
    ttq.setAndDefer = function (target: any, method: string) {
      target[method] = function (...args: unknown[]) {
        target.push(([method] as unknown[]).concat(args));
      };
    };
    for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function (id: string) {
      const instance = ttq._i[id] || [];
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(instance, ttq.methods[i]);
      return instance;
    };
    ttq.load = function (e: string, n?: Record<string, unknown>) {
      const i = "https://analytics.tiktok.com/i18n/pixel/events.js";
      const o = n && n.partner;
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = i;
      ttq._t = ttq._t || +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = i + "?sdkid=" + e + "&lib=" + t;
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode!.insertBefore(script, firstScript);
    };
  })(window, document, "ttq");
  /* eslint-enable */

  window.ttq!.load(PIXEL_ID);
  window.ttq!.page();
}

export function initTikTokPixelWithConsent(): void {
  if (hasConsent("marketing")) loadPixel();
  onConsentChanged(() => {
    if (hasConsent("marketing") && !pixelLoaded) loadPixel();
  });
}

export function trackTikTokEvent(
  event: string,
  params?: Record<string, string | number | boolean>
): void {
  try {
    if (typeof window !== "undefined" && window.ttq && hasConsent("marketing")) {
      window.ttq.track(event, params);
    }
  } catch {
    /* silent */
  }
}
