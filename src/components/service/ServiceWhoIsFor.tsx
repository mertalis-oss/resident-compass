import { useTranslation } from "react-i18next";
import AnimatedSection from "@/components/AnimatedSection";

// Global Content (EN, HI vb.)
const content = {
  default: {
    whoForLabel: "Who this is for",
    whoForBody: "People who want to move forward fast. People who need clarity, not endless research.",
    notForLabel: "Not for",
    notForBody: "People looking for free general advice. People not ready to take action.",
  },
  mice: {
    whoForLabel: "Who this is for",
    whoForBody:
      "Corporate leaders and event directors who demand precision. Organizations where execution quality is non-negotiable.",
    notForLabel: "Not for",
    notForBody: "Teams looking for the lowest-cost vendor. Those not ready to delegate to a dedicated specialist.",
  },
  nomad: {
    whoForLabel: "Who this is for",
    whoForBody:
      "Those ready to relocate without friction. Builders and operators who want infrastructure already in place — not a manual to follow.",
    notForLabel: "Not for",
    notForBody: "Those expecting instant results without preparation. Those not yet committed to making the move.",
  },
};

// BLOK-04: TR Content Patch
const contentTR = {
  default: {
    whoForLabel: "Bu hizmet kime göre?",
    whoForBody:
      "Tayland'a taşınmayı ciddi düşünen, belge ve vize süreçlerini birinin halletmesini isteyen profesyoneller, girişimciler ve serbest çalışanlar için.",
    notForLabel: "Kime göre değil?",
    notForBody: "Ücretsiz genel bilgi arayanlar ya da süreci tek başına yönetmek isteyenler için değil.",
  },
  mice: {
    whoForLabel: "Bu hizmet kime göre?",
    whoForBody:
      "Asya'da kurumsal etkinlik planlamak isteyen, operasyonel mükemmeliyetten taviz vermeyen şirketler ve organizatörler için.",
    notForLabel: "Kime göre değil?",
    notForBody: "En düşük maliyetli alternatifi arayanlar ya da tüm detayları kendisi yönetmek isteyenler için değil.",
  },
  nomad: {
    whoForLabel: "Bu hizmet kime göre?",
    whoForBody:
      "Asya'ya taşınmaya hazır olanlar için. Altyapının kurulu gelmesini isteyen, operasyona hazır insanlar için.",
    notForLabel: "Kime göre değil?",
    notForBody: "Hâlâ araştırma aşamasındakiler ya da harekete geçmeye hazır olmayanlar için değil.",
  },
};

interface ServiceWhoIsForProps {
  context?: "mice" | "nomad" | "default";
}

export default function ServiceWhoIsFor({ context = "default" }: ServiceWhoIsForProps) {
  const { i18n } = useTranslation();

  // Dil kontrolü ve doğru objenin seçilmesi
  const isTR = i18n.language === "tr";
  const copy = isTR ? (contentTR[context] ?? contentTR.default) : (content[context] ?? content.default);

  return (
    <AnimatedSection>
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container max-w-3xl px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="caption-editorial text-accent mb-6">{copy.whoForLabel}</p>
              <p className="body-editorial text-foreground">{copy.whoForBody}</p>
            </div>
            <div>
              <p className="caption-editorial text-muted-foreground mb-6">{copy.notForLabel}</p>
              <p className="body-editorial text-muted-foreground">{copy.notForBody}</p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
