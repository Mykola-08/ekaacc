'use client';

import Link from 'next/link';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import PageLayout from '@/marketing/components/PageLayout';
import SEOUpdater from '@/marketing/components/SEOUpdater';

import ParallaxBackground from '@/marketing/components/ParallaxBackground';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  Activity01Icon,
  Brain01Icon,
  FavouriteIcon,
  Moon01Icon,
  ShieldIcon,
  StethoscopeIcon,
  ZapIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons';

interface Problem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: IconSvgElement;
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
      icon: Activity01Icon,
      color: 'blue',
      href: '/services/massage',
    },
    {
      id: 'stress-anxiety',
      title: t('casos.problems.stress.title'),
      category: 'emocional',
      description: t('casos.problems.stress.description'),
      icon: Brain01Icon,
      color: 'purple',
      href: '/services/kinesiology',
    },
    {
      id: 'digestive-problems',
      title: t('casos.problems.digestive.title'),
      category: 'fisic',
      description: t('casos.problems.digestive.description'),
      icon: FavouriteIcon,
      color: 'green',
      href: '/services/nutrition',
    },
    {
      id: 'migraines',
      title: t('casos.problems.migraines.title'),
      category: 'fisic',
      description: t('casos.problems.migraines.description'),
      icon: Brain01Icon,
      color: 'red',
      href: '/services/massage',
    },
    {
      id: 'low-energy',
      title: t('casos.problems.lowEnergy.title'),
      category: 'energia',
      description: t('casos.problems.lowEnergy.description'),
      icon: ZapIcon,
      color: 'orange',
      href: '/services/kinesiology',
    },
    {
      id: 'hormonal-problems',
      title: t('casos.problems.hormonal.title'),
      category: 'hormonal',
      description: t('casos.problems.hormonal.description'),
      icon: ShieldIcon,
      color: 'pink',
      href: '/services/kinesiology',
    },
    {
      id: 'sleep-difficulties',
      title: t('casos.problems.sleep.title'),
      category: 'son',
      description: t('casos.problems.sleep.description'),
      icon: Moon01Icon,
      color: 'indigo',
      href: '/services/kinesiology',
    },
    {
      id: 'injury-recovery',
      title: t('casos.problems.recovery.title'),
      category: 'recuperacio',
      description: t('casos.problems.recovery.description'),
      icon: StethoscopeIcon,
      color: 'red',
      href: '/services/massage',
    },
  ];

  return (
    <>
      <SEOUpdater
        titleKey="casos.seo.title"
        descriptionKey="casos.seo.desc"
        keywordsKey="casos.seo.keywords"
      />
      <PageLayout
        hero={{
          title: t('casos.title'),
          subtitle: t('casos.subtitle'),
          badge: t('casos.hero.badge') || 'Solutions',
          icon: <HugeiconsIcon icon={Search01Icon} className="size-4" />,
        }}
        className="bg-secondary"
      >
        {/* Main Problems Grid */}
        <div className="py-16 sm:py-24">
          <div className="section-container">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                {t('casos.frequentCases')}
              </h2>
              <p className="text-xl font-normal text-gray-500">
                {t('casos.frequentCasesSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {mainProblems.map((problem) => {
                const Icon = problem.icon;

                return (
                  <Link
                    key={problem.id}
                    href={`/cases/${problem.id}`}
                    className="group relative flex h-full flex-col rounded-[32px] border border-gray-100/50 bg-white p-8 transition duration-300 active:scale-[0.97]"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-gray-50 text-gray-900">
                      <HugeiconsIcon icon={Icon} className="h-7 w-7" />
                    </div>

                    <h3 className="mb-3 text-xl font-semibold text-gray-900">{problem.title}</h3>

                    <p className="mb-6 line-clamp-3 text-base leading-relaxed text-gray-500">
                      {problem.description}
                    </p>

                    <div className="mt-auto flex items-center text-sm font-medium text-blue-600">
                      <span>{t('casos.seeDetails')}</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional Problems List - Modernized */}
        <div className="border-t border-gray-100 bg-white py-24">
          <div className="section-container max-w-5xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-semibold tracking-tight text-gray-900">
                {t('casos.otherCases')}
              </h2>
              <p className="text-xl font-normal text-gray-500">{t('casos.otherCasesSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {additionalProblemsKeys.map((key) => (
                <div
                  key={key}
                  className="bg-secondary flex cursor-default items-center rounded-[var(--radius)] p-4 transition-colors duration-200 hover:bg-gray-100"
                >
                  <div className="mr-4 h-2 w-2 rounded-full bg-blue-500" />
                  <span className="font-medium text-gray-700">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Parallax CTA - Apple Style with Background Image */}
        <ParallaxBackground
          src="https://images.pexels.com/photos/4099305/pexels-photo-4099305.jpeg?auto=compress&cs=tinysrgb&w=1920"
          className="px-6 py-32 text-center"
          overlayOpacity={0.6}
        >
          <div className="relative z-10 mx-auto max-w-4xl">
            <h2 className="mb-6 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              {t('casos.ctaTitle')}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed font-light text-gray-200 md:text-2xl">
              {t('casos.ctaSubtitle')}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/booking">
                <Button
                  size="lg"
                  variant="default"
                  className="h-auto rounded-full border-none bg-white px-8 py-4 text-lg text-black hover:bg-gray-100"
                >
                  {t('casos.bookSession')}
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto rounded-full border-white bg-transparent px-8 py-4 text-lg text-white hover:bg-white/10 hover:text-white"
                >
                  {t('casos.discoverIdeal')}
                </Button>
              </Link>
            </div>
          </div>
        </ParallaxBackground>
      </PageLayout>
    </>
  );
}
