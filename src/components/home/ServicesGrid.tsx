import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const services = [
  {
    id: "dtv",
    title: "DTV Visa",
    subtitle: "Thailand Digital Nomad",
    description: "5-year multiple entry visa for remote workers and digital entrepreneurs.",
    href: "/dtv-vize",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-12 md:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    id: "mice",
    title: "Corporate MICE",
    subtitle: "Meetings & Retreats",
    description: "End-to-end corporate event management across Southeast Asia.",
    href: "/mice",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-12 md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    id: "adventure",
    title: "Motor Expeditions",
    subtitle: "Ha Giang & Beyond",
    description: "Vietnam motorcycle tours, private villas, and bespoke adventures.",
    href: "/adventure",
    image: "https://images.unsplash.com/photo-1559628129-67cf63b72248?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-12 md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    id: "wellness",
    title: "Wellness & Healing",
    subtitle: "Retreat Programs",
    description: "Breathwork, yoga retreats, and traditional healing in Koh Phangan.",
    href: "/wellness",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-12 md:col-span-7",
    aspect: "aspect-[16/10]",
  },
];

export function ServicesGrid() {
  const { t } = useTranslation();

  const testimonials = t('testimonials.items', { returnObjects: true }) as { quote: string; author: string; role: string }[];

  return (
    <>
      {/* Services Grid */}
      <section className="section-editorial bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-16 lg:mb-24"
          >
            <p className="caption-editorial text-muted-foreground mb-4">{t('services.title')}</p>
            <h2 className="heading-editorial max-w-3xl">
              {t('services.subtitle')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={service.span}
              >
                <Link to={service.href} className="group block">
                  <div className="card-editorial overflow-hidden">
                    <div className={`image-editorial ${service.aspect}`}>
                      <img
                        src={service.image}
                        alt={service.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-500" />
                    </div>
                    <div className="p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="caption-editorial text-accent mb-2">{service.subtitle}</p>
                          <h3 className="heading-section">{service.title}</h3>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300"
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </motion.div>
                      </div>
                      <p className="body-editorial text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {Array.isArray(testimonials) && testimonials.length > 0 && (
        <section className="py-24 lg:py-32 bg-background border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="caption-editorial text-accent mb-4">{t('testimonials.title')}</p>
            </motion.div>

            <Carousel opts={{ align: 'start', loop: true }} className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {testimonials.map((item, i) => (
                  <CarouselItem key={i} className="md:basis-1/2 pl-6">
                    <div className="h-full p-8 md:p-10 border border-border bg-card/50 flex flex-col justify-between">
                      <p className="font-serif text-lg md:text-xl font-normal leading-relaxed text-foreground italic mb-8">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                      <div className="border-t border-border pt-6">
                        <p className="font-serif text-base text-accent">{item.author}</p>
                        <p className="text-xs text-muted-foreground mt-1 tracking-[0.2em] uppercase">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-10">
                <CarouselPrevious className="static translate-y-0 border-border hover:bg-muted" />
                <CarouselNext className="static translate-y-0 border-border hover:bg-muted" />
              </div>
            </Carousel>
          </div>
        </section>
      )}
    </>
  );
}
