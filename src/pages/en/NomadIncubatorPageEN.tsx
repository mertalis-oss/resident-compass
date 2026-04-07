import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe, Calculator, Users, Zap, ArrowRight, CheckCircle, Home, Briefcase, Heart, MapPin, Loader } from 'lucide-react';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import PlanBForm from '@/components/PlanBForm';
import ComparisonCrossSell from '@/components/service/ComparisonCrossSell';
import ServiceCheckout from '@/components/service/ServiceCheckout';
import ServiceWhoIsFor from '@/components/service/ServiceWhoIsFor';
import ExpectationOutcome from '@/components/service/ExpectationOutcome';
import TrustBlock from '@/components/service/TrustBlock';
import SocialProofMini from '@/components/service/SocialProofMini';
import FOMOBlock from '@/components/service/FOMOBlock';
import ServiceUpdateFallback from '@/components/tr/ServiceUpdateFallback';
import { useServicesList } from '@/hooks/useServicesList';
import { Button } from '@/components/ui/button';

const serviceItems = [
  { icon: Building2, title: 'Company Formation', subtitle: 'Global Structures', desc: 'Set up your business entity in the most tax-efficient jurisdictions.', features: ['Estonia e-Residency application', 'US Wyoming/Delaware LLC', 'Singapore Pte. Ltd.', 'Dubai Free Zone company'] },
  { icon: Calculator, title: 'Tax Optimization', subtitle: 'Strategic Planning', desc: 'Minimize your tax burden legally while maintaining full compliance.', features: ['Tax residency analysis', 'Double taxation prevention', 'Crypto & investment income planning', 'Exit strategy consulting'] },
  { icon: Globe, title: 'Second Passport & Residency', subtitle: 'Global Mobility', desc: 'Expand your options with citizenship and residency programs worldwide.', features: ['Caribbean CBI programs', 'Portugal/Spain Golden Visa', 'Ancestry routes (Italy, Ireland)', 'Thailand Elite Visa'] },
  { icon: Users, title: 'Community & Network', subtitle: 'Connections', desc: 'Join a curated community of like-minded entrepreneurs and nomads.', features: ['Monthly networking events', 'Private mastermind groups', 'Investor introductions', 'Co-living experiences'] },
];

const fullLifeItems = [
  { icon: Home, label: 'Accommodation and living space setup' },
  { icon: Briefcase, label: 'Company and bank account opening' },
  { icon: Heart, label: 'Health insurance and clinic network' },
  { icon: MapPin, label: 'Visa and residency permit process' },
  { icon: Globe, label: 'Tax optimization and exit plan' },
  { icon: Users, label: 'Community and networking access' },
];

export default function NomadIncubatorPageEN() {
  const { services, isLoading, hasError } = useServicesList('residency', 'global');
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader className="mx-auto mt-10 h-8 w-8 animate-spin text-accent" /></div>;

  const hasServices = services.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Digital Nomad Incubator — Plan B Asia" description="Company formation, tax optimization, second passport." />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(to right, hsl(var(--accent)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--accent)) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/80" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/80 tracking-wide">Business Infrastructure for Digital Nomads</span>
            </div>
            <h1 className="heading-display text-background mb-6">
              Live Anywhere,
              <span className="block text-accent">Build Globally.</span>
            </h1>
            <p className="text-lg text-background/70 max-w-xl mb-4">Company formation, tax optimization, second passport, and a powerful community.</p>
            <div className="bg-accent/10 border border-accent/20 px-6 py-4 mb-10 max-w-xl">
              <p className="text-background font-heading text-lg">A fully established life in Asia within 30 days.</p>
            </div>
            <button onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury-gold inline-flex items-center gap-2">
              Join the Incubator <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2-4 */}
      <ExpectationOutcome />
      <TrustBlock />
      <SocialProofMini />

      {/* 5-6. FOMO + CHECKOUT */}
      {hasServices && (
        <>
          <FOMOBlock service={services[0]} />
          <div id="checkout">
            <section className="section-editorial border-t border-border py-16">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center mb-10">
                  <p className="caption-editorial text-accent mb-2">Related Consulting Packages</p>
                </div>
                <div className="min-h-[400px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {services.map((s) => (
                    <ServiceCheckout key={s.id} service={s} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {!hasServices && (
        <div id="checkout">
          <div className="py-24 text-center text-muted-foreground">Packages currently being updated. Please check back soon.</div>
        </div>
      )}

      {/* 7. WHO IS FOR */}
      <ServiceWhoIsFor />

      {/* 8. Content — 360° Life Setup */}
      <section className="py-20 lg:py-28 bg-card border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">360° Life Setup</p>
            <h2 className="heading-section mb-4">Fully Established Life in 30 Days</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Visa, accommodation, company, bank, insurance, community — we handle everything.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {fullLifeItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0"><item.icon className="w-5 h-5 text-accent" /></div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16"><p className="caption-editorial text-accent mb-4">Services</p><h2 className="heading-section mb-4">Incubator Program</h2></div>
          <div className="min-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceItems.map((svc, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-card p-8 lg:p-10 border border-border hover:border-accent/30 transition-all duration-500">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-accent/10 flex items-center justify-center"><svc.icon className="w-7 h-7 text-accent" /></div>
                  <div><h3 className="font-heading text-xl mb-1">{svc.title}</h3><span className="text-sm text-accent">{svc.subtitle}</span></div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{svc.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {svc.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-accent flex-shrink-0" /><span>{f}</span></div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PlanBForm */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Free Eligibility Check</h2>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">Your eligibility looks strong. Purchase a consulting package above to get started.</p>
              <Button onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto">Purchase Consulting Package ↑</Button>
            </div>
          ) : (
            <PlanBForm serviceId={services[0]?.id} onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      {/* Comparison & Cross-Sell */}
      <ComparisonCrossSell currentSlug="nomad-incubator" />

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center"><span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span></div>
      </footer>
      <StickyMobileCTA onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} />
    </div>
  );
}
