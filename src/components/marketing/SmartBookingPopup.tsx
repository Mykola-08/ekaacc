'use client';

import { useState } from 'react';
import { X, MessageCircle, FileText, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { useAnalytics } from '@/hooks/marketing/useAnalytics';
import { motion, AnimatePresence } from 'framer-motion';

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

  if (!isOpen) return null;

  const handleQuickWhatsApp = () => {
    logEvent('booking_whatsapp_click', { type: 'quick' });
    const message = encodeURIComponent(t('booking.whatsapp.greetingGeneric'));
    window.open(`https://wa.me/34644506377?text=${message}`, '_blank');
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
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
  };

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg overflow-hidden rounded-[20px] bg-white shadow-2xl dark:bg-zinc-900"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
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
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-light text-gray-900 dark:text-white">
                    {t('booking.smart.title')}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">{t('booking.smart.subtitle')}</p>
                </div>

                <div className="grid gap-4">
                  <button
                    onClick={handleQuickWhatsApp}
                    className="group flex items-center rounded-[20px] border-2 border-green-100 bg-green-50/50 p-4 text-left transition-all hover:border-green-500 hover:bg-green-50"
                  >
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 transition-transform group-hover:scale-110">
                      <MessageCircle className="h-6 w-6 text-green-600" />
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
                    className="group flex items-center rounded-[20px] border-2 border-blue-100 bg-blue-50/50 p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50"
                  >
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-transform group-hover:scale-110">
                      <FileText className="h-6 w-6 text-blue-600" />
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
                <div className="mb-6 flex items-center">
                  <button
                    onClick={() => setStep('choice')}
                    className="mr-4 rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                    {t('booking.smart.form')}
                  </h2>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('booking.smart.name')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('booking.smart.service')}
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800"
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
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('booking.smart.time')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('booking.smart.time.placeholder')}
                      value={formData.timePreference}
                      onChange={(e) => setFormData({ ...formData, timePreference: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-xl bg-green-600 py-4 font-medium text-white shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02] hover:bg-green-700"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t('booking.smart.send')}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
