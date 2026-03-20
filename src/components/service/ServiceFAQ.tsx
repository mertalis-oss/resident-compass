import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/AnimatedSection';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import type { Service } from '@/pages/ServicePage';

export default function ServiceFAQ({ service }: { service: Service }) {
  const { t } = useTranslation();

  if (!service.faq || !Array.isArray(service.faq) || service.faq.length === 0) return null;

  return (
    <AnimatedSection>
      <section className="section-editorial border-t border-border">
        <div className="container max-w-3xl px-6">
          <p className="caption-editorial text-muted-foreground mb-12">
            {t('service.faqLabel', { defaultValue: 'Frequently Asked Questions' })}
          </p>
          <Accordion type="single" collapsible className="w-full">
            {(service.faq as { question: string; answer: string }[]).map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="font-heading text-lg text-foreground text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-8 text-sm text-muted-foreground italic">
            {t('service.faqPush', { defaultValue: "Still unsure? Start your process and we'll guide you step by step." })}
          </p>
        </div>
      </section>
    </AnimatedSection>
  );
}
