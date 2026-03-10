'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, RotateCcw, Sparkles } from 'lucide-react';
import Modal from './Modal';
import { useLanguage } from '@/marketing/contexts/LanguageContext';

interface Variant {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  idealFor: string[];
  duration: string;
  includes: string[];
  price: string;
}

export default function VariantsSection() {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const { t } = useLanguage();

  const variants: Variant[] = [
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: t('revision360.variants.reset.title'),
      subtitle: t('revision360.variants.reset.subtitle'),
      description: t('revision360.variants.reset.description'),
      idealFor: [
        t('revision360.variants.reset.idealFor.1'),
        t('revision360.variants.reset.idealFor.2'),
        t('revision360.variants.reset.idealFor.3'),
        t('revision360.variants.reset.idealFor.4'),
      ],
      duration: t('revision360.variants.reset.duration'),
      includes: [
        t('revision360.variants.reset.includes.1'),
        t('revision360.variants.reset.includes.2'),
        t('revision360.variants.reset.includes.3'),
        t('revision360.variants.reset.includes.4'),
      ],
      price: 'EUR 450',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('revision360.variants.mapping.title'),
      subtitle: t('revision360.variants.mapping.subtitle'),
      description: t('revision360.variants.mapping.description'),
      idealFor: [
        t('revision360.variants.mapping.idealFor.1'),
        t('revision360.variants.mapping.idealFor.2'),
        t('revision360.variants.mapping.idealFor.3'),
        t('revision360.variants.mapping.idealFor.4'),
      ],
      duration: t('revision360.variants.mapping.duration'),
      includes: [
        t('revision360.variants.mapping.includes.1'),
        t('revision360.variants.mapping.includes.2'),
        t('revision360.variants.mapping.includes.3'),
        t('revision360.variants.mapping.includes.4'),
      ],
      price: 'EUR 350',
    },
    {
      icon: <Compass className="w-6 h-6" />,
      title: t('revision360.variants.alignment.title'),
      subtitle: t('revision360.variants.alignment.subtitle'),
      description: t('revision360.variants.alignment.description'),
      idealFor: [
        t('revision360.variants.alignment.idealFor.1'),
        t('revision360.variants.alignment.idealFor.2'),
        t('revision360.variants.alignment.idealFor.3'),
        t('revision360.variants.alignment.idealFor.4'),
      ],
      duration: t('revision360.variants.alignment.duration'),
      includes: [
        t('revision360.variants.alignment.includes.1'),
        t('revision360.variants.alignment.includes.2'),
        t('revision360.variants.alignment.includes.3'),
        t('revision360.variants.alignment.includes.4'),
      ],
      price: 'EUR 280',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t('revision360.variants.integral.title'),
      subtitle: t('revision360.variants.integral.subtitle'),
      description: t('revision360.variants.integral.description'),
      idealFor: [
        t('revision360.variants.integral.idealFor.1'),
        t('revision360.variants.integral.idealFor.2'),
        t('revision360.variants.integral.idealFor.3'),
        t('revision360.variants.integral.idealFor.4'),
      ],
      duration: t('revision360.variants.integral.duration'),
      includes: [
        t('revision360.variants.integral.includes.1'),
        t('revision360.variants.integral.includes.2'),
        t('revision360.variants.integral.includes.3'),
        t('revision360.variants.integral.includes.4'),
      ],
      price: 'EUR 750',
    },
  ];

  return (
    <section className="relative py-24 bg-secondary">
      <div className="section-container">
        <motion.div
          className="max-w-3xl text-center mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full border border-blue-100">
            {t('revision360.variants.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-4">{t('revision360.variants.title')}</h2>
          <p className="text-lg text-gray-500 font-normal leading-relaxed">{t('revision360.variants.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-fr">
          {variants.map((variant, index) => (
            <motion.button
              key={variant.title}
              type="button"
              onClick={() => setSelectedVariant(variant)}
              className="group text-left rounded-[2.5rem] bg-white border border-gray-100 hover:border-gray-200 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 relative overflow-hidden flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
              <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-900 border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
                {variant.icon}
              </span>
              <h3 className="relative z-10 mt-6 text-xl font-semibold text-gray-900">{variant.title}</h3>
              <p className="relative z-10 mt-1 text-xs text-blue-600 font-bold uppercase tracking-wider">{variant.subtitle}</p>
              <p className="relative z-10 mt-4 text-sm text-gray-500 leading-relaxed font-normal flex-1">{variant.description}</p>
              <div className="relative z-10 mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">{variant.duration}</span>
                <span className="text-lg font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-xl">{variant.price}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {selectedVariant && (
        <Modal
          isOpen={!!selectedVariant}
          onClose={() => setSelectedVariant(null)}
          title={selectedVariant.title}
          size="lg"
        >
          <div className="space-y-8">
            <p className="text-gray-600 text-lg leading-relaxed font-light">{selectedVariant.description}</p>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{t('revision360.variants.idealFor')}</p>
                <ul className="space-y-2.5">
                  {selectedVariant.idealFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 font-medium">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{t('revision360.variants.includes')}</p>
                <ul className="space-y-2.5">
                  {selectedVariant.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 font-medium">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="rounded-2xl bg-secondary p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-100">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">{t('revision360.variants.sessionDuration')}</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{selectedVariant.duration}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">{t('revision360.variants.investment')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{selectedVariant.price}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
