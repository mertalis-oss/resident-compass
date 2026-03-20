import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/AnimatedSection';

export default function ServiceWhoIsFor() {
  const { t } = useTranslation();

  return (
    <AnimatedSection>
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container max-w-3xl px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="caption-editorial text-accent mb-6">
                {t('service.whoForLabel', { defaultValue: 'Who this is for' })}
              </p>
              <p className="body-editorial text-foreground">
                {t('service.whoForBody', { defaultValue: 'People who want to move forward fast. People who need clarity, not endless research.' })}
              </p>
            </div>
            <div>
              <p className="caption-editorial text-muted-foreground mb-6">
                {t('service.notForLabel', { defaultValue: 'Not for' })}
              </p>
              <p className="body-editorial text-muted-foreground">
                {t('service.notForBody', { defaultValue: 'People looking for free general advice. People not ready to take action.' })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
