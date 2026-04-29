// src/pages/tr/DTVVizePage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Shield, Clock, ChevronDown, Loader } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FocusedNavbar from "@/components/FocusedNavbar";
import TrustBar from "@/components/TrustBar";
import SEOHead from "@/components/SEOHead";
import ServiceCheckout from "@/components/service/ServiceCheckout";
import ServiceWhoIsFor from "@/components/service/ServiceWhoIsFor";
import ExpectationOutcome from "@/components/service/ExpectationOutcome";
import TrustBlock from "@/components/service/TrustBlock";
import SocialProofMini from "@/components/service/SocialProofMini";
import PlanBForm from "@/components/PlanBForm";
import ComparisonCrossSell from "@/components/service/ComparisonCrossSell";
import ServiceUpdateFallback from "@/components/tr/ServiceUpdateFallback";
import { useServicesList } from "@/hooks/useServicesList";
import { Button } from "@/components/ui/button";

const processSteps = [
  {
    step: 1,
    title: "Uygunluk Analizi",
    desc: "Durumunuza özel değerlendirme yapıyoruz. Pasaport, meslek ve gelir kaynağınıza göre net bir tablo. Tahmin değil, gerçek analiz.",
  },
  {
    step: 2,
    title: "Belge Denetimi",
    desc: "Gerekli belgeleri birlikte hazırlıyoruz. Eksik veya hatalı belge başvuruyu öldürür. Bunu olmadan çözüyoruz.",
  },
  {
    step: 3,
    title: "Başvuru ve Sonrası",
    desc: "Başvuruyu takip ederiz. Onay sonrası giriş tarihi, kalış planı, uzatma — adım adım planlarız.",
  },
];

const faqs = [
  {
    q: "DTV vizesi tam olarak ne sağlıyor?",
    a: "5 yıl geçerli, çok girişli bir vize. Her girişte 180 güne kadar Tayland'da yasal olarak kalabiliyorsunuz. Sınır çıkışı gerektirmeden.",
  },
  {
    q: "Başvuru süreci ne kadar sürer?",
    a: "Belgeler hazır olduğunda ortalama 4–6 hafta. Bürokrasinin zamanlaması bizim elimizde değil, bu konuda net olalım.",
  },
  {
    q: "Hangi belgeler gerekli?",
    a: "Pasaport, gelir belgesi veya banka ekstresi, seyahat sigortası ve bazı durumlarda meslek belgesi. Tam kontrol listesi pakete dahil.",
  },
  {
    q: "Her ülkeden başvurabilir miyim?",
    a: "DTV çoğu pasaport için açık. Türk, AB, ABD ve birçok ülke vatandaşı başvurabilir. Ülkenize özel analizi ilk görüşmede netleştiririz.",
  },
  {
    q: "DTV vizesiyle Tayland'da çalışabilir miyim?",
    a: "Uzaktan çalışma — yabancı bir şirkete/müşteriye hizmet — için tasarlanan bir vize. Tayland'da yerel işveren için çalışmak farklı kategoride.",
  },
  {
    q: "Vize başvurusu reddedilirse ne olur?",
    a: "Red oranımız düşük — belge kalitesine çok dikkat ediyoruz. Nadir redlerde alternatif rotayı birlikte değerlendiriyoruz.",
  },
];

