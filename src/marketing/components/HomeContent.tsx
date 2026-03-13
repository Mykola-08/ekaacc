'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/marketing/components/ui/button';
import { motion } from 'framer-motion';
import { BentoCard } from '@/marketing/components/ui/bento-card';

import AppleHero from '@/marketing/components/AppleHero';
import CasosSection from '@/marketing/components/CasosSection';
import FAQ from '@/marketing/components/FAQ';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { SERVICES_DATA } from '@/marketing/shared/constants';
import ServiceCard from '@/marketing/components/ServiceCard';

import SEOUpdater from '@/marketing/components/SEOUpdater';
import CTASection from '@/marketing/components/CTASection';

export default function HomeContent() {
  const { t } = useLanguage();

  const stats = [
    { value: 1500, suffix: '+', label: t('hero.stats.sessions') },
    { value: 10, suffix: '+', label: t('hero.stats.experience') },
    { value: 96, suffix: '%', label: t('hero.stats.clients') },
    { value: 9, suffix: '', label: t('hero.stats.countries') },
  ];

  return (
    <>
      <SEOUpdater
        titleKey="seo.home.title"
        descriptionKey="seo.home.description"
        keywordsKey="seo.home.keywords"
      />
      {/* Hero Section */}
      <AppleHero />

      {/* Stats Section - Minimalist Redesign */}
      <section className="bg-white py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-8 md:gap-12 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-3xl p-6 text-center transition-colors duration-300"
              >
                <div className="mb-3 text-4xl font-semibold tracking-tight text-gray-900 tabular-nums md:text-5xl lg:text-6xl">
                  {stat.value}
                  {stat.suffix}
                </div>
                <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Collage */}
      <section className="overflow-hidden bg-white py-24">
        <div className="section-container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-primary mb-3 text-sm font-semibold tracking-wider uppercase">
              {t('home.bento.badge')}
            </h2>
            <h3 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">
              {t('home.bento.title')}
            </h3>
          </div>

          <div className="grid auto-rows-[320px] grid-cols-1 gap-4 md:auto-rows-[280px] md:grid-cols-4 md:gap-6">
            {/* Main large visual */}
            <BentoCard href="/services" className="md:col-span-2 md:row-span-2">
              <div className="bg-primary/5 absolute inset-0 z-0" />
              <Image
                src="https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Integrative Wellness"
                fill
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
              <div className="absolute right-0 bottom-0 left-0 z-20 flex flex-col items-start p-8 md:p-10">
                <span className="mb-4 inline-flex items-center truncate rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  {t('home.bento.featured')}
                </span>
                <h3 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {t('home.bento.equilibri.title')}
                </h3>
                <p className="max-w-md text-lg font-medium text-white/95 md:text-xl">
                  {t('home.bento.equilibri.desc')}
                </p>
              </div>
            </BentoCard>

            {/* Top right smaller */}
            <BentoCard
              href="/services/kinesiology"
              delay={0.1}
              className="md:col-span-2 md:row-span-1"
            >
              <div className="absolute inset-0 z-0 bg-[#f5f5f7]"></div>
              <div className="absolute top-0 right-0 bottom-0 z-0 w-[60%] overflow-hidden md:w-1/2">
                <Image
                  src="https://images.pexels.com/photos/4506105/pexels-photo-4506105.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Kinesiology"
                  fill
                  className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-multiply"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f5f5f7] via-[#f5f5f7]/80 to-transparent"></div>
              </div>
              <div className="absolute inset-0 z-20 flex items-center p-8 md:p-10">
                <div className="w-full max-w-[60%] md:max-w-[70%] lg:max-w-[60%]">
                  <h3 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">
                    {t('home.bento.kinesiology.title')}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed font-medium text-gray-700 md:text-base">
                    {t('home.bento.kinesiology.desc')}
                  </p>
                  <span className="text-primary group-hover:text-primary-600 inline-flex items-center text-sm font-bold transition-colors">
                    {t('home.bento.explore')}
                  </span>
                </div>
              </div>
            </BentoCard>

            {/* Bottom right split - 1 */}
            <BentoCard
              href="/services/nutrition"
              delay={0.2}
              className="md:col-span-1 md:row-span-1"
            >
              <Image
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Healthy Lifestyle"
                fill
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                <h3 className="mb-2 text-2xl font-bold tracking-tight text-white">
                  {t('home.bento.nutrition.title')}
                </h3>
                <p className="text-sm font-medium text-white/90">
                  {t('home.bento.nutrition.desc')}
                </p>
              </div>
            </BentoCard>

            {/* Bottom right split - 2 */}
            <BentoCard href="/cases" delay={0.3} className="md:col-span-1 md:row-span-1">
              <div className="absolute inset-0 z-0 bg-[#fff5f5]"></div>
              <div className="absolute inset-0 z-20 flex flex-col p-8">
                <div className="flex-1">
                  <svg
                    className="mb-4 h-8 w-8 text-red-400 opacity-50"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-lg leading-snug font-medium text-gray-900">
                    {t('home.bento.testimonial.quote')}
                  </p>
                </div>
                <div className="mt-auto border-t border-red-100/50 pt-4">
                  <p className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
                    {t('home.bento.testimonial.author')}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-gray-500">
                    {t('home.bento.testimonial.role')}
                  </p>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Elena Introduction Section - REDESIGNED */}
      <section className="relative overflow-hidden bg-[#f5f5f7] py-24">
        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-24">
            {/* Image Column (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-first flex justify-center lg:col-span-5"
            >
              <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[40px] bg-white">
                <Image
                  src="/images/therapist_photo.jpg"
                  alt={t('home.elenaAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                />
              </div>
            </motion.div>

            {/* Content Column (7 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:col-span-7 lg:text-left"
            >
              <div className="">
                <span className="inline-block rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold tracking-wider text-gray-900 uppercase">
                  {t('elena.role') || 'Lead Therapist'}
                </span>
                <h2 className="text-4xl leading-[1.1] font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  {t('elena.greeting')}
                </h2>
              </div>

              <div className="mx-auto max-w-2xl text-xl leading-relaxed font-normal text-gray-500 lg:mx-0">
                <p>{t('elena.bio')}</p>
                <p>{t('elena.approach')}</p>
              </div>

              <Link href="/about-elena" className="inline-block pt-4">
                <Button variant="default" size="lg" className="h-auto px-10 py-6 text-lg shadow-sm">
                  {t('common.readMore')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="bg-white py-32">
        <div className="section-container">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {t('services.featuredTitle')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-500">
              {t('services.featuredSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {SERVICES_DATA.slice(0, 4).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/services">
              <Button variant="default" size="lg" className="h-auto px-10 py-6 text-lg">
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

      <CTASection />
    </>
  );
}
