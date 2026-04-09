import { useTranslation } from 'react-i18next';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import AnimatedSection from '@/components/AnimatedSection';
import { getDomainScope } from '@/hooks/useDomainScope';

export default function Testimonials() {
  const { t } = useTranslation();
  const scope = getDomainScope();

  // Hide testimonials on TR domain until real reviews are added
  if (scope !== 'tr') return null;

  const items = t('testimonials.items', { returnObjects: true }) as { quote: string; author: string; role: string }[];

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <AnimatedSection>
      <section className="section-editorial border-t border-border">
        <div className="container max-w-4xl px-6">
          <p className="caption-editorial text-muted-foreground mb-16 text-center">
            {t('testimonials.title')}
          </p>
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent>
              {items.map((item, i) => (
                <CarouselItem key={i} className="md:basis-1/2 pl-6">
                  <div className="h-full p-8 md:p-10 border border-border rounded-sm bg-card/50 flex flex-col justify-between">
                    <p className="font-heading text-lg md:text-xl font-normal leading-relaxed text-foreground italic mb-8">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="border-t border-border pt-6">
                      <p className="font-heading text-base text-accent">{item.author}</p>
                      <p className="text-xs text-muted-foreground mt-1 tracking-[0.2em] uppercase">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-10">
              <CarouselPrevious className="static translate-y-0 border-border hover:bg-muted" />
              <CarouselNext className="static translate-y-0 border-border hover:bg-muted" />
            </div>
          </Carousel>
        </div>
      </section>
    </AnimatedSection>
  );
}