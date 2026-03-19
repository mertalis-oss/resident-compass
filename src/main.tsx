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

createRoot(document.getElementById("root")!).render(<App />);
