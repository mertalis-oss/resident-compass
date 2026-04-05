import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, ChevronDown, Loader } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import ServiceCheckout from '@/components/service/ServiceCheckout';
import PlanBForm from '@/components/PlanBForm';
import ServiceUpdateFallback from '@/components/tr/ServiceUpdateFallback';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import type { Service } from '@/pages/ServicePage';

const DTV_SERVICE_SLUG = 'dtv-vize';

const processSteps = [
  { step: 1, titleKey: 'dtvVize.proc1Title', descKey: 'dtvVize.proc1Desc' },
  { step: 2, titleKey: 'dtvVize.proc2Title', descKey: 'dtvVize.proc2Desc' },
  { step: 3, titleKey: 'dtvVize.proc3Title', descKey: 'dtvVize.proc3Desc' },
];

const faqs = [
  { qKey: 'dtvVize.faq1Q', aKey: 'dtvVize.faq1A' },
  { qKey: 'dtvVize.faq2Q', aKey: 'dtvVize.faq2A' },
  { qKey: 'dtvVize.faq3Q', aKey: 'dtvVize.faq3A' },
  { qKey: 'dtvVize.faq4Q', aKey: 'dtvVize.faq4A' },
  { qKey: 'dtvVize.faq5Q', aKey: 'dtvVize.faq5A' },
  { qKey: 'dtvVize.faq6Q', aKey: 'dtvVize.faq6A' },
];

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

export default function DTVVizePage() {
  const { t } = useTranslation();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const fetchIdRef = useRef(0);

  // State A: Race-condition-safe client-side fetch with no-cache
  useEffect(() => {
    const currentId = ++fetchIdRef.current;
    setIsLoading(true);
    setHasError(false);
    setService(null);

    supabase
      .from('services')
      .select('*')
      .eq('slug', DTV_SERVICE_SLUG)
      .eq('is_active', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (currentId !== fetchIdRef.current) return; // stale request
        if (error) {
          console.error('[DTV] Fetch error:', error);
          setHasError(true);
          setIsLoading(false);
          return;
        }
        if (data) setService(data as unknown as Service);
        setIsLoading(false);
      });
  }, []);

  // STATE A: Strict Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="mx-auto mt-10 h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  // STATE B & C: Error or invalid data
  const isValid = service && service.id && service.stripe_price_id;
  if (hasError || !isValid) {
    if (!hasError) console.error('[DTV] Invalid service data:', service);
    return (
      <div className="min-h-screen bg-background">
        <FocusedNavbar />
        <TrustBar />
        <ServiceUpdateFallback context="DTV Vize" />
      </div>
    );
  }

  // STATE D: Valid service — Checkout-first model
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={t('dtvVize.seoTitle', { defaultValue: 'Tayland DTV Vizesi — Plan B Asia' })} description={t('dtvVize.seoDesc', { defaultValue: "Tayland'da 5 yıl yaşama ve çalışma özgürlüğü." })} />
      <FocusedNavbar />
      <TrustBar />

      {/* CHECKOUT FIRST — above the fold */}
      <ServiceCheckout service={service} />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2039&auto=format&fit=crop')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">{t('dtvVize.badge', { defaultValue: 'Resmi Onaylı Danışmanlık' })}</span>
            </div>
            <h1 className="heading-display text-background mb-6">
              {t('dtvVize.heroTitle', { defaultValue: "Tayland'da 5 Yıl Yaşama ve Çalışma Özgürlüğü." })}
              <span className="block text-accent">{t('dtvVize.heroAccent', { defaultValue: 'Tek Başvuru.' })}</span>
            </h1>
            <p className="text-lg text-background/80 max-w-xl mb-8">{t('dtvVize.heroDesc', { defaultValue: 'Dijital göçebeler için tasarlanan DTV vizesi ile 180 gün kalış hakkı, sınırsız giriş-çıkış ve 5 yıllık geçerlilik.' })}</p>
            <div className="mb-8">
              <p className="font-heading text-3xl md:text-4xl text-accent mb-2">
                {formatPrice(service.price, service.currency || 'USD')}
              </p>
              <p className="text-sm text-background/60">{t('dtvVize.priceNote', { defaultValue: '45 dakikalık stratejik danışmanlık görüşmesi' })}</p>
            </div>
            <div className="flex items-center gap-3 mb-10">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-background/90 font-medium">{t('dtvVize.scarcity', { defaultValue: '2026 Kotaları Dolmadan Yerini Ayırt' })}</span>
            </div>
            <button
              onClick={() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-luxury-gold inline-block"
            >
              {t('dtvVize.heroCta', { defaultValue: 'Hemen Başla' })}
            </button>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-background/50 text-xs uppercase tracking-widest">{t('dtvVize.explore', { defaultValue: 'Keşfet' })}</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ChevronDown className="w-5 h-5 text-background/50" /></motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '5 Yıl', label: t('dtvVize.stat1', { defaultValue: 'Geçerlilik Süresi' }) },
              { value: '180 Gün', label: t('dtvVize.stat2', { defaultValue: 'Her Girişte Kalış' }) },
              { value: 'Sınırsız', label: t('dtvVize.stat3', { defaultValue: 'Giriş-Çıkış Hakkı' }) },
              { value: '%100', label: t('dtvVize.stat4', { defaultValue: 'Onay Garantisi*' }) },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-accent mb-2">{item.value}</p>
                <p className="caption-editorial text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">{t('dtvVize.processLabel', { defaultValue: 'Süreç' })}</p>
            <h2 className="heading-section">{t('dtvVize.processTitle', { defaultValue: 'Üç Adımda Yeni Hayatına Başla' })}</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {processSteps.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="flex gap-6 mb-12 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-heading text-2xl font-medium">{item.step}</div>
                  {i < processSteps.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-accent/50 to-border mt-4" />}
                </div>
                <div className="flex-1 pt-2 pb-8">
                  <h3 className="font-heading text-xl md:text-2xl mb-3">{t(item.titleKey)}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t(item.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">{t('dtvVize.faqLabel', { defaultValue: 'Sık Sorulan Sorular' })}</p>
            <h2 className="heading-section">{t('dtvVize.faqTitle', { defaultValue: 'Merak Ettiklerin' })}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border px-6 data-[state=open]:ring-1 data-[state=open]:ring-accent/30">
                  <AccordionTrigger className="text-left font-heading text-lg hover:no-underline hover:text-accent transition-colors py-5">{t(faq.qKey)}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">{t(faq.aKey)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* PlanBForm — repurposed as free tool */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">{t('dtvVize.formTitle', { defaultValue: 'Ücretsiz Uygunluk Kontrolü' })}</h2>
          <p className="text-muted-foreground text-center mb-10 body-editorial">
            {t('dtvVize.formDesc', { defaultValue: 'Hızlı bir ön değerlendirme yapın. Ardından danışmanlık paketinizi satın alabilirsiniz.' })}
          </p>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">
                Uygunluk ihtimaliniz yüksek. Süreci başlatmak için hemen yukarıdan danışmanlık paketini satın alabilirsiniz.
              </p>
              <Button
                onClick={() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
              >
                Danışmanlık Paketini Satın Al ↑
              </Button>
            </div>
          ) : (
            <PlanBForm serviceId={service.id} onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span>
        </div>
      </footer>
    </div>
  );
}
