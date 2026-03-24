import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Leaf, Moon, Heart, Waves, TreePine } from 'lucide-react';
import { Link } from 'react-router-dom';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';

const offerings = [
  { icon: Moon, titleKey: 'rabbitHole.o1Title', descKey: 'rabbitHole.o1Desc', duration: '3-7 gün', location: 'Koh Phangan, Private Jungle Retreat' },
  { icon: Waves, titleKey: 'rabbitHole.o2Title', descKey: 'rabbitHole.o2Desc', duration: '5-14 gün', location: 'Tayland & Vietnam Orman Merkezleri' },
  { icon: Leaf, titleKey: 'rabbitHole.o3Title', descKey: 'rabbitHole.o3Desc', duration: 'Devam eden', location: 'Online & Yüz yüze' },
  { icon: TreePine, titleKey: 'rabbitHole.o4Title', descKey: 'rabbitHole.o4Desc', duration: 'Dönemsel', location: 'Koh Phangan Private Jungle' },
];

const principles = [
  { titleKey: 'rabbitHole.p1Title', descKey: 'rabbitHole.p1Desc' },
  { titleKey: 'rabbitHole.p2Title', descKey: 'rabbitHole.p2Desc' },
  { titleKey: 'rabbitHole.p3Title', descKey: 'rabbitHole.p3Desc' },
  { titleKey: 'rabbitHole.p4Title', descKey: 'rabbitHole.p4Desc' },
];

export default function RabbitHolePage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => { document.documentElement.classList.remove('dark'); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={t('rabbitHole.seoTitle', { defaultValue: 'İçsel Keşif Yolculuğu — Plan B Asia' })} description={t('rabbitHole.seoDesc', { defaultValue: 'Bilinçaltının katmanlarını keşfet.' })} />
      <FocusedNavbar />
      <TrustBar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop')` }} />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/95 via-slate-950/90 to-cyan-950/80" />
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-cyan-400/30" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1], y: [0, -30, 0] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
            ))}
          </div>
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            <div className="inline-flex items-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400/80 text-sm uppercase tracking-[0.3em]">{t('rabbitHole.badge', { defaultValue: 'İçsel Yolculuk' })}</span>
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium text-white mb-6 leading-tight">
              {t('rabbitHole.heroTitle', { defaultValue: 'Derinlere Dalış' })}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                {t('rabbitHole.heroSub', { defaultValue: 'İçsel Keşif Yolculuğu' })}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
              {t('rabbitHole.heroDesc', { defaultValue: 'Bilinçaltının katmanlarını keşfet. Binlerce yıllık geleneksel pratiklerin modern güvenlik standartlarıyla buluştuğu eşsiz deneyimler.' })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#deneyimler" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm uppercase tracking-[0.15em] font-medium hover:from-purple-500 hover:to-cyan-500 transition-all">
                {t('rabbitHole.ctaExplore', { defaultValue: 'Deneyimleri Keşfet' })}
              </a>
              <a href="#ilkeler" className="px-8 py-4 border border-white/20 text-white/80 text-sm uppercase tracking-[0.15em] hover:bg-white/5 transition-all">
                {t('rabbitHole.ctaSafety', { defaultValue: 'Güvenlik İlkelerimiz' })}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offerings */}
      <section id="deneyimler" className="py-24 lg:py-32 bg-slate-950 scroll-mt-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm uppercase tracking-[0.2em] mb-4">{t('rabbitHole.programsLabel', { defaultValue: 'Programlar' })}</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-4">{t('rabbitHole.programsTitle', { defaultValue: "Doğa Ana'nın Hediyeleri" })}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {offerings.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative bg-gradient-to-br from-slate-900/80 to-purple-950/30 border border-white/10 p-8 lg:p-10 hover:border-purple-500/30 transition-all duration-500">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl text-white mb-3">{t(item.titleKey)}</h3>
                  <p className="text-white/50 leading-relaxed mb-6">{t(item.descKey)}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-purple-400">⏱ {item.duration}</span>
                    <span className="text-cyan-400/70">📍 {item.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section id="ilkeler" className="py-24 lg:py-32 bg-gradient-to-b from-slate-950 to-purple-950/30 scroll-mt-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-purple-400 text-sm uppercase tracking-[0.2em] mb-4">{t('rabbitHole.principlesLabel', { defaultValue: 'Taahhütlerimiz' })}</p>
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">{t('rabbitHole.principlesTitle', { defaultValue: 'Güvenlik İlkelerimiz' })}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-heading text-lg text-white mb-2">{t(item.titleKey)}</h4>
                <p className="text-sm text-white/40">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-slate-950">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-6">{t('rabbitHole.ctaTitle', { defaultValue: 'Bu Yolculuk Sana Uygun mu?' })}</h2>
            <p className="text-white/50 mb-8 leading-relaxed">{t('rabbitHole.ctaBody', { defaultValue: 'Gizli, bağlayıcı olmayan bir görüşme ile senin için doğru olup olmadığını birlikte değerlendirelim.' })}</p>
            <Link to="/tools/dtv-visa-calculator" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm uppercase tracking-[0.15em] font-medium hover:from-purple-500 hover:to-pink-500 transition-all">
              {t('rabbitHole.ctaBtn', { defaultValue: 'Değerlendirme Başlat' })}
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-slate-950 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="text-white/40 hover:text-white/60 transition-colors text-sm">← {t('rabbitHole.backHome', { defaultValue: 'Ana Sayfaya Dön' })}</Link>
          <p className="text-white/20 text-xs">Plan B Asia</p>
        </div>
      </footer>
    </div>
  );
}
