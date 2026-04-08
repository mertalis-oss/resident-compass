import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getDomainScope } from '@/hooks/useDomainScope';
import { ArrowRight, Star } from 'lucide-react';

interface CrossSellService {
  title: string;
  description: string;
  href: string;
  recommended?: boolean;
}

interface Props {
  currentSlug: string;
}

// Comparison anchors per page
const comparisonData: Record<string, { title: string; titleTR: string; desc: string; descTR: string }> = {
  'dtv-vize': {
    title: 'Why not Bali or Vietnam?',
    titleTR: 'Neden Bali ya da Vietnam değil?',
    desc: "Thailand's DTV visa offers 5-year validity with 180-day stays and unlimited re-entries — no other Southeast Asian country matches this combination of legal stability and lifestyle freedom.",
    descTR: "Tayland DTV vizesi 5 yıl geçerlilik, 180 gün kalış hakkı ve sınırsız giriş-çıkış sunuyor. Bali veya Vietnam'da bu kombinasyon mevcut değil.",
  },
  'muay-thai': {
    title: 'Why not online courses?',
    titleTR: 'Neden online kurs değil?',
    desc: 'In-person training in Thailand provides visa eligibility, hands-on cultural immersion, and internationally recognized certifications that online programs cannot offer.',
    descTR: "Tayland'daki yüz yüze eğitim size vize uygunluğu, kültürel deneyim ve uluslararası geçerli sertifika sağlar — online programlar bunu sunamaz.",
  },
  'mice-corporate': {
    title: 'Why Thailand for your event?',
    titleTR: 'Etkinliğiniz neden Tayland?',
    desc: 'World-class venues, cost-effective luxury, direct flights from major hubs, and a hospitality culture that makes every event exceptional.',
    descTR: "Dünya standartında mekanlar, uygun fiyatlı lüks, direkt uçuşlar ve benzersiz ağırlama kültürü.",
  },
  'expedition-jungle': {
    title: 'Why guided expeditions?',
    titleTR: 'Neden rehberli ekspedisyon?',
    desc: 'Licensed operators, local knowledge, safety infrastructure, and access to restricted routes that independent travelers cannot reach.',
    descTR: 'Lisanslı operatörler, yerel bilgi, güvenlik altyapısı ve bağımsız gezginlerin ulaşamayacağı özel rotalar.',
  },
  'nomad-incubator': {
    title: 'Why not do it yourself?',
    titleTR: 'Neden kendin yapmıyorsun?',
    desc: "Company formation, tax optimization, and visa processes in Asia involve local regulations that change frequently. Our team handles the complexity so you don't have to.",
    descTR: "Şirket kurulumu, vergi optimizasyonu ve vize süreçleri sık değişen yerel mevzuat içerir. Ekibimiz bu karmaşıklığı sizin yerinize yönetir.",
  },
  'dtv-thailand': {
    title: 'Why not Bali or Vietnam?',
    titleTR: 'Neden Bali ya da Vietnam değil?',
    desc: "Thailand's DTV visa offers 5-year validity with 180-day stays and unlimited re-entries — no other Southeast Asian country matches this.",
    descTR: "Tayland DTV vizesi 5 yıl geçerlilik, 180 gün kalış hakkı ve sınırsız giriş-çıkış sunuyor.",
  },
  'dtv-thailand-cop': {
    title: 'Why professional submission support?',
    titleTR: 'Neden profesyonel başvuru desteği?',
    desc: 'A single document error can delay or reject your DTV application. Our co-pilot service ensures accuracy and compliance.',
    descTR: 'Tek bir evrak hatası başvurunuzu geciktirebilir veya reddedebilir. Co-pilot hizmetimiz doğruluk ve uyumluluk sağlar.',
  },
  'mice-thailand': {
    title: 'Why Thailand for your event?',
    titleTR: 'Etkinliğiniz neden Tayland?',
    desc: 'World-class venues, cost-effective luxury, and a hospitality culture that makes every event exceptional.',
    descTR: "Dünya standartında mekanlar, uygun fiyatlı lüks ve benzersiz ağırlama kültürü.",
  },
  'ha-giang-motor-expedition': {
    title: 'Why guided expeditions?',
    titleTR: 'Neden rehberli ekspedisyon?',
    desc: 'Licensed operators, local knowledge, and access to restricted routes that independent travelers cannot reach.',
    descTR: 'Lisanslı operatörler, yerel bilgi ve bağımsız gezginlerin ulaşamayacağı özel rotalar.',
  },
};

