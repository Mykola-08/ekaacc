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

export default function SmartBookingPopup({ isOpen, onClose, preselectedService }: SmartBookingPopupProps) {
  const { t } = useLanguage();
  const { logEvent } = useAnalytics();
  const [step, setStep] = useState<'choice' | 'form'>('choice');
  const [formData, setFormData] = useState({
    name: '',
    service: preselectedService || '',
    timePreference: ''
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

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    logEvent('booking_whatsapp_click', { 
        type: 'form',
        service: formData.service 
    });
    const message = encodeURIComponent(
      t('booking.whatsapp.greetingGeneric') + '\n\n' +
      t('booking.whatsapp.name') + `: ${formData.name}\n` +
      t('booking.whatsapp.serviceLabel') + `: ${formData.service}\n` +
      t('booking.whatsapp.preference') + `: ${formData.timePreference}`
    );
    window.open(`https://wa.me/34644506377?text=${message}`, '_blank');
    onClose();
  }, [logEvent, t, formData, onClose]);

  const services = [
    t('booking.service.consultation'),
    t('services.massage.title'),
    t('services.kinesiology.title'),
    t('services.nutrition.title'),
    t('services.revision360.title'),
    t('technique.movement_lesson.title'),
    t('technique.jka.title'),
    t('technique.osteobalance.title'),
    t('booking.service.other')
  ];

  if (!isOpen) return null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return mounted && typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4" onClick={onClose} role="presentation">
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('booking.smart.title')}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl  max-w-lg w-full overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label={t('booking.smart.close') || 'Close'}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'choice' ? (
              <motion.div
                key="choice"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-light text-gray-900 dark:text-white">
                    {t('booking.smart.title')}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('booking.smart.subtitle')}
                  </p>
                </div>

                <div className="grid gap-4">
                  <button
                    onClick={handleQuickWhatsApp}
                    className="flex items-center p-4 rounded-2xl border-2 border-green-100 hover:border-green-500 bg-green-50/50 hover:bg-green-50 transition group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 transition-colors">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {t('booking.smart.quick')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('booking.smart.quickDesc')}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setStep('form')}
                    className="flex items-center p-4 rounded-2xl border-2 border-blue-100 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 transition group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 transition-colors">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {t('booking.smart.form')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
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
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <button 
                    onClick={() => setStep('choice')}
                    className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                    {t('booking.smart.form')}
                  </h2>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('booking.smart.name')}
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-amber-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="booking-service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('booking.smart.service')}
                    </label>
                    <select
                      id="booking-service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-amber-500 outline-none transition"
                    >
                      <option value="">{t('booking.smart.service.placeholder')}</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="booking-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('booking.smart.time')}
                    </label>
                    <input
                      id="booking-time"
                      type="text"
                      placeholder={t('booking.smart.time.placeholder')}
                      value={formData.timePreference}
                      onChange={(e) => setFormData({ ...formData, timePreference: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-amber-500 outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium   transition-colors flex items-center justify-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
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
  ) : null;
}

