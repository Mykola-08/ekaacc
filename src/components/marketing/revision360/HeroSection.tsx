import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-warning/12 blur-3xl" />
        <div className="absolute top-24 right-0 h-[340px] w-[340px] rounded-full bg-info/10 blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-5xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-warning/35 bg-vip-gold-4/10 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-vip-gold-2 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Integral Method
          </span>

          <h1 className="mt-6 text-4xl leading-tight font-semibold text-white sm:text-6xl lg:text-7xl">
            {t('hero.title')}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground/90 sm:text-xl">
            {t('hero.subtitle')}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`https://wa.me/34658867133?text=${encodeURIComponent(t('whatsapp.booking'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-360-primary px-7 py-3.5 text-base"
            >
              {t('hero.cta')}
            </a>
            <a href="#process" className="btn-360-secondary px-7 py-3.5 text-base">
              {t('service.title')}
            </a>
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-sm text-vip-gold-2/80 italic sm:text-base">
            "{t('hero.quote')}"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
