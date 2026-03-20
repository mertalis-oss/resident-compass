import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/pages/ServicePage';

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function ServiceHero({ service }: { service: Service }) {
  const { t } = useTranslation();

  const scrollToCheckout = () => {
    document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-corporate-navy text-holistic">
      <div className="container max-w-4xl text-center px-6">
        <p className="caption-editorial text-holistic/50 mb-6">
          {service.category || t('service.programme', { defaultValue: 'Sovereign Programme' })}
        </p>
        <h1 className="heading-display text-holistic mb-6">{service.title}</h1>
        {service.short_description && (
          <p className="body-editorial text-holistic/60 max-w-2xl mx-auto mb-6">
            {service.short_description}
          </p>
        )}
        <p className="font-heading text-3xl md:text-4xl text-holistic mb-3">
          {formatPrice(service.price, service.currency || 'USD')}
        </p>
        <p className="text-sm text-holistic/40 mb-2">
          {t('service.priceOneTime', { defaultValue: 'One-time payment. No recurring fees. No hidden costs later. No wasted time.' })}
        </p>
        <p className="text-xs text-holistic/30 mb-10">
          {t('service.priceAnchor', { defaultValue: 'Typical cost of mistakes in this process: $500–$5,000+' })}
        </p>
        <Button
          size="lg"
          onClick={scrollToCheckout}
          className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
        >
          {t('service.ctaStart', { defaultValue: 'Start Your Process' })} <ArrowRight className="ml-3 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
