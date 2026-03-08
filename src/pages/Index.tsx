import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import ConciergeButton from '@/components/ConciergeButton';
import PlanBForm from '@/components/PlanBForm';

const serviceVerticals = [
  {
    numeral: 'I',
    title: 'Sovereign Residency',
    subtitle: 'Digital Nomad Visa Protocol',
    desc: 'A structured 5-year multi-entry pathway for founders, remote professionals, and global citizens seeking long-term residency in the Kingdom of Thailand.',
    to: '/residency/dtv-thailand',
    image: '/images/service-residency.webp',
  },
  {
    numeral: 'II',
    title: 'Wellness & Renewal',
    subtitle: 'Medical & Holistic Programmes',
    desc: 'Premium healthcare access and traditional Thai healing integrated with luxury accommodation. Designed for those who seek renewal alongside relocation.',
    to: '/wellness/thailand-retreat',
    image: '/images/service-wellness.webp',
    reverse: true,
  },
  {
    numeral: 'III',
    title: 'Strategic Retreats',
    subtitle: 'MICE & Corporate Infrastructure',
    desc: 'Bespoke business events, leadership retreats, and conference logistics for organisations operating across Southeast Asian markets.',
    to: '/corporate-retreats/mice-thailand',
    image: '/images/service-corporate.webp',
  },
  {
    numeral: 'IV',
    title: 'Private Expeditions',
    subtitle: 'Hà Giang & Beyond',
    desc: 'Vietnam\'s most spectacular mountain roads. A sovereign journey through the northern highlands — curated for founders, not tourists.',
    to: '/expeditions/ha-giang-motor-expedition',
    image: '/images/service-expeditions.webp',
    reverse: true,
  },
];

const networkPillars = [
  'Immigration Counsel',
  'Tax Advisory',
  'Private Medical',
  'Luxury Hospitality',
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

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-end pb-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-home.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-corporate-navy/80 via-corporate-navy/30 to-transparent" />
        <div className="relative z-10 container max-w-5xl px-6">
          <p className="text-xs tracking-[0.4em] uppercase text-holistic/60 mb-6 font-body">
            {t('hero.ctaSub')}
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-normal tracking-tight leading-[0.95] text-holistic mb-8">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-holistic/70 max-w-xl font-body font-light leading-relaxed mb-12">
            {t('hero.subtitle')}
          </p>
          <button
            onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-4 text-holistic font-body text-sm tracking-[0.2em] uppercase transition-all duration-500 ease-out hover:gap-6"
          >
            {t('hero.cta')}
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* ═══ TRUSTED NETWORK ═══ */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-5xl px-6">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-16 font-body">
            {t('network.title')}
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-0">
            {networkPillars.map((pillar, i) => (
              <div key={pillar} className="flex items-center">
                {i > 0 && (
                  <div className="hidden md:block w-px h-8 bg-border mx-10" />
                )}
                <p className="font-heading text-xl md:text-2xl font-normal tracking-tight text-foreground py-3 md:py-0">
                  {pillar}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOUNDER LETTER ═══ */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-3xl px-6 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-12 font-body">
            {t('founderLetter.title')}
          </p>
          <p className="font-heading text-2xl md:text-3xl font-normal leading-relaxed text-foreground italic">
            "{t('founderLetter.text')}"
          </p>
          <div className="mt-12 border-t border-border pt-8 inline-block">
            <p className="font-heading text-lg text-secondary italic">{t('founderLetter.signature')}</p>
            <p className="text-xs text-muted-foreground mt-2 tracking-[0.3em] uppercase font-body">{t('founderLetter.role')}</p>
          </div>
        </div>
      </section>

      {/* ═══ TRUST LAYER ═══ */}
      <section className="py-16 bg-corporate-navy">
        <div className="container max-w-5xl px-6">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
            {['Private & Confidential', 'Legal Framework Driven', 'Government Compliant', 'Trusted by Global Founders'].map((item, i) => (
              <span key={i} className="text-xs tracking-[0.3em] uppercase text-holistic/50 font-body">
                {item}
              </span>
            ))}
          </div>
          <p className="text-center mt-6 text-xs text-holistic/30 tracking-[0.4em] uppercase font-body">
            {t('trust.subtitle')}
          </p>
        </div>
      </section>

      {/* ═══ SERVICE VERTICALS — EDITORIAL ═══ */}
      <section className="border-t border-border">
        <div className="container max-w-5xl px-6 pt-32 pb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 font-body">
            {t('services.title')}
          </p>
          <p className="text-muted-foreground text-sm max-w-md font-body">
            {t('services.subtitle')}
          </p>
        </div>

        {serviceVerticals.map((service) => (
          <div
            key={service.to}
            className={`flex flex-col ${service.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[70vh]`}
          >
            {/* Image half */}
            <div className="w-full md:w-1/2 relative overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
                className="w-full h-full object-cover min-h-[400px] md:min-h-full"
              />
            </div>

            {/* Content half */}
            <div className="w-full md:w-1/2 bg-background flex items-center">
              <div className="px-8 md:px-16 lg:px-24 py-20 md:py-0 max-w-lg">
                <span className="font-heading text-6xl font-light text-border block mb-6">
                  {service.numeral}
                </span>
                <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 font-body">
                  {service.subtitle}
                </p>
                <h3 className="font-heading text-3xl md:text-4xl font-normal tracking-tight text-foreground mb-6">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-10 font-body">
                  {service.desc}
                </p>
                <Link
                  to={service.to}
                  className="group inline-flex items-center gap-3 text-foreground font-body text-xs tracking-[0.2em] uppercase transition-all duration-500 ease-out hover:gap-5 border-b border-foreground/20 pb-1"
                >
                  Explore Protocol
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ═══ CALCULATOR HOOK ═══ */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-4xl px-6 text-center">
          <Calculator className="h-6 w-6 text-secondary mx-auto mb-8 stroke-[1]" />
          <h2 className="font-heading text-3xl md:text-4xl font-normal tracking-tight text-foreground mb-6">
            {t('calculator.title')}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-10 font-body">
            {t('calculator.subtitle')}
          </p>
          <Link to="/tools/dtv-visa-calculator">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto transition-all duration-500 ease-out hover:scale-[1.02]"
            >
              {t('calculator.cta')} <ArrowRight className="ml-3 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ═══ PHILOSOPHY ═══ */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-3xl px-6">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-8 font-body">
                Why Plan B Asia
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-body">
                We are not a travel agency. We are a sovereign lifestyle architecture firm. Every engagement
                begins with a strategic assessment of your personal, financial, and regulatory position.
                From there, we design a mobility plan that protects your freedom, your family, and your future.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-10">
              {[
                { value: '18+', label: 'Client Countries' },
                { value: '100%', label: 'Legal Compliance' },
                { value: '24h', label: 'Response Time' },
              ].map((stat) => (
                <div key={stat.label} className="border-t border-border pt-4">
                  <p className="font-heading text-3xl font-normal text-secondary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 tracking-[0.2em] uppercase font-body">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LEAD CAPTURE ═══ */}
      <PlanBForm />

      {/* ═══ FOOTER ═══ */}
      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase font-body">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
          <div className="flex gap-10 text-xs text-holistic/40 tracking-[0.2em] uppercase font-body">
            <a href="#" className="hover:text-holistic/70 transition-colors duration-500">Privacy</a>
            <a href="#" className="hover:text-holistic/70 transition-colors duration-500">Terms</a>
            <a href="#" className="hover:text-holistic/70 transition-colors duration-500">Contact</a>
          </div>
        </div>
      </footer>

      <ConciergeButton />
    </div>
  );
}
