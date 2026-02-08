'use client';

import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
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
import { WelcomeBanner } from '../widgets/WelcomeBanner';
import { MotivationalQuote } from '@/components/ui';

export function TherapistDashboard({ profile, userId }: { profile: any, userId: string }) {
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
            .select('*, services:service_id(title:name, duration), profiles:profile_id(first_name, last_name, email, phone)')
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
            <div className="space-y-6 animate-in fade-in duration-500">
                <WelcomeBanner
                    title="Good day, Professor"
                    firstName={profile.first_name || 'Staff'}
                    subtitle="Review your schedule and patient updates."
                    className="mb-8"
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard 
                            icon={Calendar} 
                            label="Today's Sessions" 
                            value={bookings.length} 
                            colorClass="bg-blue-50 text-blue-600"
                        />
                        <StatsCard 
                            icon={Activity} 
                            label="Avg. Improvement" 
                            value="+18%" 
                            colorClass="bg-emerald-50 text-emerald-600"
                        />
                        <StatsCard 
                            icon={Star} 
                            label="Rating" 
                            value="4.9" 
                            colorClass="bg-amber-50 text-amber-600"
                        />
                    </div>
                    {/* Quick Action Column */}
                    <Link href="/availability" className="h-full">
                         <Button className="w-full h-full min-h-[140px] rounded-2xl shadow-sm flex flex-col items-center justify-center p-6 gap-3 bg-primary hover:bg-primary/90 transition-all group overflow-hidden relative">
                            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform relative z-10">
                                <Plus className="w-6 h-6 text-white" strokeWidth={2.75} />
                            </div>
                            <div className="text-center relative z-10">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Availability</span>
                                <div className="font-bold text-lg tracking-tight text-white leading-tight">Update Schedule</div>
                            </div>
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Schedule Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-baseline justify-between px-2">
                            <h3 className="text-2xl font-bold tracking-tighter">Upcoming Sessions</h3>
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-primary">View Full Calendar</Button>
                        </div>
                        
                        {loading ? (
                            <div className="p-12 text-center text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed">Loading...</div>
                        ) : bookings.length === 0 ? (
                            <div className="p-12 text-center bg-secondary/10 rounded-2xl border border-dashed border-border/60">
                                <p className="text-muted-foreground italic font-medium">No sessions scheduled for today.</p>
                                <Button variant="link" className="mt-2 text-primary font-bold" asChild>
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
                                        <Card className="p-5 rounded-2xl group hover:border-primary/20 shadow-none hover:shadow-xl hover:shadow-primary/5 transition-all bg-card/50 backdrop-blur-sm">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex flex-col items-center justify-center border border-border/40 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{format(new Date(booking.start_time), 'MMM')}</span>
                                                        <span className="text-2xl font-black text-foreground leading-none tabular-nums">{format(new Date(booking.start_time), 'd')}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors tracking-tight">{booking.services?.title || 'Session'}</h4>
                                                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                            <span className="flex items-center gap-1 font-bold tabular-nums"><Clock className="w-3.5 h-3.5 text-primary" strokeWidth={2.75} /> {format(new Date(booking.start_time), 'h:mm a')}</span>
                                                            <span className="opacity-20 text-foreground">|</span>
                                                            <span className="font-semibold text-foreground/80">{booking.profiles?.first_name} {booking.profiles?.last_name || 'Guest'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge className="rounded-full bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                                                        Confirmed
                                                    </Badge>
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setIsLogModalOpen(true);
                                                        }}
                                                        variant="outline"
                                                        className="rounded-2xl h-11 px-6 font-bold hover:bg-primary hover:text-white transition-all shadow-sm border-border/60 hover:border-primary"
                                                    >
                                                        Review Session
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
                        <MotivationalQuote />
                        <PatientActivitySummary userId={userId} />
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

