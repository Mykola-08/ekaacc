import { motion } from 'motion/react';
import { CalendarCheck2, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';

export default function FinalInvitationSection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 sm:py-24">
      <div className="section-container">
        <motion.div
          className="rounded-3xl border border-amber-300/30 bg-linear-to-br from-amber-300/15 via-amber-200/10 to-transparent p-8 text-center sm:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-3xl leading-tight font-semibold text-white sm:text-5xl">
            {t('final.title')}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-zinc-200 sm:text-xl">
            {t('final.subtitle')}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`https://wa.me/34658867133?text=${encodeURIComponent(t('whatsapp.booking'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-360-primary inline-flex items-center gap-2 px-7 py-3.5 text-base"
            >
              <CalendarCheck2 className="h-4.5 w-4.5" />
              {t('final.cta')}
            </a>
            <a
              href="https://wa.me/34658867133?text=Hola%2C%20m%27agradaria%20programar%20una%20trucada%20de%20descobriment.%20Podr%C3%ADem%20parlar%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-360-secondary inline-flex items-center gap-2 px-7 py-3.5 text-base"
            >
              <MessageCircle className="h-4.5 w-4.5" />
              {t('cta.scheduleDiscoveryCall')}
            </a>
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3 text-xs text-zinc-200/90 sm:gap-4 sm:text-sm">
            <span className="rounded-full border border-white/20 px-3 py-1.5">
              {t('labels.noInsuranceNeeded')}
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1.5">
              {t('labels.flexibleSchedules')}
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1.5">
              {t('labels.personalizedApproach')}
            </span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-semibold text-white">500+</p>
              <p className="mt-1 text-sm text-zinc-300">{t('final.stat1')}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-semibold text-white">15+</p>
              <p className="mt-1 text-sm text-zinc-300">{t('final.stat2')}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-semibold text-white">98%</p>
              <p className="mt-1 text-sm text-zinc-300">{t('final.stat3')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
