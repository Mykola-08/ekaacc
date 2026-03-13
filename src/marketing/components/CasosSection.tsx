'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Brain, Heart, Zap, Moon } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import AnimateIn from './AnimateIn';

interface Problem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
}

export default function CasosSection() {
  const { t } = useLanguage();

  const featuredProblems: Problem[] = [
    {
      id: 'back-pain',
      titleKey: 'casos.problems.backPain.title',
      descriptionKey: 'casos.problems.backPain.description',
      icon: Activity,
      color: 'blue',
      href: '/cases/back-pain',
    },
    {
      id: 'stress-anxiety',
      titleKey: 'casos.problems.stress.title',
      descriptionKey: 'casos.problems.stress.description',
      icon: Brain,
      color: 'purple',
      href: '/cases/stress-anxiety',
    },
    {
      id: 'digestive-problems',
      titleKey: 'casos.problems.digestive.title',
      descriptionKey: 'casos.problems.digestive.description',
      icon: Heart,
      color: 'green',
      href: '/cases/digestive-problems',
    },
    {
      id: 'migraines',
      titleKey: 'casos.problems.migraines.title',
      descriptionKey: 'casos.problems.migraines.description',
      icon: Brain,
      color: 'red',
      href: '/cases/migraines',
    },
    {
      id: 'low-energy',
      titleKey: 'casos.problems.lowEnergy.title',
      descriptionKey: 'casos.problems.lowEnergy.description',
      icon: Zap,
      color: 'orange',
      href: '/cases/low-energy',
    },
    {
      id: 'sleep-difficulties',
      titleKey: 'casos.problems.sleep.title',
      descriptionKey: 'casos.problems.sleep.description',
      icon: Moon,
      color: 'indigo',
      href: '/cases/sleep-difficulties',
    },
  ];

  return (
    <section className="bg-[#f5f5f7] py-24">
      <div className="section-container">
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full border border-gray-200/50 bg-white px-3 py-1 text-xs font-semibold tracking-wider text-gray-600 uppercase">
            {t('casos.section.badge')}
          </span>

          <h2 className="mb-6 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t('casos.section.title')}
          </h2>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed font-normal text-balance text-gray-500">
            {t('casos.section.subtitle')}
          </p>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProblems.map((problem, index) => {
            const ProblemIcon = problem.icon;
            return (
              <AnimateIn key={problem.id} delay={index * 0.05}>
                <Link
                  href={problem.href}
                  className="group apple-card block h-full p-8 transition-colors duration-300"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-900 transition-colors duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
                    <ProblemIcon className="h-6 w-6 stroke-[1.5px]" />
                  </div>

                  <h3 className="apple-title mb-3 text-xl font-semibold text-gray-900">
                    {t(problem.titleKey)}
                  </h3>

                  <p className="mb-6 line-clamp-3 text-base leading-relaxed font-normal text-gray-500">
                    {t(problem.descriptionKey)}
                  </p>

                  <div className="mt-auto flex items-center text-sm font-medium text-blue-600">
                    {t('casos.section.readMore')}
                    <ArrowRight className="ml-1 h-4 w-4 transition-colors duration-200" />
                  </div>
                </Link>
              </AnimateIn>
            );
          })}
        </div>

        {/* Other Cases List */}
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <h3 className="mb-8 text-2xl font-medium text-gray-900">{t('casos.other.title')}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'casos.other.money',
              'casos.other.relationships',
              'casos.other.selfworth',
              'casos.other.family',
              'casos.other.work',
              'casos.other.trauma',
            ].map((key) => (
              <span
                key={key}
                className="cursor-default rounded-full border border-gray-200/60 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-200 hover:border-blue-200 hover:text-blue-600"
              >
                {t(key)}
              </span>
            ))}
          </div>
        </div>

        {/* View All Cases */}
        <div className="text-center">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/cases"
              className="inline-flex items-center rounded-full bg-[#0071e3] px-8 py-4 font-medium text-white transition duration-200 hover:bg-[#0077ED] active:scale-[0.97]"
            >
              {t('casos.section.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/first-time"
              className="inline-flex items-center rounded-full border border-[#0071e3] bg-transparent px-8 py-4 font-medium text-[#0071e3] transition duration-200 hover:bg-[#0071e3]/5 active:scale-[0.97]"
            >
              {t('casos.section.findYourCase')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
