'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { Heart, Star } from 'lucide-react';
import SEOUpdater from '@/components/marketing/SEOUpdater';
import CTASection from '@/components/marketing/CTASection';
import { ServiceBentoItem } from '@/components/marketing/ui/service-bento';

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

  const targetAudience = [
    {
      title: t('elena.audience.adults.title') || 'Adults',
      description: t('elena.audience.adults.desc') || 'Stress, chronic pain, postural issues, emotional balance.',
    },
    {
      title: t('elena.audience.children.title') || 'Children',
      description: t('elena.audience.children.desc') || 'Focus, development, behavioral challenges, motor skills.',
    },
    {
      title: t('elena.audience.families.title') || 'Families',
      description: t('elena.audience.families.desc') || 'Holistic family wellness, preventive care, bonding through movement.',
    },
  ];

  return (
    <>
      <SEOUpdater
        titleKey="elena.seo.title"
        descriptionKey="elena.seo.description"
      />
      <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100/40">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white pt-32 pb-24">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-8">
            {/* Profile Image with Glow */}
            <motion.div
              className="relative mx-auto mb-12 max-w-xs"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="group relative mx-auto h-64 w-64 sm:h-80 sm:w-80">
                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-blue-100/40 to-purple-100/40 opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />
                <div className="relative h-full w-full overflow-hidden rounded-full shadow-2xl">
                  <Image
                    src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/therapist_photo.jpg"
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
              className="mb-12 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl leading-tight font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                {t('elena.greeting')}
              </h1>

              <div className="space-y-4">
                <p className="text-2xl font-normal tracking-wide text-gray-900 sm:text-3xl">
                  {t('elena.name')}
                </p>
                <p className="text-xl font-light tracking-wide text-gray-500 sm:text-2xl">
                  {t('elena.role')}
                </p>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-gray-500 sm:text-xl">
                  {t('elena.bio')}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/reservar">
                  <Button size="lg" className="rounded-full px-10 py-4">
                    {t('common.bookNow')}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-full border-2 px-10 py-4">
                    {t('nav.contact')}
                  </Button>
                </Link>
              </div>

              {/* Quote */}
              <div className="mx-auto mt-12 max-w-3xl">
                <blockquote className="relative text-xl leading-relaxed font-light text-gray-700 italic sm:text-2xl">
                  <span className="absolute -top-8 -left-4 font-serif text-6xl text-gray-200">"</span>
                  <span className="relative z-10">{t('elena.quote')}</span>
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
              <div className="inline-flex items-center rounded-full border border-gray-100 bg-white px-6 py-3 shadow-sm">
                <Star className="mr-2 h-4 w-4 text-amber-400" />
                <span className="font-medium text-gray-900">15+ {t('hero.stats.experience')}</span>
              </div>
              <div className="inline-flex items-center rounded-full border border-gray-100 bg-white px-6 py-3 shadow-sm">
                <Heart className="mr-2 h-4 w-4 text-rose-400" />
                <span className="font-medium text-gray-900">96% {t('hero.stats.clients')}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Techniques Section */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-8">
            <div className="mb-16">
              <h2 className="mb-6 text-3xl font-semibold text-gray-900 tracking-tight sm:text-4xl">
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
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
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
                  whileHover={{ scale: 1.05 }}
                  className="cursor-default rounded-full border border-gray-100 bg-white px-8 py-4 font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
                >
                  {tech.name}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="bg-gray-50/50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-semibold text-gray-900 tracking-tight sm:text-4xl">
                {t('elena.audience.title') || 'Who Can Benefit'}
              </h2>
              <p className="mx-auto max-w-3xl text-xl leading-relaxed font-normal text-gray-500">
                {t('elena.audience.desc') || 'Elena works with people of all ages, adapting her approach to each individual.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {targetAudience.map((item) => (
                <ServiceBentoItem
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  bookUrl="/reservar"
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection />
      </div>
    </>
  );
}
