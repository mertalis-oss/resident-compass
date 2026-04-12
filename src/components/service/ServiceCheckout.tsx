import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { getStoredUtms } from "@/lib/utmStorage";
import { trackPostHogEvent } from "@/lib/posthog";
import { trackEvent } from "@/lib/analytics";
import { normalizeEmail } from "@/lib/emailNormalize";
import { safeGet, cleanupFallback } from "@/lib/safeStorage";
import { getDomainScope } from "@/hooks/useDomainScope";
import { renderPrice } from "@/lib/formatPrice";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Clock, Lock, CreditCard, MessageCircle, AlertTriangle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import type { Service } from "@/pages/ServicePage";

interface Props {
  service: Service;
  variant?: "full" | "mirror";
  layout?: "standalone" | "grid";
}

const scope = getDomainScope();

export default function ServiceCheckout({ service, variant = "full", layout = "standalone" }: Props) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [showRescue, setShowRescue] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Ref-based locks for reliability
  const sessionKey = useRef(window.__session_id || `s_${Date.now()}`);
  const clickLock = useRef(false);

  const handleModalChange = (open: boolean) => {
    if (!open) {
      setIsAgreed(false);
      setIsCheckoutLoading(false);
      setShowRescue(false);
      clickLock.current = false;
    }
    setModalOpen(open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  const showLeadRescue = () => {
    setShowRescue(true);
    setIsCheckoutLoading(false);
  };

  const handleCheckout = async () => {
    if (isCheckoutLoading || !isAgreed) return;
    setIsCheckoutLoading(true);

    try {
      const utms = getStoredUtms() || {};
      const normalizedHost = window.location.hostname.replace(/^www\./i, "").toLowerCase();
      const leadId = safeGet("planb_lead_id") || "";
      const leadEmail = normalizeEmail(safeGet("planb_lead_email"));

      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          service_id: service.id,
          source_domain: normalizedHost,
          agreed_to_terms: "true",
          utm_source: String(utms?.utm_source || ""),
          utm_campaign: String(utms?.utm_campaign || ""),
          utm_medium: String(utms?.utm_medium || ""),
          lead_id: leadId,
          email: leadEmail,
        },
      });

      if (error || !data?.url) {
        if (data?.error === "INVALID_PRICE_ID") {
          showLeadRescue();
        } else {
          throw new Error("Stripe session failed");
        }
        return;
      }

      trackPostHogEvent("cta_clicked", { service_id: service.id, destination: "stripe" }, true);
      cleanupFallback("planb_lead_id");
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout process failed:", err);
      toast({
        variant: "destructive",
        title: t("checkout.errorTitle"),
        description: t("checkout.errorDesc"),
      });
      setIsCheckoutLoading(false);
    }
  };

  const isPlaceholder =
    service.stripe_price_id &&
    (/xxx|placeholder/i.test(service.stripe_price_id) || !service.stripe_price_id.startsWith("price_"));

  // FAILSAFE: WhatsApp Rescue UI
  if (!service.stripe_price_id || isPlaceholder || showRescue) {
    const rescueWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      scope === "tr"
        ? `Merhaba, ${service.title} hizmeti hakkında bilgi almak istiyorum.`
        : `Hello, I would like to learn more about ${service.title}.`,
    )}`;

    return (
      <section id="checkout-section" className="section-editorial border-t border-border">
        <div className="container max-w-2xl px-6 text-center py-16">
          <AlertTriangle className="h-10 w-10 text-accent mx-auto mb-6" />
          <h3 className="font-heading text-xl mb-4">
            {scope === "tr" ? "Hizmet şu anda güncelleniyor." : "Service is currently being updated."}
          </h3>
          <Button
            size="lg"
            onClick={() => window.open(rescueWhatsapp, "_blank")}
            className="btn-luxury-gold px-10 py-6 h-auto"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {scope === "tr" ? "WhatsApp ile İletişime Geçin" : "Contact Us on WhatsApp"}
          </Button>
        </div>
      </section>
    );
  }

  const { display: priceDisplay } = renderPrice(service.price, service.currency || "USD", scope);
  const isFeatured = Boolean(service.is_featured);

  const card = (
    <div
      className={cn(
        "relative flex flex-col justify-between rounded-2xl border border-muted/40 bg-card/80 backdrop-blur-sm transition-all duration-300 p-6 md:p-7 min-h-[420px]",
        isFeatured && "ring-1 ring-foreground/10 md:scale-[1.02]",
      )}
    >
      <div>
        <h2 className="font-heading text-lg font-semibold text-foreground mb-3">{service.title}</h2>
        {service.short_description && (
          <p className="text-muted-foreground text-sm mt-1 mb-4">{service.short_description}</p>
        )}
        <div className="border-t border-border my-4 opacity-50" />
        <p className="font-heading text-3xl font-medium text-accent mt-4 mb-5">{priceDisplay}</p>
        <p className="text-xs text-muted-foreground mb-4">{t("checkout.advisorySubtitle")}</p>
      </div>
      <div className="mt-auto">
        <Button
          variant={isFeatured ? "default" : "outline"}
          className="w-full rounded-xl font-medium h-12"
          onClick={() => {
            if (clickLock.current || modalOpen) return;
            console.log("CTA CLICK FIRED", { service: service.slug, price: service.price });
            clickLock.current = true;
            try {
              trackEvent("checkout_click", {
                service: service.slug || service.id,
                price: service.price,
                currency: service.currency || "USD",
              });
              setModalOpen(true);
            } catch (err) {
              console.error("Checkout click failed:", err);
              clickLock.current = false;
            }
          }}
          disabled={modalOpen}
        >
          {t("checkout.initializeLabel")}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {layout === "grid" ? (
        card
      ) : (
        <section id="checkout-section" className="section-editorial border-t border-border">
          <div className="container max-w-2xl px-6">{card}</div>
        </section>
      )}

      <Dialog open={modalOpen} onOpenChange={handleModalChange}>
        {/* MODAL FIX: Removed relative class to fix visibility bug */}
        <DialogContent className="z-[999] p-0 overflow-hidden max-w-[560px]" id={`checkout-dialog-${service.id}`}>
          <div className="max-h-[80vh] overflow-y-auto p-6 md:p-8 pb-32">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">{service.title}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground my-6">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {t("checkout.microTime")}
              </span>
              <span className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" /> {t("checkout.microSecure")}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" /> {t("checkout.microCountries")}
              </span>
            </div>

            <p className="text-center text-sm text-muted-foreground italic mb-8">{t("checkout.hesitationKiller")}</p>

            <div className="flex items-start gap-3 mb-6">
              <Checkbox
                id="terms-agree"
                checked={isAgreed}
                onCheckedChange={(checked) => setIsAgreed(checked === true)}
              />
              <label htmlFor="terms-agree" className="text-sm cursor-pointer leading-snug">
                {t("checkout.agreementLabel")}
              </label>
            </div>

            <Button
              id="checkout-cta-btn"
              size="lg"
              onClick={handleCheckout}
              disabled={!isAgreed || isCheckoutLoading}
              className="w-full btn-luxury-gold py-6 h-auto uppercase tracking-widest"
            >
              {isCheckoutLoading ? t("checkout.redirecting") : t("checkout.ctaLabel")}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-6">
              {scope === "tr" ? "3 dakika içinde planın hazır" : "Your plan ready in 3 minutes"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
