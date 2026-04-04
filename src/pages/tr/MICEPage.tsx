import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Building2, Users, Calendar, Globe, MessageCircle, Loader } from 'lucide-react';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import PlanBForm from '@/components/PlanBForm';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import ServiceCheckout from '@/components/service/ServiceCheckout';
import ServiceUpdateFallback from '@/components/tr/ServiceUpdateFallback';
import { supabase } from '@/integrations/supabase/client';
import { trackPostHogEvent } from '@/lib/posthog';
import { buildWhatsAppUrl } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import type { Service } from '@/pages/ServicePage';

const MICE_SLUG = 'mice-corporate';

const features = [
  { icon: Calendar, title: 'Etkinlik Planlama', desc: "A'dan Z'ye kurumsal etkinlik organizasyonu." },
  { icon: Users, title: 'Takım Buluşmaları', desc: "Remote ekipler için Tayland'da team-building." },
  { icon: Building2, title: 'Konferans & Seminer', desc: "Bangkok ve Phuket'te uluslararası konferans." },
  { icon: Globe, title: 'İncentive Turları', desc: 'Performans ödüllendirme ve motivasyon turları.' },
];

export default function MICEPage() {
  const { t } = useTranslation();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const fetchIdRef = useRef(0);

  const whatsappUrl = buildWhatsAppUrl('Sayfa: MICE | Domain: ' + window.location.hostname + ' | Merhaba, etkinliğimizi planlamak istiyoruz.');
  const handleWhatsAppClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'mice_page' }, true);
    setTimeout(() => window.open(whatsappUrl, '_blank'), 150);
  };

  useEffect(() => {
    const currentId = ++fetchIdRef.current;
    setIsLoading(true); setHasError(false); setService(null);
    supabase.from('services').select('*').eq('slug', MICE_SLUG).eq('is_active', true).maybeSingle()
      .then(({ data, error }) => {
        if (currentId !== fetchIdRef.current) return;
        if (error) { console.error('[MICE] Fetch error:', error); setHasError(true); setIsLoading(false); return; }
        if (data) setService(data as unknown as Service);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader className="mx-auto mt-10 h-8 w-8 animate-spin text-accent" /></div>;

  const isValid = service && service.id && service.stripe_price_id;
  if (hasError || !isValid) {
    if (!hasError) console.error('[MICE] Invalid service data:', service);
    return <div className="min-h-screen bg-background"><FocusedNavbar /><TrustBar /><ServiceUpdateFallback context="MICE" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Kurumsal Etkinlik & MICE — Plan B Asia" description="Tayland'da kurumsal etkinlik, konferans ve team-building." schemaType="Service" serviceName="MICE & Kurumsal Etkinlik" />
      <FocusedNavbar />
      <TrustBar />

      {/* CHECKOUT FIRST */}
      <ServiceCheckout service={service} />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')` }} />
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
            <p className="text-lg text-background/80 max-w-xl mb-10">Konferans, team-building, incentive turları. Uçtan uca organizasyon.</p>
            <button onClick={() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury-gold inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Hemen Başla
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16"><p className="caption-editorial text-accent mb-4">Hizmetler</p><h2 className="heading-section mb-4">Uçtan Uca Kurumsal Çözümler</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

      {/* PlanBForm — repurposed */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Ücretsiz Uygunluk Kontrolü</h2>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">Uygunluk ihtimaliniz yüksek. Süreci başlatmak için hemen yukarıdan danışmanlık paketini satın alabilirsiniz.</p>
              <Button onClick={() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto">Danışmanlık Paketini Satın Al ↑</Button>
            </div>
          ) : (
            <PlanBForm serviceId={service.id} onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-20 lg:py-32 bg-foreground text-background grain-overlay">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-section mb-6">Bir Sonraki Etkinliğiniz Burada</h2>
            <p className="body-editorial text-background/70 mb-8">Bize yazın, en uygun planı birlikte oluşturalım.</p>
            <button onClick={handleWhatsAppClick} className="btn-luxury-gold inline-flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp ile İletişime Geçin</button>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center"><span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span></div>
      </footer>
      <StickyMobileCTA onClick={() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })} />
    </div>
  );
}
