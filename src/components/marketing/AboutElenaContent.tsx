'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from 'keep-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { Heart, Star } from 'lucide-react';

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

  return (
    <>
      <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100">
        {/* Hero Section - Unified Design */}
        <section className="relative overflow-hidden bg-white pt-32 pb-24">
          <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center" />

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-8">
            {/* Profile Image with Glow */}
            <motion.div
              className="relative mx-auto mb-12 max-w-xs"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="group relative mx-auto h-64 w-64 sm:h-80 sm:w-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />
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
              <h1 className="text-eka-dark text-5xl leading-tight font-bold tracking-tight sm:text-6xl lg:text-7xl">
                {t('elena.greeting')}
              </h1>

              <div className="space-y-4">
                <p className="text-2xl font-normal tracking-wide text-gray-700 sm:text-3xl">
                  {t('elena.name')}
                </p>
                <p className="text-xl font-light tracking-wide text-gray-500 sm:text-2xl">
                  {t('elena.role')}
                </p>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-gray-600 sm:text-xl">
                  {t('elena.bio')}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/book">
                  <Button size="xl" className="btn btn-accent border-none px-10 py-4 normal-case">
                    {t('common.bookNow')}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="xl"
                    variant="outline"
                    className="btn btn-outline border-2 border-gray-200 bg-white px-10 py-4 normal-case"
                  >
                    {t('nav.contact')}
                  </Button>
                </Link>
              </div>

              {/* Quote */}
              <div className="mx-auto mt-12 max-w-3xl">
                <blockquote className="relative text-xl leading-relaxed font-light text-gray-700 italic sm:text-2xl">
                  <span className="text-primary-200 absolute -top-8 -left-4 font-serif text-6xl">
                    "
                  </span>
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
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                <span className="font-medium text-gray-700">15+ {t('hero.stats.experience')}</span>
              </div>
              <div className="inline-flex items-center rounded-full border border-gray-100 bg-white px-6 py-3 shadow-sm">
                <Heart className="mr-2 h-4 w-4 text-red-500" />
                <span className="font-medium text-gray-700">96% {t('hero.stats.clients')}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Techniques Section */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-8">
            <div className="mb-16">
              <h2 className="mb-6 text-3xl font-light text-[#000035] sm:text-4xl">
                {t('elena.approach.title')}
              </h2>
              <p className="mx-auto max-w-3xl text-xl leading-relaxed font-light text-gray-600">
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
                  whileHover={{ scale: 1.05 }}
                  className="cursor-default rounded-[20px] border border-gray-100 bg-white px-8 py-4 font-medium text-gray-700 shadow-sm transition-all hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
                >
                  {tech.name}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-8 text-3xl font-light text-[#000035]">{t('footer.readyToBegin')}</h2>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/book">
                <Button
                  size="xl"
                  className="rounded-[20px] border-none bg-[#FFB405] px-10 py-4 font-medium text-[#000035] normal-case shadow-lg transition-all hover:translate-y-[-2px] hover:bg-[#e8a204]"
                >
                  {t('common.bookNow')}
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="xl"
                  variant="outline"
                  className="rounded-[20px] border-gray-200 bg-white px-10 py-4 font-medium text-gray-900 normal-case hover:bg-gray-100"
                >
                  {t('nav.contact')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
