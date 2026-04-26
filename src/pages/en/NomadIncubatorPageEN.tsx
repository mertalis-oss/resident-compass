import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Globe,
  Calculator,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Home,
  Briefcase,
  Heart,
  MapPin,
} from "lucide-react";
import FocusedNavbar from "@/components/FocusedNavbar";
import TrustBar from "@/components/TrustBar";
import SEOHead from "@/components/SEOHead";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import PlanBForm from "@/components/PlanBForm";
import ComparisonCrossSell from "@/components/service/ComparisonCrossSell";
import ServiceWhoIsFor from "@/components/service/ServiceWhoIsFor";
import ExpectationOutcome from "@/components/service/ExpectationOutcome";
import TrustBlock from "@/components/service/TrustBlock";
import SocialProofMini from "@/components/service/SocialProofMini";
import AdvisoryForm from "@/components/advisory/AdvisoryForm";
import { Button } from "@/components/ui/button";

const serviceItems = [
  {
    icon: Building2,
    title: "Company Formation",
    subtitle: "Global Structures",
    desc: "Set up your business entity in the most tax-efficient jurisdictions.",
    features: [
      "Estonia e-Residency application",
      "US Wyoming/Delaware LLC",
      "Singapore Pte. Ltd.",
      "Dubai Free Zone company",
    ],
  },
  {
    icon: Calculator,
    title: "Tax Optimization",
    subtitle: "Strategic Planning",
    desc: "Minimize your tax burden legally while maintaining full compliance.",
    features: [
      "Tax residency analysis",
      "Double taxation prevention",
      "Crypto & investment income planning",
      "Exit strategy consulting",
    ],
  },
  {
    icon: Globe,
    title: "Second Passport & Residency",
    subtitle: "Global Mobility",
    desc: "Expand your options with citizenship and residency programs worldwide.",
    features: [
      "Caribbean CBI programs",
      "Portugal/Spain Golden Visa",
      "Ancestry routes (Italy, Ireland)",
      "Thailand Elite Visa",
    ],
  },
  {
    icon: Users,
    title: "Community & Network",
    subtitle: "Connections",
    desc: "Join a curated community of like-minded entrepreneurs and nomads.",
    features: [
      "Monthly networking events",
      "Private mastermind groups",
      "Investor introductions",
      "Co-living experiences",
    ],
  },
];

const fullLifeItems = [
  { icon: Home, label: "Accommodation and living space setup" },
  { icon: Briefcase, label: "Company and bank account opening" },
  { icon: Heart, label: "Health insurance and clinic network" },
  { icon: MapPin, label: "Visa and residency permit process" },
  { icon: Globe, label: "Tax optimization and exit plan" },
  { icon: Users, label: "Community and networking access" },
];

export default function NomadIncubatorPageEN() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Digital Nomad Incubator — Plan B Asia"
        description="Company formation, tax optimization, second passport, and full life setup in Asia within 30 days."
        canonical="https://planbasia.com/relocation/nomad-incubator"
      />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. Hero — FIX: replaced abstract grid with tropical villa hero image */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden grain-overlay">
        <div className="absolute inset-0">
          {/* FIX: sunset infinity pool / tropical villa — supports the 360° life setup promise */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/80 to-foreground/50" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/80 tracking-wide">
                Business Infrastructure for Digital Nomads
              </span>
            </div>

            <h1 className="heading-display text-background mb-6">
              Arrive Ready.
              <span className="block text-accent">Build Immediately.</span>
            </h1>

            <p className="text-lg text-background/70 max-w-xl mb-4">
              Company formation, tax optimization, second passport, and a powerful community.
            </p>

            <div className="bg-accent/10 border border-accent/20 px-6 py-4 mb-10 max-w-xl">
              <p className="text-background font-heading text-lg">A fully established life in Asia within 30 days.</p>
            </div>

            <button
              onClick={() => document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-luxury-gold inline-flex items-center gap-2"
            >
              Join the Incubator <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2-4 — nomad context on TrustBlock/SocialProofMini keeps generic EN (no special MICE copy needed) */}
      <ExpectationOutcome />
      <TrustBlock />
      <SocialProofMini />

      {/* 5. WHO IS FOR — Nomad context: friction-free lifestyle transition copy */}
      <ServiceWhoIsFor context="nomad" />

      {/* 6. Content — 360° Life Setup */}
      <section className="py-20 lg:py-28 bg-card border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">360° Life Setup</p>
            <h2 className="heading-section mb-4">Fully Established Life in 30 Days</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Visa, accommodation, company, bank, insurance, community — we handle everything.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {fullLifeItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-4"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Advisory Form */}
      <div id="checkout">
        <section className="section-editorial border-t border-border py-16">
          <div className="container max-w-2xl px-6">
            <div className="text-center mb-8">
              <p className="caption-editorial text-accent mb-4">Begin Your Advisory</p>
              <h2 className="heading-section mb-4">Start Your Incubator Process</h2>
            </div>
            <AdvisoryForm source_page="nomad_incubator" defaultDestination="thailand" />
          </div>
        </section>
      </div>

      {/* Services Grid */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Services</p>
            <h2 className="heading-section mb-4">Incubator Program</h2>
          </div>
          <div className="min-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceItems.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card p-8 lg:p-10 border border-border hover:border-accent/30 transition-all duration-500"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-accent/10 flex items-center justify-center">
                    <svc.icon className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl mb-1">{svc.title}</h3>
                    <span className="text-sm text-accent">{svc.subtitle}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{svc.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {svc.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PlanBForm */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Free Eligibility Check</h2>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">
                Your eligibility looks strong. View advisory packages above to get started.
              </p>
              <Button
                onClick={() => document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
              >
                View Advisory Packages ↑
              </Button>
            </div>
          ) : (
            <PlanBForm onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      {/* Cross-Bridge */}
      <section className="py-20 lg:py-28 bg-foreground text-background grain-overlay">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-2xl">
          <p className="caption-editorial text-accent mb-4">Peak Performance</p>
          <h2 className="heading-section text-background mb-4">Peak Performance Environment.</h2>
          <p className="body-editorial text-background/70 mb-4">
            Optimize your physical and mental operating system alongside your business infrastructure.
          </p>
          <p className="text-xs text-background/50 mb-8">Limited to 10 Founder-level orchestrations per quarter.</p>
          <Link
            to="/experiences/wellness"
            className="btn-luxury-gold inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase"
          >
            Explore Wellness Protocols <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Comparison & Cross-Sell */}
      <ComparisonCrossSell currentSlug="nomad-incubator" />

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
        </div>
      </footer>

      <StickyMobileCTA onClick={() => document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" })} />
    </div>
  );
}
