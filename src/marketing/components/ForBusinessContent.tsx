'use client';

import React from 'react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import PageLayout from '@/marketing/components/PageLayout';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import FAQ from '@/marketing/components/FAQ';
import CTASection from '@/marketing/components/CTASection';
import { Button } from '@/marketing/components/ui/button';
import { motion } from 'framer-motion';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

export default function ForBusinessContent() {
  const { t } = useLanguage();

  const faqItems = [
    {
      id: 'business-q1',
      question: t('personalized.business.faq.q1'),
      answer: t('personalized.business.faq.a1'),
    },
    {
      id: 'business-q2',
      question: t('personalized.business.faq.q2'),
      answer: t('personalized.business.faq.a2'),
    },
    {
      id: 'business-q3',
      question: t('personalized.business.faq.q3'),
      answer: t('personalized.business.faq.a3'),
    },
  ];

  return (
    <>
      <SEOUpdater
        titleKey="seo.business.title"
        descriptionKey="seo.business.description"
        keywordsKey="seo.business.keywords"
      />
      <PageLayout
        hero={{
          title: t('personalized.business.hero.title'),
          subtitle: t('personalized.business.hero.description'),
          backgroundImage:
            'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1600',
          themeColor: 'blue',
        }}
      >
        <div className="relative z-20 mt-4 mb-20 flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="hover: rounded-full px-8 transition-all">
            <Link href="/booking">
              {t('nav.bookNow')}
              <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-gray-200 bg-white/90 px-8 text-gray-800 backdrop-blur-sm hover:bg-gray-50"
          >
            <Link href="/booking">{t('common.askQuestions')}</Link>
          </Button>
        </div>

        {/* Apple-Style Bento Section */}
        <section className="bg-background relative overflow-hidden py-20">
          <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 text-4xl font-semibold tracking-tighter text-gray-900 md:text-5xl">
                {t('personalized.business.bento.title')}
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-gray-500 md:text-xl">
                {t('personalized.business.bento.subtitle')}
              </p>
            </motion.div>

            {/* Service Bento Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              <ServiceBentoItem
                title={t('personalized.business.bento.box1.title')}
                description={t('personalized.business.bento.box1.desc')}
                image="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
                className="md:col-span-2"
                details={
                  <div className="">
                    <h4 className="text-xl font-bold text-gray-900">
                      {t('personalized.business.bento.box1.details.title')}
                    </h4>
                    <p className="leading-relaxed text-gray-600">
                      {t('personalized.business.bento.box1.details.desc')}
                    </p>
                  </div>
                }
                bookUrl="/booking?subject=teams"
                bookText={t('common.enquireNow')}
              />

              <ServiceBentoItem
                title={t('personalized.business.bento.box2.title')}
                description={t('personalized.business.bento.box2.desc')}
                image="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800"
                className="col-span-1"
                delay={0.1}
                details={
                  <div className="">
                    <h4 className="text-xl font-bold text-gray-900">
                      {t('personalized.business.bento.box2.details.title')}
                    </h4>
                    <p className="leading-relaxed text-gray-600">
                      {t('personalized.business.bento.box2.details.desc')}
                    </p>
                  </div>
                }
                bookUrl="/booking?subject=office"
                bookText={t('common.enquireNow')}
              />

              <ServiceBentoItem
                title={t('personalized.business.bento.box3.title')}
                description={t('personalized.business.bento.box3.desc')}
                image="https://images.pexels.com/photos/4098228/pexels-photo-4098228.jpeg?auto=compress&cs=tinysrgb&w=800"
                className="col-span-1"
                delay={0.2}
                details={
                  <div className="">
                    <h4 className="text-xl font-bold text-gray-900">
                      {t('personalized.business.bento.box3.details.title')}
                    </h4>
                    <p className="leading-relaxed text-gray-600">
                      {t('personalized.business.bento.box3.details.desc')}
                    </p>
                  </div>
                }
                bookUrl="/booking?subject=teams"
                bookText={t('common.enquireNow')}
              />

              <ServiceBentoItem
                title={t('personalized.business.bento.box4.title')}
                description={t('personalized.business.bento.box4.desc')}
                image="https://images.pexels.com/photos/1181681/pexels-photo-1181681.jpeg?auto=compress&cs=tinysrgb&w=1200"
                className="md:col-span-2"
                delay={0.3}
                details={
                  <div className="">
                    <h4 className="text-xl font-bold text-gray-900">
                      {t('personalized.business.bento.box4.details.title')}
                    </h4>
                    <p className="leading-relaxed text-gray-600">
                      {t('personalized.business.bento.box4.details.desc')}
                    </p>
                  </div>
                }
                bookUrl="/booking?subject=office"
                bookText={t('common.enquireNow')}
              />
            </div>
          </div>
        </section>

        {/* Tiers / Plans Section - Rounded Style */}
        <section className="relative overflow-hidden bg-white py-24" id="plans">
          <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-semibold tracking-tighter text-gray-900 md:text-5xl">
                {t('personalized.business.plans.title')}
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-gray-500 md:text-xl">
                {t('personalized.business.plans.subtitle')}
              </p>
            </div>

            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
              {/* Background gradient blur */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-full w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl" />

              {/* Plan 1 - Teams */}
              <div className="relative flex h-full flex-col rounded-[2rem] border border-gray-100 bg-white p-8 shadow-gray-200/20 transition-all duration-300 sm:p-10">
                <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-blue-400 opacity-10" />
                <h3 className="relative z-10 mb-3 text-3xl font-semibold tracking-tight text-gray-900">
                  {t('personalized.business.plans.teams.title')}
                </h3>
                <p className="relative z-10 mb-8 flex-grow font-medium text-gray-500">
                  {t('personalized.business.plans.teams.desc')}
                </p>

                <div className="relative z-10 mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tighter text-gray-900">€100</span>
                    <span className="text-xl font-medium text-gray-500">/mo</span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-400">
                    {t('personalized.business.plans.teams.price')}
                  </div>
                </div>

                <ul className="relative z-10 mb-10 flex-grow">
                  <li className="flex items-start">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className="mr-3 size-6 shrink-0 text-blue-500"
                    />
                    <span className="leading-snug text-gray-700">
                      {t('personalized.business.plans.teams.feature1')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className="mr-3 size-6 shrink-0 text-blue-500"
                    />
                    <span className="leading-snug text-gray-700">
                      {t('personalized.business.plans.teams.feature2')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className="mr-3 size-6 shrink-0 text-blue-500"
                    />
                    <span className="leading-snug text-gray-700">
                      {t('personalized.business.plans.teams.feature3')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className="mr-3 size-6 shrink-0 text-blue-500"
                    />
                    <span className="leading-snug text-gray-700">
                      {t('personalized.business.plans.teams.feature4')}
                    </span>
                  </li>
                </ul>

                <Button
                  asChild
                  className="bg-primary hover:bg-primary-600 relative z-10 w-full rounded-[var(--radius)] py-6 text-lg text-white"
                >
                  <Link href="/booking?subject=teams">{t('common.getStarted')}</Link>
                </Button>
              </div>

              {/* Plan 2 - Office */}
              <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-gray-900 p-8 transition-transform duration-300 sm:p-10">
                <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-bl-full bg-white opacity-20" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-blue-500 opacity-10" />

                <h3 className="relative z-10 mb-3 text-3xl font-semibold tracking-tight text-white">
                  {t('personalized.business.plans.enterprise.title')}
                </h3>
                <p className="relative z-10 mb-8 flex-grow font-medium text-gray-300">
                  {t('personalized.business.plans.enterprise.desc')}
                </p>

                <div className="relative z-10 mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tighter text-white">€500</span>
                    <span className="text-xl font-medium text-gray-400">/mo</span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-500">
                    {t('personalized.business.plans.enterprise.price')}
                  </div>
                </div>

                <ul className="relative z-10 mb-10 flex-grow">
                  <li className="flex items-start">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className="mr-3 size-6 shrink-0 text-blue-400"
                    />
                    <span className="leading-snug text-gray-100">
                      {t('personalized.business.plans.enterprise.feature1')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className="mr-3 size-6 shrink-0 text-blue-400"
                    />
                    <span className="leading-snug text-gray-100">
                      {t('personalized.business.plans.enterprise.feature2')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className="mr-3 size-6 shrink-0 text-blue-400"
                    />
                    <span className="leading-snug text-gray-100">
                      {t('personalized.business.plans.enterprise.feature3')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className="mr-3 size-6 shrink-0 text-blue-400"
                    />
                    <span className="leading-snug text-gray-100">
                      {t('personalized.business.plans.enterprise.feature4')}
                    </span>
                  </li>
                </ul>

                <Button
                  asChild
                  className="relative z-10 w-full rounded-[var(--radius)] bg-white py-6 text-lg text-black hover:bg-gray-100"
                >
                  <Link href="/booking?subject=office">{t('common.getStarted')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <FAQ items={faqItems} />
        <CTASection />
      </PageLayout>
    </>
  );
}
