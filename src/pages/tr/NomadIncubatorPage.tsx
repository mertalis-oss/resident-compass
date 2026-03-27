import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Building2, Globe, Calculator, Users, Zap, Shield, ArrowRight, CheckCircle, Home, Briefcase, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import StickyMobileCTA from '@/components/StickyMobileCTA';

const services = [
  { icon: Building2, titleKey: 'nomad.s1Title', subtitleKey: 'nomad.s1Sub', descKey: 'nomad.s1Desc', features: ['Estonya e-Residency başvurusu', 'ABD Wyoming/Delaware LLC', 'Singapur Pte. Ltd.', 'Dubai Serbest Bölge şirketi'] },
  { icon: Calculator, titleKey: 'nomad.s2Title', subtitleKey: 'nomad.s2Sub', descKey: 'nomad.s2Desc', features: ['Vergi mukimliği analizi', 'Çifte vergilendirme önleme', 'Kripto & yatırım geliri planlaması', 'Türkiye çıkış stratejisi'] },
  { icon: Globe, titleKey: 'nomad.s3Title', subtitleKey: 'nomad.s3Sub', descKey: 'nomad.s3Desc', features: ['Karayip CBI programları', 'Portekiz/İspanya Golden Visa', 'Soy bağı (İtalya, İrlanda)', 'Tayland Elite Visa'] },
  { icon: Users, titleKey: 'nomad.s4Title', subtitleKey: 'nomad.s4Sub', descKey: 'nomad.s4Desc', features: ['Aylık networking akşamları', 'Özel mastermind grupları', 'Yatırımcı tanıştırma', 'Co-living deneyimleri'] },
];

const fullLifeItems = [
  { icon: Home, label: 'Konaklama ve yaşam alanı kurulumu' },
  { icon: Briefcase, label: 'Şirket ve banka hesabı açılışı' },
  { icon: Heart, label: 'Sağlık sigortası ve klinik ağı' },
  { icon: MapPin, label: 'Vize ve oturma izni süreci' },
  { icon: Globe, label: 'Vergi optimizasyonu ve çıkış planı' },
  { icon: Users, label: 'Topluluk ve networking erişimi' },
];

export default function NomadIncubatorPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={t('nomad.seoTitle', { defaultValue: 'Dijital Göçebe Kuluçka — Plan B Asia' })} description={t('nomad.seoDesc', { defaultValue: 'Şirket kurulumu, vergi optimizasyonu, ikinci pasaport.' })} />
      <FocusedNavbar />
      <TrustBar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(to right, hsl(var(--accent)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--accent)) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/80" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/80 tracking-wide">{t('nomad.badge', { defaultValue: 'Dijital Göçebeler için İş Altyapısı' })}</span>
            </div>
            <h1 className="heading-display text-background mb-6">
              {t('nomad.heroTitle', { defaultValue: 'Nerede Yaşarsan Yaşa,' })}
              <span className="block text-accent">{t('nomad.heroAccent', { defaultValue: 'İşini Global Yap.' })}</span>
            </h1>
            <p className="text-lg text-background/70 max-w-xl mb-4">{t('nomad.heroDesc', { defaultValue: 'Şirket kurulumu, vergi optimizasyonu, ikinci pasaport ve güçlü bir topluluk — dijital göçebe hayatının tüm altyapısı tek çatı altında.' })}</p>
            
            {/* 360° Outcome Statement */}
            <div className="bg-accent/10 border border-accent/20 px-6 py-4 mb-10 max-w-xl">
              <p className="text-background font-heading text-lg">
                {t('nomad.outcomeStatement', { defaultValue: "Asya'da 30 gün içinde tamamen kurulu bir hayat." })}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/tools/dtv-visa-calculator?checkout=true" className="btn-luxury-gold inline-flex items-center gap-2">
                {t('nomad.ctaJoin', { defaultValue: 'Kuluçkaya Katıl' })} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 360° Life Setup */}
      <section className="py-20 lg:py-28 bg-card border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">{t('nomad.fullLifeLabel', { defaultValue: '360° Yaşam Kurulumu' })}</p>
            <h2 className="heading-section mb-4">{t('nomad.fullLifeTitle', { defaultValue: '30 Günde Tamamen Kurulu Hayat' })}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t('nomad.fullLifeDesc', { defaultValue: 'Vize, konaklama, şirket, banka, sigorta, topluluk — her şeyi biz hallederiz.' })}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {fullLifeItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">{t('nomad.servicesLabel', { defaultValue: 'Hizmetler' })}</p>
            <h2 className="heading-section mb-4">{t('nomad.servicesTitle', { defaultValue: 'Kuluçka Programı' })}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-card p-8 lg:p-10 border border-border hover:border-accent/30 transition-all duration-500">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-accent/10 flex items-center justify-center"><service.icon className="w-7 h-7 text-accent" /></div>
                  <div><h3 className="font-heading text-xl mb-1">{t(service.titleKey)}</h3><span className="text-sm text-accent">{t(service.subtitleKey)}</span></div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{t(service.descKey)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-accent flex-shrink-0" /><span>{f}</span></div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-foreground text-background grain-overlay">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <Zap className="w-12 h-12 text-accent mx-auto mb-8" />
            <h2 className="heading-section mb-6">{t('nomad.ctaTitle', { defaultValue: 'Kuluçkaya Katıl' })}</h2>
            <p className="body-editorial text-background/70 mb-8">{t('nomad.ctaBody', { defaultValue: 'Ücretsiz 30 dakikalık strateji görüşmesiyle başla.' })}</p>
            <Link to="/tools/dtv-visa-calculator?checkout=true" className="btn-luxury-gold inline-block">{t('nomad.ctaBtn', { defaultValue: 'Ücretsiz Strateji Görüşmesi' })}</Link>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span>
        </div>
      </footer>

      <StickyMobileCTA onClick={() => window.location.href = '/tools/dtv-visa-calculator?checkout=true'} />
    </div>
  );
}
