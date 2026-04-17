import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { buildWaUrl, handleVipWhatsAppClick } from '@/lib/vipWhatsApp';
import { useDomainScope } from '@/hooks/useDomainScope';

export default function ServiceFooter() {
  const { t } = useTranslation();
  const sourceSite = useDomainScope();
  const clickLock = useRef(false);

  return (
    <footer className="py-16 bg-corporate-navy border-t border-border/10">
      <div className="container max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} Atropox OÜ
        </span>
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="flex gap-10 text-xs text-holistic/40 tracking-[0.2em] uppercase">
            <a href="/privacy-policy" className="hover:text-holistic/70 transition-colors duration-500">{t('footer.privacy')}</a>
            <a href="/terms-of-service" className="hover:text-holistic/70 transition-colors duration-500">{t('footer.terms')}</a>
            <a href="/refund-policy" className="hover:text-holistic/70 transition-colors duration-500">{t('footer.refund')}</a>
          </div>
          <a
            href={buildWaUrl('VIP_FOOTER', undefined, sourceSite) ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleVipWhatsAppClick(e, 'VIP_FOOTER', clickLock, undefined, sourceSite)}
            className="opacity-60 text-xs hover:opacity-100 transition-opacity text-holistic"
          >
            Direct line (existing clients & qualified cases)
          </a>
        </div>
      </div>
    </footer>
  );
}
