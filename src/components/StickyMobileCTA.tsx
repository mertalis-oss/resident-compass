import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDomainScope } from '@/hooks/useDomainScope';
import { Button } from '@/components/ui/button';

interface Props {
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function StickyMobileCTA({ id, onClick, disabled, loading, className }: Props) {
  const { t } = useTranslation();
  const scope = useDomainScope();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

        // Show after 20% scroll
        const pastThreshold = scrollPercent >= 20;

        // Hide if checkout section is visible in viewport
        const checkoutEl = document.getElementById('checkout') || document.getElementById('checkout-section');
        let checkoutVisible = false;
        if (checkoutEl) {
          const rect = checkoutEl.getBoundingClientRect();
          checkoutVisible = rect.top < window.innerHeight && rect.bottom > 0;
        }

        setVisible(pastThreshold && !checkoutVisible);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Only show on TR domain mobile
  if (scope !== 'tr') return null;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id={id}
      className={`fixed bottom-0 left-0 right-0 z-[9999] bg-background/95 backdrop-blur border-t border-border p-3 md:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
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
          : t('stickyCta.label', { defaultValue: 'Başvurumu Güvenceye Al' })}
      </Button>
    </div>
  );
}
