'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Brain, Heart, Zap, Moon } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
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

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
      pink: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100',
      red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-16 text-center">
          <div className="bg-primary-50 border-primary-100 mb-8 inline-flex items-center rounded-full border px-6 py-2">
            <span className="text-primary-700 text-sm font-medium tracking-wide uppercase">
              {t('casos.section.badge')}
            </span>
          </div>

          <h2 className="text-eka-dark mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
            {t('casos.section.title')}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('casos.section.titleHighlight')}
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-xl text-gray-600">{t('casos.section.subtitle')}</p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProblems.map((problem, index) => {
            const ProblemIcon = problem.icon;
            return (
              <AnimateIn key={problem.id} delay={index * 0.1}>
                <Link
                  href={problem.href}
                  className="group ease-out-quart block rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
                >
                  <div
                    className={`h-14 w-14 rounded-2xl ${getColorClasses(problem.color)} ease-out-quart mb-6 flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-110`}
                  >
                    <ProblemIcon className="h-7 w-7" />
                  </div>

                  <h3 className="text-eka-dark group-hover:text-primary-600 ease-out-quart mb-3 text-xl font-semibold transition-colors duration-200">
                    {t(problem.titleKey)}
                  </h3>

                  <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">
                    {t(problem.descriptionKey)}
                  </p>

                  <div className="text-primary-600 flex items-center font-medium">
                    {t('casos.section.readMore')}
                    <ArrowRight className="ease-out-quart ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </AnimateIn>
            );
          })}
        </div>

        {/* Other Cases List */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h3 className="text-eka-dark mb-8 text-2xl font-light">{t('casos.other.title')}</h3>
          <div className="flex flex-wrap justify-center gap-4">
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
                className="hover:border-primary-200 hover:text-primary-600 ease-out-quart cursor-default rounded-full border border-gray-200 bg-white px-6 py-3 text-gray-600 shadow-sm transition-all duration-200 hover:shadow-md"
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
              className="bg-accent hover:bg-accent-dark text-eka-dark ease-out-quart inline-flex items-center rounded-full px-8 py-4 font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
            >
              {t('casos.section.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/first-time"
              className="ease-out-quart inline-flex items-center rounded-full bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
            >
              {t('casos.section.findYourCase')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
