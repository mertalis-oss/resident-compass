import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtms } from '@/lib/utmStorage';
import { trackPostHogEvent } from '@/lib/posthog';
import { normalizeEmail } from '@/lib/emailNormalize';
import { safeGet, cleanupFallback } from '@/lib/safeStorage';
import { getDomainScope } from '@/hooks/useDomainScope';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Clock, Lock, CreditCard, MessageCircle, AlertTriangle } from 'lucide-react';
import type { Service } from '@/pages/ServicePage';

declare global {
  interface Window {
    __checkout_lock?: boolean;
    __checkout_toast_shown?: boolean;
    __cta_fired?: Record<string, boolean>;
    __session_id?: string;
    __state?: Record<string, Record<string, boolean>>;
  }
}

interface Props {
  service: Service;
  variant?: 'full' | 'mirror';
}

const WHATSAPP_NUMBER = '66647036510';
const scope = getDomainScope();

export default function ServiceCheckout({ service, variant = 'full' }: Props) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const sessionKey = useRef(window.__session_id || `s_${Date.now()}`);

  const handleCheckout = async () => {
    // Session-scoped click guard
    const stateKey = `checkout_${service.slug}`;
    window.__state = window.__state || {};
    window.__state[sessionKey.current] = window.__state[sessionKey.current] || {};
    if (window.__state[sessionKey.current][stateKey]) return;

    if (isCheckoutLoading || window.__checkout_lock) return;
    window.__checkout_lock = true;
    window.__state[sessionKey.current][stateKey] = true;
    setIsCheckoutLoading(true);

    const slowTimer = setTimeout(() => {
      if (window.__checkout_lock) {
        toast({
          title: t('checkout.stillProcessing', { defaultValue: 'Still processing...' }),
          description: t('checkout.connectionSlow', { defaultValue: 'Connection is slow. Please wait...' }),
        });
      }
    }, 8000);

    try {
      const utms = getStoredUtms() || {};
      const normalizedHost = window.location.hostname.replace(/^www\./i, '').toLowerCase().replace(/\.$/, '');
      const leadId = safeGet('planb_lead_id') || '';
      const leadEmail = normalizeEmail(safeGet('planb_lead_email'));
      const recommendedService = safeGet('planb_last_recommendation') || '';

      // Scoped CTA double-fire guard
      window.__cta_fired = window.__cta_fired || {};
      if (!window.__cta_fired[service.slug]) {
        window.__cta_fired[service.slug] = true;
        trackPostHogEvent('checkout_started', { service_id: service.id, service_title: service.title }, true);
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          service_id: service.id,
          source_domain: normalizedHost,
          agreed_to_terms: 'true',
          utm_source: String(utms?.utm_source || ''),
          utm_campaign: String(utms?.utm_campaign || ''),
          utm_medium: String(utms?.utm_medium || ''),
          lead_id: leadId,
          source: leadId ? 'quiz' : 'direct',
          email: leadEmail,
          recommended_service: recommendedService,
        },
      });

      if (error) {
        console.error(error);
        if (window.__cta_fired) delete window.__cta_fired[service.slug];
        if (window.__state?.[sessionKey.current]) delete window.__state[sessionKey.current][stateKey];
        toast({
          variant: 'destructive',
          title: t('checkout.errorTitle', { defaultValue: 'Checkout Error' }),
          description: t('checkout.errorDesc', { defaultValue: 'Something went wrong. Please try again.' }),
        });
        setIsAgreed(false);
        return;
      }

      if (data?.url) {
        trackPostHogEvent('cta_clicked', { service_id: service.id, destination: 'stripe' }, true);
        cleanupFallback('planb_lead_id');
        setTimeout(() => {
          try { window.location.href = data.url; } catch { window.location.href = data.url; }
        }, 150);
      }
    } catch (err) {
      console.error(err);
      if (window.__cta_fired) delete window.__cta_fired[service.slug];
      if (window.__state?.[sessionKey.current]) delete window.__state[sessionKey.current][stateKey];
      toast({
        variant: 'destructive',
        title: t('checkout.connectionError', { defaultValue: 'Connection Error' }),
        description: t('checkout.connectionErrorDesc', { defaultValue: 'Please check your connection and try again.' }),
      });
      setIsAgreed(false);
    } finally {
      clearTimeout(slowTimer);
      window.__checkout_lock = false;
      window.__checkout_toast_shown = false;
      setIsCheckoutLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Merhaba, planımı inceledim. Ödeme öncesi kısa bir sorum var:')}`;

  const handleWhatsAppClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'checkout_escape', service: service.slug }, true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 150);
  };

  // LEAD-RESCUE FAILSAFE: If no stripe_price_id, show fallback UI
  if (!service.stripe_price_id) {
    const rescueWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Merhaba, ' + service.title + ' hizmeti hakkında bilgi almak istiyorum.')}`;
    return (
      <section id="checkout-section" className="section-editorial border-t border-border">
        <div className="container max-w-2xl px-6 text-center py-16">
          <AlertTriangle className="h-10 w-10 text-accent mx-auto mb-6" />
          <h3 className="font-heading text-xl mb-4">
            {t('checkout.rescueTitle', { defaultValue: 'Paket şu anda güncelleniyor. Size hemen yardımcı olalım.' })}
          </h3>
          <p className="text-sm text-muted-foreground mb-8">
            {t('checkout.rescueDesc', { defaultValue: 'WhatsApp üzerinden bize ulaşın, en kısa sürede size dönüş yapalım.' })}
          </p>
          <Button
            size="lg"
            onClick={() => {
              trackPostHogEvent('whatsapp_click', { source: 'lead_rescue', service: service.slug }, true);
              setTimeout(() => window.open(rescueWhatsapp, '_blank'), 150);
            }}
            className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t('checkout.rescueCta', { defaultValue: 'WhatsApp ile İletişime Geçin' })}
          </Button>
        </div>
      </section>
    );
  }

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

  const currencyLabel = (service.currency || 'USD').toUpperCase();

  return (
    <section id="checkout-section" className="section-editorial border-t border-border">
      <div className="container max-w-2xl px-6">
        {/* Stripe trust badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
          <CreditCard className="h-3.5 w-3.5" />
          <span>{t('checkout.stripeTrust', { defaultValue: `Processed securely in ${currencyLabel} by Stripe`, currencyLabel })}</span>
        </div>

        {/* Micro-trust signals */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mb-8">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t('checkout.microTime', { defaultValue: 'Takes less than 2 minutes' })}</span>
          <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> {t('checkout.microSecure', { defaultValue: 'Secure Stripe checkout' })}</span>
          <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> {t('checkout.microCountries', { defaultValue: '12+ countries served' })}</span>
        </div>

        <p className="text-center text-sm text-muted-foreground italic mb-10">
          {t('checkout.hesitationKiller', { defaultValue: "You don't need to have everything figured out. That's exactly why this exists." })}
        </p>

        {/* Price justification ABOVE CTA */}
        <div className="bg-card border border-border rounded-lg p-5 mb-8 text-center space-y-2">
          <p className="text-sm text-foreground font-medium">
            {t('checkout.priceJustify', { defaultValue: 'Anında erişim. Bekleme yok. Bu hizmet, durumunuza özel analiz ve yol haritasını içerir.' })}
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3" />
            {t('checkout.stripeSecure', { defaultValue: 'Güvenli ödeme altyapısı (Stripe)' })}
          </p>
        </div>

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
        {isAgreed && <div className="mb-4" />}

        {/* CRO: Response time + impulse copy */}
        <p className="text-xs text-muted-foreground text-center mb-2">
          {t('checkout.avgResponseTime', { defaultValue: 'Ortalama geri dönüş: 24 saat' })}
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={handleCheckout}
          disabled={!isAgreed || isCheckoutLoading}
          className="w-full btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
        >
          {isCheckoutLoading
            ? (scope === 'tr'
              ? t('checkout.redirectingTR', { defaultValue: 'Yönlendiriliyorsunuz...' })
              : t('checkout.redirectingEN', { defaultValue: 'Redirecting...' }))
            : t('checkout.ctaLabel', { defaultValue: 'Planımı Oluştur' })}
        </Button>

        {/* Post-CTA reassurance */}
        <p className="text-xs text-muted-foreground text-center mt-2">
          {t('checkout.readyIn3', { defaultValue: '3 dakika içinde planın hazır' })}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          {t('checkout.postCtaReassure', { defaultValue: 'İlk adımınız ödeme sonrası hemen başlatılır. Kart bilgileriniz sistemimizde tutulmaz.' })}
        </p>

        {/* WhatsApp Escape Hatch */}
        <div className="text-center mt-8 space-y-1.5">
          <p className="text-xs text-muted-foreground">
            {t('checkout.whatsappEscapeLabel', { defaultValue: 'Ödeme öncesi hızlı sorular için' })}
          </p>
          <button onClick={handleWhatsAppClick} className="text-xs text-accent hover:text-accent/80 underline underline-offset-4 transition-colors inline-flex items-center gap-1.5">
            <MessageCircle className="h-3 w-3" />
            {t('checkout.whatsappEscapeCta', { defaultValue: "WhatsApp'tan yazın" })}
          </button>
          <p className="text-[10px] text-muted-foreground/60">
            {t('checkout.whatsappResponseTime', { defaultValue: 'Yanıt süresi: genellikle birkaç dakika' })}
          </p>
        </div>

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
    </section>
  );
}
