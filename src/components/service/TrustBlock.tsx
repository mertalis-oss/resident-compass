import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const trustItems = {
  tr: [
    "Tayland'da yerleşik ekip",
    "Asya'ya taşınan dijital göçebelerin güvendiği danışmanlık",
    'Durumunuza özel kişisel rehberlik',
  ],
  en: [
    'Based in Thailand',
    'Trusted by remote workers relocating to Asia',
    'Personal guidance based on your situation',
  ],
};

/**
 * Trust Block — three checkmark trust signals.
 */
export default function TrustBlock() {
  const { i18n } = useTranslation();
  const items = i18n.language === 'tr' ? trustItems.tr : trustItems.en;

  return (
    <section className="py-10 md:py-14 bg-secondary/50 border-b border-border">
      <div className="container max-w-3xl px-6">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
