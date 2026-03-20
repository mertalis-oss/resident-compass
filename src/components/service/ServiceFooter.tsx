import { useTranslation } from 'react-i18next';

export default function ServiceFooter() {
  const { t } = useTranslation();

  return (
    <footer className="py-16 bg-corporate-navy border-t border-border/10">
      <div className="container max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} Atropox OÜ
        </span>
        <div className="flex gap-10 text-xs text-holistic/40 tracking-[0.2em] uppercase">
          <a href="/privacy-policy" className="hover:text-holistic/70 transition-colors duration-500">{t('footer.privacy')}</a>
          <a href="/terms-of-service" className="hover:text-holistic/70 transition-colors duration-500">{t('footer.terms')}</a>
          <a href="/refund-policy" className="hover:text-holistic/70 transition-colors duration-500">{t('footer.refund')}</a>
        </div>
      </div>
    </footer>
  );
}
