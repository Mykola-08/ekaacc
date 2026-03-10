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
    { value: 9, suffix: '', label: t('hero.stats.countries') }
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
      <section className="py-24 bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center justify-center text-center p-6 rounded-3xl transition-colors duration-300">
                <div className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight mb-3 tabular-nums">
                  {stat.value}{stat.suffix}
                </div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Collage */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="section-container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-sm font-semibold text-primary tracking-wider uppercase mb-3">{t('home.bento.badge')}</h2>
            <h3 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight">{t('home.bento.title')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[320px] md:auto-rows-[280px]">
            {/* Main large visual */}
            <BentoCard href="/services" className="md:col-span-2 md:row-span-2">
              <div className="absolute inset-0 bg-primary/5 z-0" />
              <Image 
                src="https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                alt="Integrative Wellness" 
                fill
                className="absolute inset-0 w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-20 flex flex-col items-start">
                <span className="text-white inline-flex items-center px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-xs font-semibold mb-4 border border-white/20 truncate">
                  {t('home.bento.featured')}
                </span>
                <h3 className="text-white text-3xl sm:text-4xl font-bold mb-3 tracking-tight ">{t('home.bento.equilibri.title')}</h3>
                <p className="text-white/95 text-lg md:text-xl font-medium max-w-md ">{t('home.bento.equilibri.desc')}</p>
              </div>
            </BentoCard>

            {/* Top right smaller */}
            <BentoCard href="/services/kinesiology" delay={0.1} className="md:col-span-2 md:row-span-1">
              <div className="absolute inset-0 z-0 bg-[#f5f5f7]"></div>
              <div className="absolute right-0 top-0 bottom-0 w-[60%] md:w-1/2 z-0 overflow-hidden">
                <Image 
                  src="https://images.pexels.com/photos/4506105/pexels-photo-4506105.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Kinesiology" 
                  fill
                  className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#f5f5f7] via-[#f5f5f7]/80 to-transparent pointer-events-none"></div>
              </div>
              <div className="absolute inset-0 flex items-center p-8 md:p-10 z-20">
                <div className="w-full max-w-[60%] md:max-w-[70%] lg:max-w-[60%]">
                  <h3 className="text-gray-900 text-2xl font-bold mb-3 tracking-tight">{t('home.bento.kinesiology.title')}</h3>
                  <p className="text-gray-700 font-medium mb-6 text-sm md:text-base leading-relaxed">{t('home.bento.kinesiology.desc')}</p>
                  <span className="inline-flex items-center text-sm font-bold text-primary group-hover:text-primary-600 transition-colors">
                    {t('home.bento.explore')}
                  </span>
                </div>
              </div>
            </BentoCard>

            {/* Bottom right split - 1 */}
            <BentoCard href="/services/nutrition" delay={0.2} className="md:col-span-1 md:row-span-1">
              <Image 
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Healthy Lifestyle" 
                fill
                className="absolute inset-0 w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
              <div className="absolute inset-0 p-8 z-20 flex flex-col justify-end">
                <h3 className="text-white text-2xl font-bold mb-2 tracking-tight ">{t('home.bento.nutrition.title')}</h3>
                <p className="text-white/90 text-sm font-medium ">{t('home.bento.nutrition.desc')}</p>
              </div>
            </BentoCard>

            {/* Bottom right split - 2 */}
            <BentoCard href="/cases" delay={0.3} className="md:col-span-1 md:row-span-1">
              <div className="absolute inset-0 z-0 bg-[#fff5f5]"></div>
              <div className="absolute inset-0 p-8 z-20 flex flex-col">
                <div className="flex-1">
                  <svg className="w-8 h-8 text-red-400 mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-900 text-lg font-medium leading-snug">{t('home.bento.testimonial.quote')}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-red-100/50">
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{t('home.bento.testimonial.author')}</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">{t('home.bento.testimonial.role')}</p>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Elena Introduction Section - REDESIGNED */}
      <section className="py-24 relative overflow-hidden bg-[#f5f5f7]">
        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">

            {/* Image Column (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative order-first flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-[4/5] rounded-[40px] overflow-hidden  bg-white">
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
              className="lg:col-span-7 text-center lg:text-left space-y-8"
            >
              <div className="space-y-4">
                <span className="inline-block py-1 px-3 rounded-full bg-white border border-gray-200 text-gray-900 text-xs font-semibold uppercase tracking-wider">
                  {t('elena.role') || 'Lead Therapist'}
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight leading-[1.1]">
                  {t('elena.greeting')}
                </h2>
              </div>

              <div className="text-xl text-gray-500 leading-relaxed space-y-6 font-normal max-w-2xl mx-auto lg:mx-0">
                <p>
                  {t('elena.bio')}
                </p>
                <p>
                  {t('elena.approach')}
                </p>
              </div>

              <Link href="/about-elena" className="inline-block pt-4">
                <Button variant="default" size="xl" className="px-10 py-6 text-lg h-auto shadow-sm">
                  {t('common.readMore')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-32 bg-white">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 tracking-tight">
              {t('services.featuredTitle')}
            </h2>
            <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              {t('services.featuredSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              <Button variant="default" size="xl" className="px-10 py-6 text-lg h-auto">
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
