'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, Star, Activity, Plus, Users, ArrowRight, Video, ChevronRight } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import Link from 'next/link';
import { SessionLogModal } from './SessionLogModal';
import { motion, AnimatePresence } from 'motion/react';
import { PatientActivitySummary } from '../widgets/PatientActivitySummary';
import { MotivationalQuote } from '@/components/ui';
import { cn } from '@/lib/utils';

function formatSessionDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isToday(date)) return `Today`;
  if (isTomorrow(date)) return `Tomorrow`;
  return format(date, 'EEEE, MMM d');
}

export function TherapistDashboard({ profile, userId }: { profile: any; userId: string }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const supabase = createClient();

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase
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

  useEffect(() => { fetchBookings(); }, []);

  const todayBookings = useMemo(() => 
    bookings.filter(b => isToday(new Date(b.start_time))), 
    [bookings]
  );
  const nextBooking = bookings[0];

  return (
    <motion.div 
      className="space-y-6 px-2 py-6 font-sans sm:px-4 md:px-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Hero */}
      <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1.5">
              <Star className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
              <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                Professional Portal
              </span>
            </div>
            <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
              Welcome back, <span className="text-primary">{profile.first_name || 'Dr.'}</span>
            </h1>
            <p className="max-w-lg text-base text-muted-foreground">
              You have <span className="font-semibold text-foreground">{todayBookings.length}</span> sessions
              today and <span className="font-semibold text-foreground">{bookings.length}</span> total upcoming.
            </p>
          </div>
          <Link href="/availability">
            <Button className="gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Update Schedule
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <MetricCard icon={Calendar} label="Today's Sessions" value={String(todayBookings.length)} />
        <MetricCard icon={Users} label="Total Upcoming" value={String(bookings.length)} />
        <MetricCard icon={Activity} label="Avg. Improvement" value="+18%" />
        <MetricCard icon={Star} label="Rating" value="4.9" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sessions Column */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Upcoming Sessions</h3>
            <Link href="/bookings" className="text-xs font-semibold text-primary hover:underline">
              View Calendar
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <Card className="flex flex-col items-center justify-center rounded-xl border-dashed p-10 text-center">
              <Calendar className="mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No sessions scheduled.</p>
              <Button variant="link" className="mt-1 text-sm font-semibold text-primary" asChild>
                <Link href="/availability">Update your hours</Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking, idx) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                >
                  <Card className="group rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/30 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex flex-1 items-center gap-4">
                        {/* Date Badge */}
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-muted">
                          <span className="text-[9px] font-semibold tracking-widest uppercase opacity-60">
                            {format(new Date(booking.start_time), 'MMM')}
                          </span>
                          <span className="text-xl leading-none font-semibold tabular-nums">
                            {format(new Date(booking.start_time), 'd')}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                            {booking.services?.title || 'Session'}
                          </h4>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 font-medium tabular-nums">
                              <Clock className="h-3 w-3" />
                              {format(new Date(booking.start_time), 'h:mm a')}
                            </span>
                            <span className="opacity-30">|</span>
                            <span className="truncate font-medium text-foreground">
                              {booking.profiles?.first_name} {booking.profiles?.last_name || 'Guest'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="rounded-full border-0 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-600 uppercase hover:bg-emerald-500/10">
                          Confirmed
                        </Badge>
                        <Button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsLogModalOpen(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg border-border px-4 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="rounded-xl border border-border bg-card p-5">
            <PatientActivitySummary userId={userId} />
          </Card>
          <div className="overflow-hidden rounded-xl">
            <MotivationalQuote />
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
    </motion.div>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div>
        <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{label}</div>
        <div className="text-xl font-semibold tracking-tight text-foreground">{value}</div>
      </div>
    </Card>
  );
}
