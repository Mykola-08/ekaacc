'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles, Wind, Activity, Heart } from 'lucide-react';
import Modal from './Modal';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import Image from 'next/image';

export default function Why360Section() {
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();

  const layers = [
    { 
      name: t('revision360.why360.layers.physical'), 
      description: t('revision360.why360.physical.desc'),
      icon: Activity,
      color: "bg-orange-50 text-orange-600",
      image: "https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800",
      className: "col-span-1 md:col-span-2 row-span-2"
    },
    { 
      name: t('revision360.why360.layers.structural'), 
      description: t('revision360.why360.structural.desc'),
      icon: Layers,
      color: "bg-blue-50 text-blue-600",
      image: "",
      className: "col-span-1 row-span-1"
    },
    { 
      name: t('revision360.why360.layers.emotional'), 
      description: t('revision360.why360.emotional.desc'),
      icon: Heart,
      color: "bg-rose-50 text-rose-600",
      image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800",
      className: "col-span-1 md:col-span-2 row-span-2"
    },
    { 
      name: t('revision360.why360.layers.energetic'), 
      description: t('revision360.why360.energetic.desc'),
      icon: Wind,
      color: "bg-teal-50 text-teal-600",
      image: "",
      className: "col-span-1 row-span-1"
    },
  ];

  return (
    <section className="relative py-24 bg-secondary">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <motion.div
            className="lg:col-span-4 sticky top-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-xs uppercase tracking-wider text-blue-700 font-semibold mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              {t('revision360.why360.badge')}
            </span>
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight mb-6 leading-[1.1]">
              {t('revision360.why360.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium mb-8">
              {t('revision360.why360.subtitle')}
            </p>
            <Button
              onClick={() => setShowModal(true)}
              variant="outline"
              size="lg"
              className="rounded-full bg-white hover:bg-gray-50 border-gray-200 px-8 transition-all hover:scale-105"
            >
              {t('revision360.why360.philosophy')}
            </Button>
          </motion.div>

          <motion.div
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {layers.map((layer) => (
              <div
                key={layer.name}
                className={`group rounded-[2rem] p-6 lg:p-8 bg-white border border-gray-100 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/5 relative overflow-hidden flex flex-col justify-between ${layer.className}`}
              >
                {layer.image && (
                  <>
                    <Image 
                      src={layer.image} 
                      alt={layer.name} 
                      fill
                      className="object-cover opacity-20 group-hover:opacity-40 transition-all duration-700 pointer-events-none" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                  </>
                )}
                
                <div className="relative z-10">
                  <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${layer.color} transition-transform group-hover:scale-110 duration-500`}>
                    <layer.icon className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="relative z-10 mt-auto">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">{layer.name}</h3>
                  <p className="text-base text-gray-600 leading-relaxed font-medium">
                    {layer.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={t('revision360.why360.modal.title')} size="lg">
        <div className="space-y-8 text-gray-600">
          <p className="leading-relaxed text-lg">{t('revision360.why360.modal.intro')}</p>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('revision360.why360.modal.integration.title')}</h3>
            <p className="leading-relaxed">{t('revision360.why360.modal.integration.description')}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('revision360.why360.modal.dimensions.title')}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {layers.map((layer) => (
                <div key={layer.name} className="rounded-xl border border-gray-100 bg-gray-50 p-5 hover:bg-white  transition">
                  <p className="font-bold text-gray-900 mb-1">{layer.name}</p>
                  <p className="text-sm text-gray-500">{layer.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('revision360.why360.modal.importance.title')}</h3>
            <p className="leading-relaxed">{t('revision360.why360.modal.importance.description')}</p>
          </div>
        </div>
      </Modal>
    </section>
  );
}
