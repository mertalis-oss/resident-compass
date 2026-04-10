import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Utensils, Languages, Heart, Shield, ArrowRight, Clock, Loader } from 'lucide-react';
import ComparisonCrossSell from '@/components/service/ComparisonCrossSell';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import SEOHead from '@/components/SEOHead';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import PlanBForm from '@/components/PlanBForm';
import ServiceCheckout from '@/components/service/ServiceCheckout';
import ServiceWhoIsFor from '@/components/service/ServiceWhoIsFor';
import ExpectationOutcome from '@/components/service/ExpectationOutcome';
import TrustBlock from '@/components/service/TrustBlock';
import SocialProofMini from '@/components/service/SocialProofMini';
import FOMOBlock from '@/components/service/FOMOBlock';
import BundleSelector from '@/components/service/BundleSelector';
import ServiceUpdateFallback from '@/components/tr/ServiceUpdateFallback';
import { useServicesList } from '@/hooks/useServicesList';
import { Button } from '@/components/ui/button';

const courses = [
  { icon: Shield, title: 'Muay Thai Training Program', duration: '1-6 Months', visa: 'ED Visa / DTV Visa', transition: 'Transition from education visa to residency permit', desc: 'Professional training at Thailand\'s most established camps. Visa process included.' },
  { icon: Utensils, title: 'Culinary Arts', duration: '2 Weeks - 3 Months', visa: 'ED Visa', transition: 'Post-certificate work visa consultation', desc: 'Thai cuisine and Southeast Asian gastronomy programs. International certification.' },
  { icon: Languages, title: 'Language Programs (Thai / English)', duration: '3-12 Months', visa: 'ED Visa', transition: 'Long-term stay and local integration', desc: 'Intensive programs at accredited language schools. Visa extension support included.' },
  { icon: Heart, title: 'Thai Massage & Wellness Certification', duration: '2-8 Weeks', visa: 'DTV Visa / Tourist + Extension', transition: 'Career transition in the wellness industry', desc: 'Wat Pho accredited massage and wellness training. Internationally recognized certificate.' },
];

export default function SoftPowerPageEN() {
  const { services: bundles, isLoading, hasError } = useServicesList('soft-power', 'global');
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader className="mx-auto mt-10 h-8 w-8 animate-spin text-accent" /></div>;
  if (hasError || bundles.length === 0) return <div className="min-h-screen bg-background"><FocusedNavbar /><TrustBar /><div className="py-24 text-center text-muted-foreground">Packages currently being updated. Please check back soon.</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Education & Living Packages in Asia — Plan B Asia" description="Muay Thai, culinary arts, language programs and wellness training." canonical="https://planbasia.com/visas/soft-power" schemaType="Service" serviceName="Soft Power Education Packages" />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Education & Living Packages</span>
            </div>
            <h1 className="heading-display text-background mb-6">Stay Longer. Learn Deeper.<span className="block text-accent">Move Naturally.</span></h1>
            <p className="text-lg text-background/80 max-w-xl mb-10">Each program is an independent service with its own pricing and application process.</p>
            <button onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury-gold inline-flex items-center gap-2">Get Started <ArrowRight className="w-4 h-4" /></button>
          </motion.div>
        </div>
      </section>

      {/* 2-4. Expectation → Trust → Social Proof */}
      <ExpectationOutcome />
      <TrustBlock />
      <SocialProofMini />

      {/* 5. FOMO */}
      <FOMOBlock service={selectedBundle || bundles[0]} />

      {/* 6. BUNDLE SELECTOR */}
      <BundleSelector bundles={bundles} selected={selectedBundle} onSelect={setSelectedBundle} />

      {selectedBundle && (
        <div className="flex justify-center mb-2">
          <span className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/30 text-accent text-[10px] tracking-[0.2em] uppercase font-medium px-3 py-1 rounded-full">
            Boosts Your Visa Eligibility
          </span>
        </div>
      )}

      {/* 7. CHECKOUT (id="checkout") */}
      <div id="checkout">
        {selectedBundle ? (
          <ServiceCheckout service={selectedBundle} />
        ) : (
          <section className="section-editorial border-t border-border">
            <div className="container max-w-2xl px-6 text-center py-12">
              <p className="text-sm text-muted-foreground">Select a package above to proceed to checkout.</p>
            </div>
          </section>
        )}
      </div>

      {/* 8. WHO IS FOR */}
      <ServiceWhoIsFor />

      {/* 9. Content — Courses Grid */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Programs</p>
            <h2 className="heading-section mb-4">4 Different Training Paths</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Each with its own visa eligibility and pricing.</p>
          </div>
          <div className="min-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-card p-8 lg:p-10 border border-border hover:border-accent/30 transition-all duration-500">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-accent/10 flex items-center justify-center"><course.icon className="w-7 h-7 text-accent" /></div>
                  <div><h3 className="font-heading text-xl mb-1">{course.title}</h3><span className="text-sm text-accent">{course.visa}</span></div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{course.desc}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent flex-shrink-0" /><span>Duration: {course.duration}</span></div>
                  <div className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-accent flex-shrink-0" /><span className="text-muted-foreground">{course.transition}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">Each program is an independent service with its own pricing and application process. Plan B Asia provides official consulting and guidance services.</p>
        </div>
      </section>

      {/* PlanBForm */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Free Eligibility Check</h2>
          <p className="text-muted-foreground text-center mb-10 body-editorial">Quick preliminary assessment.</p>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">Your eligibility looks strong. View advisory packages above to get started.</p>
              <Button onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto">View Advisory Packages ↑</Button>
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
          <p className="body-editorial text-background/70 mb-8">Transform your education visa into a permanent island base.</p>
          <Link to="/relocation/nomad-incubator" className="btn-luxury-gold inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase">
            Build Your Island Base <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Comparison & Cross-Sell */}
      <ComparisonCrossSell currentSlug="soft-power" />

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center"><span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">© {new Date().getFullYear()} Atropox OÜ</span></div>
      </footer>
      <StickyMobileCTA onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} />
    </div>
  );
}
