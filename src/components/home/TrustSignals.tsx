import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const stats = [
  { value: "100%", label: "Visa Approval Rate" },
  { value: "500+", label: "Relocated Families" },
  { value: "50+", label: "Corporate Events" },
  { value: "5", label: "Country Operations" },
];

export function TrustSignals() {
  const { t } = useTranslation();

  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20 lg:mb-32">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-2 text-accent">
                {stat.value}
              </p>
              <p className="caption-editorial text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="caption-editorial text-muted-foreground mb-12">
            {t('trust.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
            {t('trust.headline').split('|').map((item, i) => (
              <span key={i} className="text-xs tracking-[0.2em] uppercase text-foreground/40 font-medium">
                {item.trim()}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
