import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Heart, Briefcase, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import ConciergeButton from '@/components/ConciergeButton';
import PlanBForm from '@/components/PlanBForm';

const serviceCards = [
  { icon: Scale, title: 'Digital Nomad Visa (DTV)', desc: '5-year multi-entry visa for remote professionals, freelancers, and founders.', to: '/residency/dtv-thailand' },
  { icon: Heart, title: 'Wellness & Medical Visa', desc: 'Premium healthcare access and wellness-focused relocation to Thailand.', to: '/wellness/thailand-retreat' },
  { icon: Briefcase, title: 'Corporate Retreats (MICE)', desc: 'Strategic business events, team retreats, and conference logistics.', to: '/corporate-retreats/mice-thailand' },
  { icon: Mountain, title: 'Hà Giang Expedition', desc: 'Vietnam\'s most spectacular mountain road motorcycle journey.', to: '/expeditions/ha-giang-motor-expedition' },
];

const networkItems = [
  { emoji: '⚖️', label: 'network.immigration' },
  { emoji: '📊', label: 'network.tax' },
  { emoji: '🏥', label: 'network.medical' },
  { emoji: '🏨', label: 'network.resorts' },
];

export default function Index() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Plan B Asia — Sovereign Mobility Architecture"
        description="Architecting sovereign mobility for founders and global citizens. Visa programs, tax compliance, and strategic relocation in Southeast Asia."
        schemaType="Organization"
      />
      <FocusedNavbar />

      {/* === LAYER 1: HERO === */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-home.webp')" }}
        />
        <div className="absolute inset-0 bg-corporate-navy/70" />
        <div className="relative z-10 container max-w-4xl text-center text-holistic px-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight leading-[1.05] mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-holistic/70 max-w-2xl mx-auto mb-10 font-body">
            {t('hero.subtitle')}
          </p>
          <Button
            size="lg"
            onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base md:text-lg px-10 py-6 h-auto hover:scale-[1.02] transition-all duration-500 ease-out"
          >
            {t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-xs text-holistic/50 tracking-wider uppercase">
            {t('hero.ctaSub')}
          </p>
        </div>
      </section>

      {/* === LAYER 2: TRUSTED NETWORK === */}
      <section className="py-16 bg-card">
        <div className="container max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-10 text-foreground">
            {t('network.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {networkItems.map((item) => (
              <div key={item.label} className="text-center p-6 rounded-lg border border-border bg-background hover:shadow-md hover:scale-[1.02] transition-all duration-500 ease-out">
                <span className="text-3xl mb-3 block">{item.emoji}</span>
                <p className="text-sm font-medium text-foreground">{t(item.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === LAYER 3: FOUNDER STATEMENT === */}
      <section className="py-20">
        <div className="container max-w-3xl text-center">
          <blockquote className="text-xl md:text-2xl font-heading italic text-foreground leading-relaxed mb-6">
            "{t('founder.quote')}"
          </blockquote>
          <p className="text-sm text-muted-foreground tracking-wider uppercase">{t('founder.attribution')}</p>
        </div>
      </section>

      {/* === LAYER 4: TRUST LAYER === */}
      <section className="py-12 bg-corporate-navy">
        <div className="container max-w-4xl text-center">
          <p className="text-sm md:text-base text-holistic/80 tracking-wider font-medium">
            {t('trust.headline')}
          </p>
          <p className="text-xs text-holistic/50 mt-3 uppercase tracking-widest">{t('trust.subtitle')}</p>
        </div>
      </section>

      {/* === LAYER 5: SERVICE VERTICALS === */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 text-foreground">
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14 text-sm">
            {t('services.subtitle')}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCards.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="group p-6 rounded-lg border border-border bg-card hover:border-secondary/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-500 ease-out"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors duration-300">
                  <card.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{card.desc}</p>
                <span className="text-xs font-medium text-secondary flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === LAYER 6: SOCIAL PROOF / PHILOSOPHY === */}
      <section className="py-20 bg-card">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">
            Why Plan B Asia?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            We are not a travel agency. We are a sovereign lifestyle architecture firm. Every engagement
            begins with a strategic assessment of your personal, financial, and regulatory position.
            From there, we design a mobility plan that protects your freedom, your family, and your future.
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-heading font-bold text-secondary">18+</p>
              <p className="text-xs text-muted-foreground mt-1">Client Countries</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-secondary">100%</p>
              <p className="text-xs text-muted-foreground mt-1">Legal Compliance</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-secondary">24h</p>
              <p className="text-xs text-muted-foreground mt-1">Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* === LAYER 7: LEAD CAPTURE === */}
      <PlanBForm />

      {/* Footer */}
      <footer className="py-12 bg-corporate-navy text-holistic">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-holistic/50">© {new Date().getFullYear()} Atropox OÜ. All rights reserved.</span>
          <div className="flex gap-6 text-sm text-holistic/50">
            <a href="#" className="hover:text-holistic/80 transition-colors">Privacy</a>
            <a href="#" className="hover:text-holistic/80 transition-colors">Terms</a>
            <a href="#" className="hover:text-holistic/80 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <ConciergeButton />
    </div>
  );
}
