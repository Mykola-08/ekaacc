'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { useAnalytics } from '@/marketing/hooks/useAnalytics';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Button } from '@/marketing/components/ui/button';
import { Input } from '@/marketing/components/ui/input';
import { Textarea } from '@/marketing/components/ui/textarea';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SentIcon,
  TelephoneIcon,
  Mail01Icon,
  Location01Icon,
  CheckmarkCircle01Icon,
  Loading03Icon,
  Clock01Icon,
  Message01Icon,
  UserIcon,
  Calendar03Icon,
  ShieldIcon,
  GlobeIcon,
  UserMultipleIcon,
  HelpCircleIcon,
  InstagramIcon,
} from '@hugeicons/core-free-icons';

// Zod Schema for Validation
const createContactSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t('contact.form.error.nameMin')),
    email: z.string().email(t('contact.form.error.emailInvalid')),
    phone: z.string().min(9, t('contact.form.error.phoneMin')),
    service: z.string().min(1, t('contact.form.service.placeholder')),
    message: z.string().min(10, t('contact.form.error.messageMin')),
    preferred_contact: z.enum(['email', 'phone', 'whatsapp']),
    preferred_time: z.string().optional(),
    source: z.string().optional(),
    privacy_policy: z.boolean().refine((val) => val === true, {
      message: t('contact.form.privacy'),
    }),
  });

type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

