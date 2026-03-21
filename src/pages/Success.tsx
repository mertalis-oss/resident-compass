import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { trackPostHogEvent } from '@/lib/posthog';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import { CheckCircle, MessageCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const WHATSAPP_NUMBER = '905551234567';

export default function Success() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [verifyFailed, setVerifyFailed] = useState(false);
  const [serviceTitle, setServiceTitle] = useState('');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId || sessionId.length < 10) {
      navigate('/', { replace: true });
      return;
    }

    // Attempt backend verification with timeout
    const verifySession = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 8000)
        );

        const fetchPromise = supabase.functions.invoke('verify-checkout-session', {
          body: { session_id: sessionId },
        });

        const result = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (result?.data?.service_title) {
          setServiceTitle(result.data.service_title);
        } else {
          // Fallback: use URL param if backend didn't return title
          setServiceTitle(searchParams.get('service') || '');
        }
        setVerified(true);
      } catch {
        // Backend verification failed - show fallback
        setServiceTitle(searchParams.get('service') || '');
        // Still show success but with a softer verification
        const timer = setTimeout(() => {
          setVerified(true);
          // If no service title at all, mark as unverified
          if (!searchParams.get('service')) {
            setVerifyFailed(true);
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    };

    // Show skeleton for min 1.5s
    const minTimer = setTimeout(() => {
      verifySession();
    }, 1500);

    return () => clearTimeout(minTimer);
  }, [sessionId, navigate, searchParams]);

  const whatsappUrl = serviceTitle
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I just completed a purchase for ${serviceTitle}`)}`
    : `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I just completed a purchase.')}`;

  const handleWhatsAppClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'success_page' });
    window.open(whatsappUrl, '_blank');
  };

  if (!verified) {
    return (
      <div className="min-h-screen bg-background">
        <FocusedNavbar />
        <TrustBar />
        <div className="flex flex-col items-center justify-center pt-40 gap-6">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
          <p className="font-heading text-xl text-foreground">
            {t('success.verifying', { defaultValue: 'Verifying your secure payment...' })}
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

  if (verifyFailed) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title={t('success.pageTitle', { defaultValue: 'Order Confirmed — Plan B Asia' })} description="" />
        <FocusedNavbar />
        <TrustBar />
        <section className="pt-32 pb-20 md:pt-44 md:pb-28">
          <div className="container max-w-2xl text-center px-6">
            <AlertTriangle className="h-12 w-12 text-gold mx-auto mb-6" />
            <h1 className="heading-section text-foreground mb-4">
              {t('success.verifyFailedTitle', { defaultValue: "We couldn't verify your payment automatically" })}
            </h1>
            <p className="body-editorial text-muted-foreground mb-8">
              {t('success.verifyFailedBody', { defaultValue: 'Please contact support with your email address. Our team will confirm your order manually.' })}
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
          <p className="body-editorial text-accent mb-12">
            {t('success.dopamine', { defaultValue: 'You just removed a major uncertainty from your path.' })}
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
