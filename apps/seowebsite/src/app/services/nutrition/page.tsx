'use client';

import SEOHead from '@/react-app/components/SEOHead';
import { Clock, Leaf, ArrowRight, CheckCircle2, Sprout } from 'lucide-react';
import Image from 'next/image';
import { useBooking } from '@/react-app/hooks/useBooking';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Button } from 'keep-react';

export default function NutritionPage() {
 const { navigateToBooking } = useBooking();
 const { t } = useLanguage();

 const benefits = [
  t('nutrition.benefits.habits'),
  t('services.nutrition.subtitle'),
  t('nutrition.benefits.weight'),
  t('nutrition.benefits.prevention')
 ];

 const testimonials = [
  {
   name: 'Carla Ferrer',
   text: t('nutrition.testimonial.1.text'),
   rating: 5
  },
  {
   name: 'Pere Castell',
   text: t('nutrition.testimonial.2.text'),
   rating: 5
  }
 ];

 const sessionTypes = [
  {
   name: t('nutrition.session.first.name'),
   duration: '60 min',
   description: t('nutrition.session.first.description')
  },
  {
   name: t('nutrition.session.followup.name'),
   duration: '45 min',
   description: t('nutrition.session.followup.description')
  }
 ];

 return (
  <div className="min-h-screen bg-muted/30 font-sans text-foreground">
   <SEOHead
    title={t('seo.nutrition.title')}
    description={t('seo.nutrition.description')}
    keywords={t('seo.nutrition.keywords')}
   />

   {/* Hero Section */}
   <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20 px-6 overflow-hidden">
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    
    <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
     <div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-green-100 text-sm text-green-600 mb-8 shadow-sm">
       <Leaf className="w-4 h-4" />
       <span className="font-medium">{t('nutrition.hero.badge')}</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 mb-6 tracking-tight leading-tight">
       {t('nutrition.page.title')}
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
       {t('services.nutrition.description')}
      </p>

      <div className="flex flex-wrap gap-4">
       <Button 
        onClick={() => navigateToBooking('nutrition')}
        className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] border-none rounded-2xl px-8 h-14 text-lg"
       >
        {t('common.bookNow')}
        <ArrowRight className="ml-2 w-5 h-5" />
       </Button>
      </div>
     </div>

     <div className="relative">
      <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-none border-white aspect-[4/3]">
        <Image
         src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200"
         alt="Nutrició i dietètica"
         fill
         className="object-cover transform hover:scale-105 transition-transform duration-700"
         sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {/* Floating Card */}
      <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-xl border border-gray-100 max-w-xs">
        <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <Sprout className="w-5 h-5 text-green-600" />
         </div>
         <div>
          <p className="text-sm font-medium text-foreground">{t('nutrition.page.availableToday')}</p>
          <p className="text-xs text-muted-foreground">{t('nutrition.page.bookSession')}</p>
         </div>
        </div>
      </div>
     </div>
    </div>
   </div>

   {/* Benefits Section */}
   <section className="py-24 bg-card">
    <div className="max-w-6xl mx-auto px-6">
     <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('nutrition.page.benefitsTitle')}</h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('nutrition.page.benefitsSubtitle')}</p>
     </div>

     <div className="grid md:grid-cols-2 gap-8">
      {benefits.map((benefit, index) => (
       <div key={index} className="flex gap-4 p-6 bg-green-50/50 rounded-2xl border border-green-100 hover:border-green-200 transition-colors">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
         <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <span className="text-lg text-foreground/90 font-medium pt-2">{benefit}</span>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Duration & Pricing */}
   <section className="py-24 bg-muted/30">
    <div className="max-w-7xl mx-auto px-6">
     <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('nutrition.page.durationsTitle')}</h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('nutrition.page.durationsSubtitle')}</p>
     </div>

     <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {sessionTypes.map((session, index) => (
       <div key={index} className="bg-card rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-none relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        
        <div className="flex items-center justify-center mb-6 w-16 h-16 rounded-2xl bg-green-50 mx-auto group-hover:bg-green-100 transition-colors">
         <Clock className="w-8 h-8 text-green-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
         {session.name}
        </h3>
        
        <p className="text-center font-semibold text-green-600 mb-4">{session.duration}</p>

        <p className="text-muted-foreground mb-8 text-center min-h-[3rem]">
         {session.description}
        </p>
        
        <Button
         onClick={() => navigateToBooking('nutrition')}
         className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12 border-none"
        >
         {t('common.bookNow')}
        </Button>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Testimonials */}
   <section className="py-24 bg-card overflow-hidden">
    <div className="max-w-6xl mx-auto px-6">
     <div className="text-center mb-16">
       <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('nutrition.page.testimonialsTitle')}</h2>
     </div>

     <div className="grid md:grid-cols-2 gap-8">
      {testimonials.map((testimonial, index) => (
       <div key={index} className="bg-muted/30 rounded-[32px] p-10 relative">
         <div className="absolute top-8 left-8 text-6xl text-green-200 font-serif opacity-50">"</div>
        <div className="flex gap-1 mb-6 relative z-10">
         {[...Array(testimonial.rating)].map((_, i) => (
          <Sprout key={i} className="w-5 h-5 fill-green-400 text-green-400" />
         ))}
        </div>
        <p className="text-foreground/90 text-lg mb-6 leading-relaxed italic relative z-10">
         {testimonial.text}
        </p>
        <div className="font-bold text-foreground">
         {testimonial.name}
        </div>
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
      {t('services.readyToStart')}
     </h2>
     <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
      {t('services.contactUsToBook')}
     </p>
     <Button
      onClick={() => navigateToBooking('nutrition')}
      className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] border-none px-10 h-14 rounded-2xl text-lg font-bold"
     >
      {t('common.bookNow')}
     </Button>
    </div>
   </section>
  </div>
 );
}
