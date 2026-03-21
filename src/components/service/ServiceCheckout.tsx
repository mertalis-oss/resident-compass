import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtms } from '@/lib/utmStorage';
import { trackPostHogEvent } from '@/lib/posthog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Clock, Lock } from 'lucide-react';
import type { Service } from '@/pages/ServicePage';

declare global {
  interface Window {
    __checkout_lock?: boolean;
    __checkout_toast_shown?: boolean;
  }
}

interface Props {
  service: Service;
  variant?: 'full' | 'mirror';
}

export default function ServiceCheckout({ service, variant = 'full' }: Props) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (isCheckoutLoading || window.__checkout_lock) return;
    window.__checkout_lock = true;
    setIsCheckoutLoading(true);

    if (!window.__checkout_toast_shown) {
      window.__checkout_toast_shown = true;
      setTimeout(() => {
        toast({
          title: t('checkout.stillProcessing', { defaultValue: 'Still processing...' }),
          description: t('checkout.stillProcessingDesc', { defaultValue: 'This can take a few seconds depending on your connection.' }),
        });
      }, 4000);
    }

    try {
      const utms = getStoredUtms() || {};
      const normalizedHost = window.location.hostname.replace(/^www\./i, '').toLowerCase().replace(/\.$/, '');

      trackPostHogEvent('checkout_started', { service_id: service.id, service_title: service.title });

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          service_id: service.id,
          source_domain: normalizedHost,
          agreed_to_terms: 'true',
          utm_source: String(utms?.utm_source || ''),
          utm_campaign: String(utms?.utm_campaign || ''),
          utm_medium: String(utms?.utm_medium || ''),
        },
      });

      if (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: t('checkout.errorTitle', { defaultValue: 'Checkout Error' }),
          description: t('checkout.errorDesc', { defaultValue: 'Something went wrong. Please try again.' }),
        });
        setIsAgreed(false);
        return;
      }
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: t('checkout.connectionError', { defaultValue: 'Connection Error' }),
        description: t('checkout.connectionErrorDesc', { defaultValue: 'Please check your connection and try again.' }),
      });
      setIsAgreed(false);
    } finally {
      window.__checkout_lock = false;
      window.__checkout_toast_shown = false;
      setIsCheckoutLoading(false);
    }
  };

  // Mirror variant: simplified CTA only
  if (variant === 'mirror') {
    return (
      <Button
        size="lg"
        onClick={() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })}
        className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
      >
        {t('service.ctaStart', { defaultValue: 'Start Your Process' })}
      </Button>
    );
  }

  return (
    <section id="checkout-section" className="section-editorial border-t border-border">
      <div className="container max-w-2xl px-6">
        {/* Micro-trust signals */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mb-8">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t('checkout.microTime', { defaultValue: 'Takes less than 2 minutes' })}</span>
          <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> {t('checkout.microSecure', { defaultValue: 'Secure Stripe checkout' })}</span>
          <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> {t('checkout.microCountries', { defaultValue: '12+ countries served' })}</span>
        </div>

        <p className="text-center text-sm text-muted-foreground italic mb-10">
          {t('checkout.hesitationKiller', { defaultValue: "You don't need to have everything figured out. That's exactly why this exists." })}
        </p>

        {/* Legal agreement */}
        <div className="flex items-start gap-3 mb-3">
          <Checkbox
            id="terms-agree"
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked === true)}
          />
          <label htmlFor="terms-agree" className="text-sm text-foreground cursor-pointer leading-snug">
            {t('checkout.agreementLabel', { defaultValue: 'I agree to the Terms of Service, Privacy Policy, and Refund Policy. I understand this is an advisory service and government decisions are independent.' })}
          </label>
        </div>
        <p className="text-xs text-muted-foreground ml-7 mb-2">
          {t('checkout.legalReinforce', { defaultValue: 'By proceeding, you confirm you understand the scope of the service.' })}
        </p>
        {!isAgreed && (
          <p className="text-xs text-destructive/70 ml-7 mb-8">
            {t('checkout.mustAccept', { defaultValue: 'You must accept the terms before proceeding.' })}
          </p>
        )}
        {isAgreed && <div className="mb-8" />}

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={handleCheckout}
          disabled={!isAgreed || isCheckoutLoading}
          className="w-full btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
        >
          {isCheckoutLoading
            ? t('checkout.processing', { defaultValue: 'Processing your secure session...' })
            : t('service.ctaStart', { defaultValue: 'Start Your Process' })}
        </Button>

        {/* What happens next */}
        <div className="mt-10 space-y-4">
          <p className="caption-editorial text-muted-foreground mb-4">
            {t('checkout.whatsNextLabel', { defaultValue: 'What happens next' })}
          </p>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-bold">1</span>
            <p className="text-sm text-foreground">{t('checkout.step1', { defaultValue: 'Secure Payment' })}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-bold">2</span>
            <p className="text-sm text-foreground">{t('checkout.step2', { defaultValue: 'We contact you via WhatsApp / Email (Within 24h)' })}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-bold">3</span>
            <p className="text-sm text-foreground">{t('checkout.step3', { defaultValue: 'Personalized process starts' })}</p>
          </div>
        </div>

        {/* Real human & risk reversal */}
        <p className="text-sm text-muted-foreground text-center mt-8 leading-relaxed">
          {t('checkout.realHuman', { defaultValue: "You'll be speaking with a real expert, not an automated system. If this service is not a fit for your situation, we will guide you to the right next step. You're one step away from getting clarity." })}
        </p>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border p-4 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <Button
          size="lg"
          onClick={isAgreed ? handleCheckout : () => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })}
          disabled={isCheckoutLoading}
          className="w-full btn-luxury-gold text-xs tracking-[0.15em] uppercase py-4 h-auto"
        >
          {isCheckoutLoading
            ? t('checkout.processing', { defaultValue: 'Processing your secure session...' })
            : t('service.ctaStart', { defaultValue: 'Start Your Process' })}
        </Button>
      </div>
    </section>
  );
}
