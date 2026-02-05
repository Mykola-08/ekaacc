'use client';

import SEOHead from '@/react-app/components/SEOHead';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, LazyImage } from '@ekaacc/shared-ui';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { BOOKING_APP_URL } from '@/lib/config';


export default function OfficeWorkers() {
 const { t } = useLanguage();

 return (
  <>
   <SEOHead
    title={t('office.seo.title')}
    description={t('office.seo.desc')}
    keywords={t('office.seo.keywords')}
   />
   
   {/* Hero Section */}
   <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50">
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="order-2 lg:order-1">
       <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
        <span className="text-blue-700 font-medium text-sm">{t('nav.personalizedServices')}</span>
       </div>

       <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight">
        {t('nav.officeWorkers')}
       </h1>

       <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
        {t('personalizedServices.officeWorkers.desc')}
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
         src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
         alt={t('nav.officeWorkers')}
         className="w-full h-100 sm:h-125 object-cover rounded-3xl shadow-2xl"
        />
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Problems & Benefits */}
   <section className="apple-section bg-card">
    <div className="apple-container">
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Problems */}
      <div>
       <h2 className="apple-headline mb-8 text-red-600">
        {t('athletes.challenges.title')}
       </h2>
       <div className="space-y-6">
        <div className="flex items-start">
         <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 shrink-0"></div>
         <div>
          <h3 className="font-semibold text-foreground mb-2">{t('office.problems.pain.title')}</h3>
          <p className="text-muted-foreground">{t('office.problems.pain.desc')}</p>
         </div>
        </div>
        <div className="flex items-start">
         <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 shrink-0"></div>
         <div>
          <h3 className="font-semibold text-foreground mb-2">{t('office.problems.stress.title')}</h3>
          <p className="text-muted-foreground">{t('office.problems.stress.desc')}</p>
         </div>
        </div>
        <div className="flex items-start">
         <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 shrink-0"></div>
         <div>
          <h3 className="font-semibold text-foreground mb-2">{t('office.problems.sedentary.title')}</h3>
          <p className="text-muted-foreground">{t('office.problems.sedentary.desc')}</p>
         </div>
        </div>
       </div>
      </div>

      {/* Benefits */}
      <div>
       <h2 className="apple-headline mb-8 text-green-600">
        {t('athletes.help.title')}
       </h2>
       <div className="space-y-6">
        <div className="flex items-start">
         <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 shrink-0"></div>
         <div>
          <h3 className="font-semibold text-foreground mb-2">{t('office.benefits.techniques.title')}</h3>
          <p className="text-muted-foreground">{t('office.benefits.techniques.desc')}</p>
         </div>
        </div>
        <div className="flex items-start">
         <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 shrink-0"></div>
         <div>
          <h3 className="font-semibold text-foreground mb-2">{t('office.benefits.exercises.title')}</h3>
          <p className="text-muted-foreground">{t('office.benefits.exercises.desc')}</p>
         </div>
        </div>
        <div className="flex items-start">
         <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 shrink-0"></div>
         <div>
          <h3 className="font-semibold text-foreground mb-2">{t('office.benefits.mindfulness.title')}</h3>
          <p className="text-muted-foreground">{t('office.benefits.mindfulness.desc')}</p>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Results */}
   <section className="apple-section bg-blue-50">
    <div className="apple-container text-center">
     <div className="squircle-card bg-card p-12 max-w-4xl mx-auto">
      <h2 className="apple-headline mb-6 text-blue-600">
       {t('athletes.result.title')}
      </h2>
      <p className="apple-subtitle mb-8">
       {t('personalizedServices.officeWorkers.result')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
       <div className="text-center">
        <div className="text-3xl font-light text-blue-600 mb-2">85%</div>
        <div className="text-muted-foreground">{t('office.stats.pain')}</div>
       </div>
       <div className="text-center">
        <div className="text-3xl font-light text-blue-600 mb-2">92%</div>
        <div className="text-muted-foreground">{t('office.stats.posture')}</div>
       </div>
       <div className="text-center">
        <div className="text-3xl font-light text-blue-600 mb-2">78%</div>
        <div className="text-muted-foreground">{t('office.stats.stress')}</div>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Service Card */}
   <section className="apple-section bg-card">
    <div className="apple-container-sm">
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="squircle-image aspect-4/3 relative">
       <Image
        src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
        alt="Sessió de massatge terapèutic per a treballadors d'oficina"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
       />
      </div>
      
      <div>
       <h3 className="apple-title mb-6">
        {t('office.session.title')}
       </h3>
       
       <div className="space-y-4 mb-8">
        <div className="flex items-center">
         <Clock className="w-5 h-5 text-muted-foreground mr-3" />
         <span className="text-foreground/90">1 {t('common.hour')}</span>
        </div>
        <div className="flex items-center">
         <span className="text-3xl font-light text-foreground">70€</span>
        </div>
       </div>
       
       <div className="flex flex-col sm:flex-row gap-4">
        <Link 
         href={BOOKING_APP_URL}
         className="flex-1 inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium"
        >
         {t('common.reserve')}
        </Link>
        <Link href="/services" className="flex-1">
         <Button 
          variant="outline"
          className="w-full border-border text-foreground/90 hover:bg-muted/30 px-6 py-3 rounded-2xl font-medium"
         >
          {t('office.session.plans')}
         </Button>
        </Link>
       </div>
      </div>
     </div>
    </div>
   </section>
  </>
 );
}
