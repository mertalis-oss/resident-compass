import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Calendar, Globe, MessageCircle } from 'lucide-react';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import PlanBForm from '@/components/PlanBForm';
import ComparisonCrossSell from '@/components/service/ComparisonCrossSell';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import ServiceWhoIsFor from '@/components/service/ServiceWhoIsFor';
import ExpectationOutcome from '@/components/service/ExpectationOutcome';
import TrustBlock from '@/components/service/TrustBlock';
import SocialProofMini from '@/components/service/SocialProofMini';
import AdvisoryForm from '@/components/advisory/AdvisoryForm';
import { buildWhatsAppUrl } from '@/lib/constants';
import { trackPostHogEvent } from '@/lib/posthog';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Calendar, title: 'Event Planning', desc: 'End-to-end corporate event orchestration across Southeast Asia.' },
  { icon: Users, title: 'Team Retreats', desc: 'Remote team reunions and team-building in Thailand.' },
  { icon: Building2, title: 'Conferences & Seminars', desc: 'International conferences in Bangkok and Phuket.' },
  { icon: Globe, title: 'Incentive Tours', desc: 'Performance reward and motivation tours for high-performing teams.' },
];

export default function MICEPageEN() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const whatsappUrl = buildWhatsAppUrl('Page: MICE | Intent: event-planning | Domain: ' + (typeof window !== 'undefined' ? window.location.hostname : ''));
  const handleWhatsAppClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'mice_en', intent: 'event-planning' }, true);
    try { window.open(whatsappUrl, '_blank'); } catch { window.location.href = whatsappUrl; }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="MICE & Corporate Events — The Architecture of Influence | Plan B Asia" description="Corporate event planning, conferences, team retreats, and incentive tours in Southeast Asia." canonical="https://planbasia.com/corporate/mice" schemaType="Service" serviceName="MICE & Corporate Events" />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <Building2 className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Corporate Solutions</span>
            </div>
            <h1 className="heading-display text-background mb-6">From Leadership Retreats to Global Events.<span className="block text-accent">Southeast Asia.</span></h1>
            <p className="text-lg text-background/80 max-w-xl mb-4">10+ years delivering flawless press launches, autoshows, and dealer conventions across Southeast Asia.</p>
            <p className="text-background/60 text-sm mb-10">Confidential inquiry. Direct strategist review within 24 hours.</p>
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

      {/* 6. Features */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16"><p className="caption-editorial text-accent mb-4">Services</p><h2 className="heading-section mb-4">End-to-End Corporate Solutions</h2></div>
          <div className="min-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card p-8 lg:p-10 border border-border hover:border-accent/30 transition-all duration-500">
                <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mb-6"><feature.icon className="w-7 h-7 text-accent" /></div>
                <h3 className="font-heading text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Advisory Form */}
      <div id="checkout">
        <section className="section-editorial border-t border-border py-16">
          <div className="container max-w-2xl px-6">
            <div className="text-center mb-8">
              <p className="caption-editorial text-accent mb-4">Begin Your Advisory</p>
              <h2 className="heading-section mb-4">Initialize Your Event Blueprint</h2>
            </div>
            <AdvisoryForm variant="mice" source_page="mice" />
          </div>
        </section>
      </div>

      {/* PlanBForm */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Confidential Inquiry</h2>
          <p className="text-muted-foreground text-center mb-10 body-editorial">Confidential inquiry. Direct strategist review within 24 hours.</p>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">Your request has been received. We will contact you shortly.</p>
              <Button onClick={handleWhatsAppClick} className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto inline-flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Speak with Strategic Advisor</Button>
            </div>
          ) : (
            <PlanBForm onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      {/* Comparison & Cross-Sell */}
      <ComparisonCrossSell currentSlug="mice-thailand" />

      {/* WhatsApp CTA */}
      <section className="py-20 lg:py-32 bg-foreground text-background grain-overlay">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-section text-background mb-6">Your Next Event Starts Here</h2>
            <p className="body-editorial text-background/70 mb-8">Let us design the experience your organization deserves.</p>
            <button onClick={handleWhatsAppClick} className="btn-luxury-gold inline-flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Speak with Strategic Advisor</button>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center"><span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span></div>
      </footer>
      <StickyMobileCTA onClick={handleWhatsAppClick} />
    </div>
  );
}
