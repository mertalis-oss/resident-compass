import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Building2, Home as HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDomainScope } from '@/hooks/useDomainScope';
import { trackPostHogEvent } from '@/lib/posthog';

// ─────────────────────────────────────────────────────────────────────────────
// HomeValueGrid — the four practical deliverables shown right after the hero.
// Answers the visitor's first question ("what do you actually do?") with
// four concrete items instead of an abstract mission statement. Ordering is
// deliberate — visa first (the door), bank + company (the platform), home
// last (the settle). "Home / Ev" carries an explicit clarification that it
// is part of the Nomad Incubator package, so we do not claim a standalone
// housing service we do not run yet.
// ─────────────────────────────────────────────────────────────────────────────

const ROUTES = {
  tr: {
    visa: '/vizeler/dtv-vize',
    bank: '/yerlesim/nomad-incubator',
    company: '/yerlesim/nomad-incubator',
    home: '/yerlesim/nomad-incubator',
  },
  en: {
    visa: '/visas/thailand-dtv',
    bank: '/relocation/nomad-incubator',
    company: '/relocation/nomad-incubator',
    home: '/relocation/nomad-incubator',
  },
} as const;

const items = [
  { key: 'visa', icon: Shield },
  { key: 'bank', icon: CreditCard },
  { key: 'company', icon: Building2 },
  { key: 'home', icon: HomeIcon },
] as const;

export default function HomeValueGrid() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scope = useDomainScope();
  const routes = ROUTES[scope === 'tr' ? 'tr' : 'en'];

  return (
    <section className="py-20 lg:py-28 bg-background border-t border-border/40">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="caption-editorial text-accent mb-3">
            {t('homeValueGrid.eyebrow', { defaultValue: 'Pratikte ne yapıyoruz' })}
          </p>
          <h2 className="heading-section text-foreground">
            {t('homeValueGrid.title', { defaultValue: 'Bir yerden, sırayla, birlikte' })}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            const href = routes[item.key];
            const handleClick = () => {
              trackPostHogEvent(
                'home_value_tile_click',
                { tile: item.key, destination: href, scope },
                true,
              );
              navigate(href);
            };
            return (
              <motion.button
                key={item.key}
                onClick={handleClick}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-left bg-card border border-border rounded-2xl p-6 md:p-7 hover:border-accent/40 hover:shadow-md transition-all duration-300 flex flex-col h-full"
                aria-label={`${t(`homeValueGrid.${item.key}Title`)}: ${t(`homeValueGrid.${item.key}Desc`)}`}
              >
                <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg text-foreground mb-2">
                  {t(`homeValueGrid.${item.key}Title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`homeValueGrid.${item.key}Desc`)}
                </p>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-10 max-w-2xl mx-auto">
          <div className="inline-flex items-start gap-3 bg-accent/5 border border-accent/20 rounded-lg px-5 py-4 text-left w-full">
            <span className="text-accent font-heading text-sm shrink-0 mt-0.5">Not:</span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('homeValueGrid.footnote', {
                defaultValue:
                  'Ev bulma tekil hizmet olarak sunulmuyor. Nomad Incubator paketinin içinde: lokasyon eşleştirme, mahalle önerileri ve kontrat kontrolü.',
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
