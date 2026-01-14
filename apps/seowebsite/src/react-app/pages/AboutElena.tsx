import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Button } from 'keep-react';
import Image from 'next/image';
import SEOHead from '@/react-app/components/SEOHead';
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
      <SEOHead
        title={t('elena.seo.title')}
        description={t('elena.seo.desc')}
        keywords={t('elena.seo.keywords')}
        url="https://ekabalance.com/about-elena"
      />

      <div className="bg-white min-h-screen text-gray-900 selection:bg-blue-100">

        {/* Hero Section - Unified Gradient */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10 text-center">
            {/* Profile Image with Glow */}
            <motion.div
              className="relative max-w-xs mx-auto mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative group aspect-square">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <Image
                  src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/therapist_photo.jpg"
                  alt="Elena Kuchera"
                  fill
                  className="rounded-full object-cover shadow-2xl border-4 border-white"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
            </motion.div>

            {/* Name and Title */}
            <motion.div
              className="space-y-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight leading-tight">
                Elena Kucherova
              </h1>

              <div className="space-y-4">
                <p className="text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium tracking-wide">
                  {t('elena.greeting')}
                </p>
                <p className="text-xl sm:text-2xl text-gray-500 font-light tracking-wide">
                  {t('elena.role')}
                </p>
                <p className="text-lg sm:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                  {t('elena.bio')}
                </p>
              </div>

              {/* Quote */}
              <div className="max-w-3xl mx-auto mt-12">
                <blockquote className="text-xl sm:text-2xl text-gray-700 italic font-light leading-relaxed relative">
                  <span className="text-6xl text-blue-100 absolute -top-8 -left-4 font-serif">"</span>
                  <span className="relative z-10">{t('elena.quote')}</span>
                </blockquote>
              </div>
            </motion.div>

            {/* Stats/Badges Row */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4, delay: 0.4 }}
               className="flex flex-wrap justify-center gap-4"
            >
                <div className="inline-flex items-center px-6 py-3 bg-white rounded-full border border-gray-100 shadow-sm">
                   <Star className="w-4 h-4 text-yellow-500 mr-2" />
                   <span className="text-gray-700 font-medium">15+ {t('hero.stats.experience')}</span>
                </div>
                <div className="inline-flex items-center px-6 py-3 bg-white rounded-full border border-gray-100 shadow-sm">
                   <Heart className="w-4 h-4 text-red-500 mr-2" />
                   <span className="text-gray-700 font-medium">96% {t('hero.stats.clients')}</span>
                </div>
            </motion.div>
          </div>
        </section>

        {/* Techniques Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
            <div className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6">
                {t('elena.approach.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                {t('elena.approach.desc')}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {techniques.map((tech) => (
                <span 
                  key={tech.id} 
                  className="px-6 py-3 bg-gray-50 text-gray-700 rounded-2xl border border-gray-100 font-medium hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100 transition-colors cursor-default"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-gray-50">
           <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-8">{t('footer.readyToBegin')}</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link to="/booking">
                    <Button 
                      size="xl" 
                      className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] px-10 py-4 rounded-2xl font-medium shadow-lg hover:translate-y-[-2px] transition-all border-none"
                    >
                      {t('common.bookNow')}
                    </Button>
                 </Link>
                 <Link to="/contact">
                    <Button 
                      size="xl" 
                      variant="outline"
                      className="bg-white text-gray-900 border-gray-200 px-10 py-4 rounded-2xl font-medium hover:bg-gray-100"
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


