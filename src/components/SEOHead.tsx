import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getDomainScope } from '@/hooks/useDomainScope';

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  schemaType?: 'Organization' | 'Service' | 'Product';
  serviceName?: string;
  serviceDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const DOMAIN_MAP = {
  tr: 'https://planbasya.com',
  global: 'https://planbasia.com',
} as const;

export default function SEOHead({
  title,
  description,
  canonical,
  schemaType = 'Organization',
  serviceName,
  serviceDescription,
  ogImage,
  noIndex = false,
}: SEOHeadProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const scope = getDomainScope();
  const lang = scope === 'tr' ? 'tr' : 'en';

  const baseUrl = DOMAIN_MAP[scope];
  const currentPath = location.pathname;
  const absoluteUrl = `${baseUrl}${currentPath}`;

  const metaDescription = description || t('hero.subtitle');
  const defaultOgImage = ogImage || `${baseUrl}/images/hero-home.webp`;

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Plan B Asia',
    alternateName: 'Atropox OÜ',
    url: baseUrl,
    logo: `${baseUrl}/images/hero-home.webp`,
    description: 'Sovereign Mobility Architecture for Founders and Global Citizens.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Turkish', 'Hindi'],
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: serviceName || title,
    description: serviceDescription || metaDescription,
    provider: { '@type': 'Organization', name: 'Plan B Asia', url: baseUrl },
    areaServed: { '@type': 'Place', name: 'Southeast Asia' },
    url: absoluteUrl,
  };

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={metaDescription} />

      {/* Canonical — always absolute */}
      <link rel="canonical" href={canonical || absoluteUrl} />

      {/* Hreflang — explicit absolute URLs */}
      <link rel="alternate" hrefLang="tr" href={`https://planbasya.com${currentPath}`} />
      <link rel="alternate" hrefLang="en" href={`https://planbasia.com${currentPath}`} />
      <link rel="alternate" hrefLang="hi" href={`https://planbasia.com${currentPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`https://planbasia.com${currentPath}`} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {noIndex && <meta name="googlebot" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || absoluteUrl} />
      <meta property="og:image" content={defaultOgImage} />
      <meta property="og:locale" content={lang === 'tr' ? 'tr_TR' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={defaultOgImage} />

      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaType === 'Organization' ? orgSchema : serviceSchema)}
      </script>
    </Helmet>
  );
}
