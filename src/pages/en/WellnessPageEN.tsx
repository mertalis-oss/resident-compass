import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Wind, Dumbbell, Brain, Eye, MessageCircle } from 'lucide-react';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import PlanBForm from '@/components/PlanBForm';
import ServiceWhoIsFor from '@/components/service/ServiceWhoIsFor';
import ExpectationOutcome from '@/components/service/ExpectationOutcome';
import TrustBlock from '@/components/service/TrustBlock';
import SocialProofMini from '@/components/service/SocialProofMini';
import AdvisoryForm from '@/components/advisory/AdvisoryForm';
import { buildWhatsAppUrl } from '@/lib/constants';
import { trackPostHogEvent } from '@/lib/posthog';
import { Button } from '@/components/ui/button';

const modalities = [
  { icon: Wind, title: 'Breathwork Engineering', desc: 'Controlled breathing protocols for nervous system regulation and peak cognitive performance.' },
  { icon: Dumbbell, title: 'Performance Recovery', desc: 'Ice baths, infrared sauna, and sports massage protocols designed for high-output individuals.' },
  { icon: Brain, title: 'Somatic Regulation', desc: 'Body-based trauma release and stress management techniques for sustainable resilience.' },
  { icon: Eye, title: 'Vipassana Silence', desc: '10-day silent meditation retreats in Thailand\'s most respected centers. Complete digital detox.' },
];

export default function WellnessPageEN() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const whatsappUrl = buildWhatsAppUrl('Page: Wellness | Intent: wellness-inquiry | Domain: ' + (typeof window !== 'undefined' ? window.location.hostname : ''));
  const handleWhatsAppClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'wellness_en', intent: 'wellness-inquiry' }, true);
    try { window.open(whatsappUrl, '_blank'); } catch { window.location.href = whatsappUrl; }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Wellness Retreats — Spiritual & Somatic Sovereignty | Plan B Asia" description="Breathwork, recovery protocols, somatic regulation, and Vipassana silence retreats in Thailand." canonical="https://planbasia.com/experiences/wellness" schemaType="Service" serviceName="Wellness Programs" />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <Heart className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Wellness Protocols</span>
            </div>
            <h1 className="heading-display text-background mb-6">Spiritual & Somatic Sovereignty.<span className="block text-accent">Recalibrate Everything.</span></h1>
            <p className="text-lg text-background/80 max-w-xl mb-10">Breathwork, recovery, somatic regulation, and silent meditation — curated wellness protocols in Thailand's most transformative settings.</p>
            <button onClick={handleWhatsAppClick} className="btn-luxury-gold inline-flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Speak with Strategic Advisor</button>
          </motion.div>
        </div>
      </section>

      {/* 2-4 */}
      <ExpectationOutcome />
      <TrustBlock />
      <SocialProofMini />

      {/* 5. Advisory Form */}
      <div id="checkout">
        <section className="section-editorial border-t border-border py-16">
          <div className="container max-w-2xl px-6">
            <div className="text-center mb-8">
              <p className="caption-editorial text-accent mb-4">Begin Your Advisory</p>
              <h2 className="heading-section mb-4">Start Your Wellness Process</h2>
            </div>
            <AdvisoryForm source_page="wellness" defaultDestination="thailand" />
          </div>
        </section>
      </div>

      {/* 6. WHO IS FOR */}
      <ServiceWhoIsFor />

      {/* 7. Modalities */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Modalities</p>
            <h2 className="heading-section mb-4">Four Pathways to Sovereignty</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Each protocol is designed for high-performance individuals seeking genuine transformation.</p>
          </div>
          <div className="min-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-8">
            {modalities.map((mod, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-card p-8 lg:p-10 border border-border hover:border-accent/30 transition-all duration-500">
                <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mb-6"><mod.icon className="w-7 h-7 text-accent" /></div>
                <h3 className="font-heading text-xl mb-3">{mod.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PlanBForm */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Confidential Inquiry</h2>
          <p className="text-muted-foreground text-center mb-10 body-editorial">Tell us about your wellness goals. Direct strategist review within 24 hours.</p>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">Your inquiry has been received. A wellness strategist will contact you within 24 hours.</p>
              <Button onClick={handleWhatsAppClick} className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto inline-flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Speak with Strategic Advisor</Button>
            </div>
          ) : (
            <PlanBForm onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center"><span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span></div>
      </footer>
      <StickyMobileCTA onClick={handleWhatsAppClick} />
    </div>
  );
}
