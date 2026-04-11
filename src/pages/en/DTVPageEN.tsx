import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, ChevronDown, Loader, ArrowRight, MessageCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import ServiceCheckout from '@/components/service/ServiceCheckout';
import ServiceWhoIsFor from '@/components/service/ServiceWhoIsFor';
import ExpectationOutcome from '@/components/service/ExpectationOutcome';
import TrustBlock from '@/components/service/TrustBlock';
import SocialProofMini from '@/components/service/SocialProofMini';

import PlanBForm from '@/components/PlanBForm';
import ComparisonCrossSell from '@/components/service/ComparisonCrossSell';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import { useServicesList } from '@/hooks/useServicesList';
import { buildWhatsAppUrl } from '@/lib/constants';
import { trackPostHogEvent } from '@/lib/posthog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const processSteps = [
  { step: 1, title: 'Strategic Eligibility Analysis', desc: 'We assess your profile, travel history, and objectives to determine the optimal DTV pathway.' },
  { step: 2, title: 'Document Preparation & Audit', desc: 'Complete document assembly with accuracy verification before submission.' },
  { step: 3, title: 'Submission & Post-Approval Setup', desc: 'We handle submission logistics and guide you through entry protocols.' },
];

const faqs = [
  { q: 'What is the Thailand DTV Visa?', a: 'The Destination Thailand Visa (DTV) is a 5-year multi-entry visa offering 180-day stays per entry with unlimited re-entries. Designed for digital nomads, remote workers, and long-term visitors.' },
  { q: 'Who is eligible for the DTV?', a: 'Remote workers, freelancers, entrepreneurs, and individuals who can demonstrate a legitimate purpose of stay such as work, education, or cultural activities.' },
  { q: 'How long does the process take?', a: 'Typical processing is 15-30 business days depending on the consulate and completeness of documentation.' },
  { q: 'Can I work remotely on the DTV?', a: 'Yes. The DTV explicitly permits remote work for foreign employers or your own business registered outside Thailand.' },
  { q: 'What happens if my application is rejected?', a: 'Our strategic advisory packages include pre-submission audits to minimize rejection risk. If rejected, we provide a revised submission strategy.' },
  { q: 'Can my family join me?', a: 'Yes. Dependents can apply for their own DTV visas. We handle family applications as a coordinated package.' },
];

