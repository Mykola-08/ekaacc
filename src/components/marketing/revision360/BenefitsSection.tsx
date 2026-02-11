import { motion } from 'motion/react';
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
    {
      icon: <Brain className="h-5 w-5" />,
      title: t('benefits.benefit1.title'),
      description: t('benefits.benefit1.description'),
      science: t('benefits.benefit1.science'),
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: t('benefits.benefit2.title'),
      description: t('benefits.benefit2.description'),
      science: t('benefits.benefit2.science'),
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: t('benefits.benefit3.title'),
      description: t('benefits.benefit3.description'),
      science: t('benefits.benefit3.science'),
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: t('benefits.benefit4.title'),
      description: t('benefits.benefit4.description'),
      science: t('benefits.benefit4.science'),
    },
    {
      icon: <Moon className="h-5 w-5" />,
      title: t('benefits.benefit5.title'),
      description: t('benefits.benefit5.description'),
      science: t('benefits.benefit5.science'),
    },
    {
      icon: <Smile className="h-5 w-5" />,
      title: t('benefits.benefit6.title'),
      description: t('benefits.benefit6.description'),
      science: t('benefits.benefit6.science'),
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: t('benefits.benefit7.title'),
      description: t('benefits.benefit7.description'),
      science: t('benefits.benefit7.science'),
    },
    {
      icon: <Compass className="h-5 w-5" />,
      title: t('benefits.benefit8.title'),
      description: t('benefits.benefit8.description'),
      science: t('benefits.benefit8.science'),
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: t('benefits.benefit9.title'),
      description: t('benefits.benefit9.description'),
      science: t('benefits.benefit9.science'),
    },
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
          <h2 className="text-3xl font-semibold text-primary-foreground sm:text-5xl">{t('benefits.title')}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground/40 sm:text-lg">
            {t('benefits.subtitle')}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.article
              key={`${benefit.title}-${index}`}
              className="rounded-2xl border border-border/10 bg-background/5 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-vip-gold-4/15 text-vip-gold-2">
                {benefit.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-primary-foreground">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground/40 sm:text-base">
                {benefit.description}
              </p>
              {benefit.science && (
                <div className="mt-4 border-t border-border/10 pt-3">
                  <p className="text-xs tracking-[0.12em] text-vip-gold-2/85 uppercase">Science</p>
                  <p className="mt-2 text-sm text-muted-foreground/40">{benefit.science}</p>
                </div>
              )}
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-8 rounded-2xl border border-warning/25 bg-vip-gold-4/10 p-6 sm:p-7"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-base text-foreground/90 italic sm:text-lg">"{t('benefits.philosophy')}"</p>
        </motion.div>
      </div>
    </section>
  );
}
