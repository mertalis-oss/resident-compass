import { useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Shield, Zap, Globe, Building2, Users, Briefcase, MessageCircle } from "lucide-react";
import FocusedNavbar from "@/components/FocusedNavbar";
import TrustBar from "@/components/TrustBar";
import SEOHead from "@/components/SEOHead";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import AdvisoryForm from "@/components/advisory/AdvisoryForm";
import { buildWhatsAppUrl } from "@/lib/constants";
import { trackPostHogEvent } from "@/lib/posthog";

const context = [
  {
    icon: Zap,
    title: "Fast Setup",
    desc: "Business registration and banking in days, not months. Cambodia's regulatory environment favors speed.",
  },
  {
    icon: Shield,
    title: "Calm Operations",
    desc: "Low cost of living, minimal bureaucracy, and a welcoming environment for international entrepreneurs.",
  },
  {
    icon: Globe,
    title: "Strategic Position",
    desc: "Gateway between Thailand, Vietnam, and Laos. Growing digital infrastructure and ASEAN integration.",
  },
];

const pathways = [
  {
    icon: Building2,
    title: "Phnom Penh Base",
    desc: "Establish your business headquarters in Cambodia's dynamic capital. Banking, co-working, and community.",
  },
  {
    icon: Users,
    title: "Siem Reap Retreat",
    desc: "Cultural immersion and remote work from the gateway to Angkor. Ideal for creative and wellness professionals.",
  },
  {
    icon: Briefcase,
    title: "Business Formation",
    desc: "Company registration, work permits, and tax-efficient structuring for digital businesses.",
  },
];

export default function CambodiaPageEN() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const whatsappUrl = buildWhatsAppUrl(
    "Page: Cambodia | Intent: cambodia-advisory | Domain: " +
      (typeof window !== "undefined" ? window.location.hostname : ""),
  );

  const handleWhatsAppClick = () => {
    trackPostHogEvent("whatsapp_click", { source: "cambodia_en", intent: "cambodia-advisory" }, true);
    try {
      window.open(whatsappUrl, "_blank");
    } catch {
      window.location.href = whatsappUrl;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Cambodia — Fast. Calm. Flexible. | Plan B Asia"
        description="Concierge arrival and strategic positioning in Cambodia."
        canonical="https://planbasia.com/destinations/cambodia"
        schemaType="Service"
        serviceName="Cambodia Advisory"
      />
      <FocusedNavbar />
      <TrustBar />

      {/* Hero — FIX: replaced generic plane/flight image with Angkor Wat */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          {/* FIX: Angkor Wat sunrise reflection — iconic Cambodia landmark */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop')`,
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
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Destination Advisory</span>
            </div>

            <h1 className="heading-display text-background mb-6">
              Fast. Calm. Flexible.
              <span className="block text-accent">Cambodia.</span>
            </h1>

            <p className="text-lg text-background/80 max-w-xl mb-10">Concierge arrival and strategic positioning.</p>

            <button onClick={handleWhatsAppClick} className="btn-luxury-gold inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Speak with Strategic Advisor
            </button>
          </motion.div>
        </div>
      </section>

      {/* Context */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Context</p>
            <h2 className="heading-section mb-4">Why Cambodia</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {context.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 border border-border hover:border-accent/30 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathways */}
      <section className="py-20 lg:py-32 bg-card border-y border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Pathways</p>
            <h2 className="heading-section mb-4">Your Route Into Cambodia</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pathways.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background p-8 border border-border hover:border-accent/30 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Form */}
      <section id="checkout" className="py-20 bg-background border-b border-border">
        <div className="container max-w-2xl px-6">
          <div className="text-center mb-8">
            <p className="caption-editorial text-accent mb-4">Begin Your Advisory</p>
            <h2 className="heading-section mb-4">Start Your Cambodia Process</h2>
          </div>
          <AdvisoryForm source_page="cambodia" defaultDestination="cambodia" />
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
        </div>
      </footer>

      <StickyMobileCTA onClick={handleWhatsAppClick} />
    </div>
  );
}
