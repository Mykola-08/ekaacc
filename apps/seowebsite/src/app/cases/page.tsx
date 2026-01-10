'use client';

import Link from 'next/link';
import { ArrowRight, Heart, Brain, Zap, Moon, Activity, Stethoscope, Shield, Search } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Button } from 'keep-react';

interface Problem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
}

export default function Casos() {
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

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'group-hover:border-blue-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'group-hover:border-purple-200' },
      green: { bg: 'bg-green-50', text: 'text-green-700', border: 'group-hover:border-green-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'group-hover:border-orange-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'group-hover:border-indigo-200' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'group-hover:border-pink-200' },
      red: { bg: 'bg-red-50', text: 'text-red-700', border: 'group-hover:border-red-200' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 text-sm text-blue-600 mb-8 shadow-sm">
            <Search className="w-4 h-4" />
            <span className="font-medium">{t('casos.hero.badge') || "What brings you here?"}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight leading-tight">
            {t('casos.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-light">
            {t('casos.subtitle')}
          </p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t('casos.description')}
          </p>
        </div>
      </div>

      {/* Main Problems Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-gray-900 mb-4">{t('casos.frequentCases')}</h2>
          <p className="text-gray-500">{t('casos.frequentCasesSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mainProblems.map((problem) => {
            const colors = getColorClasses(problem.color);
            const Icon = problem.icon;
            
            return (
              <Link 
                key={problem.id} 
                href={`/cases/${problem.id}`}
                className="group relative bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100/50 flex flex-col h-full overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${colors.bg.replace('bg-', 'bg-gradient-to-br from-white to-')}`} />

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                    {problem.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {problem.description}
                  </p>
                  
                  <div className="mt-auto flex items-center text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    <span>{t('casos.seeDetails')}</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Additional Problems List - Modernized */}
      <div className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4">{t('casos.otherCases')}</h2>
            <p className="text-gray-500">{t('casos.otherCasesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalProblemsKeys.map((key) => (
              <div 
                key={key} 
                className="flex items-center p-4 rounded-2xl bg-gray-50 hover:bg-blue-50/50 transition-colors duration-200 group cursor-default"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400/50 mr-4 group-hover:bg-blue-500 transition-colors" />
                <span className="text-gray-700 font-medium group-hover:text-blue-800 transition-colors">
                  {t(key)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#000035] to-[#000060] py-24 px-6 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6 tracking-tight">
            {t('casos.ctaTitle')}
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            {t('casos.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/booking">
                <Button 
                  size="xl" 
                  className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-bold py-4 px-8 rounded-2xl shadow-lg border-none hover:scale-105 transition-transform"
                >
                  {t('casos.bookSession')}
                </Button>
             </Link>
             <Link href="/services">
                <Button 
                  size="xl" 
                  className="bg-transparent hover:bg-white/10 text-white border border-white/20 font-medium py-4 px-8 rounded-2xl hover:scale-105 transition-transform"
                >
                  {t('casos.discoverIdeal')}
                </Button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
