import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Building2, Users, Calendar, Globe, MessageCircle } from 'lucide-react';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import PlanBForm from '@/components/PlanBForm';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import { trackPostHogEvent } from '@/lib/posthog';

const WHATSAPP_NUMBER = '905551234567';

const features = [
  { icon: Calendar, title: 'Etkinlik Planlama', desc: 'A\'dan Z\'ye kurumsal etkinlik organizasyonu. Mekan seçimi, lojistik, catering.' },
  { icon: Users, title: 'Takım Buluşmaları', desc: 'Remote ekipler için Tayland\'da motivasyon ve team-building programları.' },
  { icon: Building2, title: 'Konferans & Seminer', desc: 'Bangkok ve Phuket\'te uluslararası standartta konferans organizasyonu.' },
  { icon: Globe, title: 'İncentive Turları', desc: 'Performans ödüllendirme ve motivasyon turları. Özel rotalar ve deneyimler.' },
];

export default function MICEPage() {
  const { t } = useTranslation();

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Merhaba, kurumsal etkinlik planlamak istiyorum. Detayları konuşabilir miyiz?')}`;

  const handleWhatsAppClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'mice_page' }, true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 150);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Kurumsal Etkinlik & MICE — Plan B Asia"
        description="Tayland'da kurumsal etkinlik, konferans, team-building ve incentive turları."
        schemaType="Service"
        serviceName="MICE & Kurumsal Etkinlik"
      />
      <FocusedNavbar />
      <TrustBar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <Building2 className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Kurumsal Çözümler</span>
            </div>
            <h1 className="heading-display text-background mb-6">
              Kurumsal Etkinliklerinizi
              <span className="block text-accent">Asya'da Planlayalım.</span>
            </h1>
            <p className="text-lg text-background/80 max-w-xl mb-10">
              Konferans, team-building, incentive turları ve özel kurumsal deneyimler. Tayland ve Güneydoğu Asya'da uçtan uca organizasyon.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="btn-luxury-gold inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Etkinliğinizi Planlayalım
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Hizmetler</p>
            <h2 className="heading-section mb-4">Uçtan Uca Kurumsal Çözümler</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 lg:p-10 border border-border hover:border-accent/30 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form — NO Stripe */}
      <PlanBForm />

      {/* Final CTA — Lead-gen only */}
      <section className="py-20 lg:py-32 bg-foreground text-background grain-overlay">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-section mb-6">Bir Sonraki Etkinliğiniz Burada</h2>
            <p className="body-editorial text-background/70 mb-8">Bize yazın, en uygun planı birlikte oluşturalım.</p>
            <button onClick={handleWhatsAppClick} className="btn-luxury-gold inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> WhatsApp ile İletişime Geçin
            </button>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span>
        </div>
      </footer>

      <StickyMobileCTA onClick={handleWhatsAppClick} />
    </div>
  );
}
