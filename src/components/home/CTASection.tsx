import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-32 lg:py-48 overflow-hidden grain-overlay">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop')`,
          }}
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
            {t('calculator.subtitle')}
          </p>
          <h2 className="heading-editorial text-background mb-8">
            {t('calculator.title')}
          </h2>
          <p className="body-large text-background/70 mb-12">
            {t('form.success')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tools/dtv-visa-calculator">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-luxury bg-background text-foreground hover:bg-background/90"
              >
                {t('calculator.cta')}
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-luxury border border-background/50 text-background hover:bg-background/10"
              >
                {t('nav.getStarted')}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
