'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Heart,
  Brain,
  Zap,
  Moon,
  Activity,
  Stethoscope,
  Shield,
} from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/marketing/PageLayout';

interface ProblemConfig {
  icon: React.ComponentType<any>;
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
    'back-pain': { icon: Activity, color: 'blue', href: '/services/massage', key: 'backPain' },
    'stress-anxiety': {
      icon: Brain,
      color: 'purple',
      href: '/services/kinesiology',
      key: 'stress',
    },
    'digestive-problems': {
      icon: Heart,
      color: 'green',
      href: '/services/nutrition',
      key: 'digestive',
    },
    migraines: { icon: Brain, color: 'red', href: '/services/massage', key: 'migraines' },
    'low-energy': { icon: Zap, color: 'orange', href: '/services/kinesiology', key: 'lowEnergy' },
    'hormonal-problems': {
      icon: Shield,
      color: 'pink',
      href: '/services/kinesiology',
      key: 'hormonal',
    },
    'sleep-difficulties': {
      icon: Moon,
      color: 'indigo',
      href: '/services/kinesiology',
      key: 'sleep',
    },
    'injury-recovery': {
      icon: Stethoscope,
      color: 'red',
      href: '/services/massage',
      key: 'recovery',
    },
  };

  const config = id ? problemsConfig[id] : undefined;

  if (!config) {
    return (
      <PageLayout>
        <div className="py-20 text-center">
          <h1 className="mb-4 text-2xl font-bold">{t('common.notFound') || 'Case not found'}</h1>
          <Link href="/cases">
            <Button variant="outline" className="btn btn-outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back') || 'Back'}
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const Icon = config.icon;
  const colors = {
    blue: { bg: 'bg-info', text: 'text-info-foreground', border: 'border-info' },
    purple: { bg: 'bg-accent', text: 'text-accent-foreground', border: 'border-accent' },
    green: { bg: 'bg-success', text: 'text-success-foreground', border: 'border-success' },
    orange: { bg: 'bg-marketing-accent-light/50', text: 'text-marketing-accent-dark', border: 'border-marketing-accent-light' },
    indigo: { bg: 'bg-accent/10', text: 'text-accent-foreground', border: 'border-accent/30' },
    pink: { bg: 'bg-accent/10', text: 'text-accent-foreground', border: 'border-accent/30' },
    red: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30' },
  };
  const colorClass = colors[config.color as keyof typeof colors] || colors.blue;

  // Data
  const symptoms = getArray(`casos.problems.${config.key}.symptom`);
  const causes = getArray(`casos.problems.${config.key}.cause`);
  const treatment = t(`casos.problems.${config.key}.treatment`);
  const results = t(`casos.problems.${config.key}.results`);

  const Hero = (
    <div className="relative overflow-hidden border-b border-border/50 pt-32 pb-20">
      {/* Grid handled by PageLayout */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <Link
          href="/cases"
          className="mb-8 inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:text-primary hover:shadow"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('casos.title')}
        </Link>

        <div
          className={`mx-auto h-20 w-20 rounded-[20px] ${colorClass.bg} mb-6 flex items-center justify-center shadow-inner`}
        >
          <Icon className={`h-10 w-10 ${colorClass.text}`} />
        </div>

        <h1 className="mb-6 text-4xl font-light tracking-tight text-foreground md:text-5xl">
          {t(`casos.problems.${config.key}.title`)}
        </h1>

        <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light text-muted-foreground">
          {t(`casos.problems.${config.key}.description`)}
        </p>
      </div>
    </div>
  );

  return (
    <PageLayout hero={Hero}>
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Symptoms */}
          <div className="relative">
            <div className="absolute top-0 bottom-0 -left-4 w-1 rounded-full bg-linear-to-b from-destructive/30 to-transparent opacity-50" />
            <h2 className="mb-6 flex items-center text-2xl font-light text-foreground">
              <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-sm font-bold text-destructive">
                1
              </span>
              {t('casos.symptoms')}
            </h2>
            <ul className="space-y-4">
              {symptoms.map((item, idx) => (
                <li key={idx} className="flex items-start rounded-xl bg-muted p-4">
                  <span className="mt-2 mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Causes */}
          <div className="relative">
            <div className="absolute top-0 bottom-0 -left-4 w-1 rounded-full bg-linear-to-b from-warning/30 to-transparent opacity-50" />
            <h2 className="mb-6 flex items-center text-2xl font-light text-foreground">
              <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-warning text-sm font-bold text-warning">
                2
              </span>
              {t('casos.causes')}
            </h2>
            <ul className="space-y-4">
              {causes.map((item, idx) => (
                <li key={idx} className="flex items-start rounded-xl bg-muted p-4">
                  <span className="mt-2 mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Treatment & Results */}
        <div className="rounded-apple-xl relative overflow-hidden bg-background p-8 text-white shadow-2xl md:p-12">
          <div
            className={`absolute top-0 right-0 h-96 w-96 ${colorClass.bg.replace('bg-', 'bg-')} translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl`}
          />

          <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 flex items-center text-2xl font-light text-white">
                <Activity className="mr-3 h-6 w-6 text-info" />
                {t('casos.treatment')}
              </h2>
              <p className="text-lg leading-relaxed font-light text-muted-foreground/40">{treatment}</p>
            </div>

            <div>
              <h2 className="mb-6 flex items-center text-2xl font-light text-white">
                <CheckCircle className="mr-3 h-6 w-6 text-success" />
                {t('casos.results')}
              </h2>
              <p className="text-lg leading-relaxed font-light text-muted-foreground/40">{results}</p>
            </div>
          </div>

          <div className="mt-12 border-t border-border/10 pt-8 text-center">
            <Link href={config.href}>
              <Button
                size="lg"
                className="btn btn-primary bg-accent text-eka-dark hover:bg-accent/90"
              >
                {t('common.bookNow')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
