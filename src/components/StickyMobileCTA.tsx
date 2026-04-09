import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useDomainScope } from '@/hooks/useDomainScope';
import { Button } from '@/components/ui/button';
import { buildWhatsAppUrl } from '@/lib/constants';

interface Props {
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

/** Pages where StickyMobileCTA must NOT appear */
const HIDDEN_PATHS = ['/success', '/login', '/checkout'];

export default function StickyMobileCTA({ id, onClick, disabled, loading, className }: Props) {
  const { t } = useTranslation();
  const scope = useDomainScope();
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const computeVisibility = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    const pastThreshold = scrollPercent >= 40;

    const checkoutEl = document.getElementById('checkout') || document.getElementById('checkout-section');
    let checkoutVisible = false;
    if (checkoutEl) {
      const rect = checkoutEl.getBoundingClientRect();
      checkoutVisible = rect.top < window.innerHeight && rect.bottom > 0;
    }

    return pastThreshold && !checkoutVisible;
  }, []);

  useEffect(() => {
    let ticking = false;
    let lastVisible = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const nowVisible = computeVisibility();
        if (nowVisible !== lastVisible) {
          lastVisible = nowVisible;
          setVisible(nowVisible);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [computeVisibility]);

  // Hide on excluded pages
  const isHiddenPage = HIDDEN_PATHS.some(p => location.pathname.startsWith(p));
  if (isHiddenPage) return null;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (scope === 'tr') {
      document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const url = buildWhatsAppUrl('Page: Sticky CTA | Intent: strategic-review | Domain: planbasia.com');
      try { window.open(url, '_blank'); } catch { window.location.href = url; }
    }
  };

  const label = scope === 'tr'
    ? t('stickyCta.label', { defaultValue: 'Asya Planımı Başlat' })
    : 'Speak with Strategic Advisor';

  return (
    <div
      id={id}
      className={`fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border p-3 md:hidden transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${className || ''}`}
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <Button
        size="lg"
        onClick={handleClick}
        disabled={disabled || loading}
        className="w-full btn-luxury-gold text-xs tracking-[0.15em] uppercase h-auto"
        style={{ minHeight: '48px' }}
      >
        {loading
          ? t('checkout.processing', { defaultValue: 'İşleniyor...' })
          : label}
      </Button>
    </div>
  );
}
