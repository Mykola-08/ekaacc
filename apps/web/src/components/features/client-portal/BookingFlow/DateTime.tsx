import { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

interface DateTimeProps {
  practitioner: any;
  onBack: () => void;
  onNext: (data: any) => void;
}

const timeSlots = [
  { time: '9:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '1:00 PM', available: true },
  { time: '2:00 PM', available: true },
  { time: '3:00 PM', available: true },
  { time: '4:00 PM', available: false },
  { time: '5:00 PM', available: true }
];

export function DateTime({ practitioner, onBack, onNext }: DateTimeProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const canContinue = selectedDate && selectedTime;

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h2 className="text-gray-900">Choose Date & Time</h2>
            <p className="text-sm text-gray-500">Step 4 of 5</p>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-gray-900 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24">
        {/* Practitioner Info */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
              {practitioner.avatar}
            </div>
            <div>
              <p className="text-gray-900">{practitioner.name}</p>
              <p className="text-sm text-gray-500">{practitioner.specialty}</p>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <h3 className="text-gray-900">Select Date</h3>
          </div>
          <div className="p-5 bg-white rounded-2xl">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
              className="rounded-md"
            />
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-900">Select Time</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-4 rounded-2xl text-sm transition-all ${
                    selectedTime === slot.time
                      ? 'bg-gray-900 text-white'
                      : slot.available
                      ? 'bg-white text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Grayed out times are unavailable
            </p>
          </motion.div>
        )}
      </div>

      {/* Continue Button */}
      {canContinue && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
          <Button
            onClick={() => onNext({ date: selectedDate, time: selectedTime })}
            className="w-full max-w-md mx-auto block bg-gray-900 hover:bg-gray-800 text-white border-0 py-6 rounded-2xl"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}


