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

// PostHog — production only
initPostHog();

// Capture UTM parameters
captureUtms();

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
