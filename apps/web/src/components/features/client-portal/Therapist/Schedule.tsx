import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

interface ScheduleProps {
  therapistId: string;
}

export function Schedule({ therapistId }: ScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const sessions = [
    {
      id: 1,
      time: '9:00 AM',
      client: 'Alex Johnson',
      type: 'Integrated Therapy',
      duration: '60 min',
      status: 'confirmed'
    },
    {
      id: 2,
      time: '11:00 AM',
      client: 'Sarah Williams',
      type: 'Kinesiology Balance',
      duration: '50 min',
      status: 'confirmed'
    },
    {
      id: 3,
      time: '2:00 PM',
      client: 'Michael Chen',
      type: 'Sleep & Restoration',
      duration: '45 min',
      status: 'pending'
    },
    {
      id: 4,
      time: '4:00 PM',
      client: null,
      type: 'Available',
      duration: '60 min',
      status: 'available'
    },
    {
      id: 5,
      time: '5:30 PM',
      client: null,
      type: 'Available',
      duration: '60 min',
      status: 'available'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="p-6">
          <h2 className="text-gray-900 mb-1">Schedule</h2>
          <p className="text-gray-500">Manage your appointments</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Calendar */}
        <div className="bg-white rounded-2xl p-5">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md"
          />
        </div>

        {/* Sessions for Selected Date */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <span className="text-sm text-gray-500">
              {sessions.filter(s => s.status !== 'available').length} sessions
            </span>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`rounded-2xl p-5 ${
                  session.status === 'available'
                    ? 'bg-gray-50 border border-dashed border-gray-300'
                    : 'bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-900">{session.time}</p>
                        <p className="text-xs text-gray-500">{session.duration}</p>
                      </div>
                      <div className="h-12 w-px bg-gray-200" />
                      <div>
                        {session.client ? (
                          <>
                            <p className="text-gray-900 mb-1">{session.client}</p>
                            <p className="text-sm text-gray-500">{session.type}</p>
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                              session.status === 'confirmed'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-yellow-50 text-yellow-700'
                            }`}>
                              {session.status}
                            </span>
                          </>
                        ) : (
                          <p className="text-gray-500">Open slot</p>
                        )}
                      </div>
                    </div>
                    {session.status === 'available' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <p className="text-gray-900 mb-3">Week Summary</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl text-gray-900 mb-1">18</p>
              <p className="text-xs text-gray-500">Scheduled</p>
            </div>
            <div>
              <p className="text-2xl text-gray-900 mb-1">12</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
            <div>
              <p className="text-2xl text-gray-900 mb-1">2</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


