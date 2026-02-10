'use client';

import { useState, useEffect } from 'react';
import { Calendar, MessageCircle, X } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { useAnalytics } from '@/hooks/marketing/useAnalytics';
import PageLayout from './PageLayout';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

interface FormData {
  name: string;
  service: string;
  objective: string;
  location: string;
  availability: string;
  timeSlot: string;
}

export default function BookingContent() {
  const { t } = useLanguage();
  const { logEvent } = useAnalytics();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    service: '',
    objective: '',
    location: '',
    availability: '',
    timeSlot: '',
  });

  const [services, setServices] = useState<string[]>([
    t('booking.options.service.massage'),
    t('booking.options.service.kinesiology'),
    t('booking.options.service.osteobalance'),
    t('booking.options.service.movementLesson'),
    t('booking.options.service.feldenkrais'),
    t('booking.options.service.online'),
    t('booking.options.service.other'),
  ]);

  const locations = [
    t('booking.options.location.barcelona'),
    t('booking.options.location.rubi'),
    t('booking.options.location.online'),
  ];

  const availabilityOptions = [
    t('booking.options.availability.tomorrow'),
    t('booking.options.availability.dayAfterTomorrow'),
    t('booking.options.availability.nextWeek'),
    t('booking.options.availability.weekend'),
    t('booking.options.availability.flexible'),
  ];

  const timeSlots = [
    t('booking.options.timeSlot.morning'),
    t('booking.options.timeSlot.noon'),
    t('booking.options.timeSlot.afternoon'),
    t('booking.options.timeSlot.evening'),
  ];

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateWhatsAppMessage = () => {
    const message = `${t('booking.whatsapp.greeting', { name: formData.name })}

${t('booking.whatsapp.service', { service: formData.service })}
${t('booking.whatsapp.comments', { comments: formData.objective })}
${t('booking.whatsapp.location', { location: formData.location })}
${t('booking.whatsapp.date', { date: formData.availability })}
${t('booking.whatsapp.time', { time: formData.timeSlot })}`;

    return encodeURIComponent(message);
  };

  const handleFormSubmit = () => {
    if (!formData.name || !formData.service) {
      alert(t('booking.form.validationError'));
      return;
    }
    logEvent('booking_page_submit', {
      service: formData.service,
      location: formData.location,
    });

    const whatsappUrl = `https://wa.me/34658867133?text=${generateWhatsAppMessage()}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const Hero = (
    <div className="relative overflow-hidden px-6 pt-32 pb-20">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-sm text-blue-600 shadow-sm backdrop-blur-sm">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">{t('booking.badge') || 'Reserves'}</span>
        </div>
        <h1 className="mb-6 text-5xl leading-tight font-light tracking-tight text-gray-900 md:text-7xl">
          {t('booking.hero.title') || 'Reserva la teva cita'}
        </h1>
        <p className="mb-8 text-xl leading-relaxed font-light text-gray-600 md:text-2xl">
          {t('booking.hero.subtitle') ||
            "Tria l'opció que et sigui més còmoda per començar el teu camí cap al benestar."}
        </p>
      </div>
    </div>
  );

  return (
    <PageLayout hero={Hero}>
      {/* Booking Options Section */}
      <section className="relative py-12">
        <div className="section-container">
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="btn rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-gray-900 hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="btn rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-gray-900 hover:bg-gray-50"
            >
              Open Dashboard
            </Link>
            <Link
              href="/bookings"
              className="btn rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-gray-900 hover:bg-gray-50"
            >
              My Bookings
            </Link>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Option 0: Integrated App Booking */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group flex min-h-100 cursor-pointer flex-col items-center justify-center rounded-[20px] border border-gray-100 bg-gray-50/50 p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[20px] bg-white text-marketing-accent shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Calendar className="h-10 w-10 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="heading-3 mb-3 text-2xl font-bold tracking-tight text-gray-900">
                In-App Booking Flow
              </h3>
              <p className="text-body mx-auto mb-8 max-w-xs leading-relaxed text-gray-600">
                Book directly in the platform and manage sessions from your dashboard.
              </p>
              <Link
                href="/book"
                onClick={() => logEvent('booking_page_app_flow_click')}
                className="btn inline-flex w-full items-center justify-center rounded-xl bg-primary py-4 font-bold tracking-wide text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-95"
              >
                Start Booking Flow
              </Link>
            </motion.div>

            {/* Option 1: Direct Contact */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group flex min-h-100 flex-col items-center justify-center rounded-[20px] border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[20px] bg-gray-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                <MessageCircle className="h-10 w-10" strokeWidth={1.5} />
              </div>
              <h3 className="heading-3 mb-3 text-2xl font-bold tracking-tight text-gray-900">
                {t('booking.direct.title')}
              </h3>
              <p className="text-body mx-auto mb-8 max-w-xs leading-relaxed text-gray-600">
                {t('booking.direct.description')}
              </p>
              <a
                href="https://wa.me/34658867133"
                onClick={() => logEvent('booking_page_whatsapp_click')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full rounded-xl border border-gray-200 bg-white py-4 font-bold tracking-wide text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-95"
              >
                {t('booking.direct.button')}
              </a>
            </motion.div>

            {/* Option 2: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group flex min-h-100 flex-col items-center justify-center rounded-[20px] border border-gray-100 bg-gray-50/50 p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[20px] bg-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Calendar className="h-10 w-10 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="heading-3 mb-3 text-2xl font-bold tracking-tight text-gray-900">
                {t('booking.form.title')}
              </h3>
              <p className="text-body mx-auto mb-8 max-w-xs leading-relaxed text-gray-600">
                {t('booking.form.description')}
              </p>
              <button
                onClick={() => {
                  logEvent('booking_page_toggle_form', { show: !showForm });
                  setShowForm(!showForm);
                }}
                className={`btn w-full rounded-xl py-4 font-bold tracking-wide shadow-lg transition-all active:scale-95 ${
                  showForm
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/30'
                }`}
              >
                {showForm ? t('booking.form.close') : t('booking.form.button')}
              </button>
            </motion.div>
          </div>

          {/* Quick Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative overflow-hidden rounded-[40px] border border-gray-100 bg-white p-8 shadow-2xl md:p-14"
              >
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="heading-3 text-2xl font-light text-gray-900">
                    {t('booking.form.quickTitle')}
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label={t('booking.form.close')}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="label-text">{t('booking.form.nameRequired')}</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="input-field"
                      placeholder={t('booking.form.namePlaceholder')}
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label className="label-text">{t('booking.form.serviceRequired')}</label>
                    <select
                      value={formData.service}
                      onChange={(e) => handleFormChange('service', e.target.value)}
                      className="input-field"
                    >
                      <option value="">{t('booking.form.servicePlaceholder')}</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="label-text">{t('booking.form.location')}</label>
                    <select
                      value={formData.location}
                      onChange={(e) => handleFormChange('location', e.target.value)}
                      className="input-field"
                    >
                      <option value="">{t('booking.form.locationPlaceholder')}</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="label-text">{t('booking.form.timeSlot')}</label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => handleFormChange('timeSlot', e.target.value)}
                      className="input-field"
                    >
                      <option value="">{t('booking.form.timeSlotPlaceholder')}</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Availability */}
                  <div className="md:col-span-2">
                    <label className="label-text">{t('booking.form.availability')}</label>
                    <select
                      value={formData.availability}
                      onChange={(e) => handleFormChange('availability', e.target.value)}
                      className="input-field"
                    >
                      <option value="">{t('booking.form.availabilityPlaceholder')}</option>
                      {availabilityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Objective */}
                  <div className="md:col-span-2">
                    <label className="label-text">{t('booking.form.objective')}</label>
                    <input
                      type="text"
                      value={formData.objective}
                      onChange={(e) => handleFormChange('objective', e.target.value)}
                      className="input-field"
                      placeholder={t('booking.form.objectivePlaceholder')}
                    />
                  </div>
                </div>

                <button
                  onClick={handleFormSubmit}
                  className="btn flex w-full items-center justify-center rounded-xl bg-green-600 px-6 py-4 font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:bg-green-700 hover:shadow-lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t('booking.form.submit')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Contact Info */}
      <section className="border-t border-gray-100 bg-white py-16">
        <div className="section-container text-center">
          <h3 className="heading-3 mb-8">{t('booking.help.title')}</h3>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="card p-8 hover:shadow-md">
              <h4 className="mb-4 font-medium text-gray-900">{t('booking.help.contactDirect')}</h4>
              <div className="text-body space-y-2">
                <p>{t('booking.help.email')}</p>
                <p>{t('booking.help.address')}</p>
              </div>
            </div>

            <div className="card p-8 hover:shadow-md">
              <h4 className="mb-4 font-medium text-gray-900">{t('booking.help.hours')}</h4>
              <div className="text-body space-y-2">
                <p>{t('booking.help.hours.weekdays')}</p>
                <p>{t('booking.help.hours.saturday')}</p>
                <p>{t('booking.help.hours.sunday')}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500">{t('booking.help.footer')}</p>
        </div>
      </section>
    </PageLayout>
  );
}
