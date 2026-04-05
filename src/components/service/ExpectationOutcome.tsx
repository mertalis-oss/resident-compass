import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * Expectation & Real Outcome line — placed directly under Hero.
 * EN: "We guide you through the process step by step..."
 * TR: "Süreci adım adım birlikte yönetiyoruz..."
 */
export default function ExpectationOutcome() {
  const { t, i18n } = useTranslation();
  const isTR = i18n.language === 'tr';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-10 md:py-14 bg-card border-b border-border"
    >
      <div className="container max-w-3xl px-6 text-center">
        <p className="body-editorial text-foreground leading-relaxed text-lg">
          {isTR
            ? 'Süreci adım adım birlikte yönetiyoruz. Görüşme sonunda net ve kişisel bir aksiyon planın olacak.'
            : "We guide you through the process step by step. You'll leave with a clear, personalized action plan."}
        </p>
      </div>
    </motion.section>
  );
}
