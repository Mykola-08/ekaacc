'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Activity, 
  Heart, 
  Brain, 
  Zap, 
  Layers, 
  Clock3, 
  RotateCcw, 
  MapPin, 
  Compass,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import PageLayout from '@/marketing/components/PageLayout';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import CTASection from '@/marketing/components/CTASection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Variant {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  idealFor: string[];
  duration: string;
  includes: string[];
  price: string;
}

export default function Revision360Content() {
  const { t } = useLanguage();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const variants: Variant[] = [
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: t('revision360.variants.reset.title'),
      subtitle: t('revision360.variants.reset.subtitle'),
      description: t('revision360.variants.reset.description'),
      idealFor: [
        t('revision360.variants.reset.idealFor.1'),
        t('revision360.variants.reset.idealFor.2'),
        t('revision360.variants.reset.idealFor.3'),
        t('revision360.variants.reset.idealFor.4'),
      ],
      duration: t('revision360.variants.reset.duration'),
      includes: [
        t('revision360.variants.reset.includes.1'),
        t('revision360.variants.reset.includes.2'),
        t('revision360.variants.reset.includes.3'),
        t('revision360.variants.reset.includes.4'),
      ],
      price: 'EUR 450',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('revision360.variants.mapping.title'),
      subtitle: t('revision360.variants.mapping.subtitle'),
      description: t('revision360.variants.mapping.description'),
      idealFor: [
        t('revision360.variants.mapping.idealFor.1'),
        t('revision360.variants.mapping.idealFor.2'),
        t('revision360.variants.mapping.idealFor.3'),
        t('revision360.variants.mapping.idealFor.4'),
      ],
      duration: t('revision360.variants.mapping.duration'),
      includes: [
        t('revision360.variants.mapping.includes.1'),
        t('revision360.variants.mapping.includes.2'),
        t('revision360.variants.mapping.includes.3'),
        t('revision360.variants.mapping.includes.4'),
      ],
      price: 'EUR 350',
    },
    {
      icon: <Compass className="w-6 h-6" />,
      title: t('revision360.variants.alignment.title'),
      subtitle: t('revision360.variants.alignment.subtitle'),
      description: t('revision360.variants.alignment.description'),
      idealFor: [
        t('revision360.variants.alignment.idealFor.1'),
        t('revision360.variants.alignment.idealFor.2'),
        t('revision360.variants.alignment.idealFor.3'),
        t('revision360.variants.alignment.idealFor.4'),
      ],
      duration: t('revision360.variants.alignment.duration'),
      includes: [
        t('revision360.variants.alignment.includes.1'),
        t('revision360.variants.alignment.includes.2'),
        t('revision360.variants.alignment.includes.3'),
        t('revision360.variants.alignment.includes.4'),
      ],
      price: 'EUR 280',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t('revision360.variants.integral.title'),
      subtitle: t('revision360.variants.integral.subtitle'),
      description: t('revision360.variants.integral.description'),
      idealFor: [
        t('revision360.variants.integral.idealFor.1'),
        t('revision360.variants.integral.idealFor.2'),
        t('revision360.variants.integral.idealFor.3'),
        t('revision360.variants.integral.idealFor.4'),
      ],
      duration: t('revision360.variants.integral.duration'),
      includes: [
        t('revision360.variants.integral.includes.1'),
        t('revision360.variants.integral.includes.2'),
        t('revision360.variants.integral.includes.3'),
        t('revision360.variants.integral.includes.4'),
      ],
      price: 'EUR 750',
    },
  ];

  const heroContent = (
    <section className="relative w-full h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
      <motion.div
         initial={{ scale: 1.05, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ duration: 1 }}
         className="absolute inset-0 z-0"
      >
        <Image
          src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Integral Health"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 pointer-events-none"></div>
      </motion.div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-white/90 mb-6 bg-black/30 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {t('revision360.seo.title') || 'Integral Method'}
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl sm:text-6xl lg:text-[5.5rem] font-semibold text-white mb-6 tracking-tighter text-balance pb-2 leading-[1.05]"
        >
          {t('revision360.hero.title')}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg sm:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed text-balance font-medium tracking-tight"
        >
          {t('revision360.hero.subtitle')}
        </motion.p>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
                href={`https://wa.me/34658867133?text=${encodeURIComponent(t('revision360.whatsapp.booking') || 'Booking')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="xl" className="px-10 py-6 text-lg h-auto bg-white text-black hover:bg-gray-100 shadow-xl transition-all hover:scale-105 border-0 rounded-full">
                  {t('revision360.hero.cta')}
                </Button>
            </a>
            <a href="#process">
              <Button size="xl" variant="outline" className="px-10 py-6 text-lg h-auto border-white/40 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all rounded-full">
                {t('revision360.service.title') || 'Process'}
              </Button>
            </a>
        </motion.div>
      </div>
    </section>
  );

  return (
    <>
      <SEOUpdater
        titleKey="revision360.seo.title"
        descriptionKey="revision360.seo.description"
        keywordsKey="revision360.seo.keywords"
      />
      
      <PageLayout
        hero={heroContent}
        className="bg-[#fbfbfd]"
        mainClassName="bg-transparent"
      >
        {/* Why 360 Section */}
        <section className="py-20" id="process">
          <div className="section-container max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
                {t('revision360.why360.title') || 'Comprehensive Analysis'}
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto font-normal leading-relaxed">
                {t('revision360.why360.subtitle') || 'A complete evaluation of physical, emotional, and structural well-being.'}
              </p>
            </div>            {/* Why 360 Content Blocks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm"
              >
                <div className="flex gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <Heart className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  {t('revision360.why360.layers.physical')} & {t('revision360.why360.layers.emotional')}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t('revision360.why360.physical.desc')} {t('revision360.why360.emotional.desc')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm"
              >
                <div className="flex gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                    <Brain className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  {t('revision360.why360.layers.structural')} & {t('revision360.why360.layers.energetic')}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t('revision360.why360.structural.desc')} {t('revision360.why360.energetic.desc')}
                </p>
              </motion.div>
            </div>            {/* Steps & Additional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="lg:col-span-2 bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm flex flex-col justify-center"
              >
                 <div className="mb-8">
                    <span className="text-blue-600 font-semibold mb-2 tracking-wider uppercase text-sm block">
                      {t('revision360.service.title') || 'Service Steps'}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                      <Clock3 className="h-8 w-8 text-gray-400" />
                      {t('revision360.service.total.duration') || '120 Minutes'}
                    </h3>
                 </div>
                 <div className="space-y-6">
                   {[1,2,3,4].map((step) => (
                      <div key={step} className="flex items-start gap-5">
                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-sm shrink-0">
                           {step}
                         </div>
                         <div>
                           <p className="text-gray-900 font-semibold text-lg">{t(`revision360.service.step${step}.title`)}</p>
                           <p className="text-gray-500 mt-1">{t(`revision360.service.step${step}.description`)}</p>
                         </div>
                      </div>
                   ))}
                 </div>
              </motion.div>

              <div className="flex flex-col gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                  className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex-1"
                >
                  <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                    <Brain className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('revision360.benefits.benefit1.title')}</h3>
                  <p className="text-gray-500">{t('revision360.benefits.benefit1.description')}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                  className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex-1"
                >
                  <div className="h-12 w-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-6">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('revision360.benefits.benefit3.title')}</h3>
                  <p className="text-gray-500">{t('revision360.benefits.benefit3.description')}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>        {/* Variants Section */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="section-container max-w-7xl mx-auto px-6">
            <div className="max-w-3xl text-center mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full border border-blue-100">
                {t('revision360.variants.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-6">
                {t('revision360.variants.title')}
              </h2>
              <p className="text-lg text-gray-500 font-normal leading-relaxed">
                {t('revision360.variants.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {variants.map((variant, index) => (
                <motion.div
                  key={variant.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group flex flex-col items-start text-left rounded-[2rem] bg-[#fbfbfd] border border-gray-200 p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300"
                >
                  <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-900 flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                    {variant.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{variant.title}</h3>
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">{variant.subtitle}</p>
                  
                  <div className="flex-1 mt-2 mb-8 text-gray-500 text-sm leading-relaxed">
                    <p className="line-clamp-3">{variant.description}</p>
                  </div>

                  <div className="w-full pt-6 border-t border-gray-200 flex items-center justify-between mb-6">
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">{variant.duration}</span>
                    <span className="text-lg font-bold text-gray-900">{variant.price}</span>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl bg-white hover:bg-gray-50"
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {t('common.viewDetails') || 'View Details'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <div className="py-12">
          <CTASection />
        </div>
      </PageLayout>      {/* Variant Details Dialog */}
      <Dialog 
        open={!!selectedVariant} 
        onOpenChange={(open) => !open && setSelectedVariant(null)}
      >
        <DialogContent className="sm:max-w-2xl bg-white p-0 overflow-hidden border-0 shadow-2xl rounded-[2rem]">
          {selectedVariant && (
            <div className="flex flex-col max-h-[85vh]">
              <DialogHeader className="px-8 pt-8 pb-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-gray-200 text-gray-900 flex items-center justify-center shadow-sm">
                    {selectedVariant.icon}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900 border-none">
                      {selectedVariant.title}
                    </DialogTitle>
                    <DialogDescription className="text-blue-600 font-semibold uppercase tracking-wider text-xs mt-1">
                      {selectedVariant.subtitle}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="overflow-y-auto px-8 py-6 space-y-8">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {selectedVariant.description}
                </p>
                
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      {t('revision360.variants.idealFor')}
                    </h4>
                    <ul className="space-y-3">
                      {selectedVariant.idealFor.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-600">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-500" />
                      {t('revision360.variants.includes')}
                    </h4>
                    <ul className="space-y-3">
                      {selectedVariant.includes.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-600">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-100 p-6 px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">{t('revision360.variants.sessionDuration')}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{selectedVariant.duration}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">{t('revision360.variants.investment')}</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{selectedVariant.price}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}