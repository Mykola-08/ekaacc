'use client';

import Link from 'next/link';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/marketing/components/ui/button';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import CTASection from '@/marketing/components/CTASection';
import PageLayout from '@/marketing/components/PageLayout';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';
import { HugeiconsIcon } from '@hugeicons/react';
import { FavouriteIcon, StarIcon } from '@hugeicons/core-free-icons';

export default function AboutElenaContent() {
  const { t } = useLanguage();

  const techniques = [
    { id: 'movement-lesson', name: t('technique.movement_lesson.title') },
    { id: 'jka', name: t('technique.jka.title') },
    { id: 'tmr', name: t('technique.tmr.title') },
    { id: 'kgh', name: t('technique.kgh.title') },
    { id: 'ke', name: t('technique.ke.title') },
    { id: 'kb', name: t('technique.kb.title') },
    { id: 'osteobalance', name: t('technique.osteobalance.title') },
    { id: 'sujok', name: t('technique.sujok.title') },
    { id: 'quiromasaje', name: t('technique.quiromasaje.title') },
  ];

  // Custom Hero for Elena's page matched to Apple style
  const CustomHero = (
    <section className="relative overflow-hidden bg-white pt-32 pb-24">
      <div className="section-container relative z-10 text-center">
        {/* Profile Image with Glow */}
        <motion.div
          className="relative mx-auto mb-12 max-w-xs"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="group relative mx-auto h-64 w-64 sm:h-80 sm:w-80">
            {/* Subtle glow behind */}
            <div className="absolute inset-0 scale-110 rounded-full bg-blue-100/50 opacity-60 blur-3xl" />
            <div className="relative h-full w-full overflow-hidden rounded-full border border-gray-100">
              <Image
                src="/images/therapist_photo.jpg"
                alt={t('home.elenaAlt')}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 256px, 320px"
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Name and Title */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl leading-tight font-semibold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            {t('elena.greeting')}
          </h1>

          <div className="">
            <p className="text-2xl font-normal tracking-wide text-gray-700 sm:text-3xl">
              {t('elena.name')}
            </p>
            <p className="text-xl font-light tracking-wide text-gray-500 sm:text-2xl">
              {t('elena.role')}
            </p>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed font-normal text-gray-600 sm:text-xl">
              {t('elena.bio')}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/booking">
              <Button size="lg" variant="default" className="px-10 py-4">
                {t('common.bookNow')}
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" variant="outline" className="px-10 py-4">
                {t('nav.contact')}
              </Button>
            </Link>
          </div>

          {/* Quote */}
          <div className="mx-auto mt-16 max-w-3xl">
            <blockquote className="relative text-xl leading-relaxed font-light text-gray-800 italic sm:text-2xl">
              <span className="relative z-10">"{t('elena.quote')}"</span>
            </blockquote>
          </div>
        </motion.div>

        {/* Stats/Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <div className="bg-secondary inline-flex items-center rounded-full border border-gray-200/50 px-6 py-3">
            <HugeiconsIcon icon={StarIcon} className="mr-2 size-4 text-yellow-500"  />
            <span className="font-medium text-gray-700">15+ {t('hero.stats.experience')}</span>
          </div>
          <div className="bg-secondary inline-flex items-center rounded-full border border-gray-200/50 px-6 py-3">
            <HugeiconsIcon icon={FavouriteIcon} className="mr-2 size-4 text-red-500"  />
            <span className="font-medium text-gray-700">96% {t('hero.stats.clients')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );

  return (
    <>
      <SEOUpdater
        titleKey="elena.seo.title"
        descriptionKey="elena.seo.desc"
        keywordsKey="elena.seo.keywords"
      />

      <PageLayout hero={CustomHero} className="bg-secondary">
        {/* Techniques Section */}
        <section className="rounded-t-[3rem] bg-white py-24">
          <div className="section-container relative z-10 text-center">
            <div className="mb-20">
              <h2 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                {t('elena.approach.title')}
              </h2>
              <p className="mx-auto max-w-3xl text-xl leading-relaxed font-normal text-gray-500">
                {t('elena.approach.desc')}
              </p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              className="flex flex-wrap justify-center gap-4"
            >
              {techniques.map((tech) => (
                <motion.div
                  key={tech.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="bg-secondary cursor-default rounded-2xl border border-transparent px-8 py-4 font-medium text-gray-700 transition-colors hover:border-gray-200"
                >
                  {tech.name}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Target Audience Bento */}
        <section className="bg-background py-24">
          <div className="section-container relative z-10">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                {t('elena.work.title')}
              </h2>
            </div>

            <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2 lg:col-span-1">
                <ServiceBentoItem
                  title={t('elena.target.adults.title')}
                  description={t('elena.target.adults.desc')}
                  details={<p>{t('elena.target.adults.desc')}</p>}
                  image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2070"
                  delay={0}
                />
              </div>
              <div className="col-span-1 md:col-span-1">
                <ServiceBentoItem
                  title={t('elena.target.children.title')}
                  description={t('elena.target.children.desc')}
                  details={<p>{t('elena.target.children.desc')}</p>}
                  image="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=2070"
                  delay={0.1}
                />
              </div>
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <ServiceBentoItem
                  title={t('elena.target.families.title')}
                  description={t('elena.target.families.desc')}
                  details={<p>{t('elena.target.families.desc')}</p>}
                  image="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=2070"
                  delay={0.2}
                />
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </PageLayout>
    </>
  );
}
