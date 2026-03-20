'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { useDiscount } from '@/marketing/contexts/DiscountContext';

import { useState } from 'react';
import PageLayout from './PageLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/marketing/components/ui/button';
import CTASection from '@/marketing/components/CTASection';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tag01Icon, UserMultipleIcon, PercentSquareIcon, GiftIcon, Tick02Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

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

  const handleApplyDiscount = useCallback(
    async (code: string) => {
      const success = await applyDiscount(code);
      if (success) {
        setShowSuccess(true);
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => setShowSuccess(false), 3000);
      }
    },
    [applyDiscount]
  );

  return (
    <PageLayout
      hero={{
        title: t('discounts.title'),
        subtitle:
          t('discounts.subtitle'),
        badge: t('discounts.badge'),
        icon: <HugeiconsIcon icon={Tag01Icon} className="size-4"  />,
      }}
    >
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-4 z-50 flex items-center rounded-[var(--radius)] bg-green-500 px-6 py-4 text-white"
          >
            <HugeiconsIcon icon={Tick02Icon} className="size-5"  />
            <span className="font-medium">
              {t('discounts.success')}
            </span>
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
            className="overflow-hidden bg-green-600 text-white"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
              <div className="flex items-center">
                <HugeiconsIcon icon={Tick02Icon} className="size-5"  />
                <span className="font-medium">
                  {selectedDiscount.name}{' '}
                  {t('discounts.active', { percentage: selectedDiscount.percentage })}
                </span>
              </div>
              <button
                onClick={removeDiscount}
                className="flex items-center rounded-full bg-white/20 px-3 py-1.5 text-sm transition-colors hover:bg-white/30"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-4"  />
                <span>{t('discounts.remove')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Discounts Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-12">
            {availableDiscounts.map((discount, index) => (
              <motion.div
                key={discount.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-[var(--radius)] border border-gray-100 bg-white p-8 transition duration-300"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Header */}
                <div className="relative mb-6 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 transition-colors duration-300">
                    <HugeiconsIcon icon={PercentSquareIcon} className="size-7"  />
                  </div>
                  {discount.isActive && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold tracking-wide text-green-700 uppercase">
                      {t('discounts.activeBadge')}
                    </span>
                  )}
                </div>

                <div className="relative mb-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{discount.name}</h3>
                  <div className="mb-4 flex items-baseline">
                    <span className="text-4xl font-bold text-blue-600">{discount.percentage}%</span>
                    <span className="ml-2 font-medium text-gray-500">
                      {t('discounts.off')}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{discount.description}</p>
                </div>

                {/* Code & Action */}
                {discount.code && (
                  <div className="relative">
                    <div className="flex items-center justify-between rounded-[var(--radius)] border border-dashed border-gray-200 bg-gray-50 p-3 transition-colors group-hover:border-blue-200">
                      <div className="flex items-center overflow-hidden">
                        <HugeiconsIcon icon={GiftIcon} className="size-4 flex-shrink-0 text-blue-500"  />
                        <code className="truncate rounded bg-blue-50 px-2 py-0.5 text-sm font-bold text-blue-700">
                          {discount.code}
                        </code>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(discount.code || '')}
                        className="px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:text-blue-600"
                      >
                        {t('discounts.copy')}
                      </button>
                    </div>

                    {selectedDiscount?.code === discount.code ? (
                      <div className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-green-100 bg-green-50 py-3 text-center text-sm font-medium text-green-700">
                        <HugeiconsIcon icon={Tick02Icon} className="size-4"  />
                        {t('discounts.activeBadge')}
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleApplyDiscount(discount.code || '')}
                        variant="default"
                        className="w-full rounded-[var(--radius)] py-3"
                      >
                        {t('discounts.apply')}
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
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              {t('discounts.howToUse.title')}
            </h2>
            <p className="text-gray-600">
              {t('discounts.howToUse.subtitle')}
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                icon: <HugeiconsIcon icon={UserMultipleIcon}  />,
                title: t('discounts.step1.title'),
                desc:
                  t('discounts.step1.description'),
              },
              {
                icon: <HugeiconsIcon icon={Tag01Icon}  />,
                title: t('discounts.step2.title'),
                desc:
                  t('discounts.step2.description'),
              },
              {
                icon: <HugeiconsIcon icon={PercentSquareIcon}  />,
                title: t('discounts.step3.title'),
                desc:
                  t('discounts.step3.description'),
              },
            ].map((step, idx) => (
              <div key={idx} className="p-6 text-center">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-blue-50 text-blue-600">
                  {React.cloneElement(step.icon as React.ReactElement<{ className?: string }>, {
                    className: 'w-6 h-6',
                  })}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </PageLayout>
  );
}
