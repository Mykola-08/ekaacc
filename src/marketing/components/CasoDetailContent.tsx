'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, Activity, Brain, Heart, Zap, Moon, Shield, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import PageLayout from '@/marketing/components/PageLayout';

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
    'stress-anxiety': { icon: Brain, color: 'purple', href: '/services/kinesiology', key: 'stress' },
    'digestive-problems': { icon: Heart, color: 'green', href: '/services/nutrition', key: 'digestive' },
    'migraines': { icon: Brain, color: 'red', href: '/services/massage', key: 'migraines' },
    'low-energy': { icon: Zap, color: 'orange', href: '/services/kinesiology', key: 'lowEnergy' },
    'hormonal-problems': { icon: Shield, color: 'pink', href: '/services/kinesiology', key: 'hormonal' },
    'sleep-difficulties': { icon: Moon, color: 'indigo', href: '/services/kinesiology', key: 'sleep' },
    'injury-recovery': { icon: Stethoscope, color: 'red', href: '/services/massage', key: 'recovery' }
  };

  const config = id ? problemsConfig[id] : undefined;

  if (!config) {
    return (
      <PageLayout>
          <div className="py-32 text-center bg-[#f5f5f7] min-h-screen flex flex-col items-center justify-center">
              <h1 className="text-3xl font-semibold mb-6">{t('common.notFound') || 'Case not found'}</h1>
              <Link href="/cases">
                  <Button variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t('common.back') || 'Back'}
                  </Button>
              </Link>
          </div>
      </PageLayout>
    );
  }

  const Icon = config.icon;

  // Clean color mapping for minimal accents
  const accentColorClass = {
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    green: 'text-green-600 bg-green-50',
    orange: 'text-orange-600 bg-orange-50',
    indigo: 'text-indigo-600 bg-indigo-50',
    pink: 'text-pink-600 bg-pink-50',
    red: 'text-red-600 bg-red-50'
  }[config.color] || 'text-blue-600 bg-blue-50';

  // Data
  const symptoms = getArray(`casos.problems.${config.key}.symptom`);
  const causes = getArray(`casos.problems.${config.key}.cause`);
  const treatment = t(`casos.problems.${config.key}.treatment`);
  const results = t(`casos.problems.${config.key}.results`);

  const Hero = (
     <div className="relative pt-32 pb-24 bg-[#f5f5f7] border-b border-gray-200">
        <div className="section-container text-center max-w-4xl mx-auto">
          
          <Link href="/cases" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('casos.title')}
          </Link>

          <div className={`w-24 h-24 mx-auto rounded-[24px] ${accentColorClass} flex items-center justify-center mb-8 `}>
            <Icon className="w-12 h-12" />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 tracking-tight leading-tight">
            {t(`casos.problems.${config.key}.title`)}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-normal max-w-2xl mx-auto text-balance">
            {t(`casos.problems.${config.key}.description`)}
          </p>
        </div>
      </div>
  );

  return (
    <PageLayout hero={Hero}>
      <div className="bg-white py-24">
        <div className="section-container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">

            {/* Symptoms */}
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold">1</span>
                {t('casos.symptoms')}
              </h2>
              <ul className="space-y-4">
                {symptoms.map((item, idx) => (
                  <li key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-100/50">
                    <p className="text-gray-700 text-lg leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Causes */}
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-900 text-sm font-bold">2</span>
                {t('casos.causes')}
              </h2>
              <ul className="space-y-4">
                {causes.map((item, idx) => (
                  <li key={idx} className="p-6 rounded-2xl bg-white border border-gray-100 ">
                    <p className="text-gray-600 text-lg leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Treatment & Results - Highlight Section */}
          <div className="bg-black rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden">
              {/* Subtle mesh gradient background */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                  <div>
                      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                          <Activity className="w-6 h-6 text-blue-400" />
                          {t('casos.treatment')}
                      </h2>
                      <p className="text-gray-300 leading-relaxed text-xl font-light">
                          {treatment}
                      </p>
                  </div>

                  <div>
                      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                          {t('casos.results')}
                      </h2>
                      <p className="text-gray-300 leading-relaxed text-xl font-light">
                          {results}
                      </p>
                  </div>
              </div>

              <div className="mt-16 text-center pt-8 border-t border-white/10">
                  <Link href={config.href}>
                      <Button
                          size="xl"
                          variant="white"
                          className="px-10 py-6 h-auto text-xl rounded-full font-medium"
                      >
                          {t('common.bookNow')}
                          <ArrowRight className="w-6 h-6 ml-2" />
                      </Button>
                  </Link>
              </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
