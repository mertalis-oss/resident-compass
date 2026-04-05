import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BookOpen, Utensils, Languages, Heart, Shield, ArrowRight, Clock, Loader } from 'lucide-react';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import PlanBForm from '@/components/PlanBForm';
import ServiceCheckout from '@/components/service/ServiceCheckout';
import ServiceWhoIsFor from '@/components/service/ServiceWhoIsFor';
import ExpectationOutcome from '@/components/service/ExpectationOutcome';
import TrustBlock from '@/components/service/TrustBlock';
import SocialProofMini from '@/components/service/SocialProofMini';
import FOMOBlock from '@/components/service/FOMOBlock';
import BundleSelector from '@/components/service/BundleSelector';
import ServiceUpdateFallback from '@/components/tr/ServiceUpdateFallback';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import type { Service } from '@/pages/ServicePage';

const BUNDLE_SLUGS = ['thai-language-6m', 'english-language-6m', 'thai-immersion-9m', 'english-mastery-12m'];

const courses = [
  { icon: Shield, title: 'Muay Thai Eğitim Programı', duration: '1-6 Ay', visa: 'ED Visa / DTV Visa', transition: 'Eğitim vizesinden oturma iznine geçiş imkânı', desc: "Tayland'ın en köklü kamplarında profesyonel eğitim. Vize süreci dahil." },
  { icon: Utensils, title: 'Culinary Arts — Mutfak Sanatları', duration: '2 Hafta - 3 Ay', visa: 'ED Visa', transition: 'Sertifika sonrası iş vizesine geçiş danışmanlığı', desc: 'Thai mutfağı ve Güneydoğu Asya gastronomi programları. Uluslararası sertifika.' },
  { icon: Languages, title: 'Dil Programları (Thai / İngilizce)', duration: '3-12 Ay', visa: 'ED Visa', transition: 'Uzun süreli kalış ve yerel entegrasyon', desc: 'Akredite dil okullarında yoğun program. Vize uzatma desteği dahil.' },
  { icon: Heart, title: 'Thai Massage & Wellness Sertifikası', duration: '2-8 Hafta', visa: 'DTV Visa / Tourist + Extension', transition: 'Wellness sektöründe kariyer geçişi', desc: 'Wat Pho akredite masaj ve wellness eğitimi. Uluslararası geçerli sertifika.' },
];

export default function SoftPowerPage() {
  const { t } = useTranslation();
  const [bundles, setBundles] = useState<Service[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    const currentFetchId = ++fetchIdRef.current;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    (async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .in('slug', BUNDLE_SLUGS)
          .eq('is_active', true)
          .abortSignal(controller.signal);

        clearTimeout(timer);
        if (currentFetchId !== fetchIdRef.current) return;

        if (error || !data || data.length === 0) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        // Validate all have valid stripe_price_id
        const valid = (data as unknown as Service[]).filter(
          (s) => s.stripe_price_id && s.stripe_price_id.startsWith('price_')
        );

        if (valid.length === 0) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        setBundles(valid);
        setIsLoading(false);
      } catch {
        clearTimeout(timer);
        if (currentFetchId !== fetchIdRef.current) return;
        setHasError(true);
        setIsLoading(false);
      }
    })();

    return () => { controller.abort(); clearTimeout(timer); };
  }, []);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader className="mx-auto mt-10 h-8 w-8 animate-spin text-accent" /></div>;
  if (hasError || bundles.length === 0) return <div className="min-h-screen bg-background"><FocusedNavbar /><TrustBar /><ServiceUpdateFallback context="Soft Power" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Asya'da Eğitim ve Yaşam Paketleri — Plan B Asia" description="Muay Thai, mutfak sanatları, dil programları ve wellness eğitimleri." schemaType="Service" serviceName="Soft Power Eğitim Paketleri" />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Eğitim & Yaşam Paketleri</span>
            </div>
            <h1 className="heading-display text-background mb-6">Asya'da Tutkunuzu Yaşayın:<span className="block text-accent">Özel Eğitim ve Yasal Kalış Paketleri.</span></h1>
            <p className="text-lg text-background/80 max-w-xl mb-10">Her program kendi fiyatlandırması ve başvuru süreci olan bağımsız bir hizmettir.</p>
            <button onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury-gold inline-flex items-center gap-2">Hemen Başla <ArrowRight className="w-4 h-4" /></button>
          </motion.div>
        </div>
      </section>

      {/* 2-4. Expectation → Trust → Social Proof */}
      <ExpectationOutcome />
      <TrustBlock />
      <SocialProofMini />

      {/* 5. FOMO & Price — show selected bundle or first */}
      <FOMOBlock service={selectedBundle || bundles[0]} />

      {/* 6. BUNDLE SELECTOR */}
      <BundleSelector bundles={bundles} selected={selectedBundle} onSelect={setSelectedBundle} />

      {/* 7. CHECKOUT (id="checkout") — ONLY renders if bundle selected */}
      <div id="checkout">
        {selectedBundle ? (
          <ServiceCheckout service={selectedBundle} />
        ) : (
          <section className="section-editorial border-t border-border">
            <div className="container max-w-2xl px-6 text-center py-12">
              <p className="text-sm text-muted-foreground">{t('softPower.selectToCheckout', { defaultValue: 'Ödeme bölümünü görmek için yukarıdan bir paket seçin.' })}</p>
            </div>
          </section>
        )}
      </div>

      {/* 8. WHO IS FOR */}
      <ServiceWhoIsFor />

      {/* 9. Content — Courses Grid */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Programlar</p>
            <h2 className="heading-section mb-4">4 Farklı Eğitim Yolu</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Her biri bağımsız vize uygunluğu ve fiyatlandırmaya sahiptir.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-card p-8 lg:p-10 border border-border hover:border-accent/30 transition-all duration-500">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-accent/10 flex items-center justify-center"><course.icon className="w-7 h-7 text-accent" /></div>
                  <div><h3 className="font-heading text-xl mb-1">{course.title}</h3><span className="text-sm text-accent">{course.visa}</span></div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{course.desc}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent flex-shrink-0" /><span>Süre: {course.duration}</span></div>
                  <div className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-accent flex-shrink-0" /><span className="text-muted-foreground">{course.transition}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">Her program kendi fiyatlandırması ve başvuru süreci olan bağımsız bir hizmettir. Plan B Asia resmi danışmanlık ve yönlendirme hizmeti sunmaktadır.</p>
        </div>
      </section>

      {/* PlanBForm */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Ücretsiz Uygunluk Kontrolü</h2>
          <p className="text-muted-foreground text-center mb-10 body-editorial">Hızlı ön değerlendirme yapın.</p>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">Uygunluk ihtimaliniz yüksek. Süreci başlatmak için hemen yukarıdan danışmanlık paketini satın alabilirsiniz.</p>
              <Button onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto">Danışmanlık Paketini Satın Al ↑</Button>
            </div>
          ) : (
            <PlanBForm serviceId={bundles[0]?.id} onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center"><span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span></div>
      </footer>
      <StickyMobileCTA onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} />
    </div>
  );
}
