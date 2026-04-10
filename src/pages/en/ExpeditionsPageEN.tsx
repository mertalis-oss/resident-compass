import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mountain, Shield, MapPin, AlertTriangle, MessageCircle } from 'lucide-react';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import PlanBForm from '@/components/PlanBForm';
import ComparisonCrossSell from '@/components/service/ComparisonCrossSell';
import ServiceWhoIsFor from '@/components/service/ServiceWhoIsFor';
import ExpectationOutcome from '@/components/service/ExpectationOutcome';
import TrustBlock from '@/components/service/TrustBlock';
import SocialProofMini from '@/components/service/SocialProofMini';
import AdvisoryForm from '@/components/advisory/AdvisoryForm';
import { buildWhatsAppUrl } from '@/lib/constants';
import { trackPostHogEvent } from '@/lib/posthog';

const expeditions = [
  { title: 'Ha Giang Motor Expedition', location: 'Vietnam — Ha Giang', duration: '4-7 Days', desc: 'Guided motorcycle expedition through Vietnam\'s most dramatic mountain passes.', highlight: 'Most Popular' },
  { title: 'Northern Thailand Discovery', location: 'Thailand — Chiang Mai & Chiang Rai', duration: '5-10 Days', desc: 'Temples, mountain villages, and nature treks through the cultural heartland.', highlight: null },
  { title: 'Cambodia & Laos Cross-Border', location: 'Cambodia — Laos', duration: '7-14 Days', desc: 'Cross-border expedition from Angkor Wat to Luang Prabang.', highlight: null },
];

export default function ExpeditionsPageEN() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const whatsappUrl = buildWhatsAppUrl('Page: Expeditions | Intent: expedition-inquiry | Domain: ' + (typeof window !== 'undefined' ? window.location.hostname : ''));
  const handleWhatsAppClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'expeditions_en', intent: 'expedition-inquiry' }, true);
    try { window.open(whatsappUrl, '_blank'); } catch { window.location.href = whatsappUrl; }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Expeditions — The Art of Strategic Movement | Plan B Asia" description="Guided motorcycle and nature expeditions across Southeast Asia." canonical="https://planbasia.com/experiences/expeditions" schemaType="Service" serviceName="Expedition Programs" />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <Mountain className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Expedition Operations</span>
            </div>
            <h1 className="heading-display text-background mb-6">The Art of Strategic Movement.<span className="block text-accent">Southeast Asia's Hidden Routes.</span></h1>
            <p className="text-lg text-background/80 max-w-xl mb-10">Licensed and guided expeditions through the most breathtaking landscapes in the region.</p>
            <button onClick={handleWhatsAppClick} className="btn-luxury-gold inline-flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Speak with Strategic Advisor</button>
          </motion.div>
        </div>
      </section>

      {/* 2-4 */}
      <ExpectationOutcome />
      <TrustBlock />
      <SocialProofMini />

      {/* 5. WHO IS FOR */}
      <ServiceWhoIsFor />

      {/* 6. Safety */}
      <section className="py-6 bg-accent/5 border-y border-accent/20">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-center gap-3">
          <Shield className="w-5 h-5 text-accent flex-shrink-0" />
          <p className="text-sm text-foreground font-medium">Licensed & Guided Operations.</p>
        </div>
      </section>

      {/* 7. Routes Grid */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16"><p className="caption-editorial text-accent mb-4">Routes</p><h2 className="heading-section mb-4">Active Expeditions</h2></div>
          <div className="min-h-[400px] grid grid-cols-1 md:grid-cols-3 gap-8">
            {expeditions.map((exp, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`bg-card p-8 border transition-all duration-500 ${exp.highlight ? 'border-accent/40 shadow-[0_0_40px_rgba(212,175,55,0.15)]' : 'border-border hover:border-accent/30'}`}>
                {exp.highlight && <span className="inline-block text-xs tracking-[0.2em] uppercase text-accent mb-4">{exp.highlight}</span>}
                <h3 className="font-heading text-xl mb-2">{exp.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4"><MapPin className="w-4 h-4 text-accent" /><span>{exp.location}</span></div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{exp.desc}</p>
                <p className="text-sm font-medium text-accent">{exp.duration}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Advisory Form */}
      <div id="checkout">
        <section className="section-editorial border-t border-border py-16">
          <div className="container max-w-2xl px-6">
            <div className="text-center mb-8">
              <p className="caption-editorial text-accent mb-4">Begin Your Advisory</p>
              <h2 className="heading-section mb-4">Plan Your Expedition</h2>
            </div>
            <AdvisoryForm source_page="expeditions" defaultDestination="thailand" />
          </div>
        </section>
      </div>

      {/* PlanBForm */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Free Eligibility Assessment</h2>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">Your request has been received. We will contact you shortly.</p>
            </div>
          ) : (
            <PlanBForm onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      {/* Comparison & Cross-Sell */}
      <ComparisonCrossSell currentSlug="ha-giang-motor-expedition" />

      {/* Legal */}
      <section className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2"><AlertTriangle className="w-3 h-3" /><span>Safety Notice</span></div>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">All expeditions are conducted by licensed operators with comprehensive safety infrastructure.</p>
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center"><span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span></div>
      </footer>
      <StickyMobileCTA onClick={handleWhatsAppClick} />
    </div>
  );
}
