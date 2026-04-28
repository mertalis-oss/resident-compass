// src/hooks/useDomainScope.ts

export type DomainScope = "tr" | "en";

// BLOK-01 & Mevcut Mantık Konsolidasyonu
const TR_ROUTE_PREFIXES = ["/tr", "/vizeler", "/yerlesim", "/deneyimler"];

export function getDomainScope(): DomainScope {
  if (typeof window === "undefined") return "en";

  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname;

  // 1. Üretim ortamı domain kontrolü
  const isTRDomain = host === "planbasya.com" || host.endsWith(".planbasya.com");

  // 2. Preview/Localhost veya TR domaininde yeni rotaların kontrolü
  // Artık sadece /tr değil, listedeki tüm prefix'leri kontrol ediyoruz.
  const hasTRPath = TR_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix));

  // Eğer domain ana domainse VEYA path TR rotalarından biriyse 'tr' dön.
  return isTRDomain || hasTRPath ? "tr" : "en";
}

export function useDomainScope(): DomainScope {
  return getDomainScope();
}
