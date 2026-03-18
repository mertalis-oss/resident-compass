import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function TrustSignals() {
  const { t } = useTranslation();

  const stats = t('trustSignals.stats', { returnObjects: true }) as { value: string; label: string }[];
  const logos = ['Forbes', 'Bloomberg', 'TechCrunch', 'Condé Nast', 'WSJ'];

  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20 lg:mb-32">
          {Array.isArray(stats) && stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium mb-2 text-accent">
                {stat.value}
              </p>
              <p className="caption-editorial text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* As Seen In */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="caption-editorial text-muted-foreground mb-12">
            {t('trustSignals.mediaLabel')}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {logos.map((logo, index) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="text-2xl md:text-3xl font-heading text-foreground/30 hover:text-foreground/60 transition-colors duration-300"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
