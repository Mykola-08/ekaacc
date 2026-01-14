'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from 'keep-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Heart, Star } from 'lucide-react';

export default function AboutElena() {
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

 return (
  <>
   <div className="bg-card min-h-screen text-foreground selection:bg-blue-100">

    {/* Hero Section - Unified Gradient */}
    <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
     <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
     
     <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10 text-center">
      {/* Profile Image with Glow */}
      <motion.div
       className="relative max-w-xs mx-auto mb-12"
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.8 }}
      >
       <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
        <img
         src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/therapist_photo.jpg"
         alt="Elena Kuchera"
         className="relative w-full h-auto rounded-full object-cover aspect-square shadow-2xl border-4 border-white"
        />
       </div>
      </motion.div>

      {/* Name and Title */}
      <motion.div
       className="space-y-6 mb-12"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.8, delay: 0.2 }}
      >
       <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-foreground tracking-tight leading-tight">
        Elena Kucherova
       </h1>

       <div className="space-y-4">
        <p className="text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium tracking-wide">
         {t('elena.greeting')}
        </p>
        <p className="text-xl sm:text-2xl text-muted-foreground font-light tracking-wide">
         {t('elena.role')}
        </p>
        <p className="text-lg sm:text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
         {t('elena.bio')}
        </p>
       </div>

       {/* Quote */}
       <div className="max-w-3xl mx-auto mt-12">
        <blockquote className="text-xl sm:text-2xl text-foreground/90 italic font-light leading-relaxed relative">
         <span className="text-6xl text-blue-100 absolute -top-8 -left-4 font-serif">"</span>
         <span className="relative z-10">{t('elena.quote')}</span>
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
        <div className="inline-flex items-center px-6 py-3 bg-card rounded-full border border-gray-100 shadow-sm">
          <Star className="w-4 h-4 text-yellow-500 mr-2" />
          <span className="text-foreground/90 font-medium">15+ {t('hero.stats.experience')}</span>
        </div>
        <div className="inline-flex items-center px-6 py-3 bg-card rounded-full border border-gray-100 shadow-sm">
          <Heart className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-foreground/90 font-medium">96% {t('hero.stats.clients')}</span>
        </div>
      </motion.div>
     </div>
    </section>

    {/* Techniques Section */}
    <section className="py-20 bg-card">
     <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
      <div className="mb-16">
       <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-6">
        {t('elena.approach.title')}
       </h2>
       <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
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
         whileHover={{ scale: 1.05 }}
         className="px-8 py-4 bg-card text-foreground/90 rounded-2xl border border-gray-100 font-medium shadow-sm hover:shadow-md hover:border-blue-200 hover:text-blue-700 transition-all cursor-default"
        >
         {tech.name}
        </motion.div>
       ))}
      </motion.div>
     </div>
    </section>

    {/* Contact CTA */}
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 text-center">
       <h2 className="text-3xl font-light text-foreground mb-8">{t('footer.readyToBegin')}</h2>
       <div className="flex flex-col sm:flex-row justify-center gap-4">
         <Link href="/booking">
          <Button 
           size="xl" 
           className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] px-10 py-4 rounded-2xl font-medium shadow-lg hover:translate-y-[-2px] transition-all border-none"
          >
           {t('common.bookNow')}
          </Button>
         </Link>
         <Link href="/contact">
          <Button 
           size="xl" 
           variant="outline"
           className="bg-card text-foreground border-gray-200 px-10 py-4 rounded-2xl font-medium hover:bg-muted"
          >
           {t('nav.contact')}
          </Button>
         </Link>
       </div>
      </div>
    </section>
   </div>
  </>
 );
}
