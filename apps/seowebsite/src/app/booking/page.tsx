'use client';

import { useState, useEffect } from 'react';
import { Calendar, MessageCircle, X } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { useAnalytics } from '@/react-app/hooks/useAnalytics';
// import { useSupabaseAuth } from '@/react-app/contexts/SupabaseAuthContext';
// import { supabase } from '@/react-app/lib/supabase';

interface FormData {
  name: string;
  service: string;
  objective: string;
  location: string;
  availability: string;
  timeSlot: string;
}

export default function BookingPage() {
  const { t } = useLanguage();
  // const { user } = useSupabaseAuth();
  const user = null;
  const { logEvent } = useAnalytics();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    service: '',
    objective: '',
    location: '',
    availability: '',
    timeSlot: ''
  });

  /*
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .single();
        
        if (data?.full_name) {
          setFormData(prev => ({ ...prev, name: data.full_name }));
        } else if (user.email) {
          // Fallback to email username if no profile name
          setFormData(prev => ({ ...prev, name: user.email!.split('@')[0] }));
        }
      };
      fetchProfile();
    }
  }, [user]);
  */

  const services = [
    t('booking.options.service.massage'),
    t('booking.options.service.kinesiology'),
    t('booking.options.service.osteobalance'),
    t('booking.options.service.movementLesson'),
    t('booking.options.service.feldenkrais'),
    t('booking.options.service.online'),
    t('booking.options.service.other')
  ];

  const locations = [
    t('booking.options.location.barcelona'),
    t('booking.options.location.rubi'),
    t('booking.options.location.online')
  ];

  const availabilityOptions = [
    t('booking.options.availability.tomorrow'),
    t('booking.options.availability.dayAfterTomorrow'),
    t('booking.options.availability.nextWeek'),
    t('booking.options.availability.weekend'),
    t('booking.options.availability.flexible')
  ];

  const timeSlots = [
    t('booking.options.timeSlot.morning'),
    t('booking.options.timeSlot.noon'),
    t('booking.options.timeSlot.afternoon'),
    t('booking.options.timeSlot.evening')
  ];

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        location: formData.location
    });

    
    const whatsappUrl = `https://wa.me/34658867133?text=${generateWhatsAppMessage()}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Hero Section - Unified Design */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 shadow-sm mb-8 animate-fade-in-up">
            <Calendar className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-900 tracking-wide uppercase">{t('booking.badge')}</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-light tracking-tight text-gray-900 mb-8 drop-shadow-sm animate-fade-in-up delay-100">
            {t('booking.hero.title')?.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
              {t('booking.hero.title')?.split(' ').slice(-1)[0]}
            </span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up delay-200">
            {t('booking.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Booking Options Section */}
      <section className="py-12 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Option 1: Direct Contact */}
            <div className="bg-green-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-green-100 shadow-sm group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {t('booking.direct.title')}
              </h3>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                {t('booking.direct.description')}
              </p>
              <a
                href="https://wa.me/34658867133"
                onClick={() => logEvent('booking_page_whatsapp_click')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg w-full"
              >
                {t('booking.direct.button')}
              </a>
            </div>

            {/* Option 2: Form */}
            <div className="bg-blue-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-blue-100 shadow-sm group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {t('booking.form.title')}
              </h3>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                {t('booking.form.description')}
              </p>
              <button
                onClick={() => {
                    logEvent('booking_page_toggle_form', { show: !showForm });
                    setShowForm(!showForm);
                }}
                className={`inline-flex items-center justify-center font-medium px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg w-full ${
                  showForm 
                    ? 'bg-gray-900 text-white hover:bg-gray-800' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {showForm ? t('booking.form.close') : t('booking.form.button')}
              </button>
            </div>
          </div>

          {/* Quick Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 animate-fade-in-up">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-light text-gray-900">
                  {t('booking.form.quickTitle')}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.form.nameRequired')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    placeholder={t('booking.form.namePlaceholder')}
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.form.serviceRequired')}
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => handleFormChange('service', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.form.location')}
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.form.timeSlot')}
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => handleFormChange('timeSlot', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.form.availability')}
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => handleFormChange('availability', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('booking.form.objective')}
                      </label>
                      <input
                        type="text"
                        value={formData.objective}
                        onChange={(e) => handleFormChange('objective', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                        placeholder={t('booking.form.objectivePlaceholder')}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleFormSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-4 rounded-xl transition-all duration-300 hover:scale-[1.01] shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2 inline" />
                    {t('booking.form.submit')}
                  </button>
                </div>
              )}
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-8">
            {t('booking.help.title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <h4 className="font-medium text-gray-900 mb-4">{t('booking.help.contactDirect')}</h4>
              <div className="space-y-2 text-gray-600">
                <p>{t('booking.help.email')}</p>
                <p>{t('booking.help.address')}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <h4 className="font-medium text-gray-900 mb-4">{t('booking.help.hours')}</h4>
              <div className="space-y-2 text-gray-600">
                <p>{t('booking.help.hours.weekdays')}</p>
                <p>{t('booking.help.hours.saturday')}</p>
                <p>{t('booking.help.hours.sunday')}</p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm">
            {t('booking.help.footer')}
          </p>
        </div>
      </section>
    </>
  );
}
