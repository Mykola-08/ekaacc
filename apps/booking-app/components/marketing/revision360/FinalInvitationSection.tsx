import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function FinalInvitationSection() {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-black relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Animated golden background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div 
            className="w-[800px] h-[800px] border border-amber-400/10 rounded-full"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-amber-300/15 rounded-full"
            animate={{ 
              scale: [1, 1.08, 1],
              opacity: [0.15, 0.25, 0.15],
              rotate: [360, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-amber-500/20 rounded-full"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "linear",
              delay: 4
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-200 to-amber-400 mb-8 tracking-tight leading-tight"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {t('final.title')}
          </motion.h2>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-zinc-300 font-light leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {t('final.subtitle')}
          </motion.p>
        </motion.div>

        {/* Main CTA with animated background */}
        <motion.div 
          className="relative inline-block mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <motion.div 
            className="absolute -inset-4 bg-linear-to-r from-amber-500/30 via-yellow-400/30 to-amber-500/30 rounded-full blur-lg"
            animate={isHovered ? { 
              opacity: 1,
              scale: 1.1
            } : { 
              opacity: 0.5,
              scale: 1
            }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.a
            href={`https://wa.me/34658867133?text=${encodeURIComponent(t('whatsapp.booking'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block px-16 py-6 bg-linear-to-r from-amber-500 to-yellow-400 text-foreground font-bold text-xl rounded-full shadow-2xl shadow-amber-500/40"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(245, 158, 11, 0.6)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="relative z-10">{t('final.cta')}</span>
            <motion.div 
              className="absolute inset-0 bg-linear-to-r from-yellow-400 to-amber-500 rounded-full"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </motion.div>

        {/* Supporting elements */}
        <motion.div 
          className="space-y-8 text-zinc-400"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm">
            {[t('labels.noInsuranceNeeded'), t('labels.flexibleSchedules'), t('labels.personalizedApproach')].map((text, index) => (
              <motion.div 
                key={index}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div 
                  className="w-2 h-2 bg-amber-400 rounded-full"
                />
                <span>{text}</span>
              </motion.div>
            ))}
          </div>

          <motion.p 
            className="text-lg italic mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            "{t('final.healingQuote')}"
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center space-x-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <motion.img 
              src="/eka_logo.png"
              alt={t('alt.ekaLogo')}
              className="w-5 h-5 object-contain opacity-25"
              whileHover={{ 
                scale: 1.1,
                opacity: 0.4,
                rotate: 180
              }}
              transition={{ duration: 0.3 }}
            />
            <span 
              className="text-amber-300/25 text-xs font-light"
            >
              {t('common.ekaBalance')} {t('common.copyright')}
            </span>
          </motion.div>
        </motion.div>

        {/* Secondary actions */}
        <motion.div 
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <motion.a
            href="https://wa.me/34658867133?text=Hola%2C%20m%27agradaria%20programar%20una%20trucada%20de%20descobriment.%20Podr%C3%ADem%20parlar%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-linear-to-r from-zinc-700/50 to-zinc-600/50 border border-amber-500/30 text-amber-200 rounded-lg"
            whileHover={{ 
              backgroundColor: "rgba(82, 82, 91, 0.6)",
              borderColor: "rgba(245, 158, 11, 0.5)",
              scale: 1.02
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {t('cta.scheduleDiscoveryCall')}
          </motion.a>
          
          <motion.button 
            className="px-8 py-3 bg-linear-to-r from-amber-600/20 to-yellow-500/20 border border-amber-500/30 text-amber-200 rounded-lg"
            whileHover={{ 
              backgroundColor: "rgba(245, 158, 11, 0.3)",
              borderColor: "rgba(245, 158, 11, 0.5)",
              scale: 1.02
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {t('cta.downloadGuide')}
          </motion.button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          className="mt-20 pt-8 border-t border-amber-500/20"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-zinc-500 text-sm">
            {[
              { number: '500+', text: t('final.stat1') },
              { number: '15+', text: t('final.stat2') },
              { number: '98%', text: t('final.stat3') }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div 
                  className="text-2xl font-light text-amber-300 mb-1"
                >
                  {stat.number}
                </div>
                <div>{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


