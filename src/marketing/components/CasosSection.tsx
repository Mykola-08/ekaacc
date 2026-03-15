'use client';

import Link from 'next/link';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import AnimateIn from './AnimateIn';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { ArrowRight01Icon, Activity01Icon, Brain01Icon, FavouriteIcon, ZapIcon, Moon01Icon } from '@hugeicons/core-free-icons';

interface Problem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: IconSvgElement;
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
      icon: Activity01Icon,
      color: 'blue',
      href: '/cases/back-pain',
    },
    {
      id: 'stress-anxiety',
      titleKey: 'casos.problems.stress.title',
      descriptionKey: 'casos.problems.stress.description',
      icon: Brain01Icon,
      color: 'purple',
      href: '/cases/stress-anxiety',
    },
    {
      id: 'digestive-problems',
      titleKey: 'casos.problems.digestive.title',
      descriptionKey: 'casos.problems.digestive.description',
      icon: FavouriteIcon,
      color: 'green',
      href: '/cases/digestive-problems',
    },
    {
      id: 'migraines',
      titleKey: 'casos.problems.migraines.title',
      descriptionKey: 'casos.problems.migraines.description',
      icon: Brain01Icon,
      color: 'red',
      href: '/cases/migraines',
    },
    {
      id: 'low-energy',
      titleKey: 'casos.problems.lowEnergy.title',
      descriptionKey: 'casos.problems.lowEnergy.description',
      icon: ZapIcon,
      color: 'orange',
      href: '/cases/low-energy',
    },
    {
      id: 'sleep-difficulties',
      titleKey: 'casos.problems.sleep.title',
      descriptionKey: 'casos.problems.sleep.description',
      icon: Moon01Icon,
      color: 'indigo',
      href: '/cases/sleep-difficulties',
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="section-container">
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <h2 className="mb-6 text-[2.5rem] leading-[1.05] font-semibold tracking-tighter text-foreground sm:text-[3.5rem] lg:text-[4rem]">
            {t('casos.section.title')}
          </h2>

          <p className="mx-auto max-w-2xl text-[1.2rem] leading-relaxed font-normal text-balance text-muted-foreground">
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
                  <div className="text-primary group-hover:bg-primary mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-background transition-colors duration-300 group-hover:text-white">
                    <HugeiconsIcon icon={ProblemIcon} className="h-6 w-6 stroke-[1.5px]" />
                  </div>

                  <h3 className="mb-3 text-[1.25rem] font-semibold tracking-tight text-foreground">
                    {t(problem.titleKey)}
                  </h3>

                  <p className="mb-6 line-clamp-3 text-[1.05rem] leading-relaxed font-normal text-muted-foreground">
                    {t(problem.descriptionKey)}
                  </p>

                  <div className="mt-auto flex items-center text-sm font-medium text-foreground transition-opacity group-hover:opacity-70">
                    {t('casos.section.readMore')}
                    <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 size-4 transition-transform group-hover:translate-x-1"  />
                  </div>
                </Link>
              </AnimateIn>
            );
          })}
        </div>

        {/* Other Cases List */}
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <h3 className="mb-8 text-[1.5rem] font-medium tracking-tight text-foreground">
            {t('casos.other.title')}
          </h3>
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
                className="cursor-default rounded-full border border-black/5 bg-background px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-black/10 hover:text-foreground"
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
              <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-5"  />
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
