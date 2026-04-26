import { useTranslation } from "react-i18next";
import AnimatedSection from "@/components/AnimatedSection";

// FIX: context prop added
// context="mice"  → corporate event/MICE audience copy
// context="nomad" → friction-free lifestyle transition copy (Nomad Incubator)
// default         → existing generic copy (DTV, Soft Power, others — unchanged)

const content = {
  default: {
    whoForLabel: "Who this is for",
    whoForBody: "People who want to move forward fast. People who need clarity, not endless research.",
    notForLabel: "Not for",
    notForBody: "People looking for free general advice. People not ready to take action.",
  },
  mice: {
    whoForLabel: "Who this is for",
    whoForBody:
      "Corporate leaders and event directors who demand precision. Organizations where execution quality is non-negotiable.",
    notForLabel: "Not for",
    notForBody: "Teams looking for the lowest-cost vendor. Those not ready to delegate to a dedicated specialist.",
  },
  nomad: {
    whoForLabel: "Who this is for",
    whoForBody:
      "Those ready to relocate without friction. Builders and operators who want infrastructure already in place — not a manual to follow.",
    notForLabel: "Not for",
    notForBody: "Those expecting instant results without preparation. Those not yet committed to making the move.",
  },
};

interface ServiceWhoIsForProps {
  context?: "mice" | "nomad" | "default";
}

export default function ServiceWhoIsFor({ context = "default" }: ServiceWhoIsForProps) {
  const { t } = useTranslation();
  const copy = content[context] ?? content.default;

  return (
    <AnimatedSection>
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container max-w-3xl px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="caption-editorial text-accent mb-6">
                {t(`service.whoForLabel_${context}`, { defaultValue: copy.whoForLabel })}
              </p>
              <p className="body-editorial text-foreground">
                {t(`service.whoForBody_${context}`, { defaultValue: copy.whoForBody })}
              </p>
            </div>
            <div>
              <p className="caption-editorial text-muted-foreground mb-6">
                {t(`service.notForLabel_${context}`, { defaultValue: copy.notForLabel })}
              </p>
              <p className="body-editorial text-muted-foreground">
                {t(`service.notForBody_${context}`, { defaultValue: copy.notForBody })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
