'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, MessageCircle, FileText, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { useAnalytics } from '@/marketing/hooks/useAnalytics';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useScrollLock } from '@/marketing/hooks/useScrollLock';

interface SmartBookingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export default function SmartBookingPopup({
  isOpen,
  onClose,
  preselectedService,
}: SmartBookingPopupProps) {
  const { t } = useLanguage();
  const { logEvent } = useAnalytics();
  const [step, setStep] = useState<'choice' | 'form'>('choice');
  const [formData, setFormData] = useState({
    name: '',
    service: preselectedService || '',
    timePreference: '',
  });
  const dialogRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);

  // Keyboard escape handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    firstEl.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    dialog.addEventListener('keydown', handleTab);
    return () => dialog.removeEventListener('keydown', handleTab);
  }, [isOpen, step]);

  const handleQuickWhatsApp = useCallback(() => {
    logEvent('booking_whatsapp_click', { type: 'quick' });
    const message = encodeURIComponent(t('booking.whatsapp.greetingGeneric'));
    window.open(`https://wa.me/34644506377?text=${message}`, '_blank');
    onClose();
  }, [logEvent, t, onClose]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      logEvent('booking_whatsapp_click', {
        type: 'form',
        service: formData.service,
      });
      const message = encodeURIComponent(
        t('booking.whatsapp.greetingGeneric') +
          '\n\n' +
          t('booking.whatsapp.name') +
          `: ${formData.name}\n` +
          t('booking.whatsapp.serviceLabel') +
          `: ${formData.service}\n` +
          t('booking.whatsapp.preference') +
          `: ${formData.timePreference}`
      );
      window.open(`https://wa.me/34644506377?text=${message}`, '_blank');
      onClose();
    },
    [logEvent, t, formData, onClose]
  );

  const services = [
    t('booking.service.consultation'),
    t('services.massage.title'),
    t('services.kinesiology.title'),
    t('services.nutrition.title'),
    t('services.revision360.title'),
    t('technique.movement_lesson.title'),
    t('technique.jka.title'),
    t('technique.osteobalance.title'),
    t('booking.service.other'),
  ];

  if (!isOpen) return null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return mounted && typeof document !== 'undefined'
    ? createPortal(
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          role="presentation"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('booking.smart.title')}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-zinc-900"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label={t('booking.smart.close') || 'Close'}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100/80 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="p-4 sm:p-5">
              <AnimatePresence mode="wait">
                {step === 'choice' ? (
                  <motion.div
                    key="choice"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1 pt-1 text-center">
                      <h2 className="text-lg leading-tight font-medium tracking-tight text-gray-900 dark:text-white">
                        {t('booking.smart.title')}
                      </h2>
                      <p className="text-xs leading-tight text-gray-500 dark:text-gray-400">
                        {t('booking.smart.subtitle')}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <button
                        onClick={handleQuickWhatsApp}
                        className="group flex items-center rounded-xl border border-green-100/80 bg-green-50/30 p-2.5 text-left transition hover:border-green-300 hover:bg-green-50"
                      >
                        <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100/80 transition-colors">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            {t('booking.smart.quick')}
                          </h3>
                          <p className="mt-0.5 text-[10px] text-gray-500/80 dark:text-gray-400">
                            {t('booking.smart.quickDesc')}
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => setStep('form')}
                        className="group flex items-center rounded-xl border border-blue-100/80 bg-blue-50/30 p-2.5 text-left transition hover:border-blue-300 hover:bg-blue-50"
                      >
                        <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100/80 transition-colors">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            {t('booking.smart.form')}
                          </h3>
                          <p className="mt-0.5 text-[10px] text-gray-500/80 dark:text-gray-400">
                            {t('booking.smart.formDesc')}
                          </p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="mb-1 flex items-center">
                      <button
                        onClick={() => setStep('choice')}
                        className="mr-2 rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
                      >
                        <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <h2 className="text-base leading-tight font-medium tracking-tight text-gray-900 dark:text-white">
                        {t('booking.smart.form')}
                      </h2>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-2">
                      <div>
                        <label
                          htmlFor="booking-name"
                          className="mb-0.5 ml-1 block text-[11px] font-medium text-gray-600 dark:text-gray-300"
                        >
                          {t('booking.smart.name')}
                        </label>
                        <input
                          id="booking-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs transition outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="booking-service"
                          className="mb-0.5 ml-1 block text-[11px] font-medium text-gray-600 dark:text-gray-300"
                        >
                          {t('booking.smart.service')}
                        </label>
                        <select
                          id="booking-service"
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs transition outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800"
                        >
                          <option value="">{t('booking.smart.service.placeholder')}</option>
                          {services.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="booking-time"
                          className="mb-0.5 ml-1 block text-[11px] font-medium text-gray-600 dark:text-gray-300"
                        >
                          {t('booking.smart.time')}
                        </label>
                        <input
                          id="booking-time"
                          type="text"
                          placeholder={t('booking.smart.time.placeholder')}
                          value={formData.timePreference}
                          onChange={(e) =>
                            setFormData({ ...formData, timePreference: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs transition outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800"
                        />
                      </div>

                      <button
                        type="submit"
                        className="mt-1 flex w-full items-center justify-center rounded-lg bg-green-600 py-2.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                      >
                        <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                        {t('booking.smart.send')}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>,
        document.body
      )
    : null;
}
