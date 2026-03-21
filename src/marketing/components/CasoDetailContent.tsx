'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import PageLayout from '@/marketing/components/PageLayout';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Activity01Icon,
  Brain01Icon,
  FavouriteIcon,
  ZapIcon,
  Moon01Icon,
  ShieldIcon,
  StethoscopeIcon,
} from '@hugeicons/core-free-icons';

interface ProblemConfig {
  icon: IconSvgElement;
  color: string;
  href: string;
  key: string;
}

export default function CasoDetailContent() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';

  const { t } = useLanguage();

  // Helper to get array from translations
  const getArray = (baseKey: string) => {
    const items: string[] = [];
    let i = 1;
    while (true) {
      const key = `${baseKey}${i}`;
      const val = t(key);
      if (val === key || !val) break;
      items.push(val);
      i++;
    }
    return items;
  };

  const problemsConfig: Record<string, ProblemConfig> = {
    'back-pain': {
      icon: Activity01Icon,
      color: 'blue',
      href: '/services/massage',
      key: 'backPain',
    },
    'stress-anxiety': {
      icon: Brain01Icon,
      color: 'purple',
      href: '/services/kinesiology',
      key: 'stress',
    },
    'digestive-problems': {
      icon: FavouriteIcon,
      color: 'green',
      href: '/services/nutrition',
      key: 'digestive',
    },
    migraines: { icon: Brain01Icon, color: 'red', href: '/services/massage', key: 'migraines' },
    'low-energy': {
      icon: ZapIcon,
      color: 'orange',
      href: '/services/kinesiology',
      key: 'lowEnergy',
    },
    'hormonal-problems': {
      icon: ShieldIcon,
      color: 'pink',
      href: '/services/kinesiology',
      key: 'hormonal',
    },
    'sleep-difficulties': {
      icon: Moon01Icon,
      color: 'indigo',
      href: '/services/kinesiology',
      key: 'sleep',
    },
    'injury-recovery': {
      icon: StethoscopeIcon,
      color: 'red',
      href: '/services/massage',
      key: 'recovery',
    },
  };

  const config = id ? problemsConfig[id] : undefined;

  if (!config) {
    return (
      <PageLayout>
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f7] py-32 text-center">
          <h1 className="mb-6 text-3xl font-semibold">
            {t('common.notFound') || 'Case not found'}
          </h1>
          <Link href="/cases">
            <Button variant="outline">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 size-4" />
              {t('common.back') || 'Back'}
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const Icon = config.icon;

  // Clean color mapping for minimal accents
  const accentColorClass =
    {
      blue: 'text-blue-600 bg-blue-50',
      purple: 'text-purple-600 bg-purple-50',
      green: 'text-green-600 bg-green-50',
      orange: 'text-orange-600 bg-orange-50',
      indigo: 'text-indigo-600 bg-indigo-50',
      pink: 'text-pink-600 bg-pink-50',
      red: 'text-red-600 bg-red-50',
    }[config.color] || 'text-blue-600 bg-blue-50';

  // Data
  const symptoms = getArray(`casos.problems.${config.key}.symptom`);
  const causes = getArray(`casos.problems.${config.key}.cause`);
  const treatment = t(`casos.problems.${config.key}.treatment`);
  const results = t(`casos.problems.${config.key}.results`);

  const Hero = (
    <div className="relative border-b border-gray-200 bg-[#f5f5f7] pt-32 pb-24">
      <div className="section-container mx-auto max-w-4xl text-center">
        <Link
          href="/cases"
          className="mb-10 inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-black"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-1 size-4" />
          {t('casos.title')}
        </Link>

        <div
          className={`mx-auto h-24 w-24 rounded-[var(--radius)] ${accentColorClass} mb-8 flex items-center justify-center`}
        >
          <HugeiconsIcon icon={Icon} className="h-12 w-12" />
        </div>

        <h1 className="mb-8 text-5xl leading-tight font-semibold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
          {t(`casos.problems.${config.key}.title`)}
        </h1>

        <p className="mx-auto max-w-2xl text-xl leading-relaxed font-normal text-balance text-gray-500 md:text-2xl">
          {t(`casos.problems.${config.key}.description`)}
        </p>
      </div>
    </div>
  );

  return (
    <PageLayout hero={Hero}>
      <div className="bg-white py-24">
        <div className="section-container max-w-5xl">
          <div className="mb-24 grid grid-cols-1 gap-16 md:grid-cols-2">
            {/* Symptoms */}
            <div>
              <h2 className="mb-8 flex items-center gap-3 text-3xl font-semibold tracking-tight text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  1
                </span>
                {t('casos.symptoms')}
              </h2>
              <ul className="">
                {symptoms.map((item, idx) => (
                  <li
                    key={idx}
                    className="rounded-[var(--radius)] border border-gray-100/50 bg-gray-50 p-6"
                  >
                    <p className="text-lg leading-relaxed text-gray-700">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Causes */}
            <div>
              <h2 className="mb-8 flex items-center gap-3 text-3xl font-semibold tracking-tight text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-900">
                  2
                </span>
                {t('casos.causes')}
              </h2>
              <ul className="">
                {causes.map((item, idx) => (
                  <li
                    key={idx}
                    className="rounded-[var(--radius)] border border-gray-100 bg-white p-6"
                  >
                    <p className="text-lg leading-relaxed text-gray-600">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Treatment & Results - Highlight Section */}
          <div className="relative overflow-hidden rounded-[40px] bg-black p-8 text-white md:p-16">
            {/* Subtle mesh gradient background */}
            <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-900/20 blur-[100px]" />

            <div className="relative z-10 grid grid-cols-1 gap-16 md:grid-cols-2">
              <div>
                <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white">
                  <HugeiconsIcon icon={Activity01Icon} className="size-6 text-blue-400" />
                  {t('casos.treatment')}
                </h2>
                <p className="text-xl leading-relaxed font-light text-gray-300">{treatment}</p>
              </div>

              <div>
                <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-6 text-green-400" />
                  {t('casos.results')}
                </h2>
                <p className="text-xl leading-relaxed font-light text-gray-300">{results}</p>
              </div>
            </div>

            <div className="mt-16 border-t border-white/10 pt-8 text-center">
              <Link href={config.href}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-auto rounded-full px-10 py-6 text-xl font-medium"
                >
                  {t('common.bookNow')}
                  <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
