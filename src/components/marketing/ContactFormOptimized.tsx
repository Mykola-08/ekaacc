'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Send,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Loader2,
  Clock,
  MessageCircle,
  User,
  Calendar,
  HelpCircle,
  Shield,
  Globe,
  Instagram,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
// import { supabase } from '@/lib/marketing/supabase';
import { useAnalytics } from '@/hooks/marketing/useAnalytics';
import { motion } from 'motion/react';
import { z } from 'zod';

// Zod Schema for Validation
const createContactSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t('contact.form.name') + ' is too short'),
    email: z.string().email(t('contact.form.email') + ' is invalid'),
    phone: z.string().min(9, t('contact.form.phone') + ' is too short'),
    service: z.string().min(1, t('contact.form.service.placeholder')),
    message: z.string().min(10, t('contact.form.message') + ' is too short'),
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
  // const { user } = useSupabaseAuth();
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

  //   useEffect(() => {
  //     if (user) {
  //       const fetchProfile = async () => {
  //         const { data } = await supabase
  //           .from('user_profiles')
  //           .select('full_name, email, phone')
  //           .eq('user_id', user.id)
  //           .single();

  //         if (data) {
  //           setFormData(prev => ({
  //             ...prev,
  //             name: data.full_name || prev.name,
  //             email: data.email || user.email || prev.email,
  //             phone: data.phone || prev.phone
  //           }));
  //         } else if (user.email) {
  //           setFormData(prev => ({
  //             ...prev,
  //             email: user.email || prev.email
  //           }));
  //         }
  //       };
  //       fetchProfile();
  //     }
  //   }, [user]);

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
    { value: 'google', label: t('contact.form.source.google'), icon: Globe },
    { value: 'social', label: t('contact.form.source.social'), icon: Instagram },
    { value: 'friend', label: t('contact.form.source.friend'), icon: Users },
    { value: 'other', label: t('contact.form.source.other'), icon: HelpCircle },
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
        <div className="rounded-[20px] border border-success bg-linear-to-br from-success/10 to-success/10 p-12 text-center shadow-lg">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-success/20"
          >
            <CheckCircle className="h-12 w-12 text-success" />
          </motion.div>
          <h3 className="mb-4 text-3xl font-light text-foreground">{t('contact.success.title')}</h3>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            {t('contact.success.message')}
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex transform items-center rounded-xl bg-success px-8 py-3 font-medium text-white shadow-md transition-colors duration-200 hover:-translate-y-0.5 hover:bg-success/90 hover:shadow-lg"
          >
            {t('contact.success.button')}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Contact Information */}
        <div className="space-y-8 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 text-4xl font-light text-foreground">{t('contact.info.title')}</h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {t('contact.info.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                icon: Phone,
                title: t('contact.info.phone'),
                content: '658 867 133',
                link: 'tel:+34658867133',
                sub: t('contact.info.whatsapp'),
                color: 'blue',
              },
              {
                icon: Mail,
                title: t('contact.info.email'),
                content: 'contact@ekabalance.com',
                link: 'mailto:contact@ekabalance.com',
                sub: t('contact.info.response'),
                color: 'purple',
              },
              {
                icon: MapPin,
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
                className="flex items-start space-x-4 rounded-[20px] border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div
                  className={`h-12 w-12 bg-${item.color}-50 flex shrink-0 items-center justify-center rounded-xl`}
                >
                  <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-foreground">{item.title}</h4>
                  <p className="mb-2 text-muted-foreground">
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
                  <p className="text-sm text-muted-foreground">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-[20px] border border-info bg-linear-to-r from-info/10 to-accent/10 p-6"
          >
            <div className="flex items-start space-x-3">
              <Clock className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h4 className="mb-3 text-lg font-medium text-foreground">
                  {t('contact.hours.title')}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('contact.hours.weekdays')}:</span>
                    <span className="rounded-md bg-card px-2 py-1 font-medium text-foreground shadow-sm">
                      9:00 - 20:00
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('contact.hours.saturday')}:</span>
                    <span className="rounded-md bg-card px-2 py-1 font-medium text-foreground shadow-sm">
                      9:00 - 18:00
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('contact.hours.sunday')}:</span>
                    <span className="rounded-md bg-card px-2 py-1 font-medium text-foreground shadow-sm">
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
            className="overflow-hidden rounded-[20px] border border-border bg-card shadow-lg"
          >
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="mb-2 text-3xl font-light text-foreground">
                    {t('contact.form.title')}
                  </h3>
                  <p className="text-muted-foreground">{t('contact.form.message.placeholder')}</p>
                </div>

                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center rounded-xl border border-destructive/30 bg-destructive/10 p-4"
                  >
                    <Shield className="mr-3 h-5 w-5 text-destructive" />
                    <p className="text-sm text-destructive">{serverError}</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                      {t('contact.form.name')} <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute top-3.5 left-4 h-5 w-5 text-muted-foreground/60" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full rounded-xl border py-3 pr-4 pl-12 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-primary ${errors.name ? 'border-destructive/40 bg-destructive/10' : 'border-border'}`}
                        placeholder={t('contact.form.namePlaceholder')}
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                      {t('contact.form.email')} <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute top-3.5 left-4 h-5 w-5 text-muted-foreground/60" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full rounded-xl border py-3 pr-4 pl-12 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-primary ${errors.email ? 'border-destructive/40 bg-destructive/10' : 'border-border'}`}
                        placeholder={t('contact.form.emailPlaceholder')}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                      {t('contact.form.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute top-3.5 left-4 h-5 w-5 text-muted-foreground/60" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full rounded-xl border py-3 pr-4 pl-12 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-primary ${errors.phone ? 'border-destructive/40 bg-destructive/10' : 'border-border'}`}
                        placeholder="+34 123 456 789"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="service" className="block text-sm font-medium text-foreground">
                      {t('contact.form.service')}
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`w-full appearance-none rounded-xl border px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-primary ${errors.service ? 'border-destructive/40 bg-destructive/10' : 'border-border'}`}
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
                          className="h-5 w-5 text-muted-foreground/60"
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
                      <p className="mt-1 text-xs text-destructive">{errors.service}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-foreground">
                    {t('contact.form.message')} <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full resize-none rounded-xl border px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-primary ${errors.message ? 'border-destructive/40 bg-destructive/10' : 'border-border'}`}
                    placeholder={t('contact.form.message.placeholder')}
                  />
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-foreground">
                      {t('contact.form.preferred')}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'email', label: 'Email', icon: Mail },
                        { value: 'phone', label: t('contact.form.phone'), icon: Phone },
                        { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200 ${
                            formData.preferred_contact === option.value
                              ? 'border-primary bg-info text-info-foreground'
                              : 'border-border hover:border-info hover:bg-muted'
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
                          <option.icon
                            className={`mb-1 h-5 w-5 ${formData.preferred_contact === option.value ? 'text-primary' : 'text-muted-foreground'}`}
                          />
                          <span className="text-xs font-medium">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="preferred_time"
                      className="block text-sm font-medium text-foreground"
                    >
                      {t('contact.form.preferredTime')}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute top-3.5 left-4 h-5 w-5 text-muted-foreground/60" />
                      <select
                        id="preferred_time"
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-xl border border-border py-3 pr-4 pl-12 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-primary"
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
                          className="h-5 w-5 text-muted-foreground/60"
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

                <div className="space-y-2">
                  <label htmlFor="source" className="block text-sm font-medium text-foreground">
                    {t('contact.form.source')}
                  </label>
                  <div className="relative">
                    <select
                      id="source"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-border px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-primary"
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
                        className="h-5 w-5 text-muted-foreground/60"
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

                <div className="space-y-2">
                  <label className="flex cursor-pointer items-start space-x-3">
                    <input
                      type="checkbox"
                      name="privacy_policy"
                      checked={formData.privacy_policy}
                      onChange={handleChange}
                      className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      {t('contact.form.privacy')} <span className="text-destructive">*</span>
                    </span>
                  </label>
                  {errors.privacy_policy && (
                    <p className="ml-8 text-xs text-destructive">{errors.privacy_policy}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full transform items-center justify-center rounded-[20px] bg-primary px-6 py-4 font-medium text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('contact.form.submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      {t('contact.form.submit')}
                    </>
                  )}
                </button>
              </form>

              {/* Quick Contact */}
              <div className="mt-8 border-t border-border pt-8">
                <p className="mb-4 text-center text-sm text-muted-foreground">{t('contact.quick.title')}</p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <a
                    href="https://wa.me/34658867133"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-success px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-success/90 hover:shadow-md"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+34658867133"
                    className="inline-flex items-center justify-center rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors duration-200 hover:bg-muted hover:shadow-md"
                  >
                    <Phone className="mr-2 h-4 w-4" />
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
