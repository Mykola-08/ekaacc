'use client';

import Link from 'next/link';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  FavouriteIcon,
  Brain01Icon,
  ZapIcon,
  Moon01Icon,
  Activity01Icon,
  StethoscopeIcon,
  ShieldIcon,
} from '@hugeicons/core-free-icons';

interface ProblemConfig {
  icon: IconSvgElement;
  color: string;
  href: string;
  key: string;
}

export const problemsConfig: Record<string, ProblemConfig> = {
  'back-pain': { icon: Activity01Icon, color: 'blue', href: '/services/massage', key: 'backPain' },
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
  'low-energy': { icon: ZapIcon, color: 'orange', href: '/services/kinesiology', key: 'lowEnergy' },
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

export default function CaseDetailContent({ id }: { id: string }) {
  const { t } = useLanguage();

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

  const config = problemsConfig[id];

  if (!config) {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">{t('common.notFound') || 'Case not found'}</h1>
        <Link href="/cases">
          <Button variant="outline">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 size-4" />
            {t('common.back') || 'Back'}
          </Button>
        </Link>
      </div>
    );
  }

  const Icon = config.icon;
  const colors = {
    blue: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
    purple: { bg: 'bg-secondary', text: 'text-secondary-foreground', border: 'border-border' },
    green: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
    orange: { bg: 'bg-warning/10', text: 'text-warning-foreground', border: 'border-warning/20' },
    indigo: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
    pink: { bg: 'bg-secondary', text: 'text-secondary-foreground', border: 'border-border' },
    red: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
  };
  const colorClass = colors[config.color as keyof typeof colors] || colors.blue;

  const symptoms = getArray(`casos.problems.${config.key}.symptom`);
  const causes = getArray(`casos.problems.${config.key}.cause`);
  const treatment = t(`casos.problems.${config.key}.treatment`);
  const results = t(`casos.problems.${config.key}.results`);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-100/50 bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-40" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <Link
            href="/cases"
            className="mb-8 inline-flex items-center rounded-full border border-gray-100 bg-white px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600 hover:shadow"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 size-4" />
            {t('casos.title')}
          </Link>

          <div
            className={`mx-auto h-20 w-20 rounded-[var(--radius)] ${colorClass.bg} mb-6 flex items-center justify-center`}
          >
            <HugeiconsIcon icon={Icon} className={`h-10 w-10 ${colorClass.text}`} />
          </div>

          <h1 className="mb-6 text-4xl font-light tracking-tight text-gray-900 md:text-5xl">
            {t(`casos.problems.${config.key}.title`)}
          </h1>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light text-gray-600">
            {t(`casos.problems.${config.key}.description`)}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Symptoms */}
          <div className="relative">
            <div className="absolute top-0 bottom-0 -left-4 w-1 rounded-full bg-gradient-to-b from-red-200 to-transparent opacity-50" />
            <h2 className="mb-6 flex items-center text-2xl font-light text-gray-900">
              <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-500">
                1
              </span>
              {t('casos.symptoms')}
            </h2>
            <ul className="">
              {symptoms.map((item, idx) => (
                <li key={idx} className="flex items-start rounded-[var(--radius)] bg-gray-50 p-4">
                  <span className="mt-2 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Causes */}
          <div className="relative">
            <div className="absolute top-0 bottom-0 -left-4 w-1 rounded-full bg-gradient-to-b from-orange-200 to-transparent opacity-50" />
            <h2 className="mb-6 flex items-center text-2xl font-light text-gray-900">
              <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-500">
                2
              </span>
              {t('casos.causes')}
            </h2>
            <ul className="">
              {causes.map((item, idx) => (
                <li key={idx} className="flex items-start rounded-[var(--radius)] bg-gray-50 p-4">
                  <span className="mt-2 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Treatment & Results */}
        <div className="rounded-apple-xl relative overflow-hidden bg-gray-900 p-8 text-white md:p-12">
          <div
            className={`absolute top-0 right-0 h-96 w-96 ${colorClass.bg.replace('bg-', 'bg-')} translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl`}
          />

          <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 flex items-center text-2xl font-light text-white">
                <HugeiconsIcon icon={Activity01Icon} className="mr-3 size-6 text-blue-400" />
                {t('casos.treatment')}
              </h2>
              <p className="text-lg leading-relaxed font-light text-gray-300">{treatment}</p>
            </div>

            <div>
              <h2 className="mb-6 flex items-center text-2xl font-light text-white">
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  className="mr-3 size-6 text-green-400"
                />
                {t('casos.results')}
              </h2>
              <p className="text-lg leading-relaxed font-light text-gray-300">{results}</p>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-center">
            <Link href={config.href}>
              <Button size="lg" variant="secondary" className="border-none px-8 py-4 font-bold">
                {t('common.bookNow')}
                <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
