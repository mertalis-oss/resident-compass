import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import ConciergeButton from '@/components/ConciergeButton';
import PlanBForm from '@/components/PlanBForm';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  features: string[] | null;
  is_stripe_enabled: boolean | null;
  stripe_payment_url: string | null;
  is_featured: boolean | null;
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

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*, packages(*)')
        .eq('slug', slug!)
        .single();
      if (error || !data) { navigate('/*', { replace: true }); return; }
      setService(data as unknown as Service);
      setLoading(false);
    };
    fetch();
  }, [slug, navigate]);

  if (loading || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

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
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-4">
            {service.title}
          </h1>
          {service.subtitle && (
            <p className="text-lg md:text-xl text-holistic/70 max-w-2xl mx-auto mb-8">
              {service.subtitle}
            </p>
          )}
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8"
          >
            {service.cta_text || 'Begin Your Journey'} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Pain Points */}
      {service.pain_points && service.pain_points.length > 0 && (
        <section className="py-20 bg-card">
          <div className="container max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-10 text-foreground">
              The Challenge
            </h2>
            <div className="space-y-4">
              {service.pain_points.map((point, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-lg border border-border bg-background">
                  <span className="text-destructive mt-0.5 shrink-0">⚠</span>
                  <p className="text-sm text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Value Propositions */}
      {service.value_propositions && service.value_propositions.length > 0 && (
        <section className="py-20">
          <div className="container max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-10 text-foreground">
              Our Solution
            </h2>
            <div className="space-y-4">
              {service.value_propositions.map((vp, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{vp}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {service.process_steps && (service.process_steps as { step: string; description: string }[]).length > 0 && (
        <section className="py-20 bg-card">
          <div className="container max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-10 text-foreground">
              The Process
            </h2>
            <div className="space-y-6">
              {(service.process_steps as { step: string; description: string }[]).map((ps, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-secondary">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{ps.step}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{ps.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      {service.packages && service.packages.length > 0 && (
        <section className="py-20">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-10 text-foreground">
              Packages
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {service.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-500 ease-out hover:scale-[1.02] ${
                    pkg.is_featured ? 'border-secondary ring-1 ring-secondary/20' : 'border-border'
                  }`}
                >
                  {pkg.is_featured && (
                    <span className="absolute -top-3 left-4 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                      Recommended
                    </span>
                  )}
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{pkg.name}</h3>
                  {pkg.description && <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>}
                  {pkg.price && (
                    <p className="text-2xl font-bold text-foreground mb-4">
                      {pkg.currency === 'USD' ? '$' : pkg.currency}{pkg.price.toLocaleString()}
                    </p>
                  )}
                  {pkg.features && (
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {pkg.is_stripe_enabled && pkg.stripe_payment_url ? (
                    <a href={pkg.stripe_payment_url} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        Purchase Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  ) : (
                    <Button
                      onClick={scrollToForm}
                      variant="outline"
                      className="w-full hover:border-secondary/50"
                    >
                      Request Consultation
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust */}
      {service.trust_points && service.trust_points.length > 0 && (
        <section className="py-16 bg-card">
          <div className="container max-w-3xl text-center">
            <div className="flex flex-wrap justify-center gap-4">
              {service.trust_points.map((tp, i) => (
                <span key={i} className="text-xs font-medium text-muted-foreground tracking-wider uppercase px-4 py-2 border border-border rounded-full">
                  {tp}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead Form */}
      <PlanBForm />

      {/* Footer */}
      <footer className="py-12 bg-corporate-navy text-holistic">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-holistic/50">© {new Date().getFullYear()} Atropox OÜ. All rights reserved.</span>
          <div className="flex gap-6 text-sm text-holistic/50">
            <a href="#" className="hover:text-holistic/80 transition-colors">Privacy</a>
            <a href="#" className="hover:text-holistic/80 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      <ConciergeButton />
    </div>
  );
}
