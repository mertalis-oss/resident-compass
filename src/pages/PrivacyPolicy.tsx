import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import ConciergeButton from '@/components/ConciergeButton';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t('legal.privacyTitle', { defaultValue: 'Privacy Policy — Plan B Asia' })}
        description={t('legal.privacyDesc', { defaultValue: 'Privacy policy for Plan B Asia advisory services.' })}
      />
      <FocusedNavbar />

      <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-corporate-navy text-holistic">
        <div className="container max-w-3xl text-center px-6">
          <h1 className="heading-display text-holistic mb-4">{t('legal.privacyHeading')}</h1>
          <p className="body-editorial text-holistic/60">{t('legal.lastUpdated', { date: '2026-03-19' })}</p>
        </div>
      </section>

      <section className="section-editorial">
        <div className="container max-w-3xl px-6 prose prose-lg dark:prose-invert">
          <h2>{t('legal.privacy.collectionTitle')}</h2>
          <p>{t('legal.privacy.collectionBody')}</p>

          <h2>{t('legal.privacy.useTitle')}</h2>
          <p>{t('legal.privacy.useBody')}</p>

          <h2>{t('legal.privacy.stripeTitle')}</h2>
          <p>{t('legal.privacy.stripeBody')}</p>

          <h2>{t('legal.privacy.cookiesTitle')}</h2>
          <p>{t('legal.privacy.cookiesBody')}</p>

          <h2>{t('legal.privacy.retentionTitle')}</h2>
          <p>{t('legal.privacy.retentionBody')}</p>

          <h2>{t('legal.privacy.rightsTitle')}</h2>
          <p>{t('legal.privacy.rightsBody')}</p>

          <h2>{t('legal.privacy.contactTitle')}</h2>
          <p>{t('legal.privacy.contactBody')}</p>
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-border/10">
        <div className="container max-w-5xl px-6 text-center">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
        </div>
      </footer>
      <ConciergeButton />
    </div>
  );
}
