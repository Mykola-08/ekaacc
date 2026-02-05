'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Brain, Heart, Zap, Moon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
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
  // UNIFIED DESIGN: Use variations of neutral/gray/teal for a cleaner look
  // Or simple light background with primary accent hook
  return 'bg-white border-white/40 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300';
 };

 return (
  <section className="py-16 sm:py-24 bg-background">
   <div className="max-w-7xl mx-auto px-4 sm:px-8">
    <div className="text-center mb-16">
     <AnimateIn delay={0.2} from="top">
     <div className="inline-flex items-center px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/40 rounded-full mb-8 shadow-sm">
      <span className="text-primary font-medium text-sm uppercase tracking-wide">{t('casos.section.badge')}</span>
     </div>
     </AnimateIn>

     <AnimateIn delay={0.3}>
     <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 tracking-tight">
      {t('casos.section.title')}{' '}
      <span className="text-primary">
       {t('casos.section.titleHighlight')}
      </span>
     </h2>
     </AnimateIn>

     <AnimateIn delay={0.4}>
     <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
      {t('casos.section.subtitle')}
     </p>
     </AnimateIn>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
     {featuredProblems.map((problem, index) => {
      const ProblemIcon = problem.icon;
      return (
       <AnimateIn key={problem.id} delay={index * 0.1}>
       <Link
        href={problem.href}
        className="group bg-card rounded-3xl p-6 border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 block"
       >
        <div className={`w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300`}>
         <ProblemIcon className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
         {t(problem.titleKey)}
        </h3>

        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
         {t(problem.descriptionKey)}
        </p>

        <div className="flex items-center text-primary font-medium">
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
       <span key={key} className="px-6 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-muted-foreground shadow-sm hover:shadow-md hover:border-primary/50 hover:text-primary transition-all duration-200 cursor-default">
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
       className="inline-flex items-center bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
      >
       {t('casos.section.viewAll')}
       <ArrowRight className="w-5 h-5 ml-2" />
      </Link>
      <Link
       href="/first-time"
       className="inline-flex items-center bg-white/50 hover:bg-white text-foreground/90 font-semibold px-6 py-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
      >
       {t('casos.section.findYourCase')}
      </Link>
     </div>
    </div>
   </div>
  </section>
 );
}
