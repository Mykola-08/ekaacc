import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sessionTypes } from '@/data/sessionTypes';
import { ResponsiveContainer } from './Layout/ResponsiveContainer';

interface BookAppointmentProps {
  userId: string;
  onBack: () => void;
}

type BookingStep = 'session' | 'personalization' | 'practitioner' | 'datetime' | 'confirmation';

export function BookAppointment({ userId, onBack }: BookAppointmentProps) {
  const [step, setStep] = useState<BookingStep>('session');
  const [bookingData, setBookingData] = useState<any>({});

  const handleSessionTypeNext = (sessionType: any) => {
    setBookingData({ ...bookingData, sessionType });
    setStep('personalization');
  };

  const handlePersonalizationNext = (personalization: any) => {
    setBookingData({ ...bookingData, personalization });
    setStep('practitioner');
  };

  const handlePractitionerNext = (practitioner: any) => {
    setBookingData({ ...bookingData, practitioner });
    setStep('datetime');
  };

  const handleDateTimeNext = (dateTime: any) => {
    setBookingData({ ...bookingData, dateTime });
    setStep('confirmation');
  };

  const handleBack = () => {
    if (step === 'session') {
      onBack();
    } else if (step === 'personalization') {
      setStep('session');
    } else if (step === 'practitioner') {
      setStep('personalization');
    } else if (step === 'datetime') {
      setStep('practitioner');
    } else if (step === 'confirmation') {
      setStep('datetime');
    }
  };

  if (step === 'session') {
    return <SessionType onBack={handleBack} onNext={handleSessionTypeNext} />;
  }

  if (step === 'personalization') {
    return (
      <Personalization
        sessionType={bookingData.sessionType}
        onBack={handleBack}
        onNext={handlePersonalizationNext}
      />
    );
  }

  if (step === 'practitioner') {
    return <Practitioner onBack={handleBack} onNext={handlePractitionerNext} />;
  }

  if (step === 'datetime') {
    return (
      <DateTime
        practitioner={bookingData.practitioner}
        onBack={handleBack}
        onNext={handleDateTimeNext}
      />
    );
  }

  return (
    <Confirmation
      userId={userId}
      bookingData={bookingData}
      onBack={handleBack}
      onComplete={onBack}
    />
  );
}

function SessionType({ onBack, onNext }: { onBack: () => void; onNext: (sessionType: any) => void }) {
  const onSelectSession = (session: any) => {
    onNext(session);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <ResponsiveContainer maxWidth="xl" className="p-6 lg:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-12"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 lg:mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-gray-900">Book a Session</h1>
        </motion.div>

        {/* Session Types Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {sessionTypes.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onSelectSession(session)}
              className="bg-white rounded-3xl p-6 lg:p-8 cursor-pointer hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-2 group-hover:text-gray-700">
                    {session.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 lg:line-clamp-none">
                    {session.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration}</span>
                  </div>
                  <span className="text-gray-900">{session.price}</span>
                </div>
                <Button
                  variant="ghost"
                  className="text-gray-900 hover:bg-gray-50 border-0"
                >
                  Select
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </ResponsiveContainer>
    </div>
  );
}