export default function DTVVizePage() {
  const { t } = useTranslation();
  const { services, isLoading, hasError } = useServicesList("residency", "tr");
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="mx-auto mt-10 h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }
  if (hasError || services.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <FocusedNavbar />
        <TrustBar />
        <ServiceUpdateFallback context="DTV Vize" />
      </div>
    );
  }

  const anchorService = services[0];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t("dtvVize.seoTitle", { defaultValue: "Tayland DTV Vizesi — Plan B Asya" })}
        description={t("dtvVize.seoDesc", { defaultValue: "Tayland'da 5 yıl yaşama ve çalışma özgürlüğü." })}
      />
      <FocusedNavbar />
      <TrustBar />

      {/* 1. HERO */}
      <section className="relative min-h-[90vh] flex items-center grain-overlay">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2039&auto=format&fit=crop')`,
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
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm text-background/90 tracking-wide">
                {t("dtvVize.badge", { defaultValue: "Resmi Onaylı Danışmanlık" })}
              </span>
            </div>
            <h1 className="heading-display text-background mb-6">
              {t("dtvVize.heroTitle", { defaultValue: "Tayland'da 5 Yıl Yaşama ve Çalışma Özgürlüğü." })}
              <span className="block text-accent">{t("dtvVize.heroAccent", { defaultValue: "Tek Başvuru." })}</span>
            </h1>
            <p className="text-lg text-background/80 max-w-xl mb-8">
              {t("dtvVize.heroDesc", {
                defaultValue:
                  "Dijital göçebeler için tasarlanan DTV vizesi ile 180 gün kalış hakkı, sınırsız giriş-çıkış ve 5 yıllık geçerlilik.",
              })}
            </p>
            <div className="mb-8">
              <p className="text-sm text-background/60">
                {t("dtvVize.priceNote", { defaultValue: "Danışmanlık paketleri aşağıda listelenmektedir" })}
              </p>
            </div>
            <div className="flex items-center gap-3 mb-10">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-background/90 font-medium">
                {t("dtvVize.scarcity", { defaultValue: "2026 Kotaları Dolmadan Yerini Ayırt" })}
              </span>
            </div>
            <button
              onClick={() => document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-luxury-gold inline-block"
            >
              {t("dtvVize.heroCta", { defaultValue: "Hemen Başla" })}
            </button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-background/50 text-xs uppercase tracking-widest">
            {t("dtvVize.explore", { defaultValue: "Keşfet" })}
          </span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="w-5 h-5 text-background/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. EXPECTATION & REAL OUTCOME */}
      <ExpectationOutcome />

      {/* 3. TRUST BLOCK */}
      <TrustBlock />

      {/* 4. SOCIAL PROOF */}
      <SocialProofMini />

      {/* 5. CHECKOUT GRID (id="checkout") — ALL residency services */}
      <div id="checkout" className="scroll-mt-28 md:scroll-mt-36">
        <section className="section-editorial border-t border-border py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-10">
              <p className="caption-editorial text-accent mb-2">
                {t("dtvVize.packagesLabel", { defaultValue: "Danışmanlık Paketleri" })}
              </p>
              <h2 className="heading-section">
                {t("dtvVize.packagesTitle", { defaultValue: "İhtiyacınıza Uygun Paketi Seçin" })}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 min-h-[420px] md:min-h-[480px] items-stretch auto-rows-fr">
              {services.map((s, index) => (
                <ServiceCheckout key={s.id ?? s.slug ?? index} service={s} layout="grid" />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 7. TRUST STATS */}
      <section className="py-16 lg:py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "5 Yıl", label: t("dtvVize.stat1", { defaultValue: "Geçerlilik Süresi" }) },
              { value: "180 Gün", label: t("dtvVize.stat2", { defaultValue: "Her Girişte Kalış" }) },
              { value: "Sınırsız", label: t("dtvVize.stat3", { defaultValue: "Giriş-Çıkış Hakkı" }) },
              { value: "<24s", label: t("dtvVize.stat4", { defaultValue: "Danışman Yanıt Süresi" }) },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-accent mb-2">
                  {item.value}
                </p>
                <p className="caption-editorial text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHO IS THIS FOR */}
      <ServiceWhoIsFor />

      {/* 9. PROCESS */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">{t("dtvVize.processLabel", { defaultValue: "Süreç" })}</p>
            <h2 className="heading-section">
              {t("dtvVize.processTitle", { defaultValue: "Üç Adımda Yeni Hayatına Başla" })}
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {processSteps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-6 mb-12 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-heading text-2xl font-medium">
                    {item.step}
                  </div>
                  {i < processSteps.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-accent/50 to-border mt-4" />
                  )}
                </div>
                <div className="flex-1 pt-2 pb-8">
                  <h3 className="font-heading text-xl md:text-2xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">
              {t("dtvVize.faqLabel", { defaultValue: "Sık Sorulan Sorular" })}
            </p>
            <h2 className="heading-section">{t("dtvVize.faqTitle", { defaultValue: "Merak Ettiklerin" })}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-card border border-border px-6 data-[state=open]:ring-1 data-[state=open]:ring-accent/30"
                >
                  <AccordionTrigger className="text-left font-heading text-lg hover:no-underline hover:text-accent transition-colors py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 11. FREE TOOL (PlanBForm) */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container max-w-2xl px-6">
          <h2 className="heading-section text-center mb-4">
            {t("dtvVize.formTitle", { defaultValue: "Ücretsiz Uygunluk Kontrolü" })}
          </h2>
          <p className="text-muted-foreground text-center mb-10 body-editorial">
            {t("dtvVize.formDesc", {
              defaultValue: "Hızlı bir ön değerlendirme yapın. Ardından danışmanlık paketinizi satın alabilirsiniz.",
            })}
          </p>
          {formSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-lg font-heading text-foreground">
                Uygunluk ihtimaliniz yüksek. Süreci başlatmak için hemen yukarıdan danışmanlık paketini satın
                alabilirsiniz.
              </p>
              <Button
                onClick={() => document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
              >
                Danışmanlık Paketini Satın Al ↑
              </Button>
            </div>
          ) : (
            <PlanBForm serviceId={anchorService.id} onSubmitSuccess={() => setFormSubmitted(true)} />
          )}
        </div>
      </section>

      {/* 12. COMPARISON & CROSS-SELL */}
      <ComparisonCrossSell currentSlug="dtv-vize" />

      <footer className="py-16 bg-corporate-navy border-t border-holistic/10">
        <div className="container max-w-5xl px-6 text-center">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
        </div>
      </footer>
    </div>
  );
}