// Cross-sell cards per page (exactly 2)
const crossSellMap: Record<string, { tr: CrossSellService[]; en: CrossSellService[] }> = {
  'dtv-vize': {
    tr: [
      { title: 'Soft Power Eğitim Paketleri', description: 'Muay Thai, dil ve wellness eğitimleriyle vize uygunluğunuzu güçlendirin.', href: '/tr/soft-power', recommended: true },
      { title: 'Dijital Göçebe Kuluçka', description: 'Şirket kurulumu, vergi optimizasyonu ve topluluk erişimi.', href: '/tr/nomad-incubator' },
    ],
    en: [
      { title: 'Soft Power Education Packages', description: 'Strengthen your visa eligibility with Muay Thai, language, and wellness programs.', href: '/visas/soft-power', recommended: true },
      { title: 'Comprehensive Relocation Support', description: 'End-to-end administrative and operational guidance for your move to Asia.', href: '/relocation/nomad-incubator' },
    ],
  },
  'dtv-thailand': {
    tr: [
      { title: 'Soft Power Eğitim Paketleri', description: 'Muay Thai, dil ve wellness eğitimleriyle vize uygunluğunuzu güçlendirin.', href: '/tr/soft-power', recommended: true },
      { title: 'Dijital Göçebe Kuluçka', description: 'Şirket kurulumu, vergi optimizasyonu ve topluluk erişimi.', href: '/tr/nomad-incubator' },
    ],
    en: [
      { title: 'Soft Power Education', description: 'Language and cultural programs that strengthen your visa eligibility.', href: '/visas/soft-power', recommended: true },
      { title: 'Comprehensive Relocation', description: 'End-to-end administrative management for your move to Thailand.', href: '/relocation/nomad-incubator' },
    ],
  },
  'dtv-thailand-cop': {
    tr: [
      { title: 'DTV Vize Danışmanlık', description: 'Stratejik danışmanlık ile DTV başvurunuzu doğru yapılandırın.', href: '/tr/dtv-vize', recommended: true },
      { title: 'Soft Power Eğitim', description: 'Dil ve kültür eğitimleriyle vize şansınızı artırın.', href: '/tr/soft-power' },
    ],
    en: [
      { title: 'DTV Strategic Advisory', description: 'Eligibility analysis, document audit, and personalized DTV roadmap.', href: '/visas/thailand-dtv', recommended: true },
      { title: 'Soft Power Education', description: 'Language and cultural programs that strengthen your visa eligibility.', href: '/visas/soft-power' },
    ],
  },
  'muay-thai': {
    tr: [
      { title: 'Tayland DTV Vizesi', description: '5 yıl geçerli, 180 gün kalış hakkı olan dijital göçebe vizesi.', href: '/tr/dtv-vize', recommended: true },
      { title: 'Keşif Ekspedisyonları', description: "Güneydoğu Asya'da rehberli motor ve doğa ekspedisyonları.", href: '/tr/expeditions' },
    ],
    en: [
      { title: 'Thailand DTV Visa', description: '5-year validity, 180-day stays — the ultimate digital nomad visa.', href: '/visas/thailand-dtv', recommended: true },
      { title: 'Expedition Adventures', description: 'Guided motorcycle and nature expeditions across Southeast Asia.', href: '/experiences/expeditions' },
    ],
  },
  'mice-corporate': {
    tr: [
      { title: 'Tayland DTV Vizesi', description: 'Etkinlik sonrası uzun süreli kalış için DTV vizesi danışmanlığı.', href: '/tr/dtv-vize', recommended: true },
      { title: 'Keşif Ekspedisyonları', description: 'Kurumsal team-building için doğa ekspedisyonları.', href: '/tr/expeditions' },
    ],
    en: [
      { title: 'Thailand DTV Visa', description: 'Extended stay advisory for post-event residency in Thailand.', href: '/visas/thailand-dtv', recommended: true },
      { title: 'Expedition Adventures', description: 'Nature expeditions for corporate team-building.', href: '/experiences/expeditions' },
    ],
  },
  'mice-thailand': {
    tr: [
      { title: 'Tayland DTV Vizesi', description: 'Etkinlik sonrası uzun süreli kalış için DTV vizesi danışmanlığı.', href: '/tr/dtv-vize', recommended: true },
      { title: 'Keşif Ekspedisyonları', description: 'Kurumsal team-building için doğa ekspedisyonları.', href: '/tr/expeditions' },
    ],
    en: [
      { title: 'Thailand DTV Visa', description: 'Extended stay advisory for post-event residency.', href: '/visas/thailand-dtv', recommended: true },
      { title: 'Expedition Adventures', description: 'Nature expeditions for corporate team-building.', href: '/experiences/expeditions' },
    ],
  },
  'expedition-jungle': {
    tr: [
      { title: 'Tayland DTV Vizesi', description: "Tayland'da uzun süreli kalış için en avantajlı vize seçeneği.", href: '/tr/dtv-vize', recommended: true },
      { title: 'Soft Power Eğitim Paketleri', description: 'Muay Thai ve wellness eğitimleriyle kalışınızı anlamlı kılın.', href: '/tr/soft-power' },
    ],
    en: [
      { title: 'Thailand DTV Visa', description: 'The most advantageous visa option for long-term stays in Thailand.', href: '/visas/thailand-dtv', recommended: true },
      { title: 'Soft Power Education', description: 'Muay Thai and wellness programs to enrich your stay.', href: '/visas/soft-power' },
    ],
  },
  'ha-giang-motor-expedition': {
    tr: [
      { title: 'Tayland DTV Vizesi', description: "Tayland'da uzun süreli kalış için en avantajlı vize seçeneği.", href: '/tr/dtv-vize', recommended: true },
      { title: 'Wellness Retreat', description: 'Holistic wellness deneyimi.', href: '/tr/soft-power' },
    ],
    en: [
      { title: 'Thailand DTV Visa', description: 'Long-term stay visa for digital nomads and remote workers.', href: '/visas/thailand-dtv', recommended: true },
      { title: 'Thailand Wellness Retreat', description: 'Holistic wellness experience in Koh Phangan.', href: '/experiences/wellness' },
    ],
  },
  'nomad-incubator': {
    tr: [
      { title: 'Tayland DTV Vizesi', description: 'İşinizi kurarken yasal kalış hakkınızı güvence altına alın.', href: '/tr/dtv-vize', recommended: true },
      { title: 'MICE & Kurumsal Etkinlik', description: 'Ekibinizi Tayland\'da buluşturun.', href: '/tr/mice' },
    ],
    en: [
      { title: 'Thailand DTV Visa', description: 'Secure your legal residency while building your business.', href: '/visas/thailand-dtv', recommended: true },
      { title: 'Corporate Retreat — MICE', description: 'Bring your team together in Thailand.', href: '/corporate/mice' },
    ],
  },
};

