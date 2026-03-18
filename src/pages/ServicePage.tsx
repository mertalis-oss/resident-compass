import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import ConciergeButton from '@/components/ConciergeButton';
import PlanBForm from '@/components/PlanBForm';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  features: { title: string; description: string }[] | null;
  faq: { question: string; answer: string }[] | null;
  seo_title: string | null;
  seo_description: string | null;
  image_url: string | null;
  category: string | null;
  price: number;
  currency: string;
  stripe_price_id: string;
  stripe_description: string | null;
  calendly_url: string | null;
  delivery_time_days: number | null;
  location: string | null;
  capacity: number | null;
  is_featured: boolean;
  is_active: boolean;
}

const fallbacks: Record<string, Partial<Service>> = {
  'dtv-thailand': {
    title: 'Digital Nomad Visa (DTV) — Thailand',
    short_description: '5-year multi-entry visa for remote professionals, freelancers, and founders.',
    description: 'Complete DTV application management with legal counsel and compliance support.',
    price: 5000,
    currency: 'USD',
    stripe_price_id: '',
    features: [
      { title: 'Licensed immigration counsel', description: 'Full legal representation' },
      { title: 'Full application management', description: 'End-to-end document handling' },
      { title: 'Post-arrival compliance', description: 'Ongoing monitoring and renewal support' },
    ],
  },
  'thailand-retreat': {
    title: 'Wellness & Medical Visa — Thailand',
    short_description: 'Premium healthcare access and wellness-focused relocation.',
    price: 3000,
    currency: 'USD',
    stripe_price_id: '',
    features: [
      { title: 'Master Guides & Practitioners', description: 'Traditional Thai healing experts' },
      { title: 'Integrative Programs', description: 'Energy alignment & meditation' },
      { title: 'Med-grade infrastructure', description: 'Luxury wellness facilities' },
    ],
  },
  'ha-giang-motor-expedition': {
    title: 'Hà Giang Motor Expedition — Vietnam',
    short_description: 'Bespoke expeditions for sovereign founders.',
    price: 2500,
    currency: 'USD',
    stripe_price_id: '',
    features: [
      { title: 'GS-segment fleet', description: 'BMW R1250GS, Honda Africa Twin' },
      { title: 'Luxury route planning', description: 'Cross-border with local guides' },
      { title: 'Private lodging', description: 'Curated culinary experiences' },
    ],
  },
};

function ServiceSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <FocusedNavbar />
      <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-corporate-navy">
        <div className="container max-w-4xl text-center space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto bg-holistic/10" />
          <Skeleton className="h-6 w-1/2 mx-auto bg-holistic/10" />
          <Skeleton className="h-12 w-48 mx-auto bg-holistic/10 mt-6" />
        </div>
      </section>
    </div>
  );
}

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug!)
        .maybeSingle();

      if (error) {
        navigate('/*', { replace: true });
        return;
      }

      if (data) {
        setService(data as unknown as Service);
      } else {
        const fb = fallbacks[slug!];
        if (fb) {
          setService({ id: 'fallback', slug: slug!, seo_title: null, seo_description: null, image_url: null, category: null, stripe_description: null, calendly_url: null, delivery_time_days: null, location: null, capacity: null, is_featured: false, is_active: true, faq: null, features: null, short_description: null, description: null, price: 0, currency: 'USD', stripe_price_id: '', ...fb } as Service);
        } else {
          navigate('/*', { replace: true });
          return;
        }
      }
      setLoading(false);
    };
    fetchService();
  }, [slug, navigate]);

  if (loading) return <ServiceSkeleton />;
  if (!service) return null;

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const currencySymbol = service.currency === 'USD' ? '$' : service.currency === 'EUR' ? '€' : service.currency === 'TRY' ? '₺' : service.currency;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={service.seo_title || service.title}
        description={service.seo_description || service.description || ''}
        schemaType="Service"
        serviceName={service.title}
        serviceDescription={service.description || ''}
      />
      <FocusedNavbar />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-corporate-navy text-holistic">
        <div className="container max-w-4xl text-center px-6">
          <p className="caption-editorial text-holistic/50 mb-6">
            {service.category || t('service.programme', { defaultValue: 'Sovereign Programme' })}
          </p>
          <h1 className="heading-display text-holistic mb-6">
            {service.title}
          </h1>
          {service.short_description && (
            <p className="body-editorial text-holistic/60 max-w-2xl mx-auto mb-6">
              {service.short_description}
            </p>
          )}
          <p className="font-heading text-3xl md:text-4xl text-holistic mb-10">
            {currencySymbol}{service.price.toLocaleString()}
          </p>
          <Button
            size="lg"
            onClick={scrollToForm}
            className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
          >
            {t('service.cta', { defaultValue: 'Begin Your Journey' })} <ArrowRight className="ml-3 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Features */}
      {service.features && Array.isArray(service.features) && service.features.length > 0 && (
        <AnimatedSection>
          <section className="section-editorial border-t border-border">
            <div className="container max-w-3xl px-6">
              <p className="caption-editorial text-muted-foreground mb-12">
                {t('service.features', { defaultValue: 'What\'s Included' })}
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
      )}

      {/* FAQ */}
      {service.faq && Array.isArray(service.faq) && service.faq.length > 0 && (
        <AnimatedSection>
          <section className="section-editorial border-t border-border">
            <div className="container max-w-3xl px-6">
              <p className="caption-editorial text-muted-foreground mb-12">
                {t('service.faq', { defaultValue: 'Frequently Asked Questions' })}
              </p>
              <div className="space-y-8">
                {(service.faq as { question: string; answer: string }[]).map((item, i) => (
                  <div key={i} className="border-b border-border pb-6">
                    <h3 className="font-heading text-xl text-foreground mb-3">{item.question}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Delivery & Location Info */}
      {(service.delivery_time_days || service.location) && (
        <AnimatedSection>
          <section className="py-16 bg-secondary">
            <div className="container max-w-3xl px-6">
              <div className="flex flex-wrap justify-center gap-x-16 gap-y-6">
                {service.delivery_time_days && (
                  <div className="text-center">
                    <p className="font-heading text-3xl text-foreground">{service.delivery_time_days}</p>
                    <p className="caption-editorial text-muted-foreground mt-1">{t('service.deliveryDays', { defaultValue: 'Delivery Days' })}</p>
                  </div>
                )}
                {service.location && (
                  <div className="text-center">
                    <p className="font-heading text-3xl text-foreground">{service.location}</p>
                    <p className="caption-editorial text-muted-foreground mt-1">{t('service.location', { defaultValue: 'Location' })}</p>
                  </div>
                )}
                {service.capacity && (
                  <div className="text-center">
                    <p className="font-heading text-3xl text-foreground">{service.capacity}</p>
                    <p className="caption-editorial text-muted-foreground mt-1">{t('service.capacity', { defaultValue: 'Capacity' })}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      <PlanBForm serviceId={service.id !== 'fallback' ? service.id : undefined} />

      <footer className="py-16 bg-corporate-navy border-t border-border/10">
        <div className="container max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
          <div className="flex gap-10 text-xs text-holistic/40 tracking-[0.2em] uppercase">
            <a href="#" className="hover:text-holistic/70 transition-colors duration-500">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-holistic/70 transition-colors duration-500">{t('footer.terms')}</a>
          </div>
        </div>
      </footer>
      <ConciergeButton />
    </div>
  );
}
