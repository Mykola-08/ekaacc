"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle, Loader2, Clock, MessageCircle, User, Calendar, HelpCircle, Shield, Globe, Instagram, Users } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { useAnalytics } from '@/marketing/hooks/useAnalytics';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Button } from '@/marketing/components/ui/button';

// Zod Schema for Validation
const createContactSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, t('contact.form.name') + " is too short"),
  email: z.string().email(t('contact.form.email') + " is invalid"),
  phone: z.string().min(9, t('contact.form.phone') + " is too short"),
  service: z.string().min(1, t('contact.form.service.placeholder')),
  message: z.string().min(10, t('contact.form.message') + " is too short"),
  preferred_contact: z.enum(['email', 'phone', 'whatsapp']),
  preferred_time: z.string().optional(),
  source: z.string().optional(),
  privacy_policy: z.boolean().refine(val => val === true, {
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
    privacy_policy: false
  });

  // Reset privacy policy to false initially to force user interaction if needed,
  // but for better UX often it's unchecked.
  useEffect(() => {
    setFormData(prev => ({ ...prev, privacy_policy: false }));
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
    t('contact.service.other')
  ];

  const timeSlots = [
    t('contact.time.morning'),
    t('contact.time.noon'),
    t('contact.time.afternoon'),
    t('contact.time.evening'),
    t('contact.time.any')
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
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: (error as z.ZodError<ContactFormData>).issues[0].message }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
    validateField(name as keyof ContactFormData, newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError('');

    const result = schema.safeParse(formData);

    if (!result.success) {
      const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach(err => {
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
            source: formData.source
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
          privacy_policy: false
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
        className="max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 text-center border border-green-100 ">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <h3 className="text-3xl font-light text-gray-900 mb-4">
            {t('contact.success.title')}
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            {t('contact.success.message')}
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            className="bg-green-600 hover:bg-green-700 text-white   hover:-translate-y-0.5"
            size="lg"
          >
            {t('contact.success.button')}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Contact Information */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              {t('contact.info.title')}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              {t('contact.info.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              { icon: Phone, title: t('contact.info.phone'), content: "+34 658 867 133", link: "tel:+34658867133", sub: t('contact.info.whatsapp'), color: "blue" },
              { icon: Mail, title: t('contact.info.email'), content: "contact@ekabalance.com", link: "mailto:contact@ekabalance.com", sub: t('contact.info.response'), color: "purple" },
              { icon: MapPin, title: t('contact.info.location'), content: "Carrer Pelai, 12, 08001 Barcelona", sub: t('contact.info.metro'), color: "green" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-6 bg-white rounded-2xl  border border-gray-100  transition-shadow duration-300"
              >
                <div className={`w-12 h-12 bg-${item.color}-50 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-gray-600 mb-2">
                    {item.link ? (
                      <a href={item.link} className={`hover:text-${item.color}-600 transition-colors text-lg font-medium`}>
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
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
          >
            <div className="flex items-start space-x-3">
              <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-lg">{t('contact.hours.title')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('contact.hours.weekdays')}:</span>
                    <span className="font-medium text-gray-900 bg-white px-2 py-1 rounded-md ">9:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('contact.hours.saturday')}:</span>
                    <span className="font-medium text-gray-900 bg-white px-2 py-1 rounded-md ">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('contact.hours.sunday')}:</span>
                    <span className="font-medium text-gray-900 bg-white px-2 py-1 rounded-md ">10:00 - 16:00</span>
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
            className="bg-white rounded-3xl border border-gray-200  overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-3xl font-light text-gray-900 mb-2">
                    {t('contact.form.title')}
                  </h3>
                  <p className="text-gray-500">
                    {t('contact.form.message.placeholder')}
                  </p>
                </div>

                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center"
                  >
                    <Shield className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-600 text-sm">{serverError}</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.name')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder={t('contact.form.namePlaceholder')}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.email')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder={t('contact.form.emailPlaceholder')}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder="+34 123 456 789"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.service')}
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none ${errors.service ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      >
                        <option value="">{t('contact.form.service.placeholder')}</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-3.5 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                    {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    {t('contact.form.message')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder={t('contact.form.message.placeholder')}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('contact.form.preferred')}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'email', label: 'Email', icon: Mail },
                        { value: 'phone', label: t('contact.form.phone'), icon: Phone },
                        { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle }
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition duration-200 ${
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
                          <option.icon className={`w-5 h-5 mb-1 ${formData.preferred_contact === option.value ? 'text-blue-600' : 'text-gray-500'}`} />
                          <span className="text-xs font-medium">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="preferred_time" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.preferredTime')}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <select
                        id="preferred_time"
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none"
                      >
                        <option value="">{t('contact.form.selectTime')}</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-3.5 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                    {t('contact.form.source')}
                  </label>
                  <div className="relative">
                    <select
                      id="source"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none"
                    >
                      <option value="">{t('contact.form.source.placeholder')}</option>
                      {sources.map((source) => (
                        <option key={source.value} value={source.value}>
                          {source.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-3.5 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="privacy_policy"
                      checked={formData.privacy_policy}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      {t('contact.form.privacy')} <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.privacy_policy && <p className="text-red-500 text-xs ml-8">{errors.privacy_policy}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full   hover:-translate-y-0.5"
                  variant="default"
                  size="xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {t('contact.form.submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t('contact.form.submit')}
                    </>
                  )}
                </Button>
              </form>

              {/* Quick Contact */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-center text-gray-600 mb-4 text-sm">
                  {t('contact.quick.title')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://wa.me/34658867133"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 text-sm  "
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+34658867133"
                    className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200 text-sm  "
                  >
                    <Phone className="w-4 h-4 mr-2" />
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
