import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mountain, Shield, MapPin, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import PlanBForm from '@/components/PlanBForm';

const expeditions = [
  {
    title: 'Ha Giang Motor Expedition',
    location: 'Vietnam — Ha Giang',
    duration: '4-7 Gün',
    desc: 'Vietnam\'ın en dramatik dağ yollarında rehberli motosiklet ekspedisyonu. Tüm ekipman ve konaklama dahil.',
    highlight: 'En Popüler',
  },
  {
    title: 'Kuzey Tayland Keşif Rotası',
    location: 'Tayland — Chiang Mai & Chiang Rai',
    duration: '5-10 Gün',
    desc: 'Tapınaklar, dağ köyleri ve doğa yürüyüşleri. Kültürel derinlik ve macera bir arada.',
    highlight: null,
  },
  {
    title: 'Kamboçya & Laos Sınır Ötesi',
    location: 'Kamboçya — Laos',
    duration: '7-14 Gün',
    desc: 'Angkor Wat\'tan Luang Prabang\'a uzanan sınır ötesi keşif rotası.',
    highlight: null,
  },
];

export default function ExpeditionsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Keşif Ekspedisyonları — Plan B Asia"
        description="Güneydoğu Asya'da rehberli motor ve keşif ekspedisyonları. Lisanslı operasyon."
        schemaType="Service"
        serviceName="Keşif Ekspedisyonları"
      />
      <FocusedNavbar />
      <TrustBar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <Mountain className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Keşif Operasyonları</span>
            </div>
            <h1 className="heading-display text-background mb-6">
              Güneydoğu Asya'nın
              <span className="block text-accent">Keşfedilmemiş Rotaları.</span>
            </h1>
            <p className="text-lg text-background/80 max-w-xl mb-10">
              Lisanslı ve rehberli ekspedisyonlar. Tüm güvenlik protokolleri titizlikle uygulanmaktadır.
            </p>
            <Link to="/tools/dtv-visa-calculator" className="btn-luxury-gold inline-flex items-center gap-2">
              Rotanı Keşfet <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Safety Legal Banner */}
      <section className="py-6 bg-accent/5 border-y border-accent/20">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-center gap-3">
          <Shield className="w-5 h-5 text-accent flex-shrink-0" />
          <p className="text-sm text-foreground font-medium">
            Lisanslı ve Rehberli Operasyon. Tüm güvenlik protokolleri titizlikle uygulanmaktadır.
          </p>
        </div>
      </section>

      {/* Expeditions Grid */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Rotalar</p>
            <h2 className="heading-section mb-4">Aktif Ekspedisyonlar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {expeditions.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card p-8 border transition-all duration-500 ${
                  exp.highlight ? 'border-accent/40 shadow-[0_0_40px_rgba(212,175,55,0.15)]' : 'border-border hover:border-accent/30'
                }`}
              >
                {exp.highlight && (
                  <span className="inline-block text-xs tracking-[0.2em] uppercase text-accent mb-4">{exp.highlight}</span>
                )}
                <h3 className="font-heading text-xl mb-2">{exp.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{exp.location}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{exp.desc}</p>
                <p className="text-sm font-medium text-accent">{exp.duration}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <PlanBForm />

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-foreground text-background grain-overlay">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-section mb-6">Maceraya Hazır mısın?</h2>
            <p className="body-editorial text-background/70 mb-8">Ücretsiz keşif görüşmesiyle başla.</p>
            <Link to="/tools/dtv-visa-calculator?checkout=true" className="btn-luxury-gold inline-block">Keşif Başlat</Link>
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
            <AlertTriangle className="w-3 h-3" />
            <span>Güvenlik Bildirimi</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tüm ekspedisyonlar lisanslı operatörler tarafından yürütülmektedir. Katılımcıların seyahat sigortası yaptırması zorunludur. Plan B Asia organizatör ve danışman olarak hizmet vermektedir.
          </p>
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