export default function ComparisonCrossSell({ currentSlug }: Props) {
  const { t } = useTranslation();
  const scope = getDomainScope();

  const comparison = comparisonData[currentSlug];
  const crossSellEntry = crossSellMap[currentSlug];
  const cards: CrossSellService[] = crossSellEntry
    ? (scope === 'tr' ? crossSellEntry.tr : crossSellEntry.en)
    : [];

  if (!comparison && cards.length === 0) return null;

  return (
    <>
      {/* Comparison Anchor */}
      {comparison && (
        <section className="py-12 bg-card border-y border-border">
          <div className="container max-w-2xl px-6 text-center">
            <h3 className="font-heading text-lg mb-3">
              {scope === 'tr' ? comparison.titleTR : comparison.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {scope === 'tr' ? comparison.descTR : comparison.desc}
            </p>
          </div>
        </section>
      )}

      {/* Cross-Sell Cards (exactly 2) */}
      {cards.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container max-w-3xl px-6">
            <p className="caption-editorial text-muted-foreground mb-8 text-center">
              {t('crossSell.label', { defaultValue: scope === 'tr' ? 'Bunları da incelemek isteyebilirsiniz' : 'You might also consider' })}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.slice(0, 2).map((card, i) => (
                <Link
                  key={i}
                  to={card.href}
                  className={`group block p-6 border rounded-lg transition-all duration-500 ${
                    card.recommended
                      ? 'border-accent/40 bg-accent/5 shadow-[0_0_30px_rgba(212,175,55,0.1)]'
                      : 'border-border hover:border-accent/30'
                  }`}
                >
                  {card.recommended && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                      <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-medium">
                        {t('crossSell.recommended', { defaultValue: scope === 'tr' ? 'Önerilen' : 'Recommended' })}
                      </span>
                    </div>
                  )}
                  <h4 className="font-heading text-base text-foreground group-hover:text-accent transition-colors mb-2">
                    {card.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {card.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-accent uppercase tracking-wider">
                    {t('crossSell.compare', { defaultValue: scope === 'tr' ? 'Bu seçenekle yaşam planını karşılaştır' : 'Compare your life plan with this option' })}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
