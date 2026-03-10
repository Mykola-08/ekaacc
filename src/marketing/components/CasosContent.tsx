'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Brain, Heart, Moon, Shield, Stethoscope, Zap, Search } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import PageLayout from '@/marketing/components/PageLayout';
import SEOUpdater from '@/marketing/components/SEOUpdater';

import ParallaxBackground from '@/marketing/components/ParallaxBackground';

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
      href: '/services/massage'
    },
    {
      id: 'stress-anxiety',
      title: t('casos.problems.stress.title'),
      category: 'emocional',
      description: t('casos.problems.stress.description'),
      icon: Brain,
      color: 'purple',
      href: '/services/kinesiology'
    },
    {
      id: 'digestive-problems',
      title: t('casos.problems.digestive.title'),
      category: 'fisic',
      description: t('casos.problems.digestive.description'),
      icon: Heart,
      color: 'green',
      href: '/services/nutrition'
    },
    {
      id: 'migraines',
      title: t('casos.problems.migraines.title'),
      category: 'fisic',
      description: t('casos.problems.migraines.description'),
      icon: Brain,
      color: 'red',
      href: '/services/massage'
    },
    {
      id: 'low-energy',
      title: t('casos.problems.lowEnergy.title'),
      category: 'energia',
      description: t('casos.problems.lowEnergy.description'),
      icon: Zap,
      color: 'orange',
      href: '/services/kinesiology'
    },
    {
      id: 'hormonal-problems',
      title: t('casos.problems.hormonal.title'),
      category: 'hormonal',
      description: t('casos.problems.hormonal.description'),
      icon: Shield,
      color: 'pink',
      href: '/services/kinesiology'
    },
    {
      id: 'sleep-difficulties',
      title: t('casos.problems.sleep.title'),
      category: 'son',
      description: t('casos.problems.sleep.description'),
      icon: Moon,
      color: 'indigo',
      href: '/services/kinesiology'
    },
    {
      id: 'injury-recovery',
      title: t('casos.problems.recovery.title'),
      category: 'recuperacio',
      description: t('casos.problems.recovery.description'),
      icon: Stethoscope,
      color: 'red',
      href: '/services/massage'
    }
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
          badge: t('casos.hero.badge') || "Solutions",
          icon: <Search className="w-4 h-4" />
        }}
        className="bg-secondary"
      >
      {/* Main Problems Grid */}
      <div className="py-16 sm:py-24">
        <div className="section-container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4 tracking-tight">{t('casos.frequentCases')}</h2>
            <p className="text-xl text-gray-500 font-normal">{t('casos.frequentCasesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainProblems.map((problem) => {
              const Icon = problem.icon;

              return (
                <Link
                  key={problem.id}
                  href={`/cases/${problem.id}`}
                  className="group relative bg-white rounded-[32px] p-8 flex flex-col h-full border border-gray-100/50   transition duration-300 active:scale-[0.97]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 text-gray-900">
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {problem.title}
                  </h3>
                  
                  <p className="text-gray-500 text-base leading-relaxed mb-6 line-clamp-3">
                    {problem.description}
                  </p>
                  
                  <div className="mt-auto flex items-center text-sm font-medium text-blue-600">
                    <span>{t('casos.seeDetails')}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Problems List - Modernized */}
      <div className="bg-white py-24 border-t border-gray-100">
        <div className="section-container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">{t('casos.otherCases')}</h2>
            <p className="text-xl text-gray-500 font-normal">{t('casos.otherCasesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalProblemsKeys.map((key) => (
              <div 
                key={key} 
                className="flex items-center p-4 rounded-2xl bg-secondary hover:bg-gray-100 transition-colors duration-200 cursor-default"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-4" />
                <span className="text-gray-700 font-medium">
                  {t(key)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parallax CTA - Apple Style with Background Image */}
      <ParallaxBackground
        src="https://images.pexels.com/photos/4099305/pexels-photo-4099305.jpeg?auto=compress&cs=tinysrgb&w=1920"
        className="py-32 px-6 text-center"
        overlayOpacity={0.6}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight">
            {t('casos.ctaTitle')}
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            {t('casos.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/booking">
                <Button 
                  size="xl" 
                  variant="default"
                  className="bg-white text-black hover:bg-gray-100 border-none px-8 py-4 h-auto text-lg rounded-full"
                >
                  {t('casos.bookSession')}
                </Button>
             </Link>
             <Link href="/services">
                <Button 
                  size="xl" 
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white px-8 py-4 h-auto text-lg rounded-full"
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
