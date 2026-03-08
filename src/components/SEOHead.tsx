import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  schemaType?: 'Organization' | 'Service' | 'Product';
  serviceName?: string;
  serviceDescription?: string;
}

export default function SEOHead({ title, description, canonical, schemaType = 'Organization', serviceName, serviceDescription }: SEOHeadProps) {
  const baseUrl = window.location.origin;

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Plan B Asia',
    alternateName: 'Atropox OÜ',
    url: baseUrl,
    logo: `${baseUrl}/images/hero-home.webp`,
    description: 'Sovereign Mobility Architecture for Founders and Global Citizens.',
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: ['English', 'Turkish', 'Hindi'] },
    sameAs: [],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: serviceName || title,
    description: serviceDescription || description,
    provider: { '@type': 'Organization', name: 'Plan B Asia' },
    areaServed: { '@type': 'Place', name: 'Southeast Asia' },
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script type="application/ld+json">
        {JSON.stringify(schemaType === 'Organization' ? orgSchema : serviceSchema)}
      </script>
    </Helmet>
  );
}
