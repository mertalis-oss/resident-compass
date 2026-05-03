import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import i18n from "./lib/i18n";
import "./index.css";
import { initPostHog } from "./lib/posthog";
import { captureUtms } from "./lib/utmStorage";
import { getDomainScope } from "./hooks/useDomainScope";

// ── SYNCHRONOUS SCOPE RESOLUTION (before any render) ──
const scope = getDomainScope();
if (scope === 'tr') {
  document.documentElement.lang = 'tr';
  if (i18n.language !== 'tr') i18n.changeLanguage('tr');
} else {
  document.documentElement.lang = 'en';
  if (i18n.language === 'tr') i18n.changeLanguage('en');
}

// Idle scheduler — Safari-compatible fallback
const runIdle = (cb: () => void) => {
  if (typeof window === 'undefined') return;
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
  if (typeof ric === 'function') ric(cb);
  else setTimeout(cb, 50);
};

// Defer non-critical analytics off the hydration path
runIdle(() => initPostHog());
runIdle(() => captureUtms());

// Global error catch — NEVER show blank screen
if (typeof window !== 'undefined') {
  window.onerror = () => {
    if (document.body && !document.body.innerHTML.trim()) {
      window.location.href = '/';
    }
  };
  window.onunhandledrejection = () => {
    // Silently catch unhandled promises — do not crash
  };
}

createRoot(document.getElementById("root")!).render(<App />);
