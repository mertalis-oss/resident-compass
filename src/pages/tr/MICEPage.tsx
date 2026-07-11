import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Calendar, Globe, MessageCircle, Loader } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FocusedNavbar from "@/components/FocusedNavbar";
import TrustBar from "@/components/TrustBar";
import SEOHead from "@/components/SEOHead";
import MICEWizard from "@/components/advisory/MICEWizard";
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

const faqs = [
  {
    q: "Etkinliği kaç kişilik yapabiliyorsunuz?",
    a: "10-15 kişilik yönetici toplantısından 200+ kişilik konferansa kadar. Bangkok, Phuket, Phangan ve Chiang Mai'de partner mekan ağımız var.",
  },
  {
    q: "RFP hazırlama süresi ne kadar?",
    a: "Kısa etkinlik özeti ve bütçe aralığı ile 3-5 iş günü içinde ön teklif geliyor. Detaylı kapsam için 7-10 iş günü içinde tam proposal. Acil ihtiyaçları öncelik listesine alıyoruz.",
  },
  {
    q: "Türk şirketlerine özel bir farkınız var mı?",
    a: "Ana kurucumuz Mert Alis'in 15+ yıl Türk MICE sektöründe deneyimi var. Kurumsal muhasebe, tercih pattern'i, kültürel beklenti tanıdık zeminde. Türkçe dokümantasyon ve faturalama standart.",
  },
  {
    q: "Ödeme koşulları nelerdir?",
    a: "Standart yapı: %30 kapora sözleşme aşamasında, %60 etkinlik 30 gün öncesi, %10 etkinlik sonrası. Kurumsal fatura, banka havalesi ve Wise transfer kabul ediyoruz. KDV dahil şeffaf fiyatlama.",
  },
  {
    q: "En yaygın etkinlik türleri hangileri?",
    a: "Yıllık liderlik retreat (3-5 gün, Phangan veya Phuket), dealer ve partner konferansları (2-3 gün, Bangkok), incentive turları (5-7 gün, çoklu şehir kombine).",
  },
  {
    q: "Sürdürülebilir veya karbon nötr etkinlik yapıyor musunuz?",
    a: "Evet. Yerel tedarikçi tercih, plastik-free catering, karbon offset ana partnerimiz Wildlife Alliance Thailand üzerinden. İsteğe bağlı sürdürülebilirlik raporu ekleniyor.",
  },
];

const features = [
  {
    icon: Calendar,
    title: "Etkinlik Planlama",
    desc: "Mekan, program, ulaşım, koordinasyon. A'dan Z'ye sahaya koyarız.",
  },
  {
    icon: Users,
    title: "Takım Buluşmaları",
    desc: "Remote ekibi bir araya getir. Bangkok, Phuket, Phangan. Organizasyon yükü sende değil.",
  },
  {
    icon: Building2,
    title: "Konferans & Seminer",
    desc: "Uluslararası ölçekte etkinlik kapasitesi. Asya rahatlığı, Türk müşteriye özel destek.",
  },
  {
    icon: Globe,
    title: "İncentive Turları",
    desc: "Performans ödüllendirme seyahatleri. Ekibin hak ettiği deneyim, lojistik stres yok.",
  },
];

export default function MICEPage() {
  const { services, isLoading } = useServicesList("corporate-retreats", "tr");

  const scrollToForm = () => {
    trackPostHogEvent("mice_cta_click", { source: "mice_tr" }, true);
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
        description="Tayland'da kurumsal etkinlik, konferans, incentive tur. 15+ yıl MICE deneyimi. Tayland'da yerleşik ekip, Türkçe destek. Mekan, catering, ulaşım, sunum bir yerden. 3-5 iş günü içinde ön teklif."
        schemaType="Service"
        serviceName="MICE & Kurumsal Etkinlik"
        faq={faqs.map(({ q, a }) => ({ question: q, answer: a }))}
      />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. Hero */}
      <section className="relative min-h-[85vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=4000&auto=format&fit=crop')`,
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
              <span className="text-sm text-background/90 tracking-wide">15+ Yıl MICE Deneyimi</span>
            </div>
            <h1 className="heading-display text-background mb-6">
              Şirket etkinliği. Tayland'da.
              <span className="block text-accent">Türkçe konuşuruz.</span>
            </h1>
            <p className="text-lg text-background/80 max-w-xl mb-6">
              Konferans, kurumsal offsite, incentive tur. Mekan bulur, ekibi taşır, tercümanı ayarlarız. Türk şirketlerine iş yapmayı biliyoruz.
            </p>
            <div className="inline-flex flex-col items-start gap-1 bg-accent/10 border border-accent/20 px-5 py-3 mb-8">
              <span className="text-accent font-heading text-lg">24-48 saat ilk yanıt</span>
              <span className="text-background/80 text-sm">3-5 iş günü içinde ön teklif — kısa etkinlik özeti + bütçe yeter</span>
            </div>
            <button onClick={scrollToForm} className="btn-luxury-gold inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Etkinliği Başlat
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

      {/* 7.5 FAQ — B2B buyers read before submitting an RFP. FAQ JSON-LD
          is emitted by SEOHead separately for search engines; this section
          renders the same answers visibly for the user. */}
      <section className="py-20 lg:py-24 bg-background border-t border-border/40">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="caption-editorial text-accent mb-4">Sık Sorulan Sorular</p>
            <h2 className="heading-section">Merak edilenler</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`mice-faq-${i}`}
                  className="bg-card border border-border px-6 data-[state=open]:ring-1 data-[state=open]:ring-accent/30"
                >
                  <AccordionTrigger className="text-left font-heading text-lg hover:no-underline hover:text-accent transition-colors py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 8. MICE RFP Wizard — 3-step progressive corporate intake.
          Do NOT wire SimplifiedAssessmentModal here (that's individual
          relocation qualification, wrong lead type). MICEWizard collects
          company, contact, event brief, and budget in a 3-step wizard. */}
      <section id="mice-form" className="py-20 bg-card border-t border-border scroll-mt-24">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">Etkinlik Talebini Paylaş</h2>
          <p className="text-center text-muted-foreground mb-8">Kısa etkinlik özeti ve bütçe aralığı yeter. 3-5 iş günü içinde ilk teklif dönüşü yaparız.</p>
          <MICEWizard source_page="mice_tr" />
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
