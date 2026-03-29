import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./lib/i18n";
import "./index.css";
import { initPostHog } from "./lib/posthog";
import { captureUtms } from "./lib/utmStorage";

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
