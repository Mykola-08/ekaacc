import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, TrendingUp, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/platform/ui/button';

interface TherapistHomeProps {
  therapistId: string;
}

export function TherapistHome({ therapistId }: TherapistHomeProps) {
  const todaysSessions = [
    {
      id: 1,
      clientName: 'Alex Johnson',
      time: '2:00 PM',
      duration: '60 min',
      type: 'Integrated Therapy',
      status: 'upcoming',
      notes: 'Focus on shoulder tension and sleep improvement'
    },
    {
      id: 2,
      clientName: 'Sarah Williams',
      time: '3:30 PM',
      duration: '50 min',
      type: 'Kinesiology Balance',
      status: 'upcoming',
      notes: 'Follow-up session, check progress on lower back'
    },
    {
      id: 3,
      clientName: 'Michael Chen',
      time: '5:00 PM',
      duration: '45 min',
      type: 'Sleep & Restoration',
      status: 'upcoming',
      notes: 'New client, assess sleep patterns'
    }
  ];

  const stats = [
    { label: 'Today', value: '3', icon: Calendar },
    { label: 'This Week', value: '18', icon: Users },
    { label: 'Completion', value: '96%', icon: TrendingUp }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="pt-6">
        <h1 className="text-gray-900 mb-2">Good afternoon, Emma</h1>
        <p className="text-gray-500">You have 3 sessions today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="p-5 text-center bg-white rounded-2xl">
              <stat.icon className="w-5 h-5 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 leading-tight">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Today's Schedule</h3>
          <span className="text-sm text-gray-500">Nov 15, 2024</span>
        </div>

        <div className="space-y-3">
          {todaysSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-gray-900 mb-1">{session.clientName}</p>
                    <p className="text-sm text-gray-500">{session.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 mb-1">{session.time}</p>
                    <p className="text-sm text-gray-500">{session.duration}</p>
                  </div>
                </div>
                
                {session.notes && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-600">{session.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-0 bg-gray-50 hover:bg-gray-100"
                  >
                    View Client
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white border-0"
                  >
                    Start Session
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-gray-900">Quick Actions</h3>
        
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-900 mb-1">2 Pending Requests</p>
                <p className="text-sm text-gray-500">New session bookings</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}


