'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Activity,
  Heart,
  Brain,
  Zap,
  Layers,
  Clock3,
  RotateCcw,
  MapPin,
  Compass,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import PageLayout from '@/marketing/components/PageLayout';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import CTASection from '@/marketing/components/CTASection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Variant {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  idealFor: string[];
  duration: string;
  includes: string[];
  price: string;
}

export default function Revision360Content() {
  const { t } = useLanguage();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const variants: Variant[] = [
    {
      icon: <RotateCcw className="h-6 w-6" />,
      title: t('revision360.variants.reset.title'),
      subtitle: t('revision360.variants.reset.subtitle'),
      description: t('revision360.variants.reset.description'),
      idealFor: [
        t('revision360.variants.reset.idealFor.1'),
        t('revision360.variants.reset.idealFor.2'),
        t('revision360.variants.reset.idealFor.3'),
        t('revision360.variants.reset.idealFor.4'),
      ],
      duration: t('revision360.variants.reset.duration'),
      includes: [
        t('revision360.variants.reset.includes.1'),
        t('revision360.variants.reset.includes.2'),
        t('revision360.variants.reset.includes.3'),
        t('revision360.variants.reset.includes.4'),
      ],
      price: 'EUR 450',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t('revision360.variants.mapping.title'),
      subtitle: t('revision360.variants.mapping.subtitle'),
      description: t('revision360.variants.mapping.description'),
      idealFor: [
        t('revision360.variants.mapping.idealFor.1'),
        t('revision360.variants.mapping.idealFor.2'),
        t('revision360.variants.mapping.idealFor.3'),
        t('revision360.variants.mapping.idealFor.4'),
      ],
      duration: t('revision360.variants.mapping.duration'),
      includes: [
        t('revision360.variants.mapping.includes.1'),
        t('revision360.variants.mapping.includes.2'),
        t('revision360.variants.mapping.includes.3'),
        t('revision360.variants.mapping.includes.4'),
      ],
      price: 'EUR 350',
    },
    {
      icon: <Compass className="h-6 w-6" />,
      title: t('revision360.variants.alignment.title'),
      subtitle: t('revision360.variants.alignment.subtitle'),
      description: t('revision360.variants.alignment.description'),
      idealFor: [
        t('revision360.variants.alignment.idealFor.1'),
        t('revision360.variants.alignment.idealFor.2'),
        t('revision360.variants.alignment.idealFor.3'),
        t('revision360.variants.alignment.idealFor.4'),
      ],
      duration: t('revision360.variants.alignment.duration'),
      includes: [
        t('revision360.variants.alignment.includes.1'),
        t('revision360.variants.alignment.includes.2'),
        t('revision360.variants.alignment.includes.3'),
        t('revision360.variants.alignment.includes.4'),
      ],
      price: 'EUR 280',
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: t('revision360.variants.integral.title'),
      subtitle: t('revision360.variants.integral.subtitle'),
      description: t('revision360.variants.integral.description'),
      idealFor: [
        t('revision360.variants.integral.idealFor.1'),
        t('revision360.variants.integral.idealFor.2'),
        t('revision360.variants.integral.idealFor.3'),
        t('revision360.variants.integral.idealFor.4'),
      ],
      duration: t('revision360.variants.integral.duration'),
      includes: [
        t('revision360.variants.integral.includes.1'),
        t('revision360.variants.integral.includes.2'),
        t('revision360.variants.integral.includes.3'),
        t('revision360.variants.integral.includes.4'),
      ],
      price: 'EUR 750',
    },
  ];

  const heroContent = (
    <section className="relative flex h-[100svh] min-h-[600px] w-full flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Integral Health"
          fill
          className="object-cover"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </motion.div>

      <div className="relative z-10 mx-auto mt-16 max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-xs font-semibold tracking-widest text-white/90 uppercase backdrop-blur-md"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {t('revision360.seo.title') || 'Integral Method'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 pb-2 text-4xl leading-[1.05] font-semibold tracking-tighter text-balance text-white sm:text-6xl lg:text-[5.5rem]"
        >
          {t('revision360.hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto max-w-3xl text-lg leading-relaxed font-medium tracking-tight text-balance text-white/80 sm:text-2xl"
        >
          {t('revision360.hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href={`https://wa.me/34658867133?text=${encodeURIComponent(t('revision360.whatsapp.booking') || 'Booking')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="h-auto rounded-full border-0 bg-white px-10 py-6 text-lg text-black shadow-xl transition-all hover:scale-105 hover:bg-gray-100"
            >
              {t('revision360.hero.cta')}
            </Button>
          </a>
          <a href="#process">
            <Button
              size="lg"
              variant="outline"
              className="h-auto rounded-full border-white/40 px-10 py-6 text-lg text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
            >
              {t('revision360.service.title') || 'Process'}
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );

  return (
    <>
      <SEOUpdater
        titleKey="revision360.seo.title"
        descriptionKey="revision360.seo.description"
        keywordsKey="revision360.seo.keywords"
      />
      <PageLayout hero={heroContent} className="bg-[#fbfbfd]" mainClassName="bg-transparent">
        {/* Why 360 Section */}
        <section className="py-20" id="process">
          <div className="section-container mx-auto max-w-6xl px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                {t('revision360.why360.title') || 'Comprehensive Analysis'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed font-normal text-gray-500">
                {t('revision360.why360.subtitle') ||
                  'A complete evaluation of physical, emotional, and structural well-being.'}
              </p>
            </div>{' '}
            {/* Why 360 Content Blocks */}
            <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[2rem] border border-gray-100 bg-white p-10 shadow-sm"
              >
                <div className="mb-6 flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <Heart className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                  {t('revision360.why360.layers.physical')} &{' '}
                  {t('revision360.why360.layers.emotional')}
                </h3>
                <p className="text-lg leading-relaxed text-gray-600">
                  {t('revision360.why360.physical.desc')} {t('revision360.why360.emotional.desc')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-[2rem] border border-gray-100 bg-white p-10 shadow-sm"
              >
                <div className="mb-6 flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                    <Brain className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                  {t('revision360.why360.layers.structural')} &{' '}
                  {t('revision360.why360.layers.energetic')}
                </h3>
                <p className="text-lg leading-relaxed text-gray-600">
                  {t('revision360.why360.structural.desc')} {t('revision360.why360.energetic.desc')}
                </p>
              </motion.div>
            </div>{' '}
            {/* Steps & Additional Info */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col justify-center rounded-[2rem] border border-gray-100 bg-white p-10 shadow-sm lg:col-span-2"
              >
                <div className="mb-8">
                  <span className="mb-2 block text-sm font-semibold tracking-wider text-blue-600 uppercase">
                    {t('revision360.service.title') || 'Service Steps'}
                  </span>
                  <h3 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
                    <Clock3 className="h-8 w-8 text-gray-400" />
                    {t('revision360.service.total.duration') || '120 Minutes'}
                  </h3>
                </div>
                <div className="">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-start gap-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                        {step}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {t(`revision360.service.step${step}.title`)}
                        </p>
                        <p className="mt-1 text-gray-500">
                          {t(`revision360.service.step${step}.description`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="flex flex-col gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex-1 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Brain className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    {t('revision360.benefits.benefit1.title')}
                  </h3>
                  <p className="text-gray-500">{t('revision360.benefits.benefit1.description')}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    {t('revision360.benefits.benefit3.title')}
                  </h3>
                  <p className="text-gray-500">{t('revision360.benefits.benefit3.description')}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>{' '}
        {/* Variants Section */}
        <section className="border-t border-gray-100 bg-white py-20">
          <div className="section-container mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <span className="mb-6 inline-block rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-semibold tracking-wider text-blue-600 uppercase">
                {t('revision360.variants.badge')}
              </span>
              <h2 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                {t('revision360.variants.title')}
              </h2>
              <p className="text-lg leading-relaxed font-normal text-gray-500">
                {t('revision360.variants.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {variants.map((variant, index) => (
                <motion.div
                  key={variant.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group flex flex-col items-start rounded-[2rem] border border-gray-200 bg-[#fbfbfd] p-8 text-left transition-all duration-300 hover:border-gray-300 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-900 shadow-sm transition-colors group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600">
                    {variant.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{variant.title}</h3>
                  <p className="mb-4 text-sm font-semibold tracking-wider text-blue-600 uppercase">
                    {variant.subtitle}
                  </p>

                  <div className="mt-2 mb-8 flex-1 text-sm leading-relaxed text-gray-500">
                    <p className="line-clamp-3">{variant.description}</p>
                  </div>

                  <div className="mb-6 flex w-full items-center justify-between border-t border-gray-200 pt-6">
                    <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                      {variant.duration}
                    </span>
                    <span className="text-lg font-bold text-gray-900">{variant.price}</span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full rounded-xl bg-white hover:bg-gray-50"
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {t('common.viewDetails') || 'View Details'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Final CTA */}
        <div className="py-12">
          <CTASection />
        </div>
      </PageLayout>{' '}
      {/* Variant Details Dialog */}
      <Dialog open={!!selectedVariant} onOpenChange={(open) => !open && setSelectedVariant(null)}>
        <DialogContent className="overflow-hidden rounded-[2rem] border-0 bg-white p-0 shadow-2xl sm:max-w-2xl">
          {selectedVariant && (
            <div className="flex max-h-[85vh] flex-col">
              <DialogHeader className="border-b border-gray-100 bg-gray-50/50 px-8 pt-8 pb-4">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm">
                    {selectedVariant.icon}
                  </div>
                  <div>
                    <DialogTitle className="border-none text-2xl font-bold text-gray-900">
                      {selectedVariant.title}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-xs font-semibold tracking-wider text-blue-600 uppercase">
                      {selectedVariant.subtitle}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="overflow-y-auto px-8 py-6">
                <p className="text-lg leading-relaxed text-gray-600">
                  {selectedVariant.description}
                </p>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-900 uppercase">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      {t('revision360.variants.idealFor')}
                    </h4>
                    <ul className="">
                      {selectedVariant.idealFor.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-600">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-900 uppercase">
                      <Layers className="h-4 w-4 text-blue-500" />
                      {t('revision360.variants.includes')}
                    </h4>
                    <ul className="">
                      {selectedVariant.includes.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-600">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-gray-100 bg-gray-50 p-6 px-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                    {t('revision360.variants.sessionDuration')}
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">{selectedVariant.duration}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                    {t('revision360.variants.investment')}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-blue-600">{selectedVariant.price}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