export default function ContactFormOptimized() {
  const { t } = useLanguage();
  const { logEvent } = useAnalytics();
  const schema = useMemo(() => createContactSchema(t), [t]);

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    preferred_contact: 'email',
    preferred_time: '',
    source: '',
    privacy_policy: false,
  });

  // Reset privacy policy to false initially to force user interaction if needed,
  // but for better UX often it's unchecked.
  useEffect(() => {
    setFormData((prev) => ({ ...prev, privacy_policy: false }));
  }, []);

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const services = [
    t('contact.service.massageBasic'),
    t('contact.service.massageComplete'),
    t('contact.service.massagePremium'),
    t('contact.service.kinesiology'),
    t('contact.service.nutrition'),
    t('contact.service.revision360'),
    t('contact.service.vip'),
    t('contact.service.other'),
  ];

  const timeSlots = [
    t('contact.time.morning'),
    t('contact.time.noon'),
    t('contact.time.afternoon'),
    t('contact.time.evening'),
    t('contact.time.any'),
  ];

  const sources = [
    { value: 'google', label: t('contact.form.source.google'), icon: GlobeIcon },
    { value: 'social', label: t('contact.form.source.social'), icon: InstagramIcon },
    { value: 'friend', label: t('contact.form.source.friend'), icon: UserMultipleIcon },
    { value: 'other', label: t('contact.form.source.other'), icon: HelpCircleIcon },
  ];

  const validateField = (name: keyof ContactFormData, value: unknown) => {
    try {
      const fieldSchema = schema.shape[name];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [name]: (error as z.ZodError<ContactFormData>).issues[0].message,
        }));
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    validateField(name as keyof ContactFormData, newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError('');

    const result = schema.safeParse(formData);

    if (!result.success) {
      const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          const key = err.path[0] as keyof ContactFormData;
          newErrors[key] = err.message;
        }
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      logEvent('contact_form_submit', {
        service: formData.service,
        source: formData.source,
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
          preferred_contact: 'email',
          preferred_time: '',
          source: '',
          privacy_policy: false,
        });
      } else {
        throw new Error('Error al enviar el formulari');
      }
    } catch (err) {
      setServerError(t('contact.error'));
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-2xl"
      >
        <div className="rounded-[var(--radius)] border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-12 text-green-600" />
          </motion.div>
          <h3 className="mb-4 text-3xl font-light text-gray-900">{t('contact.success.title')}</h3>
          <p className="mb-8 text-lg leading-relaxed text-gray-600">
            {t('contact.success.message')}
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            className="bg-green-600 text-white hover:-translate-y-0.5 hover:bg-green-700"
            size="lg"
          >
            {t('contact.success.button')}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Contact Information */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 text-4xl font-light text-gray-900">{t('contact.info.title')}</h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              {t('contact.info.subtitle')}
            </p>
          </motion.div>

          <div className="">
            {[
              {
                icon: TelephoneIcon,
                title: t('contact.info.phone'),
                content: '+34 658 867 133',
                link: 'tel:+34658867133',
                sub: t('contact.info.whatsapp'),
                color: 'blue',
              },
              {
                icon: Mail01Icon,
                title: t('contact.info.email'),
                content: 'contact@ekabalance.com',
                link: 'mailto:contact@ekabalance.com',
                sub: t('contact.info.response'),
                color: 'purple',
              },
              {
                icon: Location01Icon,
                title: t('contact.info.location'),
                content: 'Carrer Pelai, 12, 08001 Barcelona',
                sub: t('contact.info.metro'),
                color: 'green',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start rounded-[var(--radius)] border border-gray-100 bg-white p-6 transition-shadow duration-300"
              >
                <div
                  className={`h-12 w-12 bg-${item.color}-50 flex flex-shrink-0 items-center justify-center rounded-[var(--radius)]`}
                >
                  <HugeiconsIcon icon={item.icon} className={`h-6 w-6 text-${item.color}-600`} />
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-gray-900">{item.title}</h4>
                  <p className="mb-2 text-gray-600">
                    {item.link ? (
                      <a
                        href={item.link}
                        className={`hover:text-${item.color}-600 text-lg font-medium transition-colors`}
                      >
                        {item.content}
                      </a>
                    ) : (
                      <span className="text-lg">{item.content}</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-[var(--radius)] border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6"
          >
            <div className="flex items-start">
              <HugeiconsIcon
                icon={Clock01Icon}
                className="mt-1 size-6 flex-shrink-0 text-blue-600"
              />
              <div>
                <h4 className="mb-3 text-lg font-medium text-gray-900">
                  {t('contact.hours.title')}
                </h4>
                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('contact.hours.weekdays')}:</span>
                    <span className="rounded-[calc(var(--radius)*0.6)] bg-white px-2 py-1 font-medium text-gray-900">
                      9:00 - 20:00
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('contact.hours.saturday')}:</span>
                    <span className="rounded-[calc(var(--radius)*0.6)] bg-white px-2 py-1 font-medium text-gray-900">
                      9:00 - 18:00
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('contact.hours.sunday')}:</span>
                    <span className="rounded-[calc(var(--radius)*0.6)] bg-white px-2 py-1 font-medium text-gray-900">
                      10:00 - 16:00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden rounded-[var(--radius)] border border-gray-200 bg-white"
          >
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="">
                <div>
                  <h3 className="mb-2 text-3xl font-light text-gray-900">
                    {t('contact.form.title')}
                  </h3>
                  <p className="text-gray-500">{t('contact.form.message.placeholder')}</p>
                </div>

                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center rounded-[var(--radius)] border border-red-200 bg-red-50 p-4"
                  >
                    <HugeiconsIcon icon={ShieldIcon} className="mr-3 size-5 text-red-500" />
                    <p className="text-sm text-red-600">{serverError}</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.name')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={UserIcon}
                        className="absolute top-3.5 left-4 size-5 text-gray-400"
                      />
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`pr-4 pl-12 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder={t('contact.form.namePlaceholder')}
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div className="">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.email')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={Mail01Icon}
                        className="absolute top-3.5 left-4 size-5 text-gray-400"
                      />
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pr-4 pl-12 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder={t('contact.form.emailPlaceholder')}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.phone')}
                    </label>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={TelephoneIcon}
                        className="absolute top-3.5 left-4 size-5 text-gray-400"
                      />
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`pr-4 pl-12 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder="+34 123 456 789"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  <div className="">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.service')}
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`w-full appearance-none rounded-[var(--radius)] border px-4 py-3 transition duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${errors.service ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      >
                        <option value="">{t('contact.form.service.placeholder')}</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute top-3.5 right-4">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    {errors.service && (
                      <p className="mt-1 text-xs text-red-500">{errors.service}</p>
                    )}
                  </div>
                </div>

                <div className="">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    {t('contact.form.message')} <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder={t('contact.form.message.placeholder')}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('contact.form.preferred')}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'email', label: 'Email', icon: Mail01Icon },
                        { value: 'phone', label: t('contact.form.phone'), icon: TelephoneIcon },
                        { value: 'whatsapp', label: 'WhatsApp', icon: Message01Icon },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius)] border p-3 transition duration-200 ${
                            formData.preferred_contact === option.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="preferred_contact"
                            value={option.value}
                            checked={formData.preferred_contact === option.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <HugeiconsIcon
                            icon={option.icon}
                            className={`mb-1 h-5 w-5 ${formData.preferred_contact === option.value ? 'text-blue-600' : 'text-gray-500'}`}
                          />
                          <span className="text-xs font-medium">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="">
                    <label
                      htmlFor="preferred_time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('contact.form.preferredTime')}
                    </label>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        className="absolute top-3.5 left-4 size-5 text-gray-400"
                      />
                      <select
                        id="preferred_time"
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-[var(--radius)] border border-gray-200 py-3 pr-4 pl-12 transition duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t('contact.form.selectTime')}</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute top-3.5 right-4">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="">
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                    {t('contact.form.source')}
                  </label>
                  <div className="relative">
                    <select
                      id="source"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-[var(--radius)] border border-gray-200 px-4 py-3 transition duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t('contact.form.source.placeholder')}</option>
                      {sources.map((source) => (
                        <option key={source.value} value={source.value}>
                          {source.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute top-3.5 right-4">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="">
                  <label className="flex cursor-pointer items-start">
                    <input
                      type="checkbox"
                      name="privacy_policy"
                      checked={formData.privacy_policy}
                      onChange={handleChange}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      {t('contact.form.privacy')} <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.privacy_policy && (
                    <p className="ml-8 text-xs text-red-500">{errors.privacy_policy}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full hover:-translate-y-0.5"
                  variant="default"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <HugeiconsIcon icon={Loading03Icon} className="mr-2 size-5 animate-spin" />
                      {t('contact.form.submitting')}
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={SentIcon} className="mr-2 size-5" />
                      {t('contact.form.submit')}
                    </>
                  )}
                </Button>
              </form>

              {/* Quick Contact */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <p className="mb-4 text-center text-sm text-gray-600">{t('contact.quick.title')}</p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <a
                    href="https://wa.me/34658867133"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-[calc(var(--radius)*0.8)] bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-700"
                  >
                    <HugeiconsIcon icon={Message01Icon} className="mr-2 size-4" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+34658867133"
                    className="inline-flex items-center justify-center rounded-[calc(var(--radius)*0.8)] bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
                  >
                    <HugeiconsIcon icon={TelephoneIcon} className="mr-2 size-4" />
                    {t('contact.quick.call')}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
