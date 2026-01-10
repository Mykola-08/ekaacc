import { useState } from 'react';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react';
import { Button } from '@/components/platform/ui/button';
import { Input } from '@/components/platform/ui/input';
import { motion } from 'framer-motion';

interface GuestInfoProps {
  onNext: (guestInfo: { name: string; email: string; phone: string }) => void;
  onBack: () => void;
}

export function GuestInfo({ onNext, onBack }: GuestInfoProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return re.test(phone);
  };

  const handleContinue = () => {
    const newErrors = { name: '', email: '', phone: '' };
    let hasError = false;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      hasError = true;
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      hasError = true;
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      onNext({ name, email, phone });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="p-4 sm:p-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-gray-900">Your Contact Information</h2>
            <p className="text-sm text-gray-500">We'll use this to confirm your booking</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 sm:p-6 space-y-6 pb-32"
      >
        {/* Info Card */}
        <div className="bg-blue-50 rounded-2xl p-4 sm:p-5">
          <p className="text-sm text-gray-700">
            ℹ️ You can book without creating an account. We'll send your booking confirmation to this email and phone number.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-gray-900 mb-2">Full Name *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className={`w-full pl-12 h-14 rounded-xl border ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                } focus:border-gray-900`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-900 mb-2">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className={`w-full pl-12 h-14 rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:border-gray-900`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-gray-900 mb-2">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+31 6 1234 5678"
                className={`w-full pl-12 h-14 rounded-xl border ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                } focus:border-gray-900`}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              We'll send you appointment reminders
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-sm text-gray-600">
            🔒 Your information is secure and will only be used for appointment-related communications. 
            You can create an account later to access your booking history and personalized recommendations.
          </p>
        </div>
      </motion.div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-white via-white to-transparent">
        <Button
          onClick={handleContinue}
          className="w-full max-w-md mx-auto block bg-gray-900 hover:bg-gray-800 text-white border-0 h-12 sm:h-14 rounded-xl sm:rounded-2xl"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}


