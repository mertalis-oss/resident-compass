import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

// FIX: context prop added — all existing usages (DTV, Soft Power, Nomad) unaffected (no prop = default fallback)
// MICE passes context="mice" to get corporate-specific trust signals

const trustItems = {
  tr: [
    "Tayland'da yerleşik ekip",
    "Asya'ya taşınan dijital göçebelerin güvendiği danışmanlık",
    "Durumunuza özel kişisel rehberlik",
  ],
  en: [
    "Based in Southeast Asia",
    "Private advisory — one strategist, your project",
    "On-ground execution, not outsourced coordination",
  ],
  en_mice: [
    "Southeast Asia corporate event network — active across 6 markets",
    "End-to-end execution from brief to debrief",
    "One strategic point of contact for your entire event",
  ],
};

interface TrustBlockProps {
  context?: "mice" | "nomad" | "default";
}

/**
 * Trust Block — three checkmark trust signals.
 * Pass context="mice" for corporate event context.
 */
export default function TrustBlock({ context = "default" }: TrustBlockProps) {
  const { i18n } = useTranslation();
  const isTR = i18n.language === "tr";

  let items: string[];
  if (isTR) {
    items = trustItems.tr;
  } else if (context === "mice") {
    items = trustItems.en_mice;
  } else {
    items = trustItems.en;
  }

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
