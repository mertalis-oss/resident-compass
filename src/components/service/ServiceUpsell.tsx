import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getDomainScope } from '@/hooks/useDomainScope';
import AnimatedSection from '@/components/AnimatedSection';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/pages/ServicePage';

export default function ServiceUpsell({ currentService }: { currentService: Service }) {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const scope = getDomainScope();
    const fetch = async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .in('visible_on', [scope, 'both'])
        .neq('id', currentService.id)
        .limit(3);
      if (data) setServices(data as unknown as Service[]);
    };
    fetch();
  }, [currentService.id]);

  if (services.length === 0) return null;

  return (
    <AnimatedSection>
      <section className="section-editorial border-t border-border">
        <div className="container max-w-4xl px-6">
          <p className="caption-editorial text-muted-foreground mb-4">
            {t('service.upsellLabel', { defaultValue: 'Clients who chose this service often also needed:' })}
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {services.map((s) => (
              <Link
                key={s.id}
                to={`/residency/${s.slug}`}
                className="group block p-6 border border-border rounded-sm hover:border-accent/50 transition-all duration-500"
              >
                <h3 className="font-heading text-lg text-foreground group-hover:text-accent transition-colors">
                  {s.title}
                </h3>
                {s.short_description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{s.short_description}</p>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-accent mt-4 uppercase tracking-wider">
                  {t('service.learnMore', { defaultValue: 'Learn More' })} <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
