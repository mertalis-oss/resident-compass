import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/pages/ServicePage';

export default function ServiceFallback({ services }: { services: Service[] }) {
  const { t } = useTranslation();

  return (
    <section className="pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container max-w-3xl text-center px-6">
        <h1 className="heading-section text-foreground mb-4">
          {t('service.fallbackTitle', { defaultValue: 'Not available in your region (yet)' })}
        </h1>
        <p className="body-editorial text-muted-foreground mb-12">
          {t('service.fallbackBody', { defaultValue: "We're expanding fast. You can still start with these:" })}
        </p>

        {services.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {services.slice(0, 2).map((s) => (
              <Link
                key={s.id}
                to={`/residency/${s.slug}`}
                className="group block p-6 border border-border rounded-sm hover:border-accent/50 transition-all text-left"
              >
                <h3 className="font-heading text-lg text-foreground group-hover:text-accent transition-colors">
                  {s.title}
                </h3>
                {s.short_description && (
                  <p className="text-sm text-muted-foreground mt-2">{s.short_description}</p>
                )}
                <Button variant="link" className="mt-4 p-0 text-accent text-xs uppercase tracking-wider">
                  {t('service.getStarted', { defaultValue: 'Get Started' })} <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
