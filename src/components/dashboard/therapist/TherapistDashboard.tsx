'use client';

import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, MoreVertical, Star, Activity, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { SessionLogModal } from './SessionLogModal';
import { motion, AnimatePresence } from 'framer-motion';
import { StatsCard } from '../widgets/StatsCard';
import { ScheduleTable } from '../widgets/ScheduleTable';
import { PatientActivitySummary } from '../widgets/PatientActivitySummary';
import { MotivationalQuote } from '@/components/ui';

export function TherapistDashboard({ profile, userId }: { profile: any; userId: string }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const supabase = createClient();

  const fetchBookings = async () => {
    setLoading(true);
    // Using nested select for component compatibility
    const { data, error } = await supabase
      .from('booking')
      .select(
        '*, services:service_id(title:name, duration), profiles:profile_id(first_name, last_name, email, phone)'
      )
      .eq('status', 'scheduled')
      .eq('staff_id', userId)
      .order('start_time', { ascending: true });

    if (data) setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <DashboardLayout profile={profile}>
      <div className="animate-in fade-in space-y-8 font-sans duration-500">
        {/* Hero / Welcome */}
        <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[32px] border border-gray-100/80 bg-white p-8 shadow-sm md:flex-row md:items-center">
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-amber-600">
              <Star className="h-3.5 w-3.5 fill-amber-600" />
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Professional Portal
              </span>
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
              Welcome back, <span className="text-indigo-600">{profile.first_name || 'Dr.'}</span>
            </h1>
            <p className="max-w-lg font-medium text-gray-500">
              You have <span className="font-bold text-gray-900">{bookings.length}</span> sessions
              scheduled for today.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:col-span-3">
            <MetricCard
              icon={Calendar}
              label="Today's Sessions"
              value={String(bookings.length)}
              bg="bg-blue-50 text-blue-600"
            />
            <MetricCard
              icon={Activity}
              label="Avg. Improvement"
              value="+18%"
              bg="bg-emerald-50 text-emerald-600"
            />
            <MetricCard icon={Star} label="Rating" value="4.9" bg="bg-amber-50 text-amber-600" />
          </div>
          {/* Quick Action Column */}
          <Link href="/availability" className="h-full">
            <Button className="group relative flex h-full min-h-[120px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[32px] border-0 bg-indigo-600 p-6 shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700">
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 transition-transform group-hover:rotate-90">
                <Plus className="h-5 w-5 text-white" strokeWidth={3} />
              </div>
              <div className="relative z-10 text-center">
                <span className="text-[10px] font-bold tracking-widest text-indigo-200 uppercase">
                  Availability
                </span>
                <div className="mt-1 text-base font-bold tracking-tight text-white">
                  Update Schedule
                </div>
              </div>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Schedule Column */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-baseline justify-between px-2">
              <h3 className="text-xl font-bold tracking-tight text-gray-900">Upcoming Sessions</h3>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-4 text-xs font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
              >
                View Calendar
              </Button>
            </div>

            {loading ? (
              <div className="rounded-[32px] border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center text-gray-400">
                Loading schedule...
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
                <p className="font-medium text-gray-500">No sessions scheduled for today.</p>
                <Button variant="link" className="mt-2 font-bold text-indigo-600" asChild>
                  <Link href="/availability">Update your hours</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {bookings.map((booking, idx) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="group rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="flex flex-1 items-center gap-5">
                          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                            <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                              {format(new Date(booking.start_time), 'MMM')}
                            </span>
                            <span className="text-2xl leading-none font-bold tabular-nums">
                              {format(new Date(booking.start_time), 'd')}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-indigo-600">
                              {booking.services?.title || 'Session'}
                            </h4>
                            <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1 font-semibold tabular-nums">
                                <Clock className="h-3.5 w-3.5" />{' '}
                                {format(new Date(booking.start_time), 'h:mm a')}
                              </span>
                              <span className="opacity-20">|</span>
                              <span className="font-medium text-gray-700">
                                {booking.profiles?.first_name}{' '}
                                {booking.profiles?.last_name || 'Guest'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="rounded-full border-0 bg-emerald-50 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase hover:bg-emerald-50">
                            Confirmed
                          </Badge>
                          <Button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsLogModalOpen(true);
                            }}
                            variant="outline"
                            className="h-10 rounded-xl border-gray-200 px-5 font-bold text-gray-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Patient Context Sidebar */}
          <div className="space-y-6">
            <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
              <PatientActivitySummary userId={userId} />
            </div>
            <div className="overflow-hidden rounded-[32px]">
              <MotivationalQuote />
            </div>
          </div>
        </div>
      </div>

      {selectedBooking && (
        <SessionLogModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          booking={selectedBooking}
          onSuccess={fetchBookings}
        />
      )}
    </DashboardLayout>
  );
}

function MetricCard({ icon: Icon, label, value, bg }: any) {
  return (
    <div className="flex cursor-default items-center gap-5 rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-200">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
        <Icon className="h-6 w-6" strokeWidth={2.5} />
      </div>
      <div>
        <div className="mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
          {label}
        </div>
        <div className="text-2xl font-bold tracking-tight text-gray-900">{value}</div>
      </div>
    </div>
  );
}
