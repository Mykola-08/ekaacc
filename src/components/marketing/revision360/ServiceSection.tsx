import { motion } from 'motion/react';
import { Clock3 } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';

interface ServiceStep {
  number: string;
  title: string;
  description: string;
  details: string[];
  duration: string;
}

export default function ServiceSection() {
  const { t } = useLanguage();

  const steps: ServiceStep[] = [
    {
      number: '01',
      title: t('service.step1.title'),
      description: t('service.step1.description'),
      details: [
        t('service.step1.details.1'),
        t('service.step1.details.2'),
        t('service.step1.details.3'),
        t('service.step1.details.4'),
      ],
      duration: '45 min',
    },
    {
      number: '02',
      title: t('service.step2.title'),
      description: t('service.step2.description'),
      details: [
        t('service.step2.details.1'),
        t('service.step2.details.2'),
        t('service.step2.details.3'),
        t('service.step2.details.4'),
      ],
      duration: '60 min',
    },
    {
      number: '03',
      title: t('service.step3.title'),
      description: t('service.step3.description'),
      details: [
        t('service.step3.details.1'),
        t('service.step3.details.2'),
        t('service.step3.details.3'),
        t('service.step3.details.4'),
      ],
      duration: '90 min',
    },
    {
      number: '04',
      title: t('service.step4.title'),
      description: t('service.step4.description'),
      details: [
        t('service.step4.details.1'),
        t('service.step4.details.2'),
        t('service.step4.details.3'),
        t('service.step4.details.4'),
      ],
      duration: '30 min',
    },
  ];

  return (
    <section id="process" className="relative py-20 sm:py-24">
      <div className="section-container">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-3xl font-semibold text-white sm:text-5xl">{t('service.title')}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">
            {t('service.subtitle')}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-7"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.12em] text-amber-200/80 uppercase">
                    Step {step.number}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-zinc-300">{step.description}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-medium whitespace-nowrap text-amber-100">
                  <Clock3 className="h-3.5 w-3.5" />
                  {step.duration}
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-sm font-medium text-amber-200">{t('service.expect')}</p>
                <ul className="mt-3 space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className="flex items-start gap-3 text-sm text-zinc-300 sm:text-base"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
          <p className="text-sm tracking-[0.11em] text-amber-200/85 uppercase">
            {t('service.total.title')}
          </p>
          <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {t('service.total.duration')}
          </p>
          <p className="mt-2 text-zinc-200/90">{t('service.total.note')}</p>
        </motion.div>
      </div>
    </section>
  );
}
