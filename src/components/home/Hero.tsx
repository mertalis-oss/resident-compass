import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-beach.jpg';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isTR = i18n.language === 'tr';

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const handlePrimaryCTA = () => {
    navigate(isTR ? '/tr/mobility-assessment' : '/mobility-assessment');
  };

  const handleSecondaryCTA = () => {
    const portalsEl = document.getElementById('portals-section');
    if (portalsEl) {
      portalsEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(isTR ? '/tr' : '/');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Image Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Serene morning beach in Koh Phangan, Thailand"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/75" />
      </div>

      {/* Grain Texture */}
      <div className="absolute inset-0 grain-overlay pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] text-background mb-6">
            {t('hero.title').split('\n').map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.15 }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="w-20 h-px bg-accent mx-auto mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-base md:text-lg lg:text-xl text-background/85 mb-3 leading-relaxed max-w-2xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="text-sm md:text-base text-background/65 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            {t('hero.hook')}
          </motion.p>

          {/* Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Button
              size="lg"
              onClick={handlePrimaryCTA}
              className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
            >
              {t('hero.cta')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleSecondaryCTA}
              className="btn-luxury-outline border-background/30 text-background hover:bg-background/10 hover:text-background text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
            >
              {t('hero.ctaSecondary', { defaultValue: 'View Packages' })}
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="caption-editorial text-background/50 tracking-[0.3em]"
          >
            {t('hero.ctaSub')}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer group"
        aria-label={t('hero.scrollDown', { defaultValue: 'Scroll down' })}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-background/60 group-hover:text-background/80 transition-colors">
            {t('hero.explore', { defaultValue: 'Explore' })}
          </span>
          <ChevronDown className="w-5 h-5 text-background/60 group-hover:text-background/80 transition-colors" />
        </motion.div>
      </motion.button>
    </section>
  );
}
