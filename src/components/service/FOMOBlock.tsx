import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, Zap, Lock } from 'lucide-react';
import type { Service } from '@/pages/ServicePage';

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

interface Props {
  service: Service;
}

/**
 * FOMO Badge + Price Microcopy + Urgency — placed directly above checkout.
 */
export default function FOMOBlock({ service }: Props) {
  const { i18n } = useTranslation();
  const isTR = i18n.language === 'tr';

  return (
    <section className="py-10 md:py-14 bg-background">
      <div className="container max-w-2xl px-6 space-y-6">
        {/* Price */}
        <div className="text-center">
          <p className="font-heading text-4xl md:text-5xl text-accent mb-2">
            {formatPrice(service.price, service.currency || 'USD')}
          </p>
        </div>

        {/* FOMO Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 bg-accent/10 border border-accent/30 px-5 py-3 mx-auto w-fit"
        >
          <Clock className="w-4 h-4 text-accent" />
          <span className="text-sm font-heading font-medium text-accent tracking-wide">
            {isTR ? 'Bu hafta kontenjan sınırlı' : 'Slots are limited this week'}
          </span>
        </motion.div>

        {/* Microcopy row */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            {isTR ? 'Tek seferlik ödeme. Gizli ücret yok.' : 'One-time payment. No hidden fees.'}
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-accent" />
            {isTR ? 'Stripe ile güvenli ödeme.' : 'Secure checkout via Stripe.'}
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-accent" />
            {isTR ? '24 saat içinde başlıyoruz.' : 'We start within 24 hours.'}
          </span>
        </div>
      </div>
    </section>
  );
}
