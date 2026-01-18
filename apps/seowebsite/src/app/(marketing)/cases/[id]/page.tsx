'use client';
 
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, Heart, Brain, Zap, Moon, Activity, Stethoscope, Shield } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Button } from '@ekaacc/shared-ui';

interface ProblemConfig {
 icon: React.ComponentType<any>;
 color: string;
 href: string;
 key: string;
}

export default function CasoDetailPage() {
 const params = useParams();
 const id = typeof params?.id === 'string' ? params.id : '';

 const { language, t } = useLanguage();

 // Helper to get array from translations (handling 1-based index keys like .symptom1, .symptom2)
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
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">{t('common.notFound') || 'Case not found'}</h1>
      <Link href="/cases">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back') || 'Back'}
        </Button>
      </Link>
    </div>
  );
 }

 const Icon = config.icon;
 const colors = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
 };
 const colorClass = colors[config.color as keyof typeof colors] || colors.blue;

 // Data
 const symptoms = getArray(`casos.problems.${config.key}.symptom`);
 const causes = getArray(`casos.problems.${config.key}.cause`);
 const treatment = t(`casos.problems.${config.key}.treatment`);
 const results = t(`casos.problems.${config.key}.results`);

 return (
  <div className="min-h-screen bg-card">
   
   {/* Hero Section */}
   <div className="relative pt-32 pb-20 overflow-hidden bg-linear-to-b from-gray-50 to-white border-b border-gray-100/50">
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-40" />
    <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
     
     <Link href="/cases" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 mb-8 transition-colors bg-card px-4 py-2 rounded-full shadow-sm hover:shadow border border-gray-100">
      <ArrowLeft className="w-4 h-4 mr-2" />
      {t('casos.title')}
     </Link>

     <div className={`w-20 h-20 mx-auto rounded-4xl ${colorClass.bg} flex items-center justify-center mb-6 shadow-inner`}>
      <Icon className={`w-10 h-10 ${colorClass.text}`} />
     </div>

     <h1 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
      {t(`casos.problems.${config.key}.title`)}
     </h1>
     
     <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
      {t(`casos.problems.${config.key}.description`)}
     </p>
    </div>
   </div>

   <div className="max-w-4xl mx-auto px-6 py-20">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
     
     {/* Symptoms */}
     <div className="relative">
      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-linear-to-b from-red-200 to-transparent rounded-full opacity-50" />
      <h2 className="text-2xl font-light text-foreground mb-6 flex items-center">
       <span className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center mr-3 text-sm font-bold">1</span>
       {t('casos.symptoms')}
      </h2>
      <ul className="space-y-4">
       {symptoms.map((item, idx) => (
        <li key={idx} className="flex items-start bg-muted/30 p-4 rounded-xl">
         <span className="w-1.5 h-1.5 mt-2 rounded-full bg-red-400 mr-3 shrink-0" />
         <span className="text-foreground/90">{item}</span>
        </li>
       ))}
      </ul>
     </div>

     {/* Causes */}
     <div className="relative">
      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-linear-to-b from-orange-200 to-transparent rounded-full opacity-50" />
      <h2 className="text-2xl font-light text-foreground mb-6 flex items-center">
        <span className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mr-3 text-sm font-bold">2</span>
       {t('casos.causes')}
      </h2>
      <ul className="space-y-4">
       {causes.map((item, idx) => (
        <li key={idx} className="flex items-start bg-muted/30 p-4 rounded-xl">
         <span className="w-1.5 h-1.5 mt-2 rounded-full bg-orange-400 mr-3 shrink-0" />
         <span className="text-foreground/90">{item}</span>
        </li>
       ))}
      </ul>
     </div>
    </div>

    {/* Treatment & Results */}
    <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
      <div className={`absolute top-0 right-0 w-96 h-96 ${colorClass.bg.replace('bg-', 'bg-')} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        <div>
          <h2 className="text-2xl font-light text-white mb-6 flex items-center">
            <Activity className="w-6 h-6 text-blue-400 mr-3" />
            {t('casos.treatment')}
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg font-light">
            {treatment}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-light text-white mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
            {t('casos.results')}
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg font-light">
            {results}
          </p>
        </div>
      </div>

      <div className="mt-12 text-center pt-8 border-t border-white/10">
        <Link href={config.href}>
          <Button 
            size="lg"
            className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-bold px-8 py-4 rounded-2xl border-none hover:scale-105 transition-transform shadow-lg"
          >
            {t('common.bookNow')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
   </div>
  </div>
 );
}
