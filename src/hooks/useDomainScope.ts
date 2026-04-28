export type DomainScope = "tr" | "en";

export function getDomainScope(): DomainScope {
  if (typeof window === "undefined") return "en";
  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname;

  // Production domain match
  const isTRDomain = host === "planbasya.com" || host.endsWith(".planbasya.com");
  // Preview/localhost: treat /tr paths as TR scope
  const isPreviewTR = (host.includes("lovable") || host === "localhost") && path.startsWith("/tr");

  return isTRDomain || isPreviewTR ? "tr" : "en";
}
const TR_ROUTE_PREFIXES = ["/tr", "/vizeler", "/yerlesim", "/deneyimler"];

export function getDomainScope(): "tr" | "en" {
  if (typeof window === "undefined") return "en";
  const path = window.location.pathname;
  return TR_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix)) ? "tr" : "en";
}

export function useDomainScope(): DomainScope {
  return getDomainScope();
}
