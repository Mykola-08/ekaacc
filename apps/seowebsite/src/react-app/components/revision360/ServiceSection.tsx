import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

interface ServiceStep {
  number: string;
  title: string;
  description: string;
  details: string[];
  duration: string;
}

export default function ServiceSection() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  const { t } = useLanguage();

  const steps: ServiceStep[] = [
    {
      number: "01",
      title: t('service.step1.title'),
      description: t('service.step1.description'),
      details: [
        t('service.step1.details.1'),
        t('service.step1.details.2'),
        t('service.step1.details.3'),
        t('service.step1.details.4')
      ],
      duration: "45 minuts"
    },
    {
      number: "02", 
      title: t('service.step2.title'),
      description: t('service.step2.description'),
      details: [
        t('service.step2.details.1'),
        t('service.step2.details.2'),
        t('service.step2.details.3'),
        t('service.step2.details.4')
      ],
      duration: "60 minuts"
    },
    {
      number: "03",
      title: t('service.step3.title'),
      description: t('service.step3.description'),
      details: [
        t('service.step3.details.1'),
        t('service.step3.details.2'),
        t('service.step3.details.3'),
        t('service.step3.details.4')
      ],
      duration: "90 minuts"
    },
    {
      number: "04",
      title: t('service.step4.title'),
      description: t('service.step4.description'),
      details: [
        t('service.step4.details.1'),
        t('service.step4.details.2'),
        t('service.step4.details.3'),
        t('service.step4.details.4')
      ],
      duration: "30 minuts"
    }
  ];

  return (
    <motion.section 
      ref={ref}
      className="py-24 sm:py-32 bg-black relative overflow-hidden"
      style={{ opacity, y }}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-yellow-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 mb-8 leading-tight tracking-tight"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('service.title')}
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {t('service.subtitle')}
          </motion.p>
        </motion.div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-800/50 to-zinc-700/30 border border-amber-500/20"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ 
                borderColor: "rgba(245, 158, 11, 0.4)",
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
            >
              {/* Golden glow on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-400/5"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative p-8">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                >
                  <div className="flex items-center space-x-6">
                    <div className="text-3xl font-light text-amber-400/80">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-amber-100 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-zinc-300 leading-relaxed max-w-2xl">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-amber-300 font-medium">
                      {step.duration}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedStep === index ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {expandedStep === index ? (
                        <ChevronDown className="w-6 h-6 text-amber-400" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-amber-400" />
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Expanded content */}
                <motion.div
                  initial={false}
                  animate={{ 
                    height: expandedStep === index ? 'auto' : 0,
                    opacity: expandedStep === index ? 1 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {expandedStep === index && (
                    <motion.div 
                      className="pl-16 space-y-4 mt-6"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <h4 className="text-lg font-semibold text-amber-200">{t('service.expect')}</h4>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <motion.li 
                            key={detailIndex} 
                            className="flex items-start space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * detailIndex }}
                          >
                            <motion.div 
                              className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: detailIndex * 0.2
                              }}
                            />
                            <span className="text-zinc-300">{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total session info */}
        <motion.div 
          className="mt-12 text-center p-8 bg-gradient-to-r from-amber-500/10 to-yellow-400/10 rounded-2xl border border-amber-500/30"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          whileHover={{ 
            borderColor: "rgba(245, 158, 11, 0.5)",
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <motion.p 
            className="text-amber-200 text-lg font-medium mb-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            {t('service.total.title')}
          </motion.p>
          <motion.p 
            className="text-3xl font-light text-amber-100 mb-2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            {t('service.total.duration')}
          </motion.p>
          <motion.p 
            className="text-zinc-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            {t('service.total.note')}
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
}

