'use client';

import SEOHead from '@/react-app/components/SEOHead';
import { Clock, Heart, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { useBooking } from '@/react-app/hooks/useBooking';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Button } from 'keep-react';
import LazyImage from '@/react-app/components/LazyImage';
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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <SEOHead
        title={`${title} - Eka Balance`}
        description={description}
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-orange-100 text-sm text-orange-600 mb-8 shadow-sm">
              <Heart className="w-4 h-4" />
              <span className="font-medium">{getText(meta.heroBadge) || 'Integral Wellbeing'}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-orange-800 to-gray-900 mb-6 tracking-tight leading-tight">
              {title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg font-light">
              {description}
            </p>

            {/* Pricing / Variants Options */}
            {variants.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-3">
                    {variants.map((v) => (
                        <div key={v.duration_min} className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm text-sm">
                            <span className="font-semibold text-gray-900">{v.duration_min} min</span>
                            <span className="text-gray-400 mx-2">|</span>
                            <span className="text-orange-600 font-medium">{(v.price_amount / 100).toFixed(0)}€</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigateToBooking(service.slug)}
                size="xl"
                className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] border-none rounded-2xl px-8 h-14 text-lg shadow-lg hover:scale-105 transition-all"
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
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
               <LazyImage
                  src={service.image_url}
                  alt={title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 max-w-xs">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('massage.page.availableToday') || 'Available Today'}</p>
                    <p className="text-xs text-gray-500">{t('massage.page.bookSession') || 'Book your session'}</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      {benefits.length > 0 && (
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
                <h2 className="text-3xl font-light mb-8">{t('common.benefits') || 'Benefits'}</h2>
                <div className="space-y-4">
                    {benefits.map((benefit, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="mt-1 bg-green-100 p-2 rounded-full">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-lg text-gray-700">{getText(benefit)}</p>
                        </motion.div>
                    ))}
                </div>
             </div>
             {meta.longDescription && (
                 <div className="bg-gray-50 p-8 rounded-3xl prose prose-lg prose-blue">
                     <p className="text-gray-600 font-light leading-relaxed">
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
          <section className="py-24 bg-gray-50">
              <div className="max-w-6xl mx-auto px-6">
                  <h2 className="text-3xl font-light text-center mb-12">{t('common.testimonials') || 'What clients say'}</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                      {testimonials.map((test, i) => (
                          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                               <div className="flex gap-1 mb-4">
                                   {[...Array(test.rating)].map((_, r) => (
                                       <Star key={r} className="w-4 h-4 text-[#FFB405] fill-current" />
                                   ))}
                               </div>
                               <p className="text-gray-600 italic mb-6">"{getText(test.text)}"</p>
                               <p className="font-semibold text-gray-900">{test.name}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      )}
    </div>
  );
}
