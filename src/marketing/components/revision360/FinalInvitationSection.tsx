'use client';

import { motion } from 'framer-motion';
import { CalendarCheck2, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import ParallaxBackground from '@/marketing/components/ParallaxBackground';

export default function FinalInvitationSection() {
  const { t } = useLanguage();

  return (
    <ParallaxBackground
      src="https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1920"
      className="py-24 sm:py-32"
      overlayOpacity={0.7}
    >
      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-6xl font-semibold text-white tracking-tight mb-6">
            {t('revision360.final.title')}
          </h2>
          <p className="text-xl sm:text-2xl text-gray-200 font-light leading-relaxed max-w-3xl mx-auto mb-10">
            {t('revision360.final.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="xl"
              variant="default"
              className="px-10 py-6 text-lg h-auto bg-white text-black hover:bg-gray-100 border-none"
            >
              <a
                href={`https://wa.me/34658867133?text=${encodeURIComponent(t('whatsapp.booking'))}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CalendarCheck2 className="w-5 h-5 mr-2" />
                {t('common.bookNow')}
              </a>
            </Button>
            
            <Button
              asChild
              size="xl"
              variant="outline"
              className="px-10 py-6 text-lg h-auto text-white border-white hover:bg-white/10"
            >
              <a
                href="https://wa.me/34658867133?text=Hola%2C%20m%27agradaria%20programar%20una%20trucada%20de%20descobriment.%20Podr%C3%ADem%20parlar%3F"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('cta.scheduleDiscoveryCall')}
              </a>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3 sm:gap-4 text-sm text-gray-300">
            <span className="rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2">{t('labels.noInsuranceNeeded')}</span>
            <span className="rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2">{t('labels.flexibleSchedules')}</span>
            <span className="rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2">{t('labels.personalizedApproach')}</span>
          </div>
        </motion.div>
      </div>
    </ParallaxBackground>
  );
}
