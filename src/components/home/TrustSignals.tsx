import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, FileText, Globe } from 'lucide-react';
import { getDomainScope } from '@/hooks/useDomainScope';

export default function TrustSignals() {
  const { t } = useTranslation();
  const scope = getDomainScope();

  // TR-specific authentic pillars
  const trPillars = [
    { value: '10+', label: 'Yıllık Turizm & Operasyon Deneyimi' },
    { value: '360°', label: 'Kişiye Özel Yaşam Kurulumu' },
    { value: '100%', label: 'Yasal Süreç Danışmanlığı' },
    { value: '24s', label: 'Ortalama İlk Yanıt Süresi' },
  ];

  const globalPillars = t('trustSignals.stats', { returnObjects: true }) as { value: string; label: string }[];
  const stats = scope === 'tr' ? trPillars : (Array.isArray(globalPillars) ? globalPillars : trPillars);

  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Stats — TR only */}
        {scope === 'tr' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20 lg:mb-32">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium mb-2 text-accent">
                  {stat.value}
                </p>
                <p className="caption-editorial text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* EN — Minimal trust line */}
        {scope !== 'tr' && (
          <p className="text-center text-sm text-muted-foreground tracking-wide mb-20 lg:mb-32">
            15+ Years International Experience · Multi-Country Execution · Private Advisory Model
          </p>
        )}

        {/* Trust Strip — text-only, no fake logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              {scope === 'tr' ? 'Güvenli Ödeme' : 'Secure Payment'}
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              {scope === 'tr' ? 'Resmi Süreç Danışmanlığı' : 'Official Process Advisory'}
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-accent" />
              {scope === 'tr' ? 'Global Operasyon' : 'Global Operations'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
