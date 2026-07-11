import { useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Calendar, Globe } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FocusedNavbar from "@/components/FocusedNavbar";
import TrustBar from "@/components/TrustBar";
import SEOHead from "@/components/SEOHead";
import ComparisonCrossSell from "@/components/service/ComparisonCrossSell";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ServiceWhoIsFor from "@/components/service/ServiceWhoIsFor";
import ExpectationOutcome from "@/components/service/ExpectationOutcome";
import TrustBlock from "@/components/service/TrustBlock";
import SocialProofMini from "@/components/service/SocialProofMini";
import MICEWizard from "@/components/advisory/MICEWizard";
import { trackPostHogEvent } from "@/lib/posthog";

// MICE-specific inline AdvisoryForm (variant="mice") is the single intake path.
// Do not wire this page to SimplifiedAssessmentModal — that is the individual
// relocation quiz and produces the wrong lead qualification for corporate MICE.

const faqs = [
  {
    q: "What group sizes do you handle?",
    a: "From 10-15 person executive retreats to 200+ person conferences. We have partner venue networks in Bangkok, Phuket, Phangan, and Chiang Mai.",
  },
  {
    q: "How fast is your RFP response?",
    a: "With a short event brief and budget range, we deliver a preliminary proposal within 3-5 business days. Full scoped proposal in 7-10 business days. Urgent timelines are triaged into a priority queue.",
  },
  {
    q: "Is there something specific you offer Turkish companies?",
    a: "Our founder Mert Alis brings 15+ years in the Turkish MICE industry. Corporate accounting, preference patterns, and cultural expectations are familiar ground. Turkish-language documentation and invoicing are standard.",
  },
  {
    q: "What are your payment terms?",
    a: "Standard structure: 30% deposit at contract, 60% due 30 days before the event, 10% post-event. We accept corporate invoicing, bank transfer, and Wise. VAT-inclusive transparent pricing.",
  },
  {
    q: "What event types are most common?",
    a: "Annual leadership retreats (3-5 days in Phangan or Phuket), dealer and partner conferences (2-3 days in Bangkok), and incentive tours (5-7 days combining multiple cities).",
  },
  {
    q: "Do you run sustainable or carbon-neutral events?",
    a: "Yes. Local supplier preference, plastic-free catering, and carbon offsetting through our partner Wildlife Alliance Thailand. Optional sustainability report attached on request.",
  },
];

const features = [
  {
    icon: Calendar,
    title: "Event Planning",
    desc: "Venue, program, transport, coordination. Full stack, one team.",
  },
  {
    icon: Users,
    title: "Team Retreats",
    desc: "Bring your remote team together. Bangkok, Phuket, Phangan. Zero logistics burden on you.",
  },
  {
    icon: Building2,
    title: "Conferences & Seminars",
    desc: "International-scale event capacity. Asian comfort, dedicated Turkish + English support.",
  },
  {
    icon: Globe,
    title: "Incentive Tours",
    desc: "Performance reward travel. The experience your team earned, no logistics stress.",
  },
];

export default function MICEPageEN() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToForm = () => {
    trackPostHogEvent("mice_cta_click", { source: "mice_en" }, true);
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="MICE & Corporate Events — Plan B Asia"
        description="Corporate events, conferences, retreats, and incentive tours in Thailand. 15+ years MICE industry experience, Thailand-based team, native Turkish + English support. Venue, catering, transport, presentation logistics from one team. Preliminary proposal within 3-5 business days."
        canonical="https://planbasia.com/corporate/mice"
        schemaType="Service"
        serviceName="MICE & Corporate Events"
        faq={faqs.map(({ q, a }) => ({ question: q, answer: a }))}
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
              <span className="text-sm text-background/90 tracking-wide">15+ Years MICE Experience</span>
            </div>

            <h1 className="heading-display text-background mb-6">
              Corporate events in your language.
              <span className="block text-accent">Thailand-based, Turkish + English support.</span>
            </h1>

            <p className="text-lg text-background/80 max-w-xl mb-6">
              Conferences, team retreats, incentive tours. Venue, catering, transport, presentation logistics. Your team walks in ready. Everything else is our problem.
            </p>

            <div className="inline-flex flex-col items-start gap-1 bg-accent/10 border border-accent/20 px-5 py-3 mb-8">
              <span className="text-accent font-heading text-lg">First reply within 24-48 hours</span>
              <span className="text-background/80 text-sm">Preliminary proposal in 3-5 business days. Short event brief + budget is enough.</span>
            </div>

            <button onClick={scrollToForm} className="btn-luxury-gold inline-flex items-center gap-2">
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

      {/* 6.5 FAQ — B2B buyers read before submitting an RFP. FAQ JSON-LD
          is emitted by SEOHead separately for search engines; this section
          renders the same answers visibly for the user. */}
      <section className="py-20 lg:py-24 bg-background border-t border-border/40">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="caption-editorial text-accent mb-4">Frequently Asked</p>
            <h2 className="heading-section">Before you send an RFP</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`mice-en-faq-${i}`}
                  className="bg-card border border-border px-6 data-[state=open]:ring-1 data-[state=open]:ring-accent/30"
                >
                  <AccordionTrigger className="text-left font-heading text-lg hover:no-underline hover:text-accent transition-colors py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
            <MICEWizard source_page="mice_en" />
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
            <button onClick={scrollToForm} className="btn-luxury-gold inline-flex items-center gap-2">
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

      <StickyMobileCTA onClick={scrollToForm} />
    </div>
  );
}
