import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Calendar, Globe } from "lucide-react";
import FocusedNavbar from "@/components/FocusedNavbar";
import TrustBar from "@/components/TrustBar";
import SEOHead from "@/components/SEOHead";
import ComparisonCrossSell from "@/components/service/ComparisonCrossSell";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ServiceWhoIsFor from "@/components/service/ServiceWhoIsFor";
import ExpectationOutcome from "@/components/service/ExpectationOutcome";
import TrustBlock from "@/components/service/TrustBlock";
import SocialProofMini from "@/components/service/SocialProofMini";
import AdvisoryForm from "@/components/advisory/AdvisoryForm";
import SimplifiedAssessmentModal from "@/components/SimplifiedAssessmentModal";
import { trackPostHogEvent } from "@/lib/posthog";

// FIX: No direct WhatsApp anywhere. All CTAs → assessment modal.
// WhatsApp only surfaces inside SimplifiedAssessmentModal for isHighIntent === true.

const features = [
  { icon: Calendar, title: "Event Planning", desc: "End-to-end corporate event orchestration across Southeast Asia." },
  {
    icon: Users,
    title: "Team Retreats",
    desc: "High-performance team reunions and leadership offsites across Thailand and Bali.",
  },
  {
    icon: Building2,
    title: "Conferences & Seminars",
    desc: "International conferences and business summits in Bangkok and Phuket.",
  },
  { icon: Globe, title: "Incentive Tours", desc: "Performance reward and motivation programs for exceptional teams." },
];

export default function MICEPageEN() {
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openAssessment = () => {
    trackPostHogEvent("assessment_open", { source: "mice_en" }, true);
    setAssessmentOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="MICE & Corporate Events — The Architecture of Influence | Plan B Asia"
        description="Corporate event planning, conferences, leadership retreats, and incentive tours across Southeast Asia."
        canonical="https://planbasia.com/corporate/mice"
        schemaType="Service"
        serviceName="MICE & Corporate Events"
      />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <Building2 className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Corporate Solutions</span>
            </div>

            <h1 className="heading-display text-background mb-6">
              From Leadership Retreats to Global Events.
              <span className="block text-accent">Southeast Asia.</span>
            </h1>

            <p className="text-lg text-background/80 max-w-xl mb-4">
              Precision-engineered corporate events — press launches, dealer conventions, executive summits, and
              incentive programs across Southeast Asia.
            </p>

            <p className="text-background/60 text-sm mb-10">
              Confidential inquiry. Direct strategist review within 24 hours.
            </p>

            {/* FIX: was handleWhatsAppClick → now assessment modal */}
            <button onClick={openAssessment} className="btn-luxury-gold inline-flex items-center gap-2">
              Begin Your Inquiry
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2-4 — MICE context */}
      <ExpectationOutcome />
      <TrustBlock context="mice" />
      <SocialProofMini context="mice" />

      {/* 5. WHO IS FOR */}
      <ServiceWhoIsFor context="mice" />

      {/* 6. Features */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Services</p>
            <h2 className="heading-section mb-4">End-to-End Corporate Solutions</h2>
          </div>
          <div className="min-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 lg:p-10 border border-border hover:border-accent/30 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Advisory Form — single form, no duplicate */}
      <div id="checkout">
        <section className="section-editorial border-t border-border py-16">
          <div className="container max-w-2xl px-6">
            <div className="text-center mb-8">
              <p className="caption-editorial text-accent mb-4">Begin Your Advisory</p>
              <h2 className="heading-section mb-4">Initialize Your Event Blueprint</h2>
            </div>
            <AdvisoryForm variant="mice" source_page="mice" />
          </div>
        </section>
      </div>

      {/* Comparison & Cross-Sell */}
      <ComparisonCrossSell currentSlug="mice-thailand" />

      {/* Final CTA — FIX line 174: was WhatsApp → now assessment modal */}
      <section className="py-20 lg:py-32 bg-foreground text-background grain-overlay">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-section text-background mb-6">Your Next Event Starts Here</h2>
            <p className="body-editorial text-background/70 mb-8">
              Let us design the experience your organization deserves.
            </p>
            <button onClick={openAssessment} className="btn-luxury-gold inline-flex items-center gap-2">
              Begin Your Inquiry
            </button>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
        </div>
      </footer>

      {/* FIX: StickyMobileCTA → assessment modal */}
      <StickyMobileCTA onClick={openAssessment} />

      {/* Modal — WhatsApp only for isHighIntent === true inside */}
      <SimplifiedAssessmentModal open={assessmentOpen} onClose={() => setAssessmentOpen(false)} sourceSite="mice" />
    </div>
  );
}
