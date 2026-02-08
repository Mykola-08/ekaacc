import { motion } from 'framer-motion';
import { Activity, Brain, Compass, Heart, Moon, Shield, Smile, Sparkles, Zap } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  science: string;
}

export default function BenefitsSection() {
  const { t } = useLanguage();

  const benefits: Benefit[] = [
    { icon: <Brain className="w-5 h-5" />, title: t('benefits.benefit1.title'), description: t('benefits.benefit1.description'), science: t('benefits.benefit1.science') },
    { icon: <Heart className="w-5 h-5" />, title: t('benefits.benefit2.title'), description: t('benefits.benefit2.description'), science: t('benefits.benefit2.science') },
    { icon: <Zap className="w-5 h-5" />, title: t('benefits.benefit3.title'), description: t('benefits.benefit3.description'), science: t('benefits.benefit3.science') },
    { icon: <Shield className="w-5 h-5" />, title: t('benefits.benefit4.title'), description: t('benefits.benefit4.description'), science: t('benefits.benefit4.science') },
    { icon: <Moon className="w-5 h-5" />, title: t('benefits.benefit5.title'), description: t('benefits.benefit5.description'), science: t('benefits.benefit5.science') },
    { icon: <Smile className="w-5 h-5" />, title: t('benefits.benefit6.title'), description: t('benefits.benefit6.description'), science: t('benefits.benefit6.science') },
    { icon: <Activity className="w-5 h-5" />, title: t('benefits.benefit7.title'), description: t('benefits.benefit7.description'), science: t('benefits.benefit7.science') },
    { icon: <Compass className="w-5 h-5" />, title: t('benefits.benefit8.title'), description: t('benefits.benefit8.description'), science: t('benefits.benefit8.science') },
    { icon: <Sparkles className="w-5 h-5" />, title: t('benefits.benefit9.title'), description: t('benefits.benefit9.description'), science: t('benefits.benefit9.science') },
  ];

  return (
    <section className="relative py-20 sm:py-24">
      <div className="section-container">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-3xl sm:text-5xl font-semibold text-white">{t('benefits.title')}</h2>
          <p className="mt-4 text-zinc-300 text-base sm:text-lg leading-relaxed">{t('benefits.subtitle')}</p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.article
              key={`${benefit.title}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-300/15 text-amber-100">
                {benefit.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{benefit.title}</h3>
              <p className="mt-2 text-sm sm:text-base text-zinc-300 leading-relaxed">{benefit.description}</p>
              {benefit.science && (
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-amber-200/85">Science</p>
                  <p className="mt-2 text-sm text-zinc-300">{benefit.science}</p>
                </div>
              )}
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-8 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-6 sm:p-7"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-zinc-100 italic text-base sm:text-lg">
            "{t('benefits.philosophy')}"
          </p>
        </motion.div>
      </div>
    </section>
  );
}


