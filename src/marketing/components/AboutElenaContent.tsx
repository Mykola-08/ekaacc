'use client';

import Link from 'next/link';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/marketing/components/ui/button';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Heart, Star } from 'lucide-react';
import CTASection from '@/marketing/components/CTASection';
import PageLayout from '@/marketing/components/PageLayout';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';

export default function AboutElenaContent() {
  const { t } = useLanguage();

  const techniques = [
    { id: 'movement-lesson', name: t('technique.movement_lesson.title') },
    { id: 'jka', name: t('technique.jka.title') },
    { id: 'tmr', name: t('technique.tmr.title') },
    { id: 'kgh', name: t('technique.kgh.title') },
    { id: 'ke', name: t('technique.ke.title') },
    { id: 'kb', name: t('technique.kb.title') },
    { id: 'osteobalance', name: t('technique.osteobalance.title') },
    { id: 'sujok', name: t('technique.sujok.title') },
    { id: 'quiromasaje', name: t('technique.quiromasaje.title') },
  ];

  // Custom Hero for Elena's page matched to Apple style
  const CustomHero = (
    <section className="relative pt-32 pb-24 overflow-hidden bg-white">
      <div className="section-container relative z-10 text-center">
        {/* Profile Image with Glow */}
        <motion.div
          className="relative max-w-xs mx-auto mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative group w-64 h-64 sm:w-80 sm:h-80 mx-auto">
            {/* Subtle glow behind */}
            <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-3xl opacity-60 scale-110" />
            <div className="relative rounded-full overflow-hidden w-full h-full border border-gray-100 ">
              <Image
                src="/images/therapist_photo.jpg"
                alt={t('home.elenaAlt')}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 256px, 320px"
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Name and Title */}
        <motion.div
          className="space-y-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-gray-900 tracking-tight leading-tight">
            {t('elena.greeting')}
          </h1>

          <div className="space-y-4">
            <p className="text-2xl sm:text-3xl text-gray-700 font-normal tracking-wide">
              {t('elena.name')}
            </p>
            <p className="text-xl sm:text-2xl text-gray-500 font-light tracking-wide">
              {t('elena.role')}
            </p>
            <p className="text-lg sm:text-xl text-gray-600 font-normal max-w-2xl mx-auto leading-relaxed">
              {t('elena.bio')}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
             <Link href="/booking">
                <Button 
                  size="xl" 
                  variant="default"
                  className="px-10 py-4"
                >
                  {t('common.bookNow')}
                </Button>
             </Link>
             <Link href="/booking">
                <Button 
                  size="xl" 
                  variant="outline"
                  className="px-10 py-4"
                >
                  {t('nav.contact')}
                </Button>
             </Link>
          </div>

          {/* Quote */}
          <div className="max-w-3xl mx-auto mt-16">
            <blockquote className="text-xl sm:text-2xl text-gray-800 italic font-light leading-relaxed relative">
              <span className="relative z-10">"{t('elena.quote')}"</span>
            </blockquote>
          </div>
        </motion.div>

        {/* Stats/Badges Row */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="flex flex-wrap justify-center gap-4"
        >
            <div className="inline-flex items-center px-6 py-3 bg-secondary rounded-full border border-gray-200/50">
               <Star className="w-4 h-4 text-yellow-500 mr-2" />
               <span className="text-gray-700 font-medium">15+ {t('hero.stats.experience')}</span>
            </div>
            <div className="inline-flex items-center px-6 py-3 bg-secondary rounded-full border border-gray-200/50">
               <Heart className="w-4 h-4 text-red-500 mr-2" />
               <span className="text-gray-700 font-medium">96% {t('hero.stats.clients')}</span>
            </div>
        </motion.div>
      </div>
    </section>
  );

  return (
    <>
      <SEOUpdater 
        titleKey="elena.seo.title"
        descriptionKey="elena.seo.desc"
        keywordsKey="elena.seo.keywords"
      />
      
      <PageLayout hero={CustomHero} className="bg-secondary">
        {/* Techniques Section */}
        <section className="py-24 bg-white rounded-t-[3rem]">
          <div className="section-container relative z-10 text-center">
            <div className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
                {t('elena.approach.title')}
              </h2>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto font-normal leading-relaxed">
                {t('elena.approach.desc')}
              </p>
            </div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="flex flex-wrap justify-center gap-4"
            >
              {techniques.map((tech) => (
                <motion.div 
                  key={tech.id} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="px-8 py-4 bg-secondary text-gray-700 rounded-2xl font-medium cursor-default border border-transparent hover:border-gray-200 transition-colors"
                >
                  {tech.name}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Target Audience Bento */}
        <section className="py-24 bg-[#fbfbfd]">
          <div className="section-container relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
                 {t('elena.work.title')}
               </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
               <div className="md:col-span-2 lg:col-span-1">
                 <ServiceBentoItem 
                   title={t('elena.target.adults.title')}
                   description={t('elena.target.adults.desc')}
                   details={<p>{t('elena.target.adults.desc')}</p>}
                   image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2070"
                   delay={0}
                 />
               </div>
               <div className="col-span-1 md:col-span-1">
                 <ServiceBentoItem 
                   title={t('elena.target.children.title')}
                   description={t('elena.target.children.desc')}
                   details={<p>{t('elena.target.children.desc')}</p>}
                   image="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=2070"
                   delay={0.1}
                 />
               </div>
               <div className="col-span-1 md:col-span-2 lg:col-span-1">
                 <ServiceBentoItem 
                   title={t('elena.target.families.title')}
                   description={t('elena.target.families.desc')}
                   details={<p>{t('elena.target.families.desc')}</p>}
                   image="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=2070"
                   delay={0.2}
                 />
               </div>
            </div>
          </div>
        </section>


        <CTASection />
      </PageLayout>
    </>
  );
}