export default function DTVPageEN() {
  const { services, isLoading, hasError } = useServicesList('residency', 'global');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const whatsappUrl = buildWhatsAppUrl('Page: DTV | Intent: strategic-review | Domain: ' + (typeof window !== 'undefined' ? window.location.hostname : ''));
  const handleWhatsAppClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'dtv_en', intent: 'strategic-review' }, true);
    try { window.open(whatsappUrl, '_blank'); } catch { window.location.href = whatsappUrl; }
  };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader className="mx-auto mt-10 h-8 w-8 animate-spin text-accent" /></div>;

  const hasServices = services.length > 0;
  const anchorService = services[0];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Thailand DTV Visa — 5-Year Freedom Protocol | Plan B Asia" description="Secure your 5-year Thailand DTV visa with strategic advisory. 180-day stays, unlimited re-entries." canonical="https://planbasia.com/visas/thailand-dtv" schemaType="Service" serviceName="Thailand DTV Visa Advisory" />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. HERO */}
      <section className="relative min-h-[90vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2039&auto=format&fit=crop')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Strategic Visa Advisory</span>
            </div>
            <h1 className="heading-display text-background mb-6">
              The 5-Year Freedom Protocol.
              <span className="block text-accent">One Application.</span>
            </h1>
            <p className="text-lg text-background/80 max-w-xl mb-4">180-day stays, unlimited re-entries, and full remote work authorization — the most powerful long-term visa in Southeast Asia.</p>
            <div className="bg-accent/10 border border-accent/20 px-6 py-4 mb-8 max-w-xl">
              <p className="text-background font-heading text-lg">The Margin for Error is $5,000.</p>
              <p className="text-background/60 text-sm mt-1">A single document error can cost months and thousands. Our advisory eliminates that risk.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button onClick={handleWhatsAppClick} className="btn-luxury-gold inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Request Strategic Review
              </button>
              <button onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} className="border border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md text-xs tracking-[0.15em] uppercase px-8 py-4 h-auto rounded-md transition-all duration-300">
                View Packages
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-background/70 font-medium">2026 Quotas Filling — Secure Your Position</span>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-background/50 text-xs uppercase tracking-widest">Explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ChevronDown className="w-5 h-5 text-background/50" /></motion.div>
        </motion.div>
      </section>

      {/* 2-4 */}
      <ExpectationOutcome />
      <TrustBlock />
      <SocialProofMini />

      {/* 5. CHECKOUT GRID */}
      <div id="checkout" className="scroll-mt-28 md:scroll-mt-36">
        {hasServices ? (
          <section className="section-editorial border-t border-border py-16">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center mb-10">
                <p className="caption-editorial text-accent mb-2">Advisory Packages</p>
                <h2 className="heading-section">Select Your Strategic Pathway</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 min-h-[420px] md:min-h-[480px] items-stretch auto-rows-fr">
                {services.map((s, index) => (
                  <ServiceCheckout key={s.id ?? s.slug ?? index} service={s} layout="grid" />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="py-24 text-center">
            <p className="text-muted-foreground mb-6">Elite protocols are currently being updated by our strategic advisors.</p>
            <Button onClick={handleWhatsAppClick} variant="outline" className="inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Speak with Strategic Advisor
            </Button>
          </section>
        )}
      </div>

      {/* 7. TRUST STATS */}
      <section className="py-16 lg:py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '5 Years', label: 'Visa Validity' },
              { value: '180 Days', label: 'Per Entry Stay' },
              { value: 'Unlimited', label: 'Re-Entries' },
              { value: '100%', label: 'Approval Target*' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-accent mb-2">{item.value}</p>
                <p className="caption-editorial text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHO IS THIS FOR */}
      <ServiceWhoIsFor />

      {/* 9. PROCESS */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Process</p>
            <h2 className="heading-section">Three Steps to Your New Life</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {processSteps.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="flex gap-6 mb-12 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-heading text-2xl font-medium">{item.step}</div>
                  {i < processSteps.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-accent/50 to-border mt-4" />}
                </div>
                <div className="flex-1 pt-2 pb-8">
                  <h3 className="font-heading text-xl md:text-2xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Frequently Asked Questions</p>
            <h2 className="heading-section">What You Need to Know</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border px-6 data-[state=open]:ring-1 data-[state=open]:ring-accent/30">
                  <AccordionTrigger className="text-left font-heading text-lg hover:no-underline hover:text-accent transition-colors py-5">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 11. FREE TOOL (PlanBForm) */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Free Eligibility Assessment</h2>
          <p className="text-muted-foreground text-center mb-10 body-editorial">Quick preliminary assessment. Then purchase your advisory package above.</p>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">Your eligibility looks strong. Purchase an advisory package above to get started.</p>
              <Button onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto">View Advisory Packages ↑</Button>
            </div>
          ) : (
            <PlanBForm serviceId={anchorService?.id} onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      {/* 12. COMPARISON & CROSS-SELL */}
      <ComparisonCrossSell currentSlug="dtv-thailand" />

      {/* Cross-Bridge */}
      <section className="py-20 lg:py-28 bg-foreground text-background grain-overlay">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-2xl">
          <p className="caption-editorial text-accent mb-4">Next Step</p>
          <h2 className="heading-section text-background mb-4">Approved. Now Establish Your Base.</h2>
          <p className="body-editorial text-background/70 mb-8">Your visa is the key. Our relocation program is the door.</p>
          <Link to="/relocation/nomad-incubator" className="btn-luxury-gold inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase">
            Explore Relocation Program <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center"><span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span></div>
      </footer>
      <StickyMobileCTA onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} />
    </div>
  );
}
