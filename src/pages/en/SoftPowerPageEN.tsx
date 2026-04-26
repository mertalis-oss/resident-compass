import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Utensils, Languages, Heart, Shield, ArrowRight, Clock, Loader } from "lucide-react";
import ComparisonCrossSell from "@/components/service/ComparisonCrossSell";
import FocusedNavbar from "@/components/FocusedNavbar";
import TrustBar from "@/components/TrustBar";
import SEOHead from "@/components/SEOHead";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import PlanBForm from "@/components/PlanBForm";
import ServiceCheckout from "@/components/service/ServiceCheckout";
import ServiceWhoIsFor from "@/components/service/ServiceWhoIsFor";
import ExpectationOutcome from "@/components/service/ExpectationOutcome";
import TrustBlock from "@/components/service/TrustBlock";
import SocialProofMini from "@/components/service/SocialProofMini";
import { useServicesList } from "@/hooks/useServicesList";
import { Button } from "@/components/ui/button";

// FIX: Updated course durations based on 2026 Thailand visa/program data (Line 108 area)
// Muay Thai: DTV 2026 recommends minimum 6 months; ED visa supports up to 12 months → 3-12 Months
// Culinary:  Professional Thai culinary programs run 4 weeks to 3 months
// Language:  3-12 Months (unchanged — was already accurate)
// Massage:   Wat Pho Foundation: 30 hrs (~1 week); Advanced: up to 10 weeks → 3-10 Weeks
const courses = [
  {
    icon: Shield,
    title: "Muay Thai Training Program",
    duration: "3-12 Months",
    visa: "ED Visa / DTV Visa",
    transition: "Transition from education visa to residency permit",
    desc: "Professional training at Thailand's most established MOE-licensed camps. 2026 DTV applications benefit from a minimum 6-month program commitment — we structure your enrollment accordingly.",
  },
  {
    icon: Utensils,
    title: "Culinary Arts",
    duration: "4 Weeks – 3 Months",
    visa: "ED Visa",
    transition: "Post-certificate work visa consultation",
    desc: "Thai cuisine and Southeast Asian gastronomy programs at accredited culinary institutes. Internationally recognized certificate upon completion.",
  },
  {
    icon: Languages,
    title: "Language Programs (Thai / English)",
    duration: "3-12 Months",
    visa: "ED Visa",
    transition: "Long-term stay and local integration",
    desc: "Intensive programs at Ministry of Education-accredited language schools. Visa extension support included throughout.",
  },
  {
    icon: Heart,
    title: "Thai Massage & Wellness Certification",
    duration: "3-10 Weeks",
    visa: "DTV Visa / Tourist + Extension",
    transition: "Career transition in the wellness industry",
    desc: "Wat Pho-accredited massage and wellness training. Foundation to advanced tracks available. Internationally recognized certificate.",
  },
];

export default function SoftPowerPageEN() {
  const { services: bundles, isLoading, hasError } = useServicesList("soft-power", "global");
  const [formSubmitted, setFormSubmitted] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="mx-auto mt-10 h-8 w-8 animate-spin text-accent" />
      </div>
    );

  if (hasError || bundles.length === 0)
    return (
      <div className="min-h-screen bg-background">
        <FocusedNavbar />
        <TrustBar />
        <div className="py-24 text-center text-muted-foreground">
          Packages currently being updated. Please check back soon.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Education & Living Packages in Asia — Plan B Asia"
        description="Muay Thai, culinary arts, language programs and wellness training with visa support in Thailand."
        canonical="https://planbasia.com/visas/soft-power"
        schemaType="Service"
        serviceName="Soft Power Education Packages"
      />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop')`,
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
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Education & Living Packages</span>
            </div>
            <h1 className="heading-display text-background mb-6">
              Stay Longer. Learn Deeper.
              <span className="block text-accent">Move Naturally.</span>
            </h1>
            <p className="text-lg text-background/80 max-w-xl mb-10">
              Each program is an independent service with its own visa pathway, pricing, and application process.
            </p>
            <button
              onClick={() => document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-luxury-gold inline-flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2-4 */}
      <ExpectationOutcome />
      <TrustBlock />
      <SocialProofMini />

      {/* 5. CHECKOUT GRID */}
      <div id="checkout" className="scroll-mt-28 md:scroll-mt-36">
        <section className="section-editorial border-t border-border py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-10">
              <p className="caption-editorial text-accent mb-2">Education Packages</p>
              <h2 className="heading-section">Select Your Training Path</h2>
            </div>
            {!bundles?.length ? (
              <div className="min-h-[420px]" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 min-h-[420px] md:min-h-[480px] items-stretch auto-rows-fr">
                {bundles.map((bundle, index) => (
                  <ServiceCheckout key={bundle.id ?? bundle.slug ?? index} service={bundle} layout="grid" />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 8. WHO IS FOR */}
      <ServiceWhoIsFor />

      {/* 9. Programs Grid — updated durations */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Programs</p>
            <h2 className="heading-section mb-4">4 Training Paths — Each with Visa Support</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Durations and visa eligibility reflect 2026 Thai immigration requirements and program standards.
            </p>
          </div>
          <div className="min-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, i) => (
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
                    <course.icon className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl mb-1">{course.title}</h3>
                    <span className="text-sm text-accent">{course.visa}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{course.desc}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-muted-foreground">{course.transition}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Each program is an independent service with its own pricing and application process. Plan B Asia provides
            official consulting and guidance services. Visa durations and requirements are subject to change — always
            confirm current rules with your local Thai consulate.
          </p>
        </div>
      </section>

      {/* PlanBForm */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Free Eligibility Check</h2>
          <p className="text-muted-foreground text-center mb-10 body-editorial">Quick preliminary assessment.</p>
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
            <PlanBForm serviceId={bundles[0]?.id} onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      {/* Cross-Bridge */}
      <section className="py-20 lg:py-28 bg-foreground text-background grain-overlay">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-2xl">
          <p className="caption-editorial text-accent mb-4">Next Step</p>
          <h2 className="heading-section text-background mb-4">Learning is the Beginning. Living is the Goal.</h2>
          <p className="body-editorial text-background/70 mb-8">
            Transform your education visa into a permanent island base.
          </p>
          <Link
            to="/relocation/nomad-incubator"
            className="btn-luxury-gold inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase"
          >
            Build Your Island Base <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Comparison & Cross-Sell */}
      <ComparisonCrossSell currentSlug="soft-power" />

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
