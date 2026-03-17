import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Leaf, Wind, Droplets, Heart, Sun, Moon, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import PlanBForm from "@/components/PlanBForm";

const retreatPrograms = [
  {
    icon: Wind,
    title: "Breathwork & Pranayama",
    duration: "3-5 Days",
    description: "Holotropic breathing, Wim Hof method, and ancient pranayama practices.",
    includes: ["Daily breath sessions", "Ice bath experience", "Meditation", "Organic nutrition"],
  },
  {
    icon: Leaf,
    title: "Yoga & Meditation Retreat",
    duration: "7-14 Days",
    description: "Deep yoga practice in the serene forests of Koh Phangan. Vinyasa, Yin, and restorative yoga.",
    includes: ["2 yoga sessions per day", "Silent meditation", "Ayurveda consultation", "Nature walks"],
  },
  {
    icon: Droplets,
    title: "Ice Bath & Cold Therapy",
    duration: "2-3 Days",
    description: "Experience the power of cold therapy with Wim Hof certified instructors.",
    includes: ["Theory training", "Gradual ice exposure", "Breath integration", "Follow-up protocol"],
  },
  {
    icon: Heart,
    title: "Private Healer Sessions",
    duration: "Customized",
    description: "Private sessions with Thailand's most respected healers. Traditional Thai massage, energy work, healing herbs.",
    includes: ["Personal assessment", "Custom session plan", "Healer selection advisory", "Integration support"],
  },
];

const WellnessPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Wellness Retreats Thailand — Yoga, Breathwork & Healing | Plan B Asia"
        description="Deep healing experiences in Southeast Asia's most peaceful corners. Yoga, breathwork, meditation, and traditional healing arts."
        schemaType="Service"
        serviceName="Wellness Retreats"
      />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop')`, filter: 'brightness(1.05) saturate(0.9)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-3 mb-8">
              <Sun className="w-5 h-5 text-accent" />
              <span className="caption-editorial text-foreground/60">Wellness & Healing</span>
              <Moon className="w-5 h-5 text-accent" />
            </motion.div>
            <h1 className="heading-display text-foreground mb-8 leading-tight">
              Listen to Your Body,
              <span className="block italic font-normal">Heal Your Soul.</span>
            </h1>
            <p className="body-large text-foreground/70 max-w-xl mx-auto mb-12">
              Deep healing experiences in Southeast Asia's most peaceful corners. Yoga, breathwork, meditation, and traditional healing arts.
            </p>
            <motion.a href="#programs" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-luxury-primary inline-block">
              Explore Programs
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-20 lg:py-32 bg-secondary/30 scroll-mt-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Programs</p>
            <h2 className="heading-section mb-4">Healing Journeys</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {retreatPrograms.map((program, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card p-8 lg:p-10 border border-border/30 hover:border-accent/20 transition-all duration-500">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <program.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-1">{program.title}</h3>
                    <span className="text-sm text-accent">{program.duration}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{program.description}</p>
                <div className="space-y-2 mb-6">
                  {program.includes.map((item, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <Star className="w-3 h-3 text-accent" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Link to="/tools/dtv-visa-calculator">
                  <motion.button whileHover={{ x: 5 }} className="text-accent text-sm font-medium inline-flex items-center gap-2">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="col-span-12 lg:col-span-6">
              <div className="aspect-[4/3] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop" alt="Koh Phangan Retreat" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="col-span-12 lg:col-span-6">
              <p className="caption-editorial text-accent mb-4">Main Hub</p>
              <h2 className="heading-section mb-6">Koh Phangan, Thailand</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Beyond its famous Full Moon parties, Koh Phangan's true treasure lies hidden in its forests and beaches. A haven where healers from around the world gather — the perfect nest for inner transformation.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                {["Private forest retreat centers", "Organic & vegetarian cuisine", "Digital detox-friendly environment"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <PlanBForm />

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
            <Leaf className="w-12 h-12 text-accent mx-auto mb-8" />
            <h2 className="heading-section mb-6">Take the First Step</h2>
            <p className="body-editorial text-muted-foreground mb-8">
              Start with a free discovery call. Let us understand your needs and find the right program for you.
            </p>
            <Link to="/tools/dtv-visa-calculator">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-luxury-gold">
                Schedule Free Consultation
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default WellnessPage;
