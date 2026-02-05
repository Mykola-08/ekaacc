'use client';

import SEOHead from '@/components/marketing/SEOHead';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { LazyImage } from '@/components/ui';
import { BOOKING_APP_URL } from '@/lib/constants';

const musicianPlans = [
 {
  name: 'musicians.plan1.name',
  sessions: 1,
  price: 70,
  description: 'musicians.plan1.desc',
  benefits: ['musicians.plan1.benefit1', 'musicians.plan1.benefit2', 'musicians.plan1.benefit3', 'musicians.plan1.benefit4'],
  result: 'musicians.plan1.result'
 },
 {
  name: 'musicians.plan2.name',
  sessions: 3,
  price: 175,
  originalPrice: 210,
  savings: 35,
  description: 'musicians.plan2.desc',
  benefits: ['musicians.plan2.benefit1', 'musicians.plan2.benefit2', 'musicians.plan2.benefit3', 'musicians.plan2.benefit4'],
  result: 'musicians.plan2.result',
  popular: true
 },
 {
  name: 'musicians.plan3.name',
  sessions: 5,
  price: 295,
  originalPrice: 350,
  savings: 55,
  description: 'musicians.plan3.desc',
  benefits: ['musicians.plan3.benefit1', 'musicians.plan3.benefit2', 'musicians.plan3.benefit3', 'musicians.plan3.benefit4'],
  result: 'musicians.plan3.result'
 }
];

