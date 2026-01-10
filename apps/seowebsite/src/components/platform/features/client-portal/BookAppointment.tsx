import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/platform/ui/button';
import { sessionTypes } from '@/data/sessionTypes';
import { ResponsiveContainer } from './Layout/ResponsiveContainer';
import { Personalization } from './BookingFlow/Personalization';
import { Practitioner } from './BookingFlow/Practitioner';
import { DateTime } from './BookingFlow/DateTime';
import { Confirmation } from './BookingFlow/Confirmation';
import { SessionType } from './BookingFlow/SessionType';

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

// Internal component for SessionType removed to avoid conflict with imported SessionType

