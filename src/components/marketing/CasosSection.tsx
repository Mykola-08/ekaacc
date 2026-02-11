'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Brain, Heart, Zap, Moon } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';

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
      blue: 'bg-info border-info text-info-foreground hover:bg-info/20',
      purple: 'bg-accent border-accent text-accent-foreground hover:bg-accent/20',
      green: 'bg-success border-success text-success-foreground hover:bg-success/20',
      orange: 'bg-marketing-accent-light/50 border-marketing-accent-light text-marketing-accent-dark hover:bg-marketing-accent-light',
      indigo: 'bg-accent/10 border-accent/30 text-accent-foreground hover:bg-accent/20',
      pink: 'bg-accent/10 border-accent/30 text-accent-foreground hover:bg-accent/20',
      red: 'bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="bg-muted py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-16 text-center">
          <div className="bg-card border-border mb-8 inline-flex items-center rounded-full border px-6 py-2 shadow-sm">
            <span className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              {t('casos.section.badge')}
            </span>
          </div>

          <h2 className="text-foreground mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
            {t('casos.section.title')}{' '}
            <span className="text-foreground">
              {t('casos.section.titleHighlight')}
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">{t('casos.section.subtitle')}</p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProblems.map((problem, index) => {
            const ProblemIcon = problem.icon;
            return (
              <div key={problem.id}>
                <Link
                  href={problem.href}
                  className="group ease-out-quart block rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-lg"
                >
                  <div
                    className={`h-14 w-14 rounded-2xl ${getColorClasses(problem.color)} ease-out-quart mb-6 flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-110`}
                  >
                    <ProblemIcon className="h-7 w-7" />
                  </div>

                  <h3 className="text-eka-dark group-hover:text-accent-dark ease-out-quart mb-3 text-xl font-semibold transition-colors duration-200">
                    {t(problem.titleKey)}
                  </h3>

                  <p className="mb-4 line-clamp-3 leading-relaxed text-muted-foreground">
                    {t(problem.descriptionKey)}
                  </p>

                  <div className="text-accent-dark flex items-center font-medium">
                    {t('casos.section.readMore')}
                    <ArrowRight className="ease-out-quart ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
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
                className="hover:border-primary/30 hover:text-primary ease-out-quart cursor-default rounded-full border border-border bg-card px-6 py-3 text-muted-foreground shadow-sm transition-all duration-200 hover:shadow-md"
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
              className="ease-out-quart inline-flex items-center rounded-full bg-muted px-6 py-3 font-semibold text-foreground transition-all duration-200 hover:bg-muted"
            >
              {t('casos.section.findYourCase')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

