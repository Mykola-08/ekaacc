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
      href: '/cases/back-pain'
    },
    {
      id: 'stress-anxiety',
      titleKey: 'casos.problems.stress.title',
      descriptionKey: 'casos.problems.stress.description',
      icon: Brain,
      color: 'purple',
      href: '/cases/stress-anxiety'
    },
    {
      id: 'digestive-problems',
      titleKey: 'casos.problems.digestive.title',
      descriptionKey: 'casos.problems.digestive.description',
      icon: Heart,
      color: 'green',
      href: '/cases/digestive-problems'
    },
    {
      id: 'migraines',
      titleKey: 'casos.problems.migraines.title',
      descriptionKey: 'casos.problems.migraines.description',
      icon: Brain,
      color: 'red',
      href: '/cases/migraines'
    },
    {
      id: 'low-energy',
      titleKey: 'casos.problems.lowEnergy.title',
      descriptionKey: 'casos.problems.lowEnergy.description',
      icon: Zap,
      color: 'orange',
      href: '/cases/low-energy'
    },
    {
      id: 'sleep-difficulties',
      titleKey: 'casos.problems.sleep.title',
      descriptionKey: 'casos.problems.sleep.description',
      icon: Moon,
      color: 'indigo',
      href: '/cases/sleep-difficulties'
    }
  ];

  return (
    <section className="py-24 bg-[#f5f5f7]">
      <div className="section-container">
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-white border border-gray-200/50 text-gray-600 text-xs font-semibold uppercase tracking-wider mb-6">
            {t('casos.section.badge')}
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 tracking-tight">
            {t('casos.section.title')}
          </h2>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
            {t('casos.section.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {featuredProblems.map((problem, index) => {
            const ProblemIcon = problem.icon;
            return (
              <AnimateIn key={problem.id} delay={index * 0.05}>
                <Link
                  href={problem.href}
                  className="group block h-full apple-card p-8 transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-900 flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
                    <ProblemIcon className="w-6 h-6 stroke-[1.5px]" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 apple-title">
                    {t(problem.titleKey)}
                  </h3>

                  <p className="text-gray-500 mb-6 leading-relaxed line-clamp-3 font-normal text-base">
                    {t(problem.descriptionKey)}
                  </p>

                  <div className="flex items-center text-blue-600 font-medium text-sm mt-auto">
                    {t('casos.section.readMore')}
                    <ArrowRight className="w-4 h-4 ml-1 transition-colors duration-200" />
                  </div>
                </Link>
              </AnimateIn>
            );
          })}
        </div>

        {/* Other Cases List */}
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <h3 className="text-2xl font-medium text-gray-900 mb-8">{t('casos.other.title')}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'casos.other.money',
              'casos.other.relationships',
              'casos.other.selfworth',
              'casos.other.family',
              'casos.other.work',
              'casos.other.trauma'
            ].map((key) => (
              <span key={key} className="px-5 py-2.5 bg-white border border-gray-200/60 rounded-full text-gray-600 text-sm font-medium hover:border-blue-200 hover:text-blue-600 transition-colors duration-200 cursor-default">
                {t(key)}
              </span>
            ))}
          </div>
        </div>

        {/* View All Cases */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/cases"
              className="inline-flex items-center bg-[#0071e3] hover:bg-[#0077ED] text-white font-medium px-8 py-4 rounded-full transition duration-200 active:scale-[0.97]"
            >
              {t('casos.section.viewAll')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/first-time"
              className="inline-flex items-center bg-transparent border border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3]/5 font-medium px-8 py-4 rounded-full transition duration-200 active:scale-[0.97]"
            >
              {t('casos.section.findYourCase')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
