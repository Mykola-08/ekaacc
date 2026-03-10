'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import Image from 'next/image';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-32 pb-24 bg-white min-h-[90vh] flex flex-col justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1920" 
          alt="Integral Health"
          fill
          className="object-cover opacity-30 mix-blend-multiply"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95 backdrop-blur-[2px]" />
      </div>

      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            Integral Method
          </span>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-gray-900 leading-[1.05] mb-6">
            {t('revision360.hero.title')}
          </h1>

          <p className="text-xl sm:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto font-normal">
            {t('revision360.hero.subtitle')}
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/34658867133?text=${encodeURIComponent(t('revision360.whatsapp.booking'))}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="xl" variant="default" className="px-10 py-6 text-lg h-auto">
                {t('revision360.hero.cta')}
              </Button>
            </a>
            <a href="#process">
              <Button size="xl" variant="outline" className="px-10 py-6 text-lg h-auto">
                {t('revision360.service.title')}
              </Button>
            </a>
          </div>

          <p className="mt-16 text-lg text-gray-400 italic max-w-2xl mx-auto font-light">
            "{t('revision360.hero.quote')}"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
