import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function HeroSection() {
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Ethereal Energy Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep atmospheric gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-900 opacity-90" />
        
        {/* Animated glowing orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px]"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Rotating geometric mesh overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <motion.div
            className="w-[800px] h-[800px] border border-amber-500/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full border border-amber-500/10 rounded-full scale-75" />
            <div className="w-full h-full border border-amber-500/10 rounded-full scale-50" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h1 
            className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-medium text-gold-shine mb-8 tracking-tight leading-[1.1]"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {t('hero.title')}
          </motion.h1>
          
          <motion.p 
            className="font-sans text-lg sm:text-xl md:text-2xl text-zinc-300/90 font-light leading-relaxed max-w-3xl mx-auto tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {t('hero.subtitle')}
          </motion.p>
        </motion.div>

        {/* CTA with tooltip */}
        <motion.div 
          className="relative inline-block"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.a
            href={`https://wa.me/34658867133?text=${encodeURIComponent(t('whatsapp.booking'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-block px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-900 font-semibold text-base sm:text-lg rounded-full shadow-lg shadow-amber-500/30 transition-all duration-300"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 50px rgba(245, 158, 11, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="relative z-10">{t('hero.cta')}</span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
          
          {showTooltip && (
            <motion.div 
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-zinc-800/95 text-amber-100 text-sm rounded-lg border border-amber-500/30 backdrop-blur-sm whitespace-nowrap"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {t('hero.tooltip')}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-800/95" />
            </motion.div>
          )}
        </motion.div>

        {/* Floating quote */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p 
            className="text-amber-200/80 italic text-lg font-light"
          >
            "{t('hero.quote')}"
          </p>
        </motion.div>
      </div>

      
    </motion.section>
  );
}


