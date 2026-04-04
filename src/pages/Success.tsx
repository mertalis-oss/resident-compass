import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { trackPostHogEvent } from '@/lib/posthog';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import { CheckCircle, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { WHATSAPP_NUMBER } from '@/lib/constants';

export default function Success() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'polling' | 'paid' | 'timeout'>('polling');
  const [serviceTitle, setServiceTitle] = useState('');
  const sessionId = searchParams.get('session_id');
  const pollCount = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const eventFired = useRef(false);
  const initLock = useRef(false);

  useEffect(() => {
    if (!sessionId || sessionId.length < 10) {
      navigate('/', { replace: true });
      return;
    }

    // Session-scoped initialization lock
    if (initLock.current) return;
    initLock.current = true;

    const poll = async () => {
      pollCount.current++;

      try {
        const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
          body: { session_id: sessionId },
        });

        if (data?.verified && (data?.status === 'paid' || data?.status === 'complete')) {
          if (pollTimer.current) clearInterval(pollTimer.current);
          setServiceTitle(data.service_title || searchParams.get('service') || '');
          setStatus('paid');

          if (!eventFired.current) {
            eventFired.current = true;
            trackPostHogEvent('payment_success', {
              session_id: sessionId,
              service_title: data.service_title || '',
            }, true);
          }
          return;
        }
      } catch {
        // Keep polling — NEVER show error state
      }

      // Timeout after 20 polls (60s) — show neutral pending, not error
      if (pollCount.current >= 20) {
        if (pollTimer.current) clearInterval(pollTimer.current);
        setServiceTitle(searchParams.get('service') || '');
        setStatus('timeout');
      }
    };

    const initialTimer = setTimeout(() => {
      poll();
      pollTimer.current = setInterval(poll, 3000);
    }, 1500);

    return () => {
      clearTimeout(initialTimer);
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [sessionId, navigate, searchParams]);

  const whatsappUrl = serviceTitle
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I just completed a purchase for ${serviceTitle}`)}`
    : `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I just completed a purchase.')}`;

  const handleWhatsAppClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'success_page' }, true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 150);
  };

  // Loading/polling state
  if (status === 'polling') {
    return (
      <div className="min-h-screen bg-background">
        <FocusedNavbar />
        <TrustBar />
        <div className="flex flex-col items-center justify-center pt-40 gap-6">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
          <p className="font-heading text-xl text-foreground">
            {t('success.verifying', { defaultValue: "We're verifying your payment..." })}
          </p>
          <div className="space-y-3 max-w-sm w-full px-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  // Timeout state — VIP neutral, never error
  if (status === 'timeout') {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title={t('success.pageTitle', { defaultValue: 'Order Confirmed — Plan B Asia' })} description="" />
        <FocusedNavbar />
        <TrustBar />
        <section className="pt-32 pb-20 md:pt-44 md:pb-28">
          <div className="container max-w-2xl text-center px-6">
            <CheckCircle className="h-14 w-14 text-gold mx-auto mb-6 stroke-[1.5]" />
            <h1 className="heading-section text-foreground mb-4">
              {t('success.timeoutTitle', { defaultValue: 'Payment received' })}
            </h1>
            <p className="body-editorial text-muted-foreground mb-4">
              {t('success.timeoutBody', { defaultValue: 'Ödemeniz sistemimize ulaşmıştır. Teknik doğrulama süreci devam ediyor. Her durumda sizinle manuel olarak iletişime geçeceğiz.' })}
            </p>
            <p className="text-sm text-accent font-medium mb-8">
              {t('success.teamWorking', { defaultValue: 'Ekibimiz şu an planınızı hazırlıyor.' })}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {t('success.timeoutCta', { defaultValue: "Didn't receive confirmation? Contact us on WhatsApp." })}
            </p>
            <Button size="lg" onClick={handleWhatsAppClick} className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto">
              <MessageCircle className="mr-2 h-4 w-4" />
              {t('success.contactSupport', { defaultValue: 'Contact Support' })}
            </Button>
          </div>
        </section>
      </div>
    );
  }

  // Success (paid) — VIP microcopy
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t('success.pageTitle', { defaultValue: 'Order Confirmed — Plan B Asia' })}
        description=""
      />
      <FocusedNavbar />
      <TrustBar />

      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="container max-w-2xl text-center px-6">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-6 stroke-[1.5]" />
          <h1 className="heading-section text-foreground mb-4">
            {t('success.title', { defaultValue: 'Order Successfully Received' })}
          </h1>
          <p className="body-editorial text-accent mb-4">
            {t('success.dopamine', { defaultValue: 'You just removed a major uncertainty from your path.' })}
          </p>
          <p className="text-sm text-accent/80 font-medium mb-4">
            {t('success.teamWorking', { defaultValue: 'Ekibimiz şu an planınızı hazırlıyor.' })}
          </p>
          <p className="text-sm text-muted-foreground mb-12">
            {t('success.vipNote', { defaultValue: 'Size özel süreciniz başlatıldı. Şu anda sistemde önceliklendirildiniz. Genellikle birkaç saat, en geç 24 saat içinde sizinle iletişime geçiyoruz.' })}
          </p>

          {/* Next steps */}
          <div className="text-left max-w-md mx-auto space-y-5 mb-10">
            <p className="caption-editorial text-muted-foreground mb-4">
              {t('success.nextStepsLabel', { defaultValue: 'What happens now' })}
            </p>
            {[
              t('success.step1', { defaultValue: 'Our team reviews your case' }),
              t('success.step2', { defaultValue: 'We contact you within 24 hours' }),
              t('success.step3', { defaultValue: 'You receive your personalized next steps' }),
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground">{step}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-2">
            {t('success.relief', { defaultValue: 'No further action is required from your side right now.' })}
          </p>
          <p className="text-xs text-muted-foreground mb-10">
            {t('success.avgResponse', { defaultValue: 'Avg. first response: 2h' })}
          </p>

          {/* WhatsApp CTA */}
          <p className="text-sm text-muted-foreground mb-4">
            {t('success.whatsappPush', { defaultValue: 'We already have your request. Most clients message us here to get faster responses.' })}
          </p>
          <Button
            size="lg"
            onClick={handleWhatsAppClick}
            className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t('success.whatsappCta', { defaultValue: 'Message Us on WhatsApp' })}
          </Button>
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-border/10">
        <div className="container max-w-5xl px-6 text-center">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
        </div>
      </footer>
    </div>
  );
}