export default function Musicians() {
 const { t } = useLanguage();

 return (
  <>
   <SEOHead
    title={t('musicians.seo.title')}
    description={t('musicians.seo.desc')}
    keywords={t('musicians.seo.keywords')}
   />
   
   {/* Hero Section */}
   <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50">
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="order-2 lg:order-1">
       <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
        <span className="text-blue-700 font-medium text-sm">{t('nav.personalizedServices')}</span>
       </div>

       <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight">
        {t('nav.musicians')}
       </h1>

       <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
        {t('musicians.hero.subtitle')}
       </p>

       <div className="flex flex-col sm:flex-row gap-4">
        <Link
         href={BOOKING_APP_URL}
         className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-full transition-colors duration-200 inline-block text-center"
        >
         {t('common.reserveSession')}
        </Link>
       </div>
      </div>

      <div className="order-1 lg:order-2">
       <div className="relative">
        <LazyImage
         src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop"
         alt={t('nav.musicians')}
         className="w-full h-[400px] sm:h-[500px] object-cover rounded-2xl shadow-2xl"
        />
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Problems */}
   <section className="apple-section bg-card">
    <div className="max-w-7xl mx-auto px-4">
     <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
       {t('musicians.problems.title')}
      </h2>
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
       {t('musicians.problems.subtitle')}
      </p>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
       <div className="flex items-start">
        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 shrink-0"></div>
        <div>
         <h3 className="font-semibold text-foreground mb-2">{t('musicians.problem1.title')}</h3>
         <p className="text-muted-foreground">
          {t('musicians.problem1.desc')}
         </p>
        </div>
       </div>
       
       <div className="flex items-start">
        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 shrink-0"></div>
        <div>
         <h3 className="font-semibold text-foreground mb-2">{t('musicians.problem2.title')}</h3>
         <p className="text-muted-foreground">
          {t('musicians.problem2.desc')}
         </p>
        </div>
       </div>
      </div>

      <div className="space-y-8">
       <div className="flex items-start">
        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 shrink-0"></div>
        <div>
         <h3 className="font-semibold text-foreground mb-2">{t('musicians.problem3.title')}</h3>
         <p className="text-muted-foreground">
          {t('musicians.problem3.desc')}
         </p>
        </div>
       </div>
       
       <div className="flex items-start">
        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 shrink-0"></div>
        <div>
         <h3 className="font-semibold text-foreground mb-2">{t('musicians.problem4.title')}</h3>
         <p className="text-muted-foreground">
          {t('musicians.problem4.desc')}
         </p>
        </div>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* How We Help */}
   <section className="apple-section bg-purple-50">
    <div className="max-w-7xl mx-auto px-4 text-center">
     <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-16">
      {t('musicians.help.title')}
     </h2>
     
     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="squircle-card bg-card p-8 text-center">
       <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <div className="w-8 h-8 bg-card rounded-xl"></div>
       </div>
       <h3 className="font-semibold text-foreground mb-4">{t('musicians.help1.title')}</h3>
       <p className="text-muted-foreground">
        {t('musicians.help1.desc')}
       </p>
      </div>
      
      <div className="squircle-card bg-card p-8 text-center">
       <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <div className="w-8 h-8 bg-card rounded-xl"></div>
       </div>
       <h3 className="font-semibold text-foreground mb-4">{t('musicians.help2.title')}</h3>
       <p className="text-muted-foreground">
        {t('musicians.help2.desc')}
       </p>
      </div>
      
      <div className="squircle-card bg-card p-8 text-center">
       <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <div className="w-8 h-8 bg-card rounded-xl"></div>
       </div>
       <h3 className="font-semibold text-foreground mb-4">{t('musicians.help3.title')}</h3>
       <p className="text-muted-foreground">
        {t('musicians.help3.desc')}
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* Results */}
   <section className="apple-section bg-card">
    <div className="max-w-7xl mx-auto px-4 text-center">
     <div className="squircle-card bg-purple-50 p-12 max-w-4xl mx-auto">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-purple-600">
       {t('musicians.results.title')}
      </h2>
      <div className="space-y-6 apple-body">
       <p>
        • {t('musicians.results.point1')}
       </p>
       <p>
        • {t('musicians.results.point2')}
       </p>
       <p>
        • {t('musicians.results.point3')}
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* Pricing Plans */}
   <section className="apple-section bg-muted/30">
    <div className="max-w-7xl mx-auto px-4">
     <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
       {t('musicians.plans.title')}
      </h2>
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
       {t('musicians.plans.subtitle')}
      </p>
     </div>
     
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {musicianPlans.map((plan) => (
       <div
        key={plan.name}
        className={`squircle-card bg-card p-8 relative transition-all duration-300 ${
         plan.popular ? 'ring-2 ring-purple-400 scale-105' : ''
        }`}
       >
        {plan.popular && (
         <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
           {t('musicians.plan2.popular')}
          </div>
         </div>
        )}
        
        <div className="text-center mb-8">
         <h3 className="text-2xl font-semibold text-foreground mb-4">
          {t(plan.name)}
         </h3>
         <p className="text-muted-foreground mb-6">
          {t(plan.description)}
         </p>
         
         <div className="mb-4">
          <span className="text-4xl font-light text-foreground">
           {plan.price}€
          </span>
          {plan.originalPrice && (
           <span className="text-lg text-muted-foreground line-through ml-2">
            {plan.originalPrice}€
           </span>
          )}
         </div>
         
         {plan.savings && (
          <div className="text-green-600 font-medium mb-4">
           {t('musicians.plan2.save')} {plan.savings}€
          </div>
         )}
         
         <div className="text-sm text-muted-foreground">
          {plan.sessions} sessió{plan.sessions > 1 ? 's' : ''}
         </div>
        </div>

        <ul className="space-y-3 mb-8">
         {plan.benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
           <div className="w-2 h-2 bg-green-500 rounded-full mr-3 shrink-0 mt-2"></div>
           <span className="text-foreground/90 text-sm">{t(benefit)}</span>
          </li>
         ))}
        </ul>

        <div className="mb-6 p-4 bg-purple-50 rounded-2xl">
         <div className="font-medium text-purple-900 text-sm">
          {t('artists.result.title')}: {t(plan.result)}
         </div>
        </div>

        <Link 
         href={BOOKING_APP_URL}
         className={`w-full inline-flex items-center justify-center py-3 rounded-2xl font-medium transition-all duration-200 ${
          plan.popular
           ? 'bg-purple-600 hover:bg-purple-700 text-white'
           : 'bg-muted hover:bg-gray-200 text-foreground'
         }`}
        >
         {t('musicians.plan.cta')} {t(plan.name)}
        </Link>
       </div>
      ))}
     </div>
    </div>
   </section>
  </>
 );
}

