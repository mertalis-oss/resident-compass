import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, BookOpen, Briefcase, Globe, Route, Mountain, Users, MessageCircle } from 'lucide-react';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import PlanBForm from '@/components/PlanBForm';
import { Button } from '@/components/ui/button';
import { buildWhatsAppUrl } from '@/lib/constants';
import { trackPostHogEvent } from '@/lib/posthog';

const context = [
  {
    icon: BookOpen,
    title: 'Kültürel Derinlik',
    desc: 'Kuzey Vietnam dil programları, geleneksel zanaatlar ve kültürel bütünleşme.',
  },
  {
    icon: Briefcase,
    title: 'Yumuşak İniş',
    desc: 'Konaklama, bankacılık, SIM kart, yerel oryantasyon — ilk günden yapılandırılmış destek.',
  },
  {
    icon: Globe,
    title: 'Yükselen Sınır',
    desc: "Güneydoğu Asya'nın en hızlı büyüyen ekonomisi. Dijital altyapısı hızla genişliyor.",
  },
];

const pathways = [
  {
    icon: Mountain,
    title: 'Ha Giang Keşfi',
    desc: "Vietnam'ın en dramatik dağ geçitlerinden ve etnik azınlık köylerinden geçen rehberli motor turu.",
  },
  {
    icon: Route,
    title: 'Hanoi Üs Kampı',
    desc: "Vietnam'ın kültür başkentinde çalışma üssünü kur. Ko-çalışma alanı, topluluk ve bağlantı.",
  },
  {
    icon: Users,
    title: 'Dil & Entegrasyon',
    desc: 'Kültürel mentorluk ve yerel ağ kurulumla eşleştirilmiş Vietnamca dil programları.',
  },
];

export default function VietnamPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const whatsappUrl = buildWhatsAppUrl(
    'Sayfa: Vietnam | Domain: ' +
      (typeof window !== 'undefined' ? window.location.hostname : '') +
      ' | Merhaba, Vietnam danışmanlığı hakkında bilgi almak istiyorum.'
  );

  const handleWhatsAppClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'vietnam_tr', intent: 'vietnam-advisory' }, true);
    try {
      window.open(whatsappUrl, '_blank');
    } catch {
      window.location.href = whatsappUrl;
    }
  };

  const scrollToForm = () => {
    document.getElementById('vietnam-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Vietnam — Kuzeyin Sessiz Güzergahı | Plan B Asya"
        description="Asya'nın yükselen sınırında kültürel çalışma ve yumuşak iniş. Vietnam taşınma süreci için stratejik danışmanlık."
        canonical="https://planbasya.com/tr/vietnam"
        schemaType="Service"
        serviceName="Vietnam Danışmanlığı"
      />
      <FocusedNavbar />
      <TrustBar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Destinasyon Danışmanlığı</span>
            </div>
            <h1 className="heading-display text-background mb-6">
              Kuzeyin Sessiz Güzergahı.
              <span className="block text-accent">Vietnam.</span>
            </h1>
            <p className="text-lg text-background/80 max-w-xl mb-10">
              Asya'nın yükselen sınırında kültürel çalışma ve yumuşak iniş.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={scrollToForm} className="btn-luxury-gold inline-flex items-center gap-2">
                Danışmanlığı Başlat
              </Button>
              <Button
                onClick={handleWhatsAppClick}
                variant="outline"
                className="inline-flex items-center gap-2 border-background/40 text-background hover:bg-background/10"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp ile Konuş
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Context */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Neden Vietnam</p>
            <h2 className="heading-section mb-4">Sessiz Ama Güçlü</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {context.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 border border-border hover:border-accent/30 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathways */}
      <section className="py-20 lg:py-32 bg-card border-y border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Güzergahlar</p>
            <h2 className="heading-section mb-4">Vietnam'a Giriş Yolunuz</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pathways.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background p-8 border border-border hover:border-accent/30 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="vietnam-form" className="py-20 bg-background border-b border-border">
        <div className="container max-w-2xl px-6">
          <div className="text-center mb-8">
            <p className="caption-editorial text-accent mb-4">Danışmanlığı Başlat</p>
            <h2 className="heading-section mb-4">Vietnam Sürecinizi Başlatın</h2>
          </div>
          {formSubmitted ? (
            <div className="text-center py-12">
              <p className="text-lg font-heading text-foreground mb-6">
                Talebiniz alındı. En kısa sürede geri döneceğiz.
              </p>
              <Button onClick={handleWhatsAppClick} className="btn-luxury-gold inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> WhatsApp ile İletişime Geçin
              </Button>
            </div>
          ) : (
            <PlanBForm serviceId="vietnam-tr" onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
        </div>
      </footer>

      <StickyMobileCTA onClick={scrollToForm} />
    </div>
  );
}
