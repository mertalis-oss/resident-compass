import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import ConciergeButton from '@/components/ConciergeButton';
import PlanBForm from '@/components/PlanBForm';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_range: string | null;
  currency: string | null;
  features: string[] | null;
  is_stripe_enabled: boolean | null;
  stripe_payment_url: string | null;
  is_featured: boolean | null;
  sort_order: number | null;
}

interface Service {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  pain_points: string[] | null;
  value_propositions: string[] | null;
  process_steps: { step: string; description: string }[] | null;
  trust_points: string[] | null;
  cta_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  schema_type: string | null;
  packages: Package[];
}

const fallbacks: Record<string, Partial<Service>> = {
  'dtv-thailand': {
    title: 'Digital Nomad Visa (DTV) — Thailand',
    subtitle: '5-year multi-entry visa for remote professionals, freelancers, and founders.',
    pain_points: ['Complex immigration bureaucracy without local legal guidance', 'Risk of non-compliance with evolving Thai visa regulations', 'Lack of structured approval pathway for remote workers'],
    value_propositions: ['Structured approval pathway with licensed immigration counsel', 'End-to-end document preparation and submission', 'Ongoing compliance monitoring and renewal support'],
    process_steps: [{ step: 'Strategic Assessment', description: 'Evaluate eligibility, documentation, and optimal timing.' }, { step: 'Document Preparation', description: 'Compile and verify all required materials.' }, { step: 'Application Filing', description: 'Submit through verified government channels.' }, { step: 'Ongoing Support', description: 'Compliance monitoring and renewal management.' }],
    trust_points: ['Licensed Legal Partners', 'Government Compliant', 'Structured Approval Pathway'],
    packages: [
      { id: 'fb-1', name: 'Document Audit', description: 'Comprehensive review of your current documentation and eligibility assessment.', price: 100, price_range: '€100', currency: 'EUR', features: ['Full document review', 'Eligibility assessment', 'Pathway recommendation'], is_stripe_enabled: false, stripe_payment_url: null, is_featured: false, sort_order: 0 },
      { id: 'fb-2', name: 'Sovereign Relocation Protocol', description: 'Complete DTV application management with legal counsel and compliance support.', price: 5000, price_range: '$5,000', currency: 'USD', features: ['Licensed immigration counsel', 'Full application management', 'Structured approval pathway', 'Post-arrival compliance', 'Tax advisory introduction'], is_stripe_enabled: false, stripe_payment_url: null, is_featured: true, sort_order: 1 },
    ],
  },
  'thailand-retreat': {
    title: 'Wellness & Medical Visa — Thailand',
    subtitle: 'Premium healthcare access and wellness-focused relocation.',
    pain_points: ["Navigating Thailand's medical visa requirements without guidance", 'Finding verified, med-grade wellness practitioners', 'Coordinating healthcare logistics across borders'],
    value_propositions: ['Master Guides & Practitioners in Traditional Thai Healing', 'Integrative Energy Alignment & Meditation Programs', 'Med-grade luxury wellness infrastructure'],
    process_steps: [{ step: 'Wellness Assessment', description: 'Define your health goals and program requirements.' }, { step: 'Program Design', description: 'Curate a bespoke wellness itinerary with verified practitioners.' }, { step: 'Visa & Logistics', description: 'Manage medical visa application and facility coordination.' }, { step: 'Immersion', description: 'Begin your transformative wellness journey.' }],
    trust_points: ['Verified Medical Partners', 'Premium Facilities', 'Confidential Care'],
  },
  'mice-thailand': {
    title: 'Corporate Retreats (MICE) — Thailand',
    subtitle: 'Strategic Infrastructure for Global Builders.',
    pain_points: ['Finding premium venues that meet corporate security standards', 'Coordinating multi-national team logistics in Southeast Asia', 'Ensuring compliance with corporate travel policies'],
    value_propositions: ['Vetted 5-star venue partnerships across Thailand', 'Full event logistics and concierge management', 'Corporate-grade security and confidentiality protocols'],
    process_steps: [{ step: 'Briefing', description: 'Understand your objectives, team size, and requirements.' }, { step: 'Venue Curation', description: 'Present shortlisted premium venues with full costings.' }, { step: 'Logistics Management', description: 'Handle flights, transfers, accommodations, and activities.' }, { step: 'Execution', description: 'On-ground concierge support throughout your event.' }],
    trust_points: ['Corporate-Grade Security', 'Premium Venues', 'Full Concierge'],
  },
  'ha-giang-motor-expedition': {
    title: 'Hà Giang Motor Expedition — Vietnam',
    subtitle: 'Bespoke Expeditions for Sovereign Founders.',
    pain_points: ['Finding GS-segment motorcycle rentals for serious riders', 'Navigating cross-border routes without local intelligence', "Generic backpacker tours that don't match founder-level expectations"],
    value_propositions: ['GS-segment motorcycle fleet (BMW R1250GS, Honda Africa Twin)', 'Luxury cross-border route planning with local guides', 'Private lodging and curated culinary experiences along the route'],
    process_steps: [{ step: 'Route Design', description: 'Customize your expedition route and difficulty level.' }, { step: 'Equipment', description: 'Select from our GS-segment motorcycle fleet with full gear.' }, { step: 'Expedition', description: "Ride with experienced guides through Vietnam's most spectacular passes." }, { step: 'Recovery', description: 'Post-expedition luxury accommodation and debrief.' }],
    trust_points: ['Premium Motorcycles', 'Experienced Guides', 'Luxury Logistics'],
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
      <section className="py-20">
        <div className="container max-w-3xl space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*, packages(*)')
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
          setService({ id: 'fallback', slug: slug!, seo_title: null, seo_description: null, schema_type: 'Service', cta_text: 'Begin Your Journey', packages: [], ...fb } as Service);
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

  // Sort packages: featured last (premium tier at end)
  const sortedPackages = [...(service.packages || [])].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return 1;
    if (!a.is_featured && b.is_featured) return -1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={service.seo_title || service.title}
        description={service.seo_description || service.description || ''}
        schemaType={(service.schema_type as 'Service' | 'Product') || 'Service'}
        serviceName={service.title}
        serviceDescription={service.description || ''}
      />
      <FocusedNavbar />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-corporate-navy text-holistic">
        <div className="container max-w-4xl text-center px-6">
          <p className="text-xs tracking-[0.4em] uppercase text-holistic/50 mb-6 font-body">
            Sovereign Programme
          </p>
          <h1 className="text-4xl md:text-6xl font-heading font-normal tracking-tight leading-[0.95] mb-6">
            {service.title}
          </h1>
          {service.subtitle && (
            <p className="text-base md:text-lg text-holistic/60 max-w-2xl mx-auto mb-10 font-body font-light leading-relaxed">
              {service.subtitle}
            </p>
          )}
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto transition-all duration-500 ease-out hover:scale-[1.02]"
          >
            {service.cta_text || 'Begin Your Journey'} <ArrowRight className="ml-3 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Pain Points */}
      {service.pain_points && service.pain_points.length > 0 && (
        <AnimatedSection>
          <section className="py-32 border-t border-border">
            <div className="container max-w-3xl px-6">
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-12 font-body">The Challenge</p>
              <div className="space-y-6">
                {service.pain_points.map((point, i) => (
                  <div key={i} className="flex gap-4 border-b border-border pb-6">
                    <span className="font-heading text-2xl font-light text-border shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed pt-1">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Value Propositions */}
      {service.value_propositions && service.value_propositions.length > 0 && (
        <AnimatedSection>
          <section className="py-32 border-t border-border">
            <div className="container max-w-3xl px-6">
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-12 font-body">Our Solution</p>
              <div className="space-y-6">
                {service.value_propositions.map((vp, i) => (
                  <div key={i} className="flex gap-4 border-b border-border pb-6">
                    <CheckCircle className="h-5 w-5 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
                    <p className="text-sm text-foreground font-body leading-relaxed">{vp}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Process */}
      {service.process_steps && (service.process_steps as { step: string; description: string }[]).length > 0 && (
        <AnimatedSection>
          <section className="py-32 border-t border-border">
            <div className="container max-w-3xl px-6">
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-12 font-body">The Process</p>
              <div className="space-y-10">
                {(service.process_steps as { step: string; description: string }[]).map((ps, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center shrink-0">
                      <span className="font-heading text-lg font-normal text-secondary">{['I', 'II', 'III', 'IV', 'V'][i] || i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-normal tracking-tight text-foreground">{ps.step}</h3>
                      <p className="text-sm text-muted-foreground mt-2 font-body leading-relaxed">{ps.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Packages — Private Banking Tiers */}
      {sortedPackages.length > 0 && (
        <AnimatedSection>
          <section className="py-32 border-t border-border">
            <div className="container max-w-5xl px-6">
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 text-center font-body">
                Investment Tiers
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-normal tracking-tight text-center text-foreground mb-16">
                Select Your Protocol
              </h2>
              <div className={`grid gap-8 ${sortedPackages.length === 1 ? 'max-w-lg mx-auto' : sortedPackages.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
                {sortedPackages.map((pkg) => {
                  const isPremium = pkg.is_featured;
                  return (
                    <div
                      key={pkg.id}
                      className={`relative p-8 md:p-10 rounded-lg transition-all duration-500 ease-out hover:scale-[1.02] flex flex-col ${
                        isPremium
                          ? 'border border-royal-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.15)] bg-card'
                          : 'border border-border bg-card/50'
                      }`}
                    >
                      {isPremium && (
                        <span className="absolute -top-3 left-6 text-[10px] font-body font-medium uppercase tracking-[0.3em] px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground">
                          Recommended
                        </span>
                      )}
                      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body">
                        {isPremium ? 'Premium Tier' : 'Standard Tier'}
                      </p>
                      <h3 className="font-heading text-2xl font-normal tracking-tight text-foreground mb-3">{pkg.name}</h3>
                      {pkg.description && (
                        <p className="text-sm text-muted-foreground mb-6 font-body leading-relaxed">{pkg.description}</p>
                      )}
                      {(pkg.price_range || pkg.price) && (
                        <p className="font-heading text-3xl font-normal text-foreground mb-8">
                          {pkg.price_range || `${pkg.currency === 'USD' ? '$' : pkg.currency === 'EUR' ? '€' : pkg.currency}${pkg.price?.toLocaleString()}`}
                        </p>
                      )}
                      {pkg.features && (
                        <ul className="space-y-3 mb-10 flex-1">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm text-muted-foreground font-body">
                              <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5 stroke-[1.5]" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      {pkg.is_stripe_enabled && pkg.stripe_payment_url ? (
                        <a href={pkg.stripe_payment_url} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs tracking-[0.15em] uppercase py-5 h-auto transition-all duration-500 ease-out hover:scale-[1.02]">
                            Initiate Protocol <ArrowRight className="ml-2 h-3.5 w-3.5" />
                          </Button>
                        </a>
                      ) : (
                        <Button
                          onClick={scrollToForm}
                          variant={isPremium ? 'default' : 'outline'}
                          className={`w-full text-xs tracking-[0.15em] uppercase py-5 h-auto transition-all duration-500 ease-out hover:scale-[1.02] ${
                            isPremium
                              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                              : 'hover:border-secondary/50'
                          }`}
                        >
                          {isPremium ? 'Request Private Consultation' : 'Request Consultation'}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Trust */}
      {service.trust_points && service.trust_points.length > 0 && (
        <section className="py-16 bg-corporate-navy">
          <div className="container max-w-5xl px-6">
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
              {service.trust_points.map((tp, i) => (
                <span key={i} className="text-xs tracking-[0.3em] uppercase text-holistic/50 font-body">
                  {tp}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <PlanBForm />

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase font-body">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
          <div className="flex gap-10 text-xs text-holistic/40 tracking-[0.2em] uppercase font-body">
            <a href="#" className="hover:text-holistic/70 transition-colors duration-500">Privacy</a>
            <a href="#" className="hover:text-holistic/70 transition-colors duration-500">Terms</a>
          </div>
        </div>
      </footer>
      <ConciergeButton />
    </div>
  );
}
