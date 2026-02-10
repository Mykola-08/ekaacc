import { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, Sparkles } from 'lucide-react';
import Modal from './Modal';
import { useLanguage } from '@/context/marketing/LanguageContext';

export default function Why360Section() {
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();

  const layers = [
    { name: t('why360.layers.physical'), description: t('why360.physical.desc') },
    { name: t('why360.layers.structural'), description: t('why360.structural.desc') },
    { name: t('why360.layers.emotional'), description: t('why360.emotional.desc') },
    { name: t('why360.layers.energetic'), description: t('why360.energetic.desc') },
  ];

  return (
    <section className="relative py-20 sm:py-24">
      <div className="section-container">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/5 px-3 py-1 text-xs tracking-[0.12em] text-amber-100 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              360 Framework
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
              {t('why360.title')}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
              {t('why360.subtitle')}
            </p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="btn-360-secondary mt-8 px-6 py-3"
            >
              {t('why360.philosophy')}
            </button>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:col-span-7"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            {layers.map((layer) => (
              <article
                key={layer.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6"
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/15 text-amber-200">
                  <Layers className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{layer.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base">
                  {layer.description}
                </p>
              </article>
            ))}
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t('why360.modal.title')}
        size="lg"
      >
        <div className="space-y-6 text-zinc-200">
          <p className="leading-relaxed">{t('why360.modal.intro')}</p>
          <div>
            <h3 className="text-lg font-semibold text-amber-200">
              {t('why360.modal.integration.title')}
            </h3>
            <p className="mt-2 leading-relaxed">{t('why360.modal.integration.description')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-200">
              {t('why360.modal.dimensions.title')}
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {layers.map((layer) => (
                <div key={layer.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">{layer.name}</p>
                  <p className="mt-1 text-sm text-zinc-300">{layer.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-200">
              {t('why360.modal.importance.title')}
            </h3>
            <p className="mt-2 leading-relaxed">{t('why360.modal.importance.description')}</p>
          </div>
        </div>
      </Modal>
    </section>
  );
}
