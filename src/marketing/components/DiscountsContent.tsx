'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { useDiscount } from '@/marketing/contexts/DiscountContext';
import { Tag, Users, Percent, Gift, Check, X } from 'lucide-react';
import { useState } from 'react';
import PageLayout from './PageLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/marketing/components/ui/button';
import CTASection from '@/marketing/components/CTASection';

export default function DiscountsContent() {
  const { t } = useLanguage();
  const { selectedDiscount, availableDiscounts, applyDiscount, removeDiscount } = useDiscount();
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const handleApplyDiscount = useCallback(async (code: string) => {
    const success = await applyDiscount(code);
    if (success) {
      setShowSuccess(true);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [applyDiscount]);

  return (
    <PageLayout
      hero={{
        title: t('discounts.title') || "Descomptes Exclusius",
        subtitle: t('discounts.subtitle') || "Aprofita les nostres ofertes especials per cuidar-te millor.",
        badge: t('discounts.badge') || "Ofertes Especials",
        icon: <Tag className="w-4 h-4" />
      }}
    >
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl  flex items-center space-x-3"
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">{t('discounts.success') || "Descompte aplicat correctament!"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Discount Banner */}
      <AnimatePresence>
        {selectedDiscount && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-600 text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  {selectedDiscount.name} {t('discounts.active', { percentage: selectedDiscount.percentage })}
                </span>
              </div>
              <button
                onClick={removeDiscount}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                <span>{t('discounts.remove') || "Remove"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Discounts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
            {availableDiscounts.map((discount, index) => (
              <motion.div
                key={discount.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl p-8   transition duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Header */}
                <div className="relative flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-blue-600 transition-colors duration-300">
                    <Percent className="w-7 h-7" />
                  </div>
                  {discount.isActive && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      {t('discounts.activeBadge') || "Actiu"}
                    </span>
                  )}
                </div>

                <div className="relative mb-6">
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{discount.name}</h3>
                   <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold text-blue-600">{discount.percentage}%</span>
                      <span className="ml-2 text-gray-500 font-medium">{t('discounts.off') || "OFF"}</span>
                   </div>
                   <p className="text-gray-600 leading-relaxed text-sm">
                      {discount.description}
                   </p>
                </div>

                {/* Code & Action */}
                {discount.code && (
                    <div className="relative space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 border-dashed group-hover:border-blue-200 transition-colors">
                         <div className="flex items-center space-x-2 overflow-hidden">
                            <Gift className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <code className="text-sm font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded truncate">
                               {discount.code}
                            </code>
                         </div>
                         <button
                           onClick={() => navigator.clipboard.writeText(discount.code || '')}
                           className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors px-2 py-1"
                         >
                           {t('discounts.copy') || "Copia"}
                         </button>
                      </div>

                      {selectedDiscount?.code === discount.code ? (
                        <div className="w-full py-3 bg-green-50 text-green-700 font-medium rounded-xl text-center text-sm flex items-center justify-center gap-2 border border-green-100">
                          <Check className="w-4 h-4" />
                          {t('discounts.activeBadge') || "Descompte actiu"}
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleApplyDiscount(discount.code || '')}
                          variant="default"
                          className="w-full py-3 rounded-xl "
                        >
                          {t('discounts.apply') || "Aplicar descompte"}
                        </Button>
                      )}
                    </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16 max-w-3xl mx-auto">
               <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('discounts.howToUse.title') || "Com utilitzar els descomptes"}</h2>
               <p className="text-gray-600">{t('discounts.howToUse.subtitle') || "És molt fàcil, només has de seguir aquests passos."}</p>
             </div>

             <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  { icon: <Users />, title: t('discounts.step1.title') || "1. Tria el teu servei", desc: t('discounts.step1.description') || "Navega pels nostres serveis i tria el que més et convingui." },
                  { icon: <Tag />, title: t('discounts.step2.title') || "2. Aplica el codi", desc: t('discounts.step2.description') || "Introdueix el codi de descompte al moment de fer la reserva." },
                  { icon: <Percent />, title: t('discounts.step3.title') || "3. Gaudeix", desc: t('discounts.step3.description') || "Gaudeix del teu servei amb el preu reduït." }
                ].map((step, idx) => (
                  <div key={idx} className="text-center p-6">
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 ">
                        {React.cloneElement(step.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                     <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                ))}
             </div>
        </div>
      </section>

      <CTASection />
    </PageLayout>
  );
}
