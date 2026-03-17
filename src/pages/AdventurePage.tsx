import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Shield, Bike, Tent, Users, Phone, CheckCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import PlanBForm from "@/components/PlanBForm";

const tourHighlights = [
  {
    title: "Ha Giang Loop Premium",
    duration: "4-5 Days",
    description: "Vietnam's most iconic motorcycle route. Dramatic mountain landscapes, authentic villages, and unforgettable curves.",
    features: ["Professional Easy Rider guide", "Premium Honda XR150L", "Boutique hotel stays", "Drone footage included"],
  },
  {
    title: "Ho Chi Minh Trail",
    duration: "10-14 Days",
    description: "An epic adventure following the legendary war trail south. Where history meets nature on a unique route.",
    features: ["Historian guide", "Off-road sections", "Local family visits", "Camping & hotel mix"],
  },
  {
    title: "Thailand Northern Loop",
    duration: "5-7 Days",
    description: "From Chiang Mai through mountain villages, forests, and the Golden Triangle — a calm but impactful course.",
    features: ["Kawasaki W175 or Honda CB", "Luxury mountain lodge stays", "Local cuisine tours", "Photographer option"],
  },
];

const safetyFeatures = [
  { icon: Shield, title: "Full Safety Equipment", description: "Shoei helmet, CE-approved armor, GPS tracking system standard." },
  { icon: Users, title: "Easy Rider Option", description: "Don't want to ride? Our professional driver takes you. Same adventure, zero risk." },
  { icon: Tent, title: "Luxury Glamping", description: "Camping doesn't mean discomfort. Private tents, hot showers, gourmet meals." },
  { icon: Phone, title: "24/7 Support Line", description: "Multilingual coordinator and local medical network for emergencies." },
];

const AdventurePage = () => {
  return (
    <Layout>
      <SEOHead
        title="Motor Expeditions — Ha Giang & Vietnam Tours | Plan B Asia"
        description="Motorcycle tours across Southeast Asia's most dramatic roads. Ha Giang to Chiang Mai, every turn is a discovery."
        schemaType="Service"
        serviceName="Motor Expeditions"
      />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop')`, filter: 'contrast(1.1) saturate(0.9)' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/70 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-6">
              <Bike className="w-6 h-6 text-accent" />
              <span className="caption-editorial text-background/70">Vietnam & Asia Motor Tours</span>
            </motion.div>
            <h1 className="heading-display text-background mb-6">
              Where the Road Ends,
              <span className="block text-accent">Adventure Begins.</span>
            </h1>
            <p className="body-large text-background/80 max-w-xl mb-8">
              Motorcycle tours on Southeast Asia's most dramatic roads. From Ha Giang to Chiang Mai, every turn is a discovery. Safe, comfortable, but 100% authentic.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a href="#tours" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-luxury border border-background/30 text-background hover:bg-background/10">
                View Tours
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Completed Tours" },
              { value: "0%", label: "Serious Accidents" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "7 Years", label: "Experience" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="font-serif text-3xl md:text-4xl text-accent mb-1">{stat.value}</p>
                <p className="text-sm text-background/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours */}
      <section id="tours" className="py-20 lg:py-32 bg-background scroll-mt-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Routes</p>
            <h2 className="heading-section">Legendary Courses</h2>
          </motion.div>
          <div className="space-y-8">
            {tourHighlights.map((tour, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="grid grid-cols-12 gap-6 lg:gap-12 items-center p-6 lg:p-10 bg-secondary/50 border border-border/50 hover:border-accent/30 transition-colors">
                <div className="col-span-12 lg:col-span-8">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="font-serif text-2xl md:text-3xl">{tour.title}</h3>
                    <span className="bg-accent/10 text-accent text-sm px-3 py-1 font-medium">{tour.duration}</span>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{tour.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {tour.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-4 flex justify-center lg:justify-end">
                  <button onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury-outline w-full lg:w-auto text-center">
                    Get Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-20 lg:py-32 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="col-span-12 lg:col-span-5">
              <p className="caption-editorial text-accent mb-4">Safety & Comfort</p>
              <h2 className="heading-section mb-6">Adventure Without Compromise</h2>
              <p className="text-muted-foreground leading-relaxed">
                We minimized the risks that come with motorcycle touring. Professional equipment, experienced guides, and 24/7 support — just enjoy the road and the views.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="col-span-12 lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {safetyFeatures.map((feature, i) => (
                  <div key={i} className="bg-card p-6 border border-border/50">
                    <feature.icon className="w-8 h-8 text-accent mb-4" />
                    <h4 className="font-serif text-lg mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <PlanBForm />

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-foreground text-background grain-overlay">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
            <h2 className="heading-section mb-6">Ready?</h2>
            <p className="body-editorial text-background/70 mb-8">
              Get a custom route recommendation and price quote. You take the first step, we'll handle the rest.
            </p>
            <motion.button onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-luxury bg-accent text-accent-foreground hover:bg-accent/90">
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AdventurePage;
