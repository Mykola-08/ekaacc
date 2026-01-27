'use client';

import SEOHead from '@/components/SEOHead';
import { Clock, Heart, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { useBooking } from '@/hooks/useBooking';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button, LazyImage } from '@ekaacc/shared-ui';
import { motion } from 'framer-motion';

interface ServiceVariant {
 name: string;
 duration_min: number;
 price_amount: number;
}

interface ServiceDetail {
 id: string;
 slug: string;
 name: string;
 description: string; // Translation key or raw text
 image_url: string;
 metadata: {
  icon?: string;
  benefits?: string[]; // Array of keys or text
  testimonials?: { name: string; text: string; rating: number }[];
  longDescription?: string;
  heroBadge?: string;
  translationKey?: string; // If using i18n
 };
 service_variant: ServiceVariant[];
}

interface ServiceDetailContentProps {
 service: ServiceDetail;
}

export default function ServiceDetailContent({ service }: ServiceDetailContentProps) {
 const { navigateToBooking } = useBooking();
 const { t } = useLanguage();
 const meta = service.metadata || {};

 // Helper to handle text that might be a key or raw text
 // If text doesn't contain spaces and looks like a key (has dots), try translating.
 // Otherwise display as is.
 const getText = (text?: string) => {
  if (!text) return '';
  return (text.includes('.') && !text.includes(' ')) ? t(text) : text;
 };

 const title = getText(meta.translationKey) || service.name;
 const description = getText(service.description);
 const benefits = meta.benefits || [];
 const testimonials = meta.testimonials || [];
 const variants = service.service_variant || [];
 
 // Sort variants by duration
 variants.sort((a, b) => a.duration_min - b.duration_min);

 return (
  <div className="min-h-screen bg-muted/30 font-sans text-foreground">
   <SEOHead
    title={`${title} - Eka Balance`}
    description={description}
   />

   {/* Hero Section */}
   <div className="relative bg-background pt-32 pb-20 px-6 overflow-hidden">
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    
    <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
     <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
     >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-sm text-primary mb-8 shadow-sm">
       <Heart className="w-4 h-4" />
       <span className="font-medium">{getText(meta.heroBadge) || 'Integral Wellbeing'}</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-semibold text-foreground mb-6 tracking-tight leading-tight">
       {title}
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg font-light">
       {description}
      </p>

      {/* Pricing / Variants Options */}
      {variants.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          {variants.map((v) => (
            <div key={v.duration_min} className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm text-sm">
              <span className="font-semibold text-foreground">{v.duration_min} min</span>
              <span className="text-muted-foreground/80 mx-2">|</span>
              <span className="text-primary font-medium">{(v.price_amount / 100).toFixed(0)}€</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
       <Button 
        onClick={() => navigateToBooking(service.slug)}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-white border-none rounded-2xl px-8 h-14 text-lg shadow-lg hover:scale-105 transition-all"
       >
        {t('common.bookNow') || 'Book Now'}
        <ArrowRight className="ml-2 w-5 h-5" />
       </Button>
      </div>
     </motion.div>

     <motion.div 
       initial={{ opacity: 0, x: 20 }}
       animate={{ opacity: 1, x: 0 }}
       transition={{ duration: 0.6, delay: 0.2 }}
       className="relative"
     >
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-none border-white aspect-4/3">
        <LazyImage
         src={service.image_url}
         alt={title}
         className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
      </div>
      {/* Floating Card */}
      <div className="absolute -bottom-6 -left-6 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 max-w-xs">
        <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
         </div>
         <div>
          <p className="text-sm font-medium text-foreground">{t('massage.page.availableToday') || 'Available Today'}</p>
          <p className="text-xs text-muted-foreground">{t('massage.page.bookSession') || 'Book your session'}</p>
         </div>
        </div>
      </div>
     </motion.div>
    </div>
   </div>

   {/* Benefits Section */}
   {benefits.length > 0 && (
   <section className="py-24 bg-background">
    <div className="max-w-6xl mx-auto px-6">
     <div className="grid md:grid-cols-2 gap-12 items-center">
       <div>
        <h2 className="text-3xl font-light mb-8 text-foreground">{t('common.benefits') || 'Benefits'}</h2>
        <div className="space-y-4">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/40 transition-colors"
            >
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-lg text-foreground/90 font-light">{getText(benefit)}</p>
            </motion.div>
          ))}
        </div>
       </div>
       {meta.longDescription && (
         <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-sm leading-relaxed">
           <p className="text-muted-foreground font-light text-lg">
             {getText(meta.longDescription)}
           </p>
         </div>
       )}
     </div>
    </div>
   </section>
   )}

   {/* Testimonials */}
   {testimonials.length > 0 && (
     <section className="py-24 bg-background">
       <div className="max-w-6xl mx-auto px-6">
         <h2 className="text-3xl font-light text-center mb-12 text-foreground">{t('common.testimonials') || 'What clients say'}</h2>
         <div className="grid md:grid-cols-2 gap-8">
           {testimonials.map((test, i) => (
             <div key={i} className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white/40 hover:shadow-md transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(test.rating)].map((_, r) => (
                    <Star key={r} className="w-4 h-4 text-primary fill-current opacity-80" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6 font-light text-lg">"{getText(test.text)}"</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                     {test.name.charAt(0)}
                   </div>
                   <p className="font-semibold text-foreground">{test.name}</p>
                </div>
             </div>
           ))}
         </div>
       </div>
     </section>
   )}
  </div>
 );
}
