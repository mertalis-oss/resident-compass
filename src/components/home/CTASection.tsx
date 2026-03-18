import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-32 lg:py-48 overflow-hidden grain-overlay">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
          alt={t('cta.bgAlt', { defaultValue: 'Luxury resort aerial view' })}
          width={2070}
          height={1380}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <p className="caption-editorial text-background/60 mb-6">
            {t('cta.label')}
          </p>
          <h2 className="heading-editorial text-background mb-8">
            {t('cta.headline')}
          </h2>
          <p className="body-large text-background/70 mb-12">
            {t('cta.body')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-luxury bg-background text-foreground hover:bg-background/90"
            >
              {t('cta.primaryBtn')}
            </motion.button>
            <Link to="/residency/dtv-thailand">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-luxury border border-background/50 text-background hover:bg-background/10"
              >
                {t('cta.secondaryBtn')}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
