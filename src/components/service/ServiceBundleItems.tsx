import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { getDomainScope } from '@/hooks/useDomainScope';
import AnimatedSection from '@/components/AnimatedSection';
import { CheckCircle } from 'lucide-react';
import type { Service } from '@/pages/ServicePage';

interface BundleItem {
  id: string;
  title: string;
  short_description: string | null;
  is_mandatory: boolean;
}

export default function ServiceBundleItems({ service }: { service: Service }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<BundleItem[]>([]);

  useEffect(() => {
    if (!service.is_bundle) return;
    const scope = getDomainScope();

    const fetch = async () => {
      const { data } = await supabase
        .from('service_bundles')
        .select('is_mandatory, order_index, item:item_id(id, title, short_description, is_active, visible_on)')
        .eq('bundle_id', service.id)
        .order('order_index');

      if (data) {
        const filtered = data
          .filter((row: any) => row.item?.is_active && ['both', scope].includes(row.item?.visible_on))
          .map((row: any) => ({
            id: row.item.id,
            title: row.item.title,
            short_description: row.item.short_description,
            is_mandatory: row.is_mandatory,
          }));
        setItems(filtered);
      }
    };
    fetch();
  }, [service]);

  if (!service.is_bundle || items.length === 0) return null;

  return (
    <AnimatedSection>
      <section className="section-editorial border-t border-border">
        <div className="container max-w-3xl px-6">
          <p className="caption-editorial text-muted-foreground mb-4">
            {t('service.bundleLabel', { defaultValue: 'Bundle Contents' })}
          </p>
          <p className="body-editorial text-muted-foreground mb-12">
            {t('service.bundleContext', { defaultValue: 'Everything you need in one structured process.' })}
          </p>
          <div className="space-y-5">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-border pb-5">
                <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0 stroke-[1.5]" />
                <div>
                  <h3 className="font-heading text-lg text-foreground">{item.title}</h3>
                  {item.short_description && (
                    <p className="text-sm text-muted-foreground mt-1">{item.short_description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
