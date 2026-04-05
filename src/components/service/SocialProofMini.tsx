import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const quotes = {
  tr: [
    'Haftalarca sürecek karmaşadan kurtardılar.',
    'Net ve dürüst danışmanlık.',
    'Sonunda seçeneklerimi anladım.',
  ],
  en: [
    'Saved me weeks of confusion.',
    'Clear and honest advice.',
    'Finally understood my options.',
  ],
};

/**
 * Mini Social Proof — italic quote-style testimonials.
 */
export default function SocialProofMini() {
  const { i18n } = useTranslation();
  const items = i18n.language === 'tr' ? quotes.tr : quotes.en;

  return (
    <section className="py-8 md:py-10 bg-background border-b border-border">
      <div className="container max-w-4xl px-6">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {items.map((quote, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-sm italic text-muted-foreground"
            >
              &ldquo;{quote}&rdquo;
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
