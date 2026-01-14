'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Brain, Heart, Zap, Moon } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import AnimateIn from './AnimateIn';

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
   href: '/cases/back-pain'
  },
  {
   id: 'stress-anxiety',
   titleKey: 'casos.problems.stress.title',
   descriptionKey: 'casos.problems.stress.description',
   icon: Brain,
   color: 'purple',
   href: '/cases/stress-anxiety'
  },
  {
   id: 'digestive-problems',
   titleKey: 'casos.problems.digestive.title',
   descriptionKey: 'casos.problems.digestive.description',
   icon: Heart,
   color: 'green',
   href: '/cases/digestive-problems'
  },
  {
   id: 'migraines',
   titleKey: 'casos.problems.migraines.title',
   descriptionKey: 'casos.problems.migraines.description',
   icon: Brain,
   color: 'red',
   href: '/cases/migraines'
  },
  {
   id: 'low-energy',
   titleKey: 'casos.problems.lowEnergy.title',
   descriptionKey: 'casos.problems.lowEnergy.description',
   icon: Zap,
   color: 'orange',
   href: '/cases/low-energy'
  },
  {
   id: 'sleep-difficulties',
   titleKey: 'casos.problems.sleep.title',
   descriptionKey: 'casos.problems.sleep.description',
   icon: Moon,
   color: 'indigo',
   href: '/cases/sleep-difficulties'
  }
 ];

 const getColorClasses = (color: string) => {
  const colors = {
   blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
   purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
   green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
   orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
   indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
   pink: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100',
   red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
  };
  return colors[color as keyof typeof colors] || colors.blue;
 };

 return (
  <section className="py-16 sm:py-24 bg-muted/30">
   <div className="max-w-7xl mx-auto px-4 sm:px-8">
    <div className="text-center mb-16">
     <div className="inline-flex items-center px-6 py-2 bg-blue-50 border border-blue-100 rounded-full mb-8">
      <span className="text-blue-700 font-medium text-sm uppercase tracking-wide">{t('casos.section.badge')}</span>
     </div>

     <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-6">
      {t('casos.section.title')}{' '}
      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
       {t('casos.section.titleHighlight')}
      </span>
     </h2>

     <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
      {t('casos.section.subtitle')}
     </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
     {featuredProblems.map((problem, index) => {
      const ProblemIcon = problem.icon;
      return (
       <AnimateIn key={problem.id} delay={index * 0.1}>
       <Link
        href={problem.href}
        className="group bg-card rounded-[24px] p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 block"
       >
        <div className={`w-14 h-14 rounded-xl ${getColorClasses(problem.color)} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border`}>
         <ProblemIcon className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-blue-600 transition-colors">
         {t(problem.titleKey)}
        </h3>

        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
         {t(problem.descriptionKey)}
        </p>

        <div className="flex items-center text-blue-600 font-medium">
         {t('casos.section.readMore')}
         <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
       </Link>
       </AnimateIn>
      );
     })}
    </div>

    {/* Other Cases List */}
    <div className="max-w-4xl mx-auto mb-16 text-center">
     <h3 className="text-2xl font-light text-foreground mb-8">{t('casos.other.title')}</h3>
     <div className="flex flex-wrap justify-center gap-4">
      {[
       'casos.other.money',
       'casos.other.relationships',
       'casos.other.selfworth',
       'casos.other.family',
       'casos.other.work',
       'casos.other.trauma'
      ].map((key) => (
       <span key={key} className="px-6 py-3 bg-card border border-gray-200 rounded-full text-muted-foreground shadow-sm hover:shadow-md hover:border-blue-200 hover:text-blue-600 transition-all duration-200 cursor-default">
        {t(key)}
       </span>
      ))}
     </div>
    </div>

    {/* View All Cases */}
    <div className="text-center">
     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link
       href="/cases"
       className="inline-flex items-center bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-semibold px-8 py-4 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
      >
       {t('casos.section.viewAll')}
       <ArrowRight className="w-5 h-5 ml-2" />
      </Link>
      <Link
       href="/first-time"
       className="inline-flex items-center bg-muted hover:bg-gray-200 text-foreground/90 font-semibold px-6 py-3 rounded-full transition-all duration-200"
      >
       {t('casos.section.findYourCase')}
      </Link>
     </div>
    </div>
   </div>
  </section>
 );
}
