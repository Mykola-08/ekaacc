'use client';

import { useState } from 'react';
import { X, MessageCircle, FileText, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { useAnalytics } from '@/hooks/marketing/useAnalytics';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-2xl dark:bg-card"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted dark:bg-card dark:hover:bg-muted"
        >
          <X className="h-5 w-5 text-muted-foreground dark:text-muted-foreground/40" />
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
                  <h2 className="text-2xl font-light text-foreground dark:text-foreground">
                    {t('booking.smart.title')}
                  </h2>
                  <p className="text-muted-foreground dark:text-muted-foreground/60">{t('booking.smart.subtitle')}</p>
                </div>

                <div className="grid gap-4">
                  <button
                    onClick={handleQuickWhatsApp}
                    className="group flex items-center rounded-2xl border-2 border-success bg-success/50 p-4 text-left transition-all hover:border-success hover:bg-success/90"
                  >
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/20 transition-transform group-hover:scale-110">
                      <MessageCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground dark:text-foreground">
                        {t('booking.smart.quick')}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground/60">
                        {t('booking.smart.quickDesc')}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setStep('form')}
                    className="group flex items-center rounded-2xl border-2 border-info bg-info/50 p-4 text-left transition-all hover:border-primary hover:bg-info"
                  >
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-info/20 transition-transform group-hover:scale-110">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground dark:text-foreground">
                        {t('booking.smart.form')}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground/60">
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
                    className="mr-4 rounded-full p-2 transition-colors hover:bg-muted dark:hover:bg-card"
                  >
                    <ArrowLeft className="h-5 w-5 text-muted-foreground dark:text-muted-foreground/40" />
                  </button>
                  <h2 className="text-xl font-medium text-foreground dark:text-foreground">
                    {t('booking.smart.form')}
                  </h2>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground dark:text-muted-foreground/40">
                      {t('booking.smart.name')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-border bg-muted px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-warning dark:border-border dark:bg-card"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground dark:text-muted-foreground/40">
                      {t('booking.smart.service')}
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full rounded-xl border border-border bg-muted px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-warning dark:border-border dark:bg-card"
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
                    <label className="mb-1 block text-sm font-medium text-foreground dark:text-muted-foreground/40">
                      {t('booking.smart.time')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('booking.smart.time.placeholder')}
                      value={formData.timePreference}
                      onChange={(e) => setFormData({ ...formData, timePreference: e.target.value })}
                      className="w-full rounded-xl border border-border bg-muted px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-warning dark:border-border dark:bg-card"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-xl bg-success py-4 font-medium text-success-foreground shadow-lg shadow-success/20 transition-all hover:scale-[1.02] hover:bg-success/90"
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

