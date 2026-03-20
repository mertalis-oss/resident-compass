import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import type { Service } from '@/pages/ServicePage';

export default function ServiceFeatures({ service }: { service: Service }) {
  const { t } = useTranslation();

  if (!service.features || !Array.isArray(service.features) || service.features.length === 0) return null;

  return (
    <AnimatedSection>
      <section className="section-editorial border-t border-border">
        <div className="container max-w-3xl px-6">
          <p className="caption-editorial text-muted-foreground mb-4">
            {t('service.whatYouGet', { defaultValue: "What you'll get:" })}
          </p>
          <p className="body-editorial text-muted-foreground mb-12">
            {t('service.featuresContext', { defaultValue: 'Designed to give you clarity, speed, and a clear path forward. Based on real cases and proven processes.' })}
          </p>
          <div className="space-y-6">
            {(service.features as { title: string; description: string }[]).map((f, i) => (
              <div key={i} className="flex gap-4 border-b border-border pb-6">
                <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0 stroke-[1.5]" />
                <div>
                  <h3 className="font-heading text-lg text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
