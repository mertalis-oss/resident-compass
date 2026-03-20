import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { getDomainScope } from '@/hooks/useDomainScope';
import { trackPostHogEvent } from '@/lib/posthog';
import { getStoredUtms } from '@/lib/utmStorage';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import ConciergeButton from '@/components/ConciergeButton';
import PlanBForm from '@/components/PlanBForm';
import AnimatedSection from '@/components/AnimatedSection';
import ServiceHero from '@/components/service/ServiceHero';
import ServiceFeatures from '@/components/service/ServiceFeatures';
import ServiceFAQ from '@/components/service/ServiceFAQ';
import ServiceDeliveryInfo from '@/components/service/ServiceDeliveryInfo';
import ServiceWhoIsFor from '@/components/service/ServiceWhoIsFor';
import ServiceBundleItems from '@/components/service/ServiceBundleItems';
import ServiceUpsell from '@/components/service/ServiceUpsell';
import ServiceCheckout from '@/components/service/ServiceCheckout';
import ServiceFallback from '@/components/service/ServiceFallback';
import ServiceFooter from '@/components/service/ServiceFooter';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export interface Service {
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
  is_bundle: boolean | null;
}

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
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [fallbackServices, setFallbackServices] = useState<Service[]>([]);
  const exitIntentFired = useRef(false);

  // Canceled state check
  useEffect(() => {
    if (searchParams.get('canceled') === 'true') {
      toast({
        title: t('service.canceledTitle', { defaultValue: 'Payment not completed' }),
        description: t('service.canceledDesc', { defaultValue: 'Your payment was not completed. You can try again anytime.' }),
      });
    }
  }, [searchParams, toast, t]);

  // Exit intent (desktop only)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentFired.current) {
        exitIntentFired.current = true;
        toast({
          title: t('service.exitIntentTitle', { defaultValue: 'Before you go…' }),
          description: t('service.exitIntentDesc', { defaultValue: 'This process gets harder the longer you wait.' }),
        });
      }
    };
    document.addEventListener('mouseleave', handler);
    return () => document.removeEventListener('mouseleave', handler);
  }, [toast, t]);

  useEffect(() => {
    const fetchService = async () => {
      const scope = getDomainScope();
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug!)
        .eq('is_active', true)
        .in('visible_on', [scope, 'both'])
        .maybeSingle();

      if (error || !data) {
        // Fetch fallback services
        const { data: fbData } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .in('visible_on', [scope, 'both'])
          .limit(3);
        setFallbackServices((fbData as unknown as Service[]) || []);
        setNotFound(true);
        setLoading(false);
        return;
      }

      setService(data as unknown as Service);
      setLoading(false);
    };
    fetchService();
  }, [slug]);

  // Track service view
  useEffect(() => {
    if (service) {
      trackPostHogEvent('service_view', { slug: service.slug, title: service.title });
    }
  }, [service]);

  if (loading) return <ServiceSkeleton />;

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title={t('service.notFoundTitle', { defaultValue: 'Service Not Available' })} description="" />
        <FocusedNavbar />
        <ServiceFallback services={fallbackServices} />
        <ServiceFooter />
        <ConciergeButton />
      </div>
    );
  }

  if (!service) return null;

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

      <ServiceHero service={service} />

      <ServiceFeatures service={service} />

      <ServiceWhoIsFor />

      <ServiceFAQ service={service} />

      <ServiceBundleItems service={service} />

      <ServiceDeliveryInfo service={service} />

      <ServiceCheckout service={service} />

      <ServiceUpsell currentService={service} />

      <PlanBForm serviceId={service.id} />

      {/* Final CTA Mirror */}
      <AnimatedSection>
        <section className="py-20 bg-corporate-navy text-holistic text-center">
          <div className="container max-w-3xl px-6">
            <h2 className="heading-section text-holistic mb-4">
              {t('service.finalCtaTitle', { defaultValue: 'Ready to move forward?' })}
            </h2>
            <p className="body-editorial text-holistic/60 mb-8">
              {t('service.finalCtaBody', { defaultValue: 'Start your process now.' })}
            </p>
            <ServiceCheckout service={service} variant="mirror" />
          </div>
        </section>
      </AnimatedSection>

      <ServiceFooter />
      <ConciergeButton />
    </div>
  );
}
