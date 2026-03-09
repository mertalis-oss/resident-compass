import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: { residency: 'Residency', wellness: 'Wellness', corporate: 'Corporate', expeditions: 'Expeditions', getStarted: 'Get Started' },
      hero: {
        title: 'Plan B Asia',
        subtitle: 'Architecting Sovereign Mobility for Founders and Global Citizens.',
        cta: 'Begin Strategic Plan',
        ctaSub: 'Private consultation. Response within 24 hours.',
      },
      trust: {
        headline: 'Private & Confidential | Legal Framework Driven | Government Compliant | Trusted by Global Founders',
        subtitle: 'Clients from 18+ countries.',
      },
      founder: {
        quote: 'Mobility is no longer a lifestyle choice. It is a strategic necessity. In a world of shifting tax regimes and digital borders, your Plan B is your most important asset.',
        attribution: '— Plan B Asia Advisory',
      },
      founderLetter: {
        title: 'A Note from the Founder',
        text: 'Mobility is no longer a lifestyle choice. It is a strategic necessity. We design structured pathways for global citizens seeking stability, renewal, and opportunity.',
        signature: 'Serkan',
        role: 'Founder, Plan B Asia',
      },
      network: { title: 'Our Trusted Network', immigration: 'Immigration Lawyers', tax: 'Tax Advisors', medical: 'Private Medical Clinics', resorts: 'Luxury Resorts' },
      services: { title: 'Strategic Verticals', subtitle: 'Tailored programs for founders, families, and global citizens.' },
      calculator: {
        title: 'Calculate Your Visa Eligibility & Mobility Score',
        subtitle: 'Discover your strategic position for Thailand\'s Digital Nomad Visa in under 60 seconds.',
        cta: 'Start Free Assessment',
      },
      form: {
        title: 'Begin Your Strategic Plan',
        name: 'Full Name', email: 'Email', country: 'Country of Residence', whatsapp: 'WhatsApp Number',
        timeline: 'Timeline', budget: 'Budget Range (Optional)', scope: 'Program Scope',
        immediate: 'Immediate', threeMonths: '3 Months', sixMonths: '6 Months',
        submit: 'Submit Inquiry',
        success: 'Your inquiry has been received. Our concierge team will contact you shortly.',
      },
      testimonials: {
        title: 'Client Perspectives',
        items: [
          { quote: 'Plan B Asia transformed our relocation from a logistical nightmare into a structured, sovereign pathway. Their legal framework gave us complete confidence.', author: 'M.K.', role: 'Tech Founder, Berlin' },
          { quote: 'The level of discretion and professionalism is unmatched. They understand the needs of global founders navigating complex tax environments.', author: 'A.R.', role: 'Serial Entrepreneur, Dubai' },
          { quote: 'From visa strategy to wellness integration — they designed a complete lifestyle architecture for our family\'s move to Thailand.', author: 'S.L.', role: 'Portfolio Manager, London' },
          { quote: 'Their corporate retreat infrastructure in Southeast Asia is world-class. Every detail was handled with precision and confidentiality.', author: 'J.W.', role: 'CEO, Singapore' },
        ],
      },
      concierge: { label: 'Speak with Concierge' },
      notFound: { message: 'The page you are looking for does not exist.', cta: 'Return to Strategic Overview' },
    },
  },
  tr: {
    translation: {
      nav: { residency: 'Oturma İzni', wellness: 'Sağlık', corporate: 'Kurumsal', expeditions: 'Keşifler', getStarted: 'Başlayın' },
      hero: {
        title: 'Plan B Asia',
        subtitle: 'Kurucular ve Küresel Vatandaşlar İçin Egemen Mobilite Mimarisi.',
        cta: 'Stratejik Plana Başlayın',
        ctaSub: 'Özel danışmanlık. 24 saat içinde yanıt.',
      },
      trust: {
        headline: 'Gizli & Güvenli | Hukuki Çerçeve Odaklı | Devlet Uyumlu | Küresel Kurucuların Güvencesi',
        subtitle: '18+ ülkeden müşteri.',
      },
      founder: {
        quote: 'Mobilite artık bir yaşam tarzı tercihi değil. Stratejik bir zorunluluktur.',
        attribution: '— Plan B Asia Danışmanlık',
      },
      founderLetter: {
        title: 'Kurucudan Bir Not',
        text: 'Mobilite artık bir yaşam tarzı tercihi değil. Stratejik bir zorunluluktur. İstikrar, yenilenme ve fırsat arayan küresel vatandaşlar için yapılandırılmış yollar tasarlıyoruz.',
        signature: 'Serkan',
        role: 'Kurucu, Plan B Asia',
      },
      network: { title: 'Güvenilir Ağımız', immigration: 'Göçmenlik Avukatları', tax: 'Vergi Danışmanları', medical: 'Özel Tıp Klinikleri', resorts: 'Lüks Tatil Köyleri' },
      services: { title: 'Stratejik Dikey Alanlar', subtitle: 'Kurucular, aileler ve küresel vatandaşlar için özel programlar.' },
      calculator: {
        title: 'Vize Uygunluğunuzu ve Mobilite Puanınızı Hesaplayın',
        subtitle: 'Tayland Dijital Göçebe Vizesi için stratejik konumunuzu 60 saniyede keşfedin.',
        cta: 'Ücretsiz Değerlendirme Başlatın',
      },
      form: {
        title: 'Stratejik Planınıza Başlayın',
        name: 'Ad Soyad', email: 'E-posta', country: 'İkamet Ülkesi', whatsapp: 'WhatsApp Numarası',
        timeline: 'Zaman Çizelgesi', budget: 'Bütçe Aralığı (İsteğe Bağlı)', scope: 'Program Kapsamı',
        immediate: 'Acil', threeMonths: '3 Ay', sixMonths: '6 Ay',
        submit: 'Başvuru Gönder',
        success: 'Başvurunuz alınmıştır. Concierge ekibimiz en kısa sürede sizinle iletişime geçecektir.',
      },
      testimonials: {
        title: 'Müşteri Görüşleri',
        items: [
          { quote: 'Plan B Asia, yer değiştirme sürecimizi yapılandırılmış, egemen bir yola dönüştürdü.', author: 'M.K.', role: 'Teknoloji Kurucusu, Berlin' },
          { quote: 'Gizlilik ve profesyonellik seviyesi benzersiz.', author: 'A.R.', role: 'Seri Girişimci, Dubai' },
          { quote: 'Vize stratejisinden sağlık entegrasyonuna — ailemiz için eksiksiz bir yaşam mimarisi tasarladılar.', author: 'S.L.', role: 'Portföy Yöneticisi, Londra' },
          { quote: 'Güneydoğu Asya\'daki kurumsal toplantı altyapıları dünya standartlarında.', author: 'J.W.', role: 'CEO, Singapur' },
        ],
      },
      concierge: { label: 'Concierge ile Konuşun' },
      notFound: { message: 'Aradığınız sayfa mevcut değil.', cta: 'Stratejik Genel Bakışa Dön' },
    },
  },
  hi: {
    translation: {
      nav: { residency: 'निवास', wellness: 'स्वास्थ्य', corporate: 'कॉर्पोरेट', expeditions: 'अभियान', getStarted: 'शुरू करें' },
      hero: {
        title: 'Plan B Asia',
        subtitle: 'संस्थापकों और वैश्विक नागरिकों के लिए संप्रभु गतिशीलता वास्तुकला।',
        cta: 'रणनीतिक योजना शुरू करें',
        ctaSub: 'निजी परामर्श। 24 घंटे के भीतर प्रतिक्रिया।',
      },
      trust: {
        headline: 'निजी और गोपनीय | कानूनी ढांचा संचालित | सरकार अनुपालन | वैश्विक संस्थापकों द्वारा विश्वसनीय',
        subtitle: '18+ देशों से ग्राहक।',
      },
      founder: {
        quote: 'गतिशीलता अब जीवनशैली का विकल्प नहीं है। यह एक रणनीतिक आवश्यकता है।',
        attribution: '— Plan B Asia सलाहकार',
      },
      founderLetter: {
        title: 'संस्थापक से एक संदेश',
        text: 'गतिशीलता अब जीवनशैली का विकल्प नहीं है। यह एक रणनीतिक आवश्यकता है। हम स्थिरता, नवीनीकरण और अवसर की तलाश में वैश्विक नागरिकों के लिए संरचित मार्ग डिज़ाइन करते हैं।',
        signature: 'सरकान',
        role: 'संस्थापक, Plan B Asia',
      },
      network: { title: 'हमारा विश्वसनीय नेटवर्क', immigration: 'आव्रजन वकील', tax: 'कर सलाहकार', medical: 'निजी चिकित्सा क्लिनिक', resorts: 'लक्जरी रिसॉर्ट' },
      services: { title: 'रणनीतिक क्षेत्र', subtitle: 'संस्थापकों, परिवारों और वैश्विक नागरिकों के लिए कार्यक्रम।' },
      calculator: {
        title: 'अपनी वीज़ा पात्रता और गतिशीलता स्कोर की गणना करें',
        subtitle: 'थाईलैंड के डिजिटल नोमैड वीज़ा के लिए अपनी रणनीतिक स्थिति 60 सेकंड में जानें।',
        cta: 'मुफ्त मूल्यांकन शुरू करें',
      },
      form: {
        title: 'अपनी रणनीतिक योजना शुरू करें',
        name: 'पूरा नाम', email: 'ईमेल', country: 'निवास का देश', whatsapp: 'WhatsApp नंबर',
        timeline: 'समयरेखा', budget: 'बजट सीमा (वैकल्पिक)', scope: 'कार्यक्रम का दायरा',
        immediate: 'तत्काल', threeMonths: '3 महीने', sixMonths: '6 महीने',
        submit: 'पूछताछ भेजें',
        success: 'आपकी पूछताछ प्राप्त हो गई है। हमारी कंसीयज टीम शीघ्र ही संपर्क करेगी।',
      },
      concierge: { label: 'कंसीयज से बात करें' },
      notFound: { message: 'आप जो पृष्ठ खोज रहे हैं वह मौजूद नहीं है।', cta: 'रणनीतिक अवलोकन पर लौटें' },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
