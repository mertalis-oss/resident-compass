import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { renderPrice } from '@/lib/formatPrice';
import { useDomainScope } from '@/hooks/useDomainScope';
import type { Service } from '@/pages/ServicePage';

export default function ServiceHero({ service }: { service: Service }) {
  const { t } = useTranslation();
  const scope = useDomainScope();

  const { display: priceDisplay, isPrivate } = renderPrice(
    service.price,
    service.currency || 'USD',
    scope
  );

  const scrollToCheckout = () => {
    document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-corporate-navy text-holistic">
      <div className="container max-w-4xl text-center px-6">
        <p className="caption-editorial text-holistic/50 mb-6">
          {service.category || t('service.programme')}
        </p>
        <h1 className="heading-display text-holistic mb-6">{service.title}</h1>
        {service.short_description && (
          <p className="body-editorial text-holistic/60 max-w-2xl mx-auto mb-6">
            {service.short_description}
          </p>
        )}
        {isPrivate ? (
          <p className="font-heading text-xl md:text-2xl text-holistic mb-3">{priceDisplay}</p>
        ) : (
          <>
            <p className="font-heading text-3xl md:text-4xl text-holistic mb-3">
              <span className="whitespace-nowrap">{priceDisplay}</span>
            </p>
            <p className="text-sm text-holistic/40 mb-2">
              {t('service.priceOneTime')}
            </p>
            <p className="text-xs text-holistic/30 mb-10">
              {t('service.priceAnchor')}
            </p>
          </>
        )}
        {isPrivate && <div className="mb-10" />}
        <Button
          size="lg"
          onClick={scrollToCheckout}
          className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
        >
          {t('service.ctaStart')} <ArrowRight className="ml-3 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
