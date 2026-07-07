import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { XCircle, MessageCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { trackPostHogEvent } from '@/lib/posthog';
import { useEffect } from 'react';

export default function CheckoutCanceled() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const serviceTitle = searchParams.get('service') || '';

  useEffect(() => {
    trackPostHogEvent('checkout_canceled', { service_title: serviceTitle }, true);
  }, [serviceTitle]);

  const waMessage = serviceTitle
    ? `Merhaba, ${serviceTitle} hakkında biraz daha bilgi almak istiyorum, ödeme adımında dönmek zorunda kaldım.`
    : 'Merhaba, danışmanlık hakkında bilgi almak istiyorum.';
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t('checkout.canceledTitle', { defaultValue: 'Payment not completed — Plan B Asia' })}
        description=""
        noIndex={true}
      />
      <FocusedNavbar />
      <TrustBar />

      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="container max-w-2xl text-center px-6">
          <XCircle className="h-14 w-14 text-muted-foreground/60 mx-auto mb-6 stroke-[1.5]" />
          <h1 className="heading-section text-foreground mb-4">
            {t('checkout.canceledTitle', { defaultValue: 'Payment not completed' })}
          </h1>
          <p className="body-editorial text-muted-foreground mb-8">
            {t('checkout.canceledDesc', { defaultValue: 'Your payment was not completed. You can try again anytime — or reach out to us on WhatsApp and we\'ll walk you through it.' })}
          </p>

          {serviceTitle && (
            <p className="text-sm text-accent/80 font-medium mb-8">
              {serviceTitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Button
              size="lg"
              onClick={() => window.history.back()}
              variant="outline"
              className="text-xs tracking-[0.15em] uppercase px-8 py-6 h-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('checkout.canceledBack', { defaultValue: 'Try Again' })}
            </Button>

            <Button
              size="lg"
              onClick={() => window.open(whatsappUrl, '_blank')}
              className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-8 py-6 h-auto"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {t('checkout.canceledWhatsapp', { defaultValue: 'Message Us on WhatsApp' })}
            </Button>
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            {t('checkout.canceledHome', { defaultValue: 'Back to home' })}
          </a>
        </div>
      </section>
    </div>
  );
}
