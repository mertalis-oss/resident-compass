import { useTranslation } from 'react-i18next';
import type { Service } from '@/pages/ServicePage';

interface Props {
  bundles: Service[];
  selected: Service | null;
  onSelect: (bundle: Service) => void;
}

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

export default function BundleSelector({ bundles, selected, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="container max-w-2xl px-6">
        <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
          {t('softPower.bundleIntro', { defaultValue: "İstediğiniz lokasyonda anlaşmalı olduğumuz dil okullarıyla Tayland'da hem yasal kalış hakkınızı güvence altına alıyor hem de yeni bir dil ve kültür deneyimi yaşamanızı sağlıyoruz." })}
        </p>
        <div className="space-y-3">
          {bundles.map((bundle) => {
            const isSelected = selected?.id === bundle.id;
            return (
              <button
                key={bundle.id}
                onClick={() => onSelect(bundle)}
                className={`w-full text-left p-5 border rounded-lg transition-all duration-300 ${
                  isSelected
                    ? 'border-accent bg-accent/5 ring-1 ring-accent/30'
                    : 'border-border bg-background hover:border-accent/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-accent' : 'border-muted-foreground/30'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-accent" />}
                    </div>
                    <div>
                      <p className="font-heading text-sm text-foreground">{bundle.title}</p>
                      {bundle.short_description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{bundle.short_description}</p>
                      )}
                    </div>
                  </div>
                  <p className="font-heading text-lg text-accent flex-shrink-0 ml-4">
                    {formatPrice(bundle.price, bundle.currency || 'USD')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {!selected && (
          <p className="text-xs text-destructive/70 text-center mt-4">
            {t('softPower.bundleRequired', { defaultValue: 'Devam etmek için bir paket seçmelisiniz.' })}
          </p>
        )}
      </div>
    </section>
  );
}
