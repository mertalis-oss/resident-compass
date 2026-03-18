import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Philosophy() {
  const { t } = useTranslation();

  return (
    <section className="section-editorial bg-background overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Text Column — Broken Grid Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1 }}
            className="col-span-12 lg:col-span-5 lg:pr-8"
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="caption-editorial text-accent mb-8"
            >
              {t('philosophy.label')}
            </motion.p>

            <h2 className="heading-editorial mb-10 leading-[1.2]">
              <span className="text-muted-foreground">{t('philosophy.headline1')}</span>{' '}
              <span className="text-foreground">{t('philosophy.headline2')}</span>
            </h2>

            <div className="space-y-6 body-editorial text-muted-foreground mb-10">
              <p className="text-lg md:text-xl leading-relaxed">
                {t('philosophy.body1')}
              </p>
              <p className="text-lg md:text-xl leading-relaxed">
                {t('philosophy.body2')}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-accent/20 font-heading text-[120px] leading-none -mt-4"
            >
              &ldquo;
            </motion.div>
          </motion.div>

          {/* Image Column — Asymmetric Right */}
          <div className="col-span-12 lg:col-span-7 relative min-h-[500px] lg:min-h-[700px]">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1 }}
              className="relative z-10 ml-auto w-full lg:w-[90%]"
            >
              <div className="image-editorial aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=2070&auto=format&fit=crop"
                  alt={t('philosophy.imageAlt', { defaultValue: 'Digital nomad working with ocean view' })}
                  width={2070}
                  height={2588}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute bottom-8 left-8 right-8 p-6 rounded-sm bg-background/80 backdrop-blur-md border border-border/50"
                >
                  <p className="caption-editorial text-accent mb-2">{t('philosophy.locationLabel')}</p>
                  <p className="text-sm text-muted-foreground">{t('philosophy.locationDesc')}</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="absolute top-12 -left-4 lg:left-0 w-24 h-24 lg:w-32 lg:h-32 border border-accent/30 rounded-full"
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="absolute bottom-24 -left-8 lg:left-8 w-16 h-16 bg-accent/10 rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
