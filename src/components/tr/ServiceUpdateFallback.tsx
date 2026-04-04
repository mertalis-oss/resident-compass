import { MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildWhatsAppUrl } from '@/lib/constants';
import { trackPostHogEvent } from '@/lib/posthog';

interface Props {
  context?: string;
  message?: string;
}

/**
 * DRY reusable fallback for:
 *  - State B: fetch error
 *  - State C: missing/invalid service data
 *  - State E: checkout session failure
 */
export default function ServiceUpdateFallback({ context = 'unknown', message }: Props) {
  const whatsappUrl = buildWhatsAppUrl(
    `Sayfa: ${context} | Domain: ${window.location.hostname} | Merhaba, yardımınıza ihtiyacım var.`
  );

  const handleClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'service_fallback', context }, true);
    setTimeout(() => window.open(whatsappUrl, '_blank'), 150);
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-lg mx-auto">
      <AlertTriangle className="h-10 w-10 text-accent mb-6" />
      <p className="font-heading text-lg mb-4 text-foreground">
        {message || 'Bu hizmet paketinin altyapısı şu anda güncellenmektedir. Lütfen WhatsApp üzerinden ekibimizle iletişime geçin.'}
      </p>
      <Button
        size="lg"
        onClick={handleClick}
        className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        WhatsApp ile İletişime Geçin
      </Button>
    </div>
  );
}
