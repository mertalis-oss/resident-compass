import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mountain, Shield, MapPin, ArrowRight, AlertTriangle, Loader } from 'lucide-react';
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

import ServiceUpdateFallback from '@/components/tr/ServiceUpdateFallback';
import { useServicesList } from '@/hooks/useServicesList';
import { Button } from '@/components/ui/button';

const expeditions = [
  { title: 'Ha Giang Motor Expedition', location: 'Vietnam — Ha Giang', duration: '4-7 Gün', desc: "Vietnam'ın en dramatik dağ yollarında rehberli motosiklet ekspedisyonu.", highlight: 'En Popüler' },
  { title: 'Kuzey Tayland Keşif Rotası', location: 'Tayland — Chiang Mai & Chiang Rai', duration: '5-10 Gün', desc: 'Tapınaklar, dağ köyleri ve doğa yürüyüşleri.', highlight: null },
  { title: 'Kamboçya & Laos Sınır Ötesi', location: 'Kamboçya — Laos', duration: '7-14 Gün', desc: "Angkor Wat'tan Luang Prabang'a uzanan sınır ötesi keşif rotası.", highlight: null },
];

export default function ExpeditionsPage() {
  const { t } = useTranslation();
  const { services, isLoading, hasError } = useServicesList('expeditions', 'tr');
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader className="mx-auto mt-10 h-8 w-8 animate-spin text-accent" /></div>;

  const hasServices = services.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Keşif Ekspedisyonları — Plan B Asya" description="Güneydoğu Asya'da rehberli motor ve keşif ekspedisyonları." schemaType="Service" serviceName="Keşif Ekspedisyonları" />
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
              <span className="text-sm text-background/90 tracking-wide">Keşif Operasyonları</span>
            </div>
            <h1 className="heading-display text-background mb-6">Güneydoğu Asya'nın<span className="block text-accent">Keşfedilmemiş Rotaları.</span></h1>
            <p className="text-lg text-background/80 max-w-xl mb-10">Lisanslı ve rehberli ekspedisyonlar.</p>
            <button onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury-gold inline-flex items-center gap-2">Hemen Başla <ArrowRight className="w-4 h-4" /></button>
          </motion.div>
        </div>
      </section>

      {/* 2-4 */}
      <ExpectationOutcome />
      <TrustBlock />
      <SocialProofMini />

      {/* 5. CHECKOUT */}
      {hasServices ? (
        <div id="checkout" className="scroll-mt-24 md:scroll-mt-32">
          <section className="section-editorial border-t border-border py-16">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="min-h-[480px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {services.map((s) => (
                  <ServiceCheckout key={s.id} service={s} />
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div id="checkout" className="scroll-mt-24 md:scroll-mt-32">
          <ServiceUpdateFallback context="Expeditions" />
        </div>
      )}

      {/* 7. WHO IS FOR */}
      <ServiceWhoIsFor />

      {/* 8. Content — Safety + Grid */}
      <section className="py-6 bg-accent/5 border-y border-accent/20">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-center gap-3">
          <Shield className="w-5 h-5 text-accent flex-shrink-0" />
          <p className="text-sm text-foreground font-medium">Lisanslı ve Rehberli Operasyon.</p>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16"><p className="caption-editorial text-accent mb-4">Rotalar</p><h2 className="heading-section mb-4">Aktif Ekspedisyonlar</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* PlanBForm */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Ücretsiz Uygunluk Kontrolü</h2>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">Talebiniz alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.</p>
            </div>
          ) : (
            <PlanBForm serviceId={services[0]?.id} onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      {/* Comparison & Cross-Sell */}
      <ComparisonCrossSell currentSlug="expedition-jungle" />

      {/* Legal */}
      <section className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2"><AlertTriangle className="w-3 h-3" /><span>Güvenlik Bildirimi</span></div>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">Tüm ekspedisyonlar lisanslı operatörler tarafından yürütülmektedir.</p>
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center"><span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span></div>
      </footer>
      <StickyMobileCTA onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} />
    </div>
  );
}
