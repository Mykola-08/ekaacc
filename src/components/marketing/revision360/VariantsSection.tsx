import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, RotateCcw, Sparkles } from 'lucide-react';
import Modal from './Modal';
import { useLanguage } from '@/context/marketing/LanguageContext';

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
      icon: <RotateCcw className="h-6 w-6" />,
      title: t('variants.reset.title'),
      subtitle: t('variants.reset.subtitle'),
      description: t('variants.reset.description'),
      idealFor: [
        t('variants.reset.idealFor.1'),
        t('variants.reset.idealFor.2'),
        t('variants.reset.idealFor.3'),
        t('variants.reset.idealFor.4'),
      ],
      duration: t('variants.reset.duration'),
      includes: [
        t('variants.reset.includes.1'),
        t('variants.reset.includes.2'),
        t('variants.reset.includes.3'),
        t('variants.reset.includes.4'),
      ],
      price: 'EUR 450',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t('variants.mapping.title'),
      subtitle: t('variants.mapping.subtitle'),
      description: t('variants.mapping.description'),
      idealFor: [
        t('variants.mapping.idealFor.1'),
        t('variants.mapping.idealFor.2'),
        t('variants.mapping.idealFor.3'),
        t('variants.mapping.idealFor.4'),
      ],
      duration: t('variants.mapping.duration'),
      includes: [
        t('variants.mapping.includes.1'),
        t('variants.mapping.includes.2'),
        t('variants.mapping.includes.3'),
        t('variants.mapping.includes.4'),
      ],
      price: 'EUR 350',
    },
    {
      icon: <Compass className="h-6 w-6" />,
      title: t('variants.alignment.title'),
      subtitle: t('variants.alignment.subtitle'),
      description: t('variants.alignment.description'),
      idealFor: [
        t('variants.alignment.idealFor.1'),
        t('variants.alignment.idealFor.2'),
        t('variants.alignment.idealFor.3'),
        t('variants.alignment.idealFor.4'),
      ],
      duration: t('variants.alignment.duration'),
      includes: [
        t('variants.alignment.includes.1'),
        t('variants.alignment.includes.2'),
        t('variants.alignment.includes.3'),
        t('variants.alignment.includes.4'),
      ],
      price: 'EUR 280',
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: t('variants.integral.title'),
      subtitle: t('variants.integral.subtitle'),
      description: t('variants.integral.description'),
      idealFor: [
        t('variants.integral.idealFor.1'),
        t('variants.integral.idealFor.2'),
        t('variants.integral.idealFor.3'),
        t('variants.integral.idealFor.4'),
      ],
      duration: t('variants.integral.duration'),
      includes: [
        t('variants.integral.includes.1'),
        t('variants.integral.includes.2'),
        t('variants.integral.includes.3'),
        t('variants.integral.includes.4'),
      ],
      price: 'EUR 750',
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
          <h2 className="text-3xl font-semibold text-white sm:text-5xl">{t('variants.title')}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">
            {t('variants.subtitle')}
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {variants.map((variant, index) => (
            <motion.button
              key={variant.title}
              type="button"
              onClick={() => setSelectedVariant(variant)}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm transition-colors hover:border-amber-200/35 hover:bg-white/[0.08]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-300/15 text-amber-100">
                {variant.icon}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-white">{variant.title}</h3>
              <p className="mt-1 text-sm text-amber-200/90">{variant.subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{variant.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs tracking-[0.1em] text-zinc-300/90 uppercase">
                  {variant.duration}
                </span>
                <span className="text-lg font-semibold text-amber-100">{variant.price}</span>
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
          <div className="space-y-6">
            <p className="text-zinc-200">{selectedVariant.description}</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm tracking-[0.1em] text-amber-200 uppercase">
                  {t('variants.idealFor')}
                </p>
                <ul className="mt-3 space-y-2">
                  {selectedVariant.idealFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-zinc-200">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm tracking-[0.1em] text-amber-200 uppercase">
                  {t('variants.includes')}
                </p>
                <ul className="mt-3 space-y-2">
                  {selectedVariant.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-zinc-200">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs tracking-[0.1em] text-amber-200 uppercase">
                  {t('variants.sessionDuration')}
                </p>
                <p className="mt-1 text-lg font-semibold text-white">{selectedVariant.duration}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs tracking-[0.1em] text-amber-200 uppercase">
                  {t('variants.investment')}
                </p>
                <p className="mt-1 text-2xl font-semibold text-white">{selectedVariant.price}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
