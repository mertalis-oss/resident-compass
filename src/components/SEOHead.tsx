import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const scope = getDomainScope();
  const lang = scope === 'tr' ? 'tr' : 'en';

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
    sameAs: [],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: serviceName || title,
    description: serviceDescription || metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'Plan B Asia',
      url: baseUrl,
    },
    areaServed: {
      '@type': 'Place',
      name: 'Southeast Asia',
    },
    url: currentUrl,
  };

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonical || currentUrl} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {noIndex && <meta name="googlebot" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || currentUrl} />
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
