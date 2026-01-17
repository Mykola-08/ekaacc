
import { Link } from 'react-router';
import { ArrowRight, Heart, Brain, Zap, Moon, Activity, Stethoscope, Shield, Search } from 'lucide-react';
import SEOHead from '@/react-app/components/SEOHead';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Button } from '@ekaacc/shared-ui';

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

  const featuredProblems: Problem[] = [
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
      category: 'digestiu',
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
      category: 'energetic',
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
    <div className="min-h-screen bg-muted/30 font-sans text-foreground">
      <SEOHead
        title={t('casos.seo.title')}
        description={t('casos.seo.desc')}
        keywords={t('casos.seo.keywords')}
        url="https://ekabalance.com/cases"
      />
      
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-blue-100 text-sm text-blue-600 mb-8 shadow-sm">
            <Search className="w-4 h-4" />
            <span className="font-medium">{t('casos.hero.badge') || "What brings you here?"}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-blue-800 to-gray-900 mb-6 tracking-tight leading-tight">
            {t('casos.title')}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            {t('casos.subtitle')}
          </p>
          
          <div className="prose prose-lg mx-auto text-muted-foreground max-w-3xl">
            <p>
              {t('casos.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Problems */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('casos.frequentCases')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('casos.frequentCasesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProblems.map((problem) => {
              const ProblemIcon = problem.icon;
              const colors = getColorClasses(problem.color);
              
              return (
                <Link
                  key={problem.id}
                  to={problem.href} // Direct link to service
                  className="group relative bg-card rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                >
                  <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <ProblemIcon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-blue-600 transition-colors">
                    {problem.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed grow">
                    {problem.description}
                  </p>

                  <div className="flex items-center text-blue-600 text-sm font-bold mt-auto group/link">
                    {t('casos.seeDetails')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Problems List */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('casos.otherCases')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('casos.otherCasesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {additionalProblemsKeys.map((problemKey, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-blue-400 transition-colors" />
                <span className="text-foreground/90 font-medium">{t(problemKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('casos.ctaTitle')}
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {t('casos.ctaSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/first-time">
              <Button 
                variant="outline"
                className="bg-transparent hover:bg-card/10 text-white border-white px-8 h-14 rounded-2xl text-lg font-bold w-full sm:w-auto"
              >
                {t('casos.discoverIdeal')}
              </Button>
            </Link>
            
            <Link to="/booking">
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-none px-8 h-14 rounded-2xl text-lg font-bold w-full sm:w-auto"
              >
                {t('casos.bookSession')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

