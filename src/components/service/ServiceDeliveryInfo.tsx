import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/AnimatedSection';
import type { Service } from '@/pages/ServicePage';

export default function ServiceDeliveryInfo({ service }: { service: Service }) {
  const { t } = useTranslation();

  if (!service.delivery_time_days && !service.location) return null;

  return (
    <AnimatedSection>
      <section className="py-16 bg-secondary">
        <div className="container max-w-3xl px-6">
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-6">
            {service.delivery_time_days && (
              <div className="text-center">
                <p className="font-heading text-3xl text-foreground">{service.delivery_time_days}</p>
                <p className="caption-editorial text-muted-foreground mt-1">
                  {t('service.deliveryDays', { defaultValue: 'Delivery Days' })}
                </p>
              </div>
            )}
            {service.location && (
              <div className="text-center">
                <p className="font-heading text-3xl text-foreground">{service.location}</p>
                <p className="caption-editorial text-muted-foreground mt-1">
                  {t('service.location', { defaultValue: 'Location' })}
                </p>
              </div>
            )}
            {service.capacity && (
              <div className="text-center">
                <p className="font-heading text-3xl text-foreground">{service.capacity}</p>
                <p className="caption-editorial text-muted-foreground mt-1">
                  {t('service.capacity', { defaultValue: 'Capacity' })}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
