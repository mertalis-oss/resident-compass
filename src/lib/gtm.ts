// src/lib/gtm.ts
// Google Tag Manager — consent-gated dynamic loader.
// GTM container loads ONLY if user has granted "analytics" consent.

import { hasConsent, onConsentChanged } from "@/lib/consent";

const GTM_ID = "GTM-MTGTMBGR";
let gtmLoaded = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function loadGTM(): void {
  if (gtmLoaded || typeof window === "undefined" || typeof document === "undefined") return;
  gtmLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const firstScript = document.getElementsByTagName("script")[0];
  const gtmScript = document.createElement("script");
  gtmScript.async = true;
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(gtmScript, firstScript);
  } else {
    document.head.appendChild(gtmScript);
  }
}

export function initGTMWithConsent(): void {
  if (hasConsent("analytics")) loadGTM();
  onConsentChanged(() => {
    if (hasConsent("analytics") && !gtmLoaded) loadGTM();
  });
}
