import { motion } from 'framer-motion';
import { CalendarCheck2, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';

export default function FinalInvitationSection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 sm:py-24">
      <div className="section-container">
        <motion.div
          className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-300/15 via-amber-200/10 to-transparent p-8 sm:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-3xl sm:text-5xl font-semibold text-white leading-tight">
            {t('final.title')}
          </h2>
          <p className="mt-5 max-w-3xl mx-auto text-zinc-200 text-base sm:text-xl leading-relaxed">
            {t('final.subtitle')}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/34658867133?text=${encodeURIComponent(t('whatsapp.booking'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-360-primary px-7 py-3.5 text-base inline-flex items-center gap-2"
            >
              <CalendarCheck2 className="h-4.5 w-4.5" />
              {t('final.cta')}
            </a>
            <a
              href="https://wa.me/34658867133?text=Hola%2C%20m%27agradaria%20programar%20una%20trucada%20de%20descobriment.%20Podr%C3%ADem%20parlar%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-360-secondary px-7 py-3.5 text-base inline-flex items-center gap-2"
            >
              <MessageCircle className="h-4.5 w-4.5" />
              {t('cta.scheduleDiscoveryCall')}
            </a>
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-200/90">
            <span className="rounded-full border border-white/20 px-3 py-1.5">{t('labels.noInsuranceNeeded')}</span>
            <span className="rounded-full border border-white/20 px-3 py-1.5">{t('labels.flexibleSchedules')}</span>
            <span className="rounded-full border border-white/20 px-3 py-1.5">{t('labels.personalizedApproach')}</span>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-2xl font-semibold text-white">500+</p>
              <p className="mt-1 text-sm text-zinc-300">{t('final.stat1')}</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-2xl font-semibold text-white">15+</p>
              <p className="mt-1 text-sm text-zinc-300">{t('final.stat2')}</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-2xl font-semibold text-white">98%</p>
              <p className="mt-1 text-sm text-zinc-300">{t('final.stat3')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


