import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const portals = [
  {
    id: 'live',
    href: '/residency/dtv-thailand',
    image: '/images/service-residency.webp',
  },
  {
    id: 'explore',
    href: '/expeditions/ha-giang-motor-expedition',
    image: '/images/service-expeditions.webp',
  },
  {
    id: 'heal',
    href: '/wellness/thailand-retreat',
    image: '/images/service-wellness.webp',
  },
];

export default function Portals() {
  const { t } = useTranslation();

  return (
    <section className="section-editorial bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-24"
        >
          <p className="caption-editorial text-muted-foreground mb-4">
            {t('portals.label')}
          </p>
          <h2 className="heading-editorial max-w-2xl mx-auto">
            {t('portals.headline')}
          </h2>
        </motion.div>

        {/* Portal Cards — Magazine Style Vertical */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <Link to={portal.href} className="group block h-full">
                <div className="relative h-full overflow-hidden bg-card">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={portal.image}
                      alt={t(`portals.${portal.id}.title`)}
                      width={800}
                      height={1067}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <p className="caption-editorial text-background/60 mb-3 transition-colors duration-500 group-hover:text-accent">
                        {t(`portals.${portal.id}.subtitle`)}
                      </p>
                      <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl text-background mb-4 transition-colors duration-500 group-hover:text-accent">
                        {t(`portals.${portal.id}.title`)}
                      </h3>
                      <p className="body-editorial text-background/70 mb-6 line-clamp-3">
                        {t(`portals.${portal.id}.desc`)}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm uppercase tracking-[0.2em] text-background/60 group-hover:text-accent transition-colors duration-500">
                          {t('portals.exploreCta')}
                        </span>
                        <div className="w-10 h-10 rounded-full border border-background/30 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                          <ArrowUpRight className="w-4 h-4 text-background transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
