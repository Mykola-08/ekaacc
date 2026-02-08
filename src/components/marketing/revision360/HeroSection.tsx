import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-24 sm:pt-32 pb-20 sm:pb-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-amber-500/12 blur-3xl" />
        <div className="absolute top-24 right-0 h-[340px] w-[340px] rounded-full bg-sky-400/8 blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-5xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-100">
            <Sparkles className="h-3.5 w-3.5" />
            Integral Method
          </span>

          <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-semibold leading-tight text-white">
            {t('hero.title')}
          </h1>

          <p className="mt-6 text-base sm:text-xl text-zinc-200/90 leading-relaxed max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/34658867133?text=${encodeURIComponent(t('whatsapp.booking'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-360-primary px-7 py-3.5 text-base"
            >
              {t('hero.cta')}
            </a>
            <a
              href="#process"
              className="btn-360-secondary px-7 py-3.5 text-base"
            >
              {t('service.title')}
            </a>
          </div>

          <p className="mt-10 text-sm sm:text-base text-amber-100/80 italic max-w-3xl mx-auto">
            "{t('hero.quote')}"
          </p>
        </motion.div>
      </div>
    </section>
  );
}


