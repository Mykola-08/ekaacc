import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { RotateCcw, MapPin, Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

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

export default function VariantsSection() {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const { t } = useLanguage();

  const variants: Variant[] = [
    {
      icon: <RotateCcw className="w-8 h-8" />,
      title: t('variants.reset.title'),
      subtitle: t('variants.reset.subtitle'),
      description: t('variants.reset.description'),
      idealFor: [
        t('variants.reset.idealFor.1'),
        t('variants.reset.idealFor.2'),
        t('variants.reset.idealFor.3'),
        t('variants.reset.idealFor.4')
      ],
      duration: t('variants.reset.duration'),
      includes: [
        t('variants.reset.includes.1'),
        t('variants.reset.includes.2'),
        t('variants.reset.includes.3'),
        t('variants.reset.includes.4')
      ],
      price: "€450"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: t('variants.mapping.title'), 
      subtitle: t('variants.mapping.subtitle'),
      description: t('variants.mapping.description'),
      idealFor: [
        t('variants.mapping.idealFor.1'),
        t('variants.mapping.idealFor.2'),
        t('variants.mapping.idealFor.3'),
        t('variants.mapping.idealFor.4')
      ],
      duration: t('variants.mapping.duration'),
      includes: [
        t('variants.mapping.includes.1'),
        t('variants.mapping.includes.2'),
        t('variants.mapping.includes.3'),
        t('variants.mapping.includes.4')
      ],
      price: "€350"
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: t('variants.alignment.title'),
      subtitle: t('variants.alignment.subtitle'),
      description: t('variants.alignment.description'),
      idealFor: [
        t('variants.alignment.idealFor.1'),
        t('variants.alignment.idealFor.2'),
        t('variants.alignment.idealFor.3'),
        t('variants.alignment.idealFor.4')
      ],
      duration: t('variants.alignment.duration'), 
      includes: [
        t('variants.alignment.includes.1'),
        t('variants.alignment.includes.2'),
        t('variants.alignment.includes.3'),
        t('variants.alignment.includes.4')
      ],
      price: "€280"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: t('variants.integral.title'),
      subtitle: t('variants.integral.subtitle'),
      description: t('variants.integral.description'),
      idealFor: [
        t('variants.integral.idealFor.1'),
        t('variants.integral.idealFor.2'),
        t('variants.integral.idealFor.3'),
        t('variants.integral.idealFor.4')
      ],
      duration: t('variants.integral.duration'),
      includes: [
        t('variants.integral.includes.1'),
        t('variants.integral.includes.2'),
        t('variants.integral.includes.3'),
        t('variants.integral.includes.4')
      ],
      price: "€750"
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-black relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 mb-6 tracking-tight"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {t('variants.title')}
          </motion.h2>
          <motion.p 
            className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {t('variants.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {variants.map((variant, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-card/5 backdrop-blur-md border border-white/10 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1
              }}
              onClick={() => setSelectedVariant(variant)}
              whileHover={{ 
                borderColor: "rgba(251, 191, 36, 0.4)",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                scale: 1.02,
                y: -8,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Golden frame effect */}
              <motion.div 
                className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/0 via-amber-400/10 to-amber-500/0 rounded-3xl blur-md"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative p-8 h-full flex flex-col">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-8 text-amber-400"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: "rgba(245, 158, 11, 0.2)",
                    color: "rgb(252, 211, 77)",
                    transition: { duration: 0.3 }
                  }}
                >
                  {variant.icon}
                </motion.div>
                
                <motion.h3 
                  className="text-xl lg:text-2xl font-semibold text-amber-100 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  {variant.title}
                </motion.h3>
                
                <motion.p 
                  className="text-amber-300/80 text-sm font-medium mb-4"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  {variant.subtitle}
                </motion.p>
                
                <motion.p 
                  className="text-zinc-300 text-sm leading-relaxed mb-6 flex-grow"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  {variant.description}
                </motion.p>
                
                <motion.div 
                  className="flex items-center justify-between mt-auto pt-4 border-t border-amber-500/20"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-amber-200 font-semibold">
                    {variant.duration}
                  </span>
                  <motion.span 
                    className="text-2xl font-light text-amber-100"
                    animate={{ 
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  >
                    {variant.price}
                  </motion.span>
                </motion.div>
                
                <motion.div 
                  className="mt-4 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-amber-300/70 text-xs">
                    {t('variants.clickForDetails')}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedVariant && (
        <Modal 
          isOpen={!!selectedVariant} 
          onClose={() => setSelectedVariant(null)}
          title={selectedVariant.title}
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="text-amber-400">
                {selectedVariant.icon}
              </div>
              <div>
                <h3 className="text-xl text-amber-200">{selectedVariant.subtitle}</h3>
                <p className="text-zinc-300">{selectedVariant.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-amber-200">{t('variants.idealFor')}:</h4>
                <ul className="space-y-2">
                  {selectedVariant.idealFor.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-zinc-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-amber-200">{t('variants.includes')}:</h4>
                <ul className="space-y-2">
                  {selectedVariant.includes.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-zinc-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-zinc-800/50 rounded-lg border border-amber-500/20">
              <div>
                <p className="text-amber-200 font-medium">{t('variants.sessionDuration')}</p>
                <p className="text-2xl font-light text-amber-100">{selectedVariant.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-amber-200 font-medium">{t('variants.investment')}</p>
                <p className="text-3xl font-light text-amber-100">{selectedVariant.price}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}


