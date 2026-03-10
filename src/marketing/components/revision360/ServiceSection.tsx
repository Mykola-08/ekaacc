'use client';

import { motion } from 'framer-motion';
import { Clock3 } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';

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
      title: t('revision360.service.step1.title'),
      description: t('revision360.service.step1.description'),
      details: [
        t('revision360.service.step1.details.1'),
        t('revision360.service.step1.details.2'),
        t('revision360.service.step1.details.3'),
        t('revision360.service.step1.details.4'),
      ],
      duration: '45 min',
    },
    {
      number: '02',
      title: t('revision360.service.step2.title'),
      description: t('revision360.service.step2.description'),
      details: [
        t('revision360.service.step2.details.1'),
        t('revision360.service.step2.details.2'),
        t('revision360.service.step2.details.3'),
        t('revision360.service.step2.details.4'),
      ],
      duration: '60 min',
    },
    {
      number: '03',
      title: t('revision360.service.step3.title'),
      description: t('revision360.service.step3.description'),
      details: [
        t('revision360.service.step3.details.1'),
        t('revision360.service.step3.details.2'),
        t('revision360.service.step3.details.3'),
        t('revision360.service.step3.details.4'),
      ],
      duration: '90 min',
    },
    {
      number: '04',
      title: t('revision360.service.step4.title'),
      description: t('revision360.service.step4.description'),
      details: [
        t('revision360.service.step4.details.1'),
        t('revision360.service.step4.details.2'),
        t('revision360.service.step4.details.3'),
        t('revision360.service.step4.details.4'),
      ],
      duration: '30 min',
    },
  ];

  return (
    <section id="process" className="relative py-24 bg-white">
      <div className="section-container">
        <motion.div
          className="max-w-3xl text-center mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full border border-blue-100">
            {t('revision360.service.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-4">
            {t('revision360.service.title')}
          </h2>
          <p className="text-lg text-gray-500 font-normal leading-relaxed">{t('revision360.service.subtitle')}</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
                className="group rounded-[2.5rem] p-8 md:p-12 bg-white border border-gray-100 hover:border-blue-100/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 relative z-10">
                <div>
                  <div className="text-xs uppercase tracking-wider text-blue-600 font-semibold bg-blue-50 border border-blue-100 px-3 py-1 inline-block rounded-full mb-4">
                    {t('revision360.service.step')} {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-gray-500 font-normal leading-relaxed">{step.description}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 whitespace-nowrap">
                  <Clock3 className="h-3.5 w-3.5" />
                  {step.duration}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t('revision360.service.expect')}</p>
                <ul className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 rounded-[24px] bg-secondary p-8 border border-gray-100/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">{t('revision360.service.total.title')}</p>
              <p className="text-3xl font-semibold text-gray-900">{t('revision360.service.total.duration')}</p>
            </div>
            <p className="text-gray-500 text-sm font-normal max-w-xl text-left">{t('revision360.service.total.note')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
