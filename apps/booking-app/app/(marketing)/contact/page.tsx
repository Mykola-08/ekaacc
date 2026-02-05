'use client';

import ContactFormOptimized from '@/components/marketing/ContactFormOptimized';
import { MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@ekaacc/shared-ui';

export default function ContactPage() {
 const { t } = useLanguage();

 return (
  <>
    {/* Unified Gradient Hero */}
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
     <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
     
     <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center relative z-10">
      <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-full mb-8 shadow-sm">
       <MessageCircle className="w-4 h-4 text-primary mr-2" />
       <span className="text-primary font-medium text-sm tracking-wide uppercase">{t('contact.hero.badge')}</span>
      </div>
      
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground mb-8 leading-tight tracking-tight">
       {t('contact.hero.title')}{' '}
       <span className="text-primary">{t('contact.hero.titleHighlight')}</span>
      </h1>
      
      <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-light">
       {t('contact.hero.description')}
      </p>

      {/* Quick contact options */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
       <a
        href="https://wa.me/34658867133"
        target="_blank"
        rel="noopener noreferrer"
       >
         <Button 
          size="lg"
          className="bg-[#25D366] hover:bg-[#128C7E] text-white font-medium px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-xl border-none"
         >
          <MessageCircle className="w-6 h-6 mr-2" />
          {t('contact.whatsapp')}
         </Button>
       </a>
       <a href="tel:+34658867133">
         <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-xl border-none"
         >
          <Phone className="w-6 h-6 mr-2" />
          {t('contact.callNow')}
         </Button>
       </a>
      </div>
     </div>
    </section>

    {/* Contact Form Section */}
    <section className="py-24 bg-background relative">
     <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <ContactFormOptimized />
      </div>
     </div>
    </section>

    {/* FAQ Section */}
    <section className="py-24 bg-background">
     <div className="max-w-4xl mx-auto px-4 sm:px-8">
      <h2 className="text-3xl font-semibold text-foreground mb-12 text-center">
       {t('contact.faq.title')}
      </h2>
      
      <div className="space-y-6">
       {[1, 2, 3, 4].map((i) => (
         <div key={i} className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="font-medium text-foreground mb-3 text-lg">{t(`contact.faq.q${i}.title`)}</h3>
          <p className="text-muted-foreground leading-relaxed font-light">
           {t(`contact.faq.q${i}.answer`)}
          </p>
         </div>
       ))}
      </div>
     </div>
    </section>
  </>
 );
}
