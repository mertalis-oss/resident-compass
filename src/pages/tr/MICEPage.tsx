import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Calendar, Globe, MessageCircle, Loader } from "lucide-react";
import FocusedNavbar from "@/components/FocusedNavbar";
import TrustBar from "@/components/TrustBar";
import SEOHead from "@/components/SEOHead";
import PlanBForm from "@/components/PlanBForm";
import ComparisonCrossSell from "@/components/service/ComparisonCrossSell";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ServiceCheckout from "@/components/service/ServiceCheckout";
import ServiceWhoIsFor from "@/components/service/ServiceWhoIsFor";
import ExpectationOutcome from "@/components/service/ExpectationOutcome";
import TrustBlock from "@/components/service/TrustBlock";
import SocialProofMini from "@/components/service/SocialProofMini";
import { useServicesList } from "@/hooks/useServicesList";
import { trackPostHogEvent } from "@/lib/posthog";
import { buildWhatsAppUrl } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Calendar,
    title: "Etkinlik Planlama",
    desc: "Mekan seçiminden program akışına, ulaşımdan ekip koordinasyonuna — A'dan Z'ye sahaya koyarız.",
  },
  {
    icon: Users,
    title: "Takım Buluşmaları",
    desc: "Remote ekibini bir araya getir. Güneydoğu Asya'nın en iyi mekanları, organizasyon yükü olmadan.",
  },
  {
    icon: Building2,
    title: "Konferans & Seminer",
    desc: "Uluslararası ölçekte etkinlik kapasitesi. Asya rahatlığı ve fiyatıyla.",
  },
  {
    icon: Globe,
    title: "İncentive Turları",
    desc: "Performans ödüllendirme seyahatleri. Ekibin hak ettiği deneyim, lojistik stres olmadan.",
  },
];

export default function MICEPage() {
  const { services, isLoading } = useServicesList("corporate-retreats", "tr");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const whatsappUrl = buildWhatsAppUrl(
    "Sayfa: MICE | Domain: " +
      (typeof window !== "undefined" ? window.location.hostname : "") +
      " | Merhaba, etkinliğimizi planlamak istiyoruz.",
  );

  const handleWhatsAppClick = () => {
    trackPostHogEvent("whatsapp_click", { source: "mice_page" }, true);
    setTimeout(() => window.open(whatsappUrl, "_blank"), 150);
  };

  const scrollToForm = () => {
    document.getElementById("mice-form")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="mx-auto mt-10 h-8 w-8 animate-spin text-accent" />
      </div>
    );

  const hasServices = services.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Kurumsal Etkinlik & MICE — Plan B Asya"
        description="Tayland'da liderlik retreatları, konferans ve incentive turları. Güneydoğu Asya'da uçtan uca etkinlik organizasyonu."
        schemaType="Service"
        serviceName="MICE & Kurumsal Etkinlik"
      />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 mb-8">
              <Building2 className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">Kurumsal Çözümler</span>
            </div>
            <h1 className="heading-display text-background mb-6">
              Liderlik Kamplarından Global Etkinliklere.
              <span className="block text-accent">Güneydoğu Asya'da.</span>
            </h1>
            <p className="text-lg text-background/80 max-w-xl mb-10">
              Konferans, takım buluşması, incentive tur. Organizasyonu biz hallederiz — ekibin deneyimi yaşar.
            </p>
            <button onClick={scrollToForm} className="btn-luxury-gold inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Talebi Başlat
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2-4 */}
      <ExpectationOutcome />
      <TrustBlock />
      <SocialProofMini />

      {/* 5. CHECKOUT */}
      {hasServices && (
        <div id="checkout" className="scroll-mt-28 md:scroll-mt-36">
          <section className="section-editorial border-t border-border py-16">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 min-h-[420px] md:min-h-[480px] items-stretch auto-rows-fr">
                {services.map((s, index) => (
                  <ServiceCheckout key={s.id ?? s.slug ?? index} service={s} layout="grid" />
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 6. WHO IS FOR */}
      <ServiceWhoIsFor />

      {/* 7. Features */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Hizmetler</p>
            <h2 className="heading-section mb-4">Etkinliğinizin Her Boyutunu Yönetiyoruz</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 lg:p-10 border border-border hover:border-accent/30 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PlanBForm */}
      <section id="mice-form" className="py-20 bg-card border-t border-border scroll-mt-24">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Etkinlik Talebinizi Paylaşın</h2>
          <p className="text-center text-muted-foreground mb-8">24 saat içinde size özel plan hazırlıyoruz.</p>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">Talebiniz alındı. En kısa sürede geri döneceğiz.</p>
              <Button
                onClick={handleWhatsAppClick}
                className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
              >
                WhatsApp ile İletişime Geçin
              </Button>
            </div>
          ) : (
            <PlanBForm serviceId={services[0]?.id} onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      {/* Comparison & Cross-Sell */}
      <ComparisonCrossSell currentSlug="mice-corporate" />

      {/* Bottom CTA */}
      <section className="py-20 lg:py-32 bg-foreground text-background grain-overlay">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-section mb-6">Bir Sonraki Etkinliğiniz Burada</h2>
            <p className="body-editorial text-background/70 mb-8">
              Güneydoğu Asya'da etkinlik planlaması zaman ister. Erkenden başlayın.
            </p>
            <button onClick={scrollToForm} className="btn-luxury-gold inline-flex items-center gap-2">
              Talebi Başlat
            </button>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
        </div>
      </footer>

      <StickyMobileCTA onClick={scrollToForm} />
    </div>
  );
}
