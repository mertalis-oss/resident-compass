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
      className={`fixed bottom-0 left-0 right-0 z-[9999] bg-background/95 backdrop-blur border-t border-border p-3 md:hidden ${className || ''}`}
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
