// src/lib/consent.ts
// GDPR/ePrivacy cookie consent state — Plan v7 S1.2
// CookieConsent bileşeni bu helper'ları kullanır; PostHog ve GTM init buradan consent kontrol eder.

export type ConsentCategory = "essential" | "analytics" | "marketing";

const STORAGE_KEY = "plana_consent_v1";
const CONSENT_VERSION = "1.0.0";

export interface ConsentState {
  version: string;
  timestamp: number;
  categories: Record<ConsentCategory, boolean>;
}

/** Mevcut consent state'i oku. Yoksa null döner — banner gösterilmeli. */
export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null; // version değiştiyse yeniden sor
    return parsed;
  } catch {
    return null;
  }
}

/** Belirli kategori için kullanıcı izin verdi mi? Essential her zaman true. */
export function hasConsent(category: ConsentCategory): boolean {
  if (category === "essential") return true;
  const state = getConsent();
  return state?.categories[category] === true;
}

/** Yeni consent kaydet ve global event dispatch et (PostHog/GTM yeniden değerlendirsin). */
export function setConsent(categories: Record<ConsentCategory, boolean>): void {
  if (typeof window === "undefined") return;
  const state: ConsentState = {
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    categories: { ...categories, essential: true }, // essential her zaman zorla true
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("plana:consent-changed", { detail: state }));
  } catch (err) {
    console.warn("consent: localStorage write failed", err);
  }
}

/** Consent'i tamamen sıfırla (banner tekrar gösterilir). Footer "Çerez Ayarları" linki için. */
export function resetConsent(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("plana:consent-changed", { detail: null }));
  } catch (err) {
    console.warn("consent: localStorage clear failed", err);
  }
}

/** Consent değişikliğini dinle. Bileşenlerden cleanup return etmek için. */
export function onConsentChanged(callback: (state: ConsentState | null) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail as ConsentState | null;
    callback(detail);
  };
  window.addEventListener("plana:consent-changed", handler);
  return () => window.removeEventListener("plana:consent-changed", handler);
}
