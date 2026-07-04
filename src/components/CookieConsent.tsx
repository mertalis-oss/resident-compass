// src/components/CookieConsent.tsx
// Plan B Asia — GDPR/ePrivacy/KVKK compliant cookie consent banner.
// 3 languages (TR/EN/HI), NVC-aligned voice, brand-consistent.
// Default state: NO consent → analytics + marketing OFF until user opts in.

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getConsent, setConsent, type ConsentCategory } from "@/lib/consent";

type Categories = Record<ConsentCategory, boolean>;

const DEFAULT_CATEGORIES: Categories = {
  essential: true,
  analytics: false,
  marketing: false,
};

// Inline translations to avoid i18n key dependency for first-paint banner.
// (Banner shows BEFORE i18n resources fully resolve; inline TEXTS are safest.)
const TEXTS = {
  tr: {
    title: "Çerez Tercihiniz",
    body: "Bu site, deneyimini iyileştirmek için çerez kullanıyor. Hangi sayfaların daha çok ziyaret edildiğini öğrenip siteyi geliştirelim diye. Sadece zorunlu olanları kabul edebilir ya da kategorileri özelleştirebilirsin.",
    rejectAll: "Sadece Zorunlular",
    customize: "Tercih Et",
    acceptAll: "Tümünü Kabul Et",
    footer: "İstediğin zaman ayarlardan değiştirebilirsin.",
    catEssentialTitle: "Zorunlu",
    catEssentialDesc: "Oturum tokeni, dil tercihi, çerez tercih kaydı. Kapatılamaz.",
    catAnalyticsTitle: "Analitik",
    catAnalyticsDesc: "Sayfa ziyaret zamanı, tıklanan butonlar, ülke-seviyesi konum (PostHog + Google Tag Manager).",
    catMarketingTitle: "Pazarlama",
    catMarketingDesc: "Meta Pixel (Instagram/Facebook) + TikTok Pixel — reklam ölçümü ve benzer kitle oluşturma.",
    save: "Tercihlerimi Kaydet",
    back: "Geri",
  },
  en: {
    title: "Cookie Preferences",
    body: "This site uses cookies to improve your experience — to learn which pages are visited most and refine the site accordingly. Accept only essentials, or customize categories.",
    rejectAll: "Essentials Only",
    customize: "Customize",
    acceptAll: "Accept All",
    footer: "Change anytime from settings.",
    catEssentialTitle: "Essential",
    catEssentialDesc: "Session token, language preference, consent record. Cannot be disabled.",
    catAnalyticsTitle: "Analytics",
    catAnalyticsDesc: "Page visit times, button clicks, country-level location (PostHog + Google Tag Manager).",
    catMarketingTitle: "Marketing",
    catMarketingDesc: "Meta Pixel (Instagram/Facebook) + TikTok Pixel — ad measurement and lookalike audience building.",
    save: "Save Preferences",
    back: "Back",
  },
  hi: {
    title: "कुकी प्राथमिकता",
    body: "यह साइट आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग करती है — यह जानने के लिए कि कौन से पृष्ठ सबसे अधिक देखे जाते हैं और साइट को बेहतर बनाया जा सके। केवल आवश्यक स्वीकार करें, या श्रेणियाँ अनुकूलित करें।",
    rejectAll: "केवल आवश्यक",
    customize: "अनुकूलित करें",
    acceptAll: "सभी स्वीकार करें",
    footer: "आप कभी भी सेटिंग्स से बदल सकते हैं।",
    catEssentialTitle: "आवश्यक",
    catEssentialDesc: "सत्र टोकन, भाषा प्राथमिकता, सहमति रिकॉर्ड। बंद नहीं किया जा सकता।",
    catAnalyticsTitle: "एनालिटिक्स",
    catAnalyticsDesc: "पृष्ठ देखने का समय, क्लिक किए गए बटन, देश-स्तर का स्थान (PostHog + Google Tag Manager)।",
    catMarketingTitle: "मार्केटिंग",
    catMarketingDesc: "Meta Pixel (Instagram/Facebook) + TikTok Pixel — विज्ञापन मापन और समान दर्शक निर्माण।",
    save: "मेरी प्राथमिकताएँ सहेजें",
    back: "वापस",
  },
} as const;

export default function CookieConsent() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [categories, setCategories] = useState<Categories>(DEFAULT_CATEGORIES);

  const lang = (i18n.language === "tr" ? "tr" : i18n.language === "hi" ? "hi" : "en") as keyof typeof TEXTS;
  const t = TEXTS[lang];

  useEffect(() => {
    const existing = getConsent();
    if (!existing) setOpen(true);
  }, []);

  // ESC key closes the modal (acts as Reject All — safer default)
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleRejectAll();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const handleRejectAll = () => {
    setConsent({ essential: true, analytics: false, marketing: false });
    setOpen(false);
  };

  const handleAcceptAll = () => {
    setConsent({ essential: true, analytics: true, marketing: true });
    setOpen(false);
  };

  const handleSaveCustom = () => {
    setConsent(categories);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-corporate-navy/95 backdrop-blur-md border-t border-border/20 text-holistic shadow-2xl"
    >
      <div className="container max-w-5xl mx-auto px-6 py-6">
        {!showCustomize ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-1">
                <h2 id="cookie-consent-title" className="font-heading text-lg md:text-xl text-holistic mb-2">
                  {t.title}
                </h2>
                <p className="text-sm text-holistic/70 leading-relaxed">{t.body}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={handleRejectAll}
                  autoFocus
                  className="px-5 py-2.5 text-sm border border-holistic/30 text-holistic hover:bg-white/5 transition-colors rounded-md min-w-[140px]"
                >
                  {t.rejectAll}
                </button>
                <button
                  onClick={() => setShowCustomize(true)}
                  className="px-5 py-2.5 text-sm border border-holistic/30 text-holistic hover:bg-white/5 transition-colors rounded-md min-w-[140px]"
                >
                  {t.customize}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 text-sm border border-holistic/30 text-holistic hover:bg-white/5 transition-colors rounded-md min-w-[140px]"
                >
                  {t.acceptAll}
                </button>
              </div>
            </div>
            <p className="text-xs text-holistic/40 mt-3 italic">{t.footer}</p>
          </>
        ) : (
          <div>
            <h2 id="cookie-consent-title" className="font-heading text-lg md:text-xl text-holistic mb-4">
              {t.title}
            </h2>

            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 cursor-not-allowed opacity-70">
                <input type="checkbox" checked disabled className="mt-1" />
                <div>
                  <p className="text-sm font-medium text-holistic">{t.catEssentialTitle}</p>
                  <p className="text-xs text-holistic/60 mt-0.5">{t.catEssentialDesc}</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={categories.analytics}
                  onChange={(e) => setCategories({ ...categories, analytics: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-holistic">{t.catAnalyticsTitle}</p>
                  <p className="text-xs text-holistic/60 mt-0.5">{t.catAnalyticsDesc}</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={categories.marketing}
                  onChange={(e) => setCategories({ ...categories, marketing: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-holistic">{t.catMarketingTitle}</p>
                  <p className="text-xs text-holistic/60 mt-0.5">{t.catMarketingDesc}</p>
                </div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => setShowCustomize(false)}
                className="px-5 py-2.5 text-sm border border-holistic/30 text-holistic/70 hover:bg-white/5 transition-colors rounded-md"
              >
                ← {t.back}
              </button>
              <button
                onClick={handleSaveCustom}
                className="px-5 py-2.5 text-sm bg-accent text-accent-foreground hover:opacity-90 transition-opacity rounded-md"
              >
                {t.save}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
