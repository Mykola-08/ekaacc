import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { 
  Brain, 
  Heart, 
  Zap, 
  Shield, 
  Moon, 
  Smile, 
  Activity, 
  Compass,
  Sparkles
} from 'lucide-react';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  science: string;
}

export default function BenefitsSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  const { t } = useLanguage();

  const benefits: Benefit[] = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: t('benefits.benefit1.title'),
      description: t('benefits.benefit1.description'),
      science: t('benefits.benefit1.science')
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: t('benefits.benefit2.title'),
      description: t('benefits.benefit2.description'),
      science: t('benefits.benefit2.science')
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('benefits.benefit3.title'),
      description: t('benefits.benefit3.description'),
      science: t('benefits.benefit3.science')
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('benefits.benefit4.title'),
      description: t('benefits.benefit4.description'),
      science: t('benefits.benefit4.science')
    },
    {
      icon: <Moon className="w-8 h-8" />,
      title: t('benefits.benefit5.title'),
      description: t('benefits.benefit5.description'),
      science: t('benefits.benefit5.science')
    },
    {
      icon: <Smile className="w-8 h-8" />,
      title: t('benefits.benefit6.title'),
      description: t('benefits.benefit6.description'),
      science: t('benefits.benefit6.science')
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: t('benefits.benefit7.title'),
      description: t('benefits.benefit7.description'),
      science: t('benefits.benefit7.science')
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: t('benefits.benefit8.title'),
      description: t('benefits.benefit8.description'),
      science: t('benefits.benefit8.science')
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: t('benefits.benefit9.title'),
      description: t('benefits.benefit9.description'),
      science: t('benefits.benefit9.science')
    },
  ];

  return (
    <motion.section 
      ref={ref}
      className="py-24 sm:py-32 bg-black relative overflow-hidden"
      style={{ opacity }}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-yellow-900/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 mb-6 tracking-tight">
            {t('benefits.title')}
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
            {t('benefits.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="group relative p-8 rounded-3xl bg-card/5 backdrop-blur-md border border-white/10 hover:border-amber-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors duration-500">
                  <div className="text-amber-400 group-hover:text-amber-300 transition-colors duration-500">
                    {benefit.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-medium text-zinc-100 mb-3 group-hover:text-amber-200 transition-colors duration-300">
                  {benefit.title}
                </h3>
                
                <p className="text-zinc-400 mb-4 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300 font-light">
                  {benefit.description}
                </p>
                
                {benefit.science && (
                  <div className="pt-4 border-t border-white/10 group-hover:border-amber-500/20 transition-colors duration-500">
                    <p className="text-xs font-medium text-amber-500/70 uppercase tracking-wider mb-1">Science</p>
                    <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300 font-light">
                      {benefit.science}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Philosophy note */}
        <motion.div 
          className="mt-20 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5 border border-amber-500/10 backdrop-blur-sm">
            <p className="text-amber-200/80 text-lg italic font-light leading-relaxed">
              "{t('benefits.philosophy')}"
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}


