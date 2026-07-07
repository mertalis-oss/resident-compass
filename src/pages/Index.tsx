import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import ConciergeButton from '@/components/ConciergeButton';
import PlanBForm from '@/components/PlanBForm';
import Hero from '@/components/home/Hero';
import Philosophy from '@/components/home/Philosophy';
import Portals from '@/components/home/Portals';
import TrustSignals from '@/components/home/TrustSignals';
import CTASection from '@/components/home/CTASection';
import Testimonials from '@/components/home/Testimonials';

export default function Index() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t('seo.homeTitle', { defaultValue: 'Plan B Asia — Sovereign Mobility for Southeast Asia' })}
        description={t('seo.homeDescription', { defaultValue: 'Strategic mobility, visa, and relocation advisory for Southeast Asia — Thailand focus. Thailand-resident advisor, human-led delivery, 2-hour response on WhatsApp. Thailand DTV visa from $150.' })}
        schemaType="Organization"
      />
      <FocusedNavbar />
      <TrustBar />
      <Hero />
      <Philosophy />
      <Portals />
      <TrustSignals />
      <Testimonials />
      <CTASection />
      <PlanBForm />

      {/* Footer */}
      <footer className="py-16 bg-corporate-navy border-t border-border/10">
        <div className="container max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
          <div className="flex gap-10 text-xs text-holistic/40 tracking-[0.2em] uppercase">
            <a href="/privacy-policy" className="hover:text-holistic/70 transition-colors duration-500">
              {t('footer.privacy', { defaultValue: 'Privacy' })}
            </a>
            <a href="/terms-of-service" className="hover:text-holistic/70 transition-colors duration-500">
              {t('footer.terms', { defaultValue: 'Terms' })}
            </a>
            <a href="/refund-policy" className="hover:text-holistic/70 transition-colors duration-500">
              {t('footer.refund', { defaultValue: 'Refund Policy' })}
            </a>
            <a href="/connect" className="hover:text-holistic/70 transition-colors duration-500">
              {t('footer.connect', { defaultValue: 'Connect AI' })}
            </a>
          </div>
        </div>
      </footer>

      <ConciergeButton />
    </div>
  );
}
