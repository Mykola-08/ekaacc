'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'keep-react';
import { motion } from 'framer-motion';
import { Star, Globe, Users, Clock } from 'lucide-react';

import AppleHero from '@/components/marketing/AppleHero';
import CasosSection from '@/components/marketing/CasosSection';
import FAQ from '@/components/marketing/FAQ';

import { useLanguage } from '@/context/marketing/LanguageContext';
import { SERVICES_DATA } from '@/shared/marketing/constants';
import ServiceCard from '@/components/marketing/ServiceCard';

import AnimatedCounter from '@/components/marketing/AnimatedCounter';

export default function HomeContent() {
  const { t } = useLanguage();

  const stats = [
    { value: 1500, suffix: '+', label: t('hero.stats.sessions'), icon: Users },
    { value: 10, suffix: '+', label: t('hero.stats.experience'), icon: Clock },
    { value: 96, suffix: '%', label: t('hero.stats.clients'), icon: Star },
    { value: 9, suffix: '', label: t('hero.stats.countries'), icon: Globe },
  ];

  return (
    <>
      {/* Hero Section */}
      <AppleHero />

      {/* Stats Section with floating effect */}
      <section className="relative z-20 -mt-10 mb-10 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel grid grid-cols-2 gap-12 rounded-3xl p-10 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="group flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary-50/50 text-primary-900 border-primary-100/50 rounded-2xl border p-4 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <stat.icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-eka-dark mb-1 flex justify-center text-4xl font-bold tracking-tight lg:text-5xl">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2500} />
                  </div>
                  <p className="text-xs font-bold tracking-[0.15em] text-gray-500 uppercase">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Elena Introduction Section - REDESIGNED */}
      <section className="relative overflow-hidden bg-white py-24 lg:py-32">
        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
            {/* Image Column (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-first flex justify-center lg:col-span-5"
            >
              <div className="group relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />
                <div className="relative aspect-square h-full w-full overflow-hidden rounded-full shadow-2xl">
                  <Image
                    src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/therapist_photo.jpg"
                    alt={t('home.elenaAlt')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                  />
                </div>
              </div>
            </motion.div>

            {/* Content Column (7 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8 text-center lg:col-span-7 lg:text-left"
            >
              <div className="space-y-4">
                <h2 className="text-eka-dark text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {t('elena.greeting')}
                </h2>
              </div>

              <div className="space-y-6 text-lg leading-relaxed font-light text-gray-600">
                <p>{t('elena.bio')}</p>
                <p>{t('elena.approach')}</p>
              </div>

              <Link href="/about-elena" className="inline-block">
                <Button
                  variant="outline"
                  className="btn btn-secondary border-primary-200 text-primary-700 hover:bg-primary-50 rounded-xl px-8 py-3 normal-case"
                >
                  {t('common.readMore')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="bg-gray-50 py-24">
        <div className="section-container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-eka-dark mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t('services.featuredTitle')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
              {t('services.featuredSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES_DATA.slice(0, 3).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/services">
              <Button className="btn btn-primary rounded-xl px-8 py-3 normal-case">
                {t('services.viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Casos Section */}
      <CasosSection />

      {/* FAQ Section */}
      <FAQ />
    </>
  );
}
