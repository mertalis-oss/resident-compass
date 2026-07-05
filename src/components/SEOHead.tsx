import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { getDomainScope } from "@/hooks/useDomainScope";
import { EN_TO_TR, TR_TO_EN, isNoIndex } from "@/config/routeMapping";

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  schemaType?: "Organization" | "Service" | "Product";
  serviceName?: string;
  serviceDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
  faq?: Array<{ question: string; answer: string }>;
}

const DOMAIN_MAP: Record<"tr" | "en", string> = {
  tr: "https://planbasya.com",
  en: "https://planbasia.com",
};

const EN_BASE = "https://planbasia.com";
const TR_BASE = "https://planbasya.com";

export default function SEOHead({
  title,
  description,
  canonical,
  schemaType = "Organization",
  serviceName,
  serviceDescription,
  ogImage,
  noIndex = false,
  faq,
}: SEOHeadProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const scope = getDomainScope();
  const lang = scope === "tr" ? "tr" : "en";

  const baseUrl = DOMAIN_MAP[scope];
  const currentPath = location.pathname || "/";
  const cleanPath = currentPath.split(/[?#]/)[0] || "/";
  const absoluteUrl =
    `${baseUrl}${cleanPath}`.toLowerCase().replace(/\/$/, "") || baseUrl;

  const metaDescription = description || t("hero.subtitle");
  const defaultOgImage = ogImage || `${baseUrl}/images/hero-home.webp`;

  // ── Phase 1.4 — Double-Indexability Hreflang Guard ──────────────────────
  // Only emit hreflang for routes whose BOTH sides are mapped + indexable.
  // Anything noindex (route-level or page prop) suppresses ALL hreflang.
  const pageIsNoIndex = noIndex || isNoIndex(cleanPath);

  const enPath: string | null | undefined =
    scope === "en" ? cleanPath : TR_TO_EN[cleanPath];
  const trPath: string | null | undefined =
    scope === "tr" ? cleanPath : EN_TO_TR[cleanPath];

  const enValid = !pageIsNoIndex && typeof enPath === "string" && !isNoIndex(enPath);
  const trValid = !pageIsNoIndex && typeof trPath === "string" && !isNoIndex(trPath);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Plan B Asia",
    alternateName: "Atropox OÜ",
    url: baseUrl,
    logo: `${baseUrl}/images/hero-home.webp`,
    description: "Sovereign Mobility Architecture for Founders and Global Citizens.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Turkish", "Hindi"],
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: serviceName || title,
    description: serviceDescription || metaDescription,
    provider: { "@type": "Organization", name: "Plan B Asia", url: baseUrl },
    areaServed: { "@type": "Place", name: "Southeast Asia" },
    url: absoluteUrl,
  };

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={metaDescription} />

      {/* Meta Domain Verification — Phase 3 */}
      <meta name="facebook-domain-verification" content="czst3u3pxeva2if5eefjzhvq0q825n" />

      {/* Self-canonical — never cross-domain */}
      <link rel="canonical" href={canonical || absoluteUrl} />

      {/* Hreflang — emitted ONLY for verified, indexable, mapped pairs. */}
      {!pageIsNoIndex && enValid && (
        <link rel="alternate" hrefLang="en" href={`${EN_BASE}${enPath}`} />
      )}
      {!pageIsNoIndex && enValid && (
        <link rel="alternate" hrefLang="hi" href={`${EN_BASE}${enPath}`} />
      )}
      {!pageIsNoIndex && trValid && (
        <link rel="alternate" hrefLang="tr" href={`${TR_BASE}${trPath}`} />
      )}
      {!pageIsNoIndex && <link rel="alternate" hrefLang="x-default" href={`${EN_BASE}/`} />}

      {pageIsNoIndex && <meta name="robots" content="noindex, nofollow" />}
      {pageIsNoIndex && <meta name="googlebot" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || absoluteUrl} />
      <meta property="og:image" content={defaultOgImage} />
      <meta property="og:locale" content={lang === "tr" ? "tr_TR" : "en_US"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={defaultOgImage} />

      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaType === "Organization" ? orgSchema : serviceSchema)}
      </script>
      {faq && faq.length > 0 && !pageIsNoIndex && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: {
                "@type": "Answer",
                text: answer,
              },
            })),
          })}
        </script>
      )}
    </Helmet>
  );
}
