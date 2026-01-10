import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/platform/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/platform/mobile/api';

interface ConfirmationProps {
  userId?: string;
  bookingData: {
    sessionType: any;
    personalization: any;
    practitioner: any;
    dateTime: any;
    guestInfo?: {
      name: string;
      email: string;
      phone: string;
    };
  };
  onBack: () => void;
  onComplete: () => void;
}

export function Confirmation({ userId, bookingData, onBack, onComplete }: ConfirmationProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleConfirm = async () => {
    setIsBooking(true);
    
    try {
      const appointmentData = {
        userId,
        sessionType: bookingData.sessionType.name,
        practitioner: bookingData.practitioner.name,
        date: bookingData.dateTime.date.toISOString().split('T')[0],
        time: bookingData.dateTime.time.replace(' AM', '').replace(' PM', ''),
        price: bookingData.sessionType.price,
        duration: bookingData.sessionType.duration.replace(' min', ''),
        notes: bookingData.personalization.concerns,
        preferences: bookingData.personalization.preferences,
        isFirstTime: bookingData.personalization.isFirstTime,
        status: 'upcoming'
      };

      await api.createAppointment(appointmentData);

      // Send email notification
      try {
        await api.sendNotification({
          userId,
          type: 'sessions',
          subject: 'Session Booking Confirmation',
          appointment: {
            sessionType: bookingData.sessionType.name,
            date: formatDate(bookingData.dateTime.date),
            time: bookingData.dateTime.time,
            practitioner: bookingData.practitioner.name,
            duration: bookingData.sessionType.duration.replace(' min', '')
          }
        });
        console.log('Booking confirmation email sent successfully');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the booking if email fails
      }

      setIsBooked(true);
      toast.success('Session booked successfully!');
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Failed to book session');
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Animation */}
      <AnimatePresence>
        {isBooked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 text-center mx-4"
            >
              <CheckCircle2 className="w-20 h-20 text-gray-900 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">Session Booked!</h3>
              <p className="text-gray-500">Confirmation sent to your email</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="p-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-gray-900">Confirm Your Booking</h2>
            <p className="text-sm text-gray-500">Step 5 of 5</p>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-gray-900 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 pb-24">
        {/* Session Details */}
        <div className="bg-white rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Session Type</p>
            <p className="text-gray-900">{bookingData.sessionType.name}</p>
            <p className="text-sm text-gray-600">
              {bookingData.sessionType.duration} • {bookingData.sessionType.price}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
                {bookingData.practitioner.avatar}
              </div>
              <div>
                <p className="text-gray-900">{bookingData.practitioner.name}</p>
                <p className="text-sm text-gray-500">{bookingData.practitioner.specialty}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-gray-900">{formatDate(bookingData.dateTime.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="text-gray-900">{bookingData.dateTime.time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Notes */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <p className="text-gray-900">Your Notes</p>
          </div>
          <p className="text-gray-600 text-sm mb-3">{bookingData.personalization.concerns}</p>
          {bookingData.personalization.preferences.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {bookingData.personalization.preferences.map((pref: string, idx: number) => (
                <span key={idx} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
                  {pref}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Important Info */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <p className="text-gray-900 mb-2">Important Information</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Please arrive 5-10 minutes early</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Free cancellation up to 24 hours before</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Wear comfortable, loose-fitting clothing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Confirmation will be sent to your email</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        <Button
          onClick={handleConfirm}
          disabled={isBooking}
          className="w-full max-w-md mx-auto block bg-gray-900 hover:bg-gray-800 text-white border-0 py-6 rounded-2xl disabled:opacity-50"
        >
          {isBooking ? 'Booking...' : `Confirm Booking - ${bookingData.sessionType.price}`}
        </Button>
      </div>
    </div>
  );
}



