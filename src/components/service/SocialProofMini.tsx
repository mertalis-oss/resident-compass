import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// FIX: context prop added — default EN quotes updated to be universally applicable
// context="mice" renders corporate event-specific social proof

const quotes = {
  tr: ["Haftalarca sürecek karmaşadan kurtardılar.", "Net ve dürüst danışmanlık.", "Sonunda seçeneklerimi anladım."],
  en: [
    "Exactly the clarity we needed.",
    "Professional from first contact to final delivery.",
    "No surprises — everything as agreed.",
  ],
  en_mice: [
    "Seamless from brief to execution.",
    "Our team handled every detail without follow-up.",
    "The most composed event partner we have worked with.",
  ],
};

interface SocialProofMiniProps {
  context?: "mice" | "default";
}

/**
 * Mini Social Proof — italic quote-style testimonials.
 * Pass context="mice" for MICE/corporate event quotes.
 */
export default function SocialProofMini({ context = "default" }: SocialProofMiniProps) {
  const { i18n } = useTranslation();
  const isTR = i18n.language === "tr";

  let items: string[];
  if (isTR) {
    items = quotes.tr;
  } else if (context === "mice") {
    items = quotes.en_mice;
  } else {
    items = quotes.en;
  }

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
