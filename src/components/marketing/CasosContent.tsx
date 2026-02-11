'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Activity,
  Brain,
  Heart,
  Moon,
  Shield,
  Stethoscope,
  Zap,
  Search,
} from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/marketing/PageLayout';

interface Problem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
}

export default function CasosContent() {
  const { t } = useLanguage();

  const additionalProblemsKeys = [
    'casos.additionalProblems.bruxism',
    'casos.additionalProblems.tmj',
    'casos.additionalProblems.sciatica',
    'casos.additionalProblems.shoulderPain',
    'casos.additionalProblems.dizziness',
    'casos.additionalProblems.irritability',
    'casos.additionalProblems.intestinalProblems',
    'casos.additionalProblems.chronicFatigue',
    'casos.additionalProblems.socialAnxiety',
    'casos.additionalProblems.concentrationDifficulty',
    'casos.additionalProblems.headaches',
    'casos.additionalProblems.insomnia',
    'casos.additionalProblems.posture',
    'casos.additionalProblems.contractures',
    'casos.additionalProblems.emotionalBlock',
    'casos.additionalProblems.rsi',
    'casos.additionalProblems.carpalTunnel',
    'casos.additionalProblems.plantarFasciitis',
  ];

  const mainProblems: Problem[] = [
    {
      id: 'back-pain',
      title: t('casos.problems.backPain.title'),
      category: 'fisic',
      description: t('casos.problems.backPain.description'),
      icon: Activity,
      color: 'blue',
      href: '/services/massage',
    },
    {
      id: 'stress-anxiety',
      title: t('casos.problems.stress.title'),
      category: 'emocional',
      description: t('casos.problems.stress.description'),
      icon: Brain,
      color: 'purple',
      href: '/services/kinesiology',
    },
    {
      id: 'digestive-problems',
      title: t('casos.problems.digestive.title'),
      category: 'fisic',
      description: t('casos.problems.digestive.description'),
      icon: Heart,
      color: 'green',
      href: '/services/nutrition',
    },
    {
      id: 'migraines',
      title: t('casos.problems.migraines.title'),
      category: 'fisic',
      description: t('casos.problems.migraines.description'),
      icon: Brain,
      color: 'red',
      href: '/services/massage',
    },
    {
      id: 'low-energy',
      title: t('casos.problems.lowEnergy.title'),
      category: 'energia',
      description: t('casos.problems.lowEnergy.description'),
      icon: Zap,
      color: 'orange',
      href: '/services/kinesiology',
    },
    {
      id: 'hormonal-problems',
      title: t('casos.problems.hormonal.title'),
      category: 'hormonal',
      description: t('casos.problems.hormonal.description'),
      icon: Shield,
      color: 'pink',
      href: '/services/kinesiology',
    },
    {
      id: 'sleep-difficulties',
      title: t('casos.problems.sleep.title'),
      category: 'son',
      description: t('casos.problems.sleep.description'),
      icon: Moon,
      color: 'indigo',
      href: '/services/kinesiology',
    },
    {
      id: 'injury-recovery',
      title: t('casos.problems.recovery.title'),
      category: 'recuperacio',
      description: t('casos.problems.recovery.description'),
      icon: Stethoscope,
      color: 'red',
      href: '/services/massage',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-info', text: 'text-info-foreground', border: 'group-hover:border-info' },
      purple: {
        bg: 'bg-accent',
        text: 'text-accent-foreground',
        border: 'group-hover:border-accent',
      },
      green: { bg: 'bg-success', text: 'text-success-foreground', border: 'group-hover:border-success' },
      orange: {
        bg: 'bg-warning',
        text: 'text-warning-foreground',
        border: 'group-hover:border-warning',
      },
      indigo: {
        bg: 'bg-accent/10',
        text: 'text-accent-foreground',
        border: 'group-hover:border-accent/30',
      },
      pink: { bg: 'bg-accent/10', text: 'text-accent-foreground', border: 'group-hover:border-accent/30' },
      red: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'group-hover:border-destructive/30' },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const Hero = (
    <div className="relative overflow-hidden px-6 pt-32 pb-20">
      {/* Grid is handled by PageLayout background */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-info bg-card/80 px-3 py-1 text-sm text-primary shadow-sm backdrop-blur-sm">
          <Search className="h-4 w-4" />
          <span className="font-medium">{t('casos.hero.badge') || 'What brings you here?'}</span>
        </div>

        <h1 className="mb-6 text-5xl leading-tight font-light tracking-tight text-foreground md:text-7xl">
          {t('casos.title')}
        </h1>

        <p className="mb-8 text-xl leading-relaxed font-light text-muted-foreground md:text-2xl">
          {t('casos.subtitle')}
        </p>

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t('casos.description')}
        </p>
      </div>
    </div>
  );

  return (
    <PageLayout hero={Hero}>
      {/* Main Problems Grid */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light text-foreground">{t('casos.frequentCases')}</h2>
          <p className="text-muted-foreground">{t('casos.frequentCasesSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mainProblems.map((problem) => {
            const colors = getColorClasses(problem.color);
            const Icon = problem.icon;

            return (
              <Link
                key={problem.id}
                href={`/cases/${problem.id}`}
                className="group card relative flex h-full flex-col overflow-hidden rounded-2xl border border-transparent bg-card p-8 transition-all duration-300 hover:border-border/50 hover:shadow-xl" // Added card class just in case, but custom styling is prevalent
              >
                {/* Hover Gradient Background */}
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5 ${colors.bg.replace('bg-', 'to- bg-linear-to-br from-background')}`}
                />

                <div className="relative z-10">
                  <div
                    className={`h-14 w-14 rounded-2xl ${colors.bg} ${colors.text} mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-info-foreground">
                    {problem.title}
                  </h3>

                  <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {problem.description}
                  </p>

                  <div className="mt-auto flex items-center text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    <span>{t('casos.seeDetails')}</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Additional Problems List - Modernized */}
      <div className="border-t border-border bg-card py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-light text-foreground">{t('casos.otherCases')}</h2>
            <p className="text-muted-foreground">{t('casos.otherCasesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {additionalProblemsKeys.map((key) => (
              <div
                key={key}
                className="group flex cursor-default items-center rounded-2xl bg-muted p-4 transition-colors duration-200 hover:bg-info/50"
              >
                <div className="mr-4 h-2 w-2 rounded-full bg-info/50 transition-colors group-hover:bg-primary" />
                <span className="font-medium text-foreground transition-colors group-hover:text-info-foreground">
                  {t(key)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-eka-dark to-eka-dark/80 px-6 py-24">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-light tracking-tight text-primary-foreground md:text-5xl">
            {t('casos.ctaTitle')}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed font-light text-info/80 md:text-xl">
            {t('casos.ctaSubtitle')}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/book">
              <Button
                size="lg"
                className="btn btn-primary bg-accent text-eka-dark hover:bg-accent/90"
              >
                {t('casos.bookSession')}
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                className="btn btn-outline border-border/20 text-primary-foreground hover:bg-background/10"
              >
                {t('casos.discoverIdeal')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

