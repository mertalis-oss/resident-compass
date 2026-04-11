import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtms } from '@/lib/utmStorage';
import { trackPostHogEvent } from '@/lib/posthog';
import { trackEvent } from '@/lib/analytics';
import { normalizeEmail } from '@/lib/emailNormalize';
import { safeGet, cleanupFallback } from '@/lib/safeStorage';
import { getDomainScope } from '@/hooks/useDomainScope';
import { renderPrice, resolveCurrency } from '@/lib/formatPrice';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Clock, Lock, CreditCard, MessageCircle, AlertTriangle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';
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
  layout?: 'standalone' | 'grid';
}

const scope = getDomainScope();

export default function ServiceCheckout({ service, variant = 'full', layout = 'standalone' }: Props) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [showRescue, setShowRescue] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const sessionKey = useRef(window.__session_id || `s_${Date.now()}`);

  const handleModalChange = (open: boolean) => {
    if (!open) {
      setIsAgreed(false);
      setIsCheckoutLoading(false);
      setShowRescue(false);
    }
    setModalOpen(open);
    if (!open && document.body.style.overflow === 'hidden') {
      document.body.style.overflow = '';
    } else if (open) {
      document.body.style.overflow = 'hidden';
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!modalOpen && document.body.style.overflow === 'hidden') {
      document.body.style.overflow = '';
    }
  }, [modalOpen]);

  const showLeadRescue = () => {
    setShowRescue(true);
    setIsCheckoutLoading(false);
    window.__checkout_lock = false;
  };

  const handleCheckout = async () => {
    const stateKey = `checkout_${service.slug}`;
    window.__state = window.__state || {};
    window.__state[sessionKey.current] = window.__state[sessionKey.current] || {};
    if (window.__state[sessionKey.current][stateKey]) return;

    if (isCheckoutLoading || window.__checkout_lock) return;
    window.__checkout_lock = true;
    window.__state[sessionKey.current][stateKey] = true;
    setIsCheckoutLoading(true);
    const btn = document.querySelector('#checkout-cta-btn') as HTMLButtonElement | null;
    if (btn) btn.disabled = true;

    const slowTimer = setTimeout(() => {
      if (window.__checkout_lock) {
        toast({
          title: t('checkout.stillProcessing'),
          description: t('checkout.connectionSlow'),
        });
      }
    }, 8000);

    try {
      const utms = getStoredUtms() || {};
      const normalizedHost = window.location.hostname.replace(/^www\./i, '').toLowerCase().replace(/\.$/, '');
      const leadId = safeGet('planb_lead_id') || '';
      const leadEmail = normalizeEmail(safeGet('planb_lead_email'));
      const recommendedService = safeGet('planb_last_recommendation') || '';

      window.__cta_fired = window.__cta_fired || {};
      if (!window.__cta_fired[service.slug]) {
        window.__cta_fired[service.slug] = true;
        trackPostHogEvent('checkout_started', { service_id: service.id, service_title: service.title }, true);
      }

      const checkoutPromise = supabase.functions.invoke('create-checkout-session', {
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

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('CHECKOUT_TIMEOUT')), 5000)
      );

      let result: { data: any; error: any };
      try {
        result = await Promise.race([checkoutPromise, timeoutPromise]) as any;
      } catch (timeoutErr) {
        if (window.__cta_fired) delete window.__cta_fired[service.slug];
        if (window.__state?.[sessionKey.current]) delete window.__state[sessionKey.current][stateKey];
        showLeadRescue();
        return;
      }

      const { data, error } = result;

      if (error || data?.error === 'INVALID_PRICE_ID') {
        console.error(error || data?.error);
        if (window.__cta_fired) delete window.__cta_fired[service.slug];
        if (window.__state?.[sessionKey.current]) delete window.__state[sessionKey.current][stateKey];
        if (data?.error === 'INVALID_PRICE_ID') {
          showLeadRescue();
        } else {
          toast({
            variant: 'destructive',
            title: t('checkout.errorTitle'),
            description: t('checkout.errorDesc'),
          });
          setIsAgreed(false);
        }
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
        title: t('checkout.connectionError'),
        description: t('checkout.connectionErrorDesc'),
      });
      setIsAgreed(false);
    } finally {
      clearTimeout(slowTimer);
      window.__checkout_lock = false;
      window.__checkout_toast_shown = false;
      setIsCheckoutLoading(false);
    }
  };

  const rescueWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Service: ' + service.slug + ' | Time: ' + Date.now() + ' | Domain: ' + window.location.hostname)}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Merhaba, planımı inceledim. Ödeme öncesi kısa bir sorum var:')}`;

  const handleWhatsAppClick = () => {
    trackPostHogEvent('whatsapp_click', { source: 'checkout_escape', service: service.slug }, true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 150);
  };

  const isPlaceholder = service.stripe_price_id && (/xxx|placeholder/i.test(service.stripe_price_id) || !service.stripe_price_id.startsWith('price_'));
  if (isPlaceholder) {
    console.warn('STRIPE PLACEHOLDER DETECTED:', service.stripe_price_id, '— Real price_id needed from Stripe Dashboard.');
  }

  // LEAD-RESCUE FAILSAFE
  if (!service.stripe_price_id || isPlaceholder || showRescue) {
    const rescueWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      scope === 'tr'
        ? 'Merhaba, ' + service.title + ' hizmeti hakkında bilgi almak istiyorum.'
        : 'Hello, I would like to learn more about ' + service.title + '.'
    )}`;
    return (
      <section id="checkout-section" className="section-editorial border-t border-border">
        <div className="container max-w-2xl px-6 text-center py-16">
          <AlertTriangle className="h-10 w-10 text-accent mx-auto mb-6" />
          <h3 className="font-heading text-xl mb-4">
            {scope === 'tr'
              ? 'Paket şu anda güncelleniyor. Size hemen yardımcı olalım.'
              : 'This package is currently being updated. Let us help you right away.'}
          </h3>
          <p className="text-sm text-muted-foreground mb-8">
            {scope === 'tr'
              ? 'WhatsApp üzerinden bize ulaşın, en kısa sürede size dönüş yapalım.'
              : 'Reach out to us on WhatsApp and we\'ll get back to you shortly.'}
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
            {scope === 'tr' ? 'WhatsApp ile İletişime Geçin' : 'Contact Us on WhatsApp'}
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
        {t('service.ctaStart')}
      </Button>
    );
  }

  const { display: priceDisplay, isPrivate, resolvedCurrency } = renderPrice(
    service.price,
    service.currency || 'USD',
    scope
  );
  const currencyLabel = resolvedCurrency;

  const isFeatured = Boolean(service.is_featured);

  const card = (
    <div className={cn(
      'relative flex flex-col justify-between rounded-2xl border border-muted/40 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 min-h-[420px] p-6 md:p-7',
      isFeatured && 'ring-1 ring-foreground/10 md:scale-[1.02]'
    )}>
      <div>
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground mb-3">{service.title}</h2>
        {service.short_description && (
          <p className="text-muted-foreground text-sm mt-1 mb-4">{service.short_description}</p>
        )}
        <div className="border-t border-border my-4 opacity-50" />
        {isPrivate ? (
          <p className="font-heading text-lg text-accent mt-4 mb-5">{priceDisplay}</p>
        ) : (
          <p className="font-heading text-3xl md:text-4xl font-medium tracking-tight text-foreground md:text-accent mt-4 mb-5">
            <span className="whitespace-nowrap">{priceDisplay}</span>
          </p>
        )}
        <p className="text-xs text-muted-foreground mb-4">{t('checkout.advisorySubtitle')}</p>
      </div>
      <div className="mt-auto">
        <Button
          variant={isFeatured ? "default" : "outline"}
          className="w-full rounded-xl font-medium h-12"
          onClick={() => {
            trackEvent('checkout_click', {
              service: service.slug || service.id || 'unknown_service',
              price: service.price,
              currency: service.currency || 'USD',
            });
            setModalOpen(true);
          }}
          disabled={modalOpen}
          aria-label={`Begin advisory for ${service.title}`}
        >
          {t('checkout.initializeLabel')}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {layout === 'grid' ? (
        card
      ) : (
        <section id="checkout-section" className="section-editorial border-t border-border">
          <div className="container max-w-2xl px-6">
            {card}
          </div>
        </section>
      )}

      {/* LAYER 2 — Interstitial Modal */}
      <Dialog open={modalOpen} onOpenChange={handleModalChange}>
        <DialogContent className="relative z-[999] p-0 overflow-hidden max-w-[560px]" id={`checkout-dialog-${service.id ?? service.slug ?? 'default'}`}>
          {/* Scrollable inner wrapper */}
          <div className="max-h-[80vh] overflow-y-auto p-6 md:p-8 pb-32">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {service.title}
                {!isPrivate && (
                  <span className="block text-accent text-2xl mt-1 whitespace-nowrap">{priceDisplay}</span>
                )}
              </DialogTitle>
            </DialogHeader>

            {/* Micro-trust signals */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t('checkout.microTime')}</span>
              <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> {t('checkout.microSecure')}</span>
              <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> {t('checkout.microCountries')}</span>
            </div>

            <p className="text-center text-sm text-muted-foreground italic mb-8">
              {t('checkout.hesitationKiller')}
            </p>

            {/* Price justification */}
            <div className="bg-card border border-border rounded-lg p-5 mb-6 text-center space-y-2">
              <p className="text-sm text-foreground font-medium">
                {scope === 'tr'
                  ? 'Anında erişim. Bekleme yok. Bu hizmet, durumunuza özel analiz ve yol haritasını içerir.'
                  : 'Instant access. No waiting. This service includes a personalized analysis and roadmap for your situation.'}
              </p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <Lock className="h-3 w-3" />
                {scope === 'tr' ? 'Güvenli ödeme altyapısı (Stripe)' : 'Secure payment infrastructure (Stripe)'}
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
                {t('checkout.agreementLabel')}
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-7 mb-2">
              {t('checkout.legalReinforce')}
            </p>
            {!isAgreed && (
              <p className="text-xs text-destructive/70 ml-7 mb-6">
                {t('checkout.mustAccept')}
              </p>
            )}

            {/* WhatsApp Escape Hatch */}
            <div className="text-center mt-6 space-y-1.5">
              <p className="text-xs text-muted-foreground">
                {scope === 'tr' ? 'Ödeme öncesi hızlı sorular için' : 'Quick questions before payment?'}
              </p>
              <button onClick={handleWhatsAppClick} className="text-xs text-accent hover:text-accent/80 underline underline-offset-4 transition-colors inline-flex items-center gap-1.5">
                <MessageCircle className="h-3 w-3" />
                {scope === 'tr' ? "WhatsApp'tan yazın" : 'Message us on WhatsApp'}
              </button>
            </div>

            {/* What happens next */}
            <div className="mt-8 space-y-4">
              <p className="caption-editorial text-muted-foreground mb-4">
                {t('checkout.whatsNextLabel')}
              </p>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-bold">1</span>
                <p className="text-sm text-foreground">{t('checkout.step1')}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-bold">2</span>
                <p className="text-sm text-foreground">{t('checkout.step2')}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-bold">3</span>
                <p className="text-sm text-foreground">{t('checkout.step3')}</p>
              </div>
            </div>

            {/* Real human */}
            <p className="text-sm text-muted-foreground text-center mt-8 leading-relaxed">
              {t('checkout.realHuman')}
            </p>

            {/* Legal Disclaimer */}
            <p className="text-[10px] text-muted-foreground/60 text-center mt-4 max-w-lg mx-auto leading-relaxed">
              {scope === 'tr'
                ? 'Bu bir dijital danışmanlık hizmetidir. Fiziksel ürün gönderimi yapılmaz. Devam ederek kişiselleştirilmiş danışmanlık hizmeti almayı kabul etmiş olursunuz.'
                : 'This is a digital consulting service. No physical product will be shipped. By proceeding, you agree to receive a personalized advisory service.'}
            </p>
          </div>

          {/* Sticky CTA footer — solid bg, no transparency artifacts */}
          <div className="sticky bottom-0 z-10 bg-card border-t border-border pt-4 pb-4 px-6 md:px-8">
            <p className="text-xs text-muted-foreground text-center mb-2">
              {scope === 'tr' ? 'Ortalama geri dönüş: 24 saat' : 'Average response time: 24 hours'}
            </p>
            <Button
              id="checkout-cta-btn"
              size="lg"
              onClick={handleCheckout}
              disabled={!isAgreed || isCheckoutLoading}
              className="w-full btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
            >
              {isCheckoutLoading ? t('checkout.redirecting') : t('checkout.ctaLabel')}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {scope === 'tr' ? '3 dakika içinde planın hazır' : 'Your plan ready in 3 minutes'}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
              <CreditCard className="h-3.5 w-3.5" />
              <span>{t('checkout.stripeTrust', { currencyLabel })}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
