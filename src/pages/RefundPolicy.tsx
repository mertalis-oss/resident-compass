import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import ConciergeButton from '@/components/ConciergeButton';

export default function RefundPolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t('legal.refundTitle', { defaultValue: 'Refund Policy — Plan B Asia' })}
        description={t('legal.refundDesc', { defaultValue: 'Refund and cancellation policy for Plan B Asia advisory services.' })}
      />
      <FocusedNavbar />

      <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-corporate-navy text-holistic">
        <div className="container max-w-3xl text-center px-6">
          <h1 className="heading-display text-holistic mb-4">{t('legal.refundHeading')}</h1>
          <p className="body-editorial text-holistic/60">{t('legal.lastUpdated', { date: '2026-03-19' })}</p>
        </div>
      </section>

      <section className="section-editorial">
        <div className="container max-w-3xl px-6 prose prose-lg dark:prose-invert">
          <h2>{t('legal.refund.advisoryTitle')}</h2>
          <p>{t('legal.refund.advisoryBody')}</p>

          <h2>{t('legal.refund.noRefundTitle')}</h2>
          <p>{t('legal.refund.noRefundBody')}</p>

          <h2>{t('legal.refund.cancellationTitle')}</h2>
          <p>{t('legal.refund.cancellationBody')}</p>

          <h2>{t('legal.refund.disputeTitle')}</h2>
          <p>{t('legal.refund.disputeBody')}</p>

          <h2>{t('legal.refund.contactTitle')}</h2>
          <p>{t('legal.refund.contactBody')}</p>
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
