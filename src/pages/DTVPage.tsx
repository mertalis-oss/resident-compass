import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Check, Clock, Globe, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import PlanBForm from "@/components/PlanBForm";

const eligibilityCriteria = [
  "Digital nomads & remote workers",
  "Freelancers with foreign clients",
  "Business owners operating remotely",
  "Content creators & influencers",
  "Software developers & designers",
  "Consultants & coaches",
];

const pricingTiers = [
  {
    name: "Essential",
    price: "$1,500",
    description: "Document preparation and submission",
    features: ["Document review & preparation", "Application submission", "Status updates", "Email support"],
  },
  {
    name: "Premium",
    price: "$2,500",
    description: "Full concierge service",
    features: ["Everything in Essential", "Priority processing", "Interview preparation", "Dedicated case manager", "Document translation", "Post-approval support"],
    popular: true,
  },
  {
    name: "Corporate",
    price: "Custom",
    description: "For companies relocating teams",
    features: ["Everything in Premium", "Bulk applications", "Custom timeline", "On-site support", "Relocation package", "Ongoing compliance"],
  },
];

const process = [
  { step: 1, title: "Initial Consultation", description: "Free 30-minute call to assess your eligibility", duration: "Day 1" },
  { step: 2, title: "Document Collection", description: "We provide a clear checklist and help gather all required documents", duration: "Days 2-7" },
  { step: 3, title: "Application Preparation", description: "Expert review and preparation of your complete application package", duration: "Days 8-14" },
  { step: 4, title: "Submission & Tracking", description: "We submit your application and provide real-time status updates", duration: "Days 15-30" },
  { step: 5, title: "Approval & Arrival", description: "Receive your visa and prepare for your new life in Thailand", duration: "Day 30+" },
];

const DTVPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Thailand DTV Visa — 5 Year Digital Nomad Visa | Plan B Asia"
        description="5-year multiple entry Thailand Destination Visa for digital nomads. 100% success rate."
        schemaType="Service"
        serviceName="Thailand DTV Visa"
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?q=80&w=2070&auto=format&fit=crop')` }} />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <p className="caption-editorial text-background/70 mb-4">Thailand DTV Visa</p>
            <h1 className="heading-display text-background mb-6">5 Years. Multiple Entry. Zero Hassle.</h1>
            <p className="body-large text-background/80 max-w-2xl mb-8">
              The Thailand Destination Visa (DTV) is the ultimate visa for digital nomads. Stay up to 180 days per entry, with unlimited entries over 5 years.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#pricing">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-luxury bg-background text-foreground hover:bg-background/90">
                  View Pricing
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, value: "5 Years", label: "Validity Period" },
              { icon: Globe, value: "180 Days", label: "Per Entry Stay" },
              { icon: Users, value: "Unlimited", label: "Re-entries" },
              { icon: Shield, value: "100%", label: "Success Rate" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <item.icon className="w-8 h-8 text-accent mx-auto mb-4" />
                <p className="font-serif text-3xl md:text-4xl font-medium mb-1">{item.value}</p>
                <p className="caption-editorial text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 lg:py-32 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="col-span-12 lg:col-span-5">
              <p className="caption-editorial text-accent mb-4">Eligibility</p>
              <h2 className="heading-section mb-6">Who qualifies for the DTV Visa?</h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="col-span-12 lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eligibilityCriteria.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-background">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">The Process</p>
            <h2 className="heading-section">From application to arrival</h2>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            {process.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-serif text-xl">{item.step}</div>
                  {i < process.length - 1 && <div className="w-px h-full bg-border mt-4" />}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-serif text-xl">{item.title}</h3>
                    <span className="text-xs uppercase tracking-wider text-accent bg-accent/10 px-3 py-1">{item.duration}</span>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-32 bg-secondary scroll-mt-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Pricing</p>
            <h2 className="heading-section mb-4">Transparent, all-inclusive pricing</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative p-8 bg-background ${tier.popular ? "ring-2 ring-accent" : "border border-border"}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground text-xs uppercase tracking-wider px-4 py-1">Most Popular</span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl mb-2">{tier.name}</h3>
                  <p className="font-serif text-4xl font-medium mb-2">{tier.price}</p>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })} className={`w-full py-4 text-sm uppercase tracking-[0.15em] font-medium transition-all ${tier.popular ? "bg-accent text-accent-foreground hover:bg-accent/90" : "border border-foreground/20 hover:bg-foreground hover:text-background"}`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <PlanBForm />

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
            <h2 className="heading-section mb-6">Ready to make Thailand your base?</h2>
            <p className="body-editorial text-background/70 mb-8">Book a free consultation call with our visa experts.</p>
            <Link to="/tools/dtv-visa-calculator">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-luxury bg-accent text-accent-foreground hover:bg-accent/90">
                Check Your Eligibility
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default DTVPage;
