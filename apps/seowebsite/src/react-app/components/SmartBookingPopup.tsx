'use client';

import { useState } from 'react';
import { X, MessageCircle, FileText, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { useAnalytics } from '@/react-app/hooks/useAnalytics';
import { motion, AnimatePresence } from 'framer-motion';

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

  if (!isOpen) return null;

  const handleQuickWhatsApp = () => {
    logEvent('booking_whatsapp_click', { type: 'quick' });
    const message = encodeURIComponent(`Hola Elena, me gustaría reservar una cita.`);
    window.open(`https://wa.me/34644506377?text=${message}`, '_blank');
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logEvent('booking_whatsapp_click', { 
        type: 'form',
        service: formData.service 
    });
    const message = encodeURIComponent(
      `Hola Elena, me gustaría reservar una cita.\n\n` +
      `Nombre: ${formData.name}\n` +
      `Servicio: ${formData.service}\n` +
      `Preferencia horaria: ${formData.timePreference}`
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
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground dark:text-gray-300" />
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
                  <h2 className="text-2xl font-light text-foreground dark:text-white">
                    {t('booking.smart.title')}
                  </h2>
                  <p className="text-muted-foreground dark:text-muted-foreground/80">
                    {t('booking.smart.subtitle')}
                  </p>
                </div>

                <div className="grid gap-4">
                  <button
                    onClick={handleQuickWhatsApp}
                    className="flex items-center p-4 rounded-2xl border-2 border-green-100 hover:border-green-500 bg-green-50/50 hover:bg-green-50 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground dark:text-gray-100">
                        {t('booking.smart.quick')}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                        {t('booking.smart.quickDesc')}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setStep('form')}
                    className="flex items-center p-4 rounded-2xl border-2 border-blue-100 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground dark:text-gray-100">
                        {t('booking.smart.form')}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">
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
                    className="mr-4 p-2 hover:bg-muted dark:hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground dark:text-gray-300" />
                  </button>
                  <h2 className="text-xl font-medium text-foreground dark:text-white">
                    {t('booking.smart.form')}
                  </h2>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground/90 dark:text-gray-300 mb-1">
                      {t('booking.smart.name')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-muted/30 dark:bg-zinc-800 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/90 dark:text-gray-300 mb-1">
                      {t('booking.smart.service')}
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-muted/30 dark:bg-zinc-800 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    >
                      <option value="">Select a service...</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/90 dark:text-gray-300 mb-1">
                      {t('booking.smart.time')}
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Mornings, Next week..."
                      value={formData.timePreference}
                      onChange={(e) => setFormData({ ...formData, timePreference: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-muted/30 dark:bg-zinc-800 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02] flex items-center justify-center"
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
    </div>
  );
}

