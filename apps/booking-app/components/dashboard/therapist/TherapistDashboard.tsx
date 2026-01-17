'use client';

import { DashboardLayout } from '../DashboardLayout';
import { DashboardHeader } from '../DashboardHeader';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, MoreVertical, Star, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { SessionLogModal } from './SessionLogModal';
import { motion } from 'framer-motion';

export function TherapistDashboard({ profile, userId }: { profile: any, userId: string }) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const supabase = createClient();

    const fetchBookings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('booking')
            .select('*, service:service_id(name)')
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
            <div className="space-y-8 animate-in fade-in duration-700">
                <DashboardHeader
                    title="Therapist Portal"
                    subtitle="Manage your appointments and log sessions."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 apple-card">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Today's Sessions</p>
                                <h3 className="text-2xl font-bold">{bookings.length}</h3>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 apple-card">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Avg. Improvement</p>
                                <h3 className="text-2xl font-bold">+18%</h3>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 apple-card">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                <Star className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Rating</p>
                                <h3 className="text-2xl font-bold">4.9</h3>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold px-1">Upcoming Sessions</h3>
                    {loading ? (
                        <div className="p-12 text-center text-muted-foreground">Loading...</div>
                    ) : bookings.length === 0 ? (
                        <div className="p-12 text-center bg-gray-50 rounded-[28px] border border-dashed border-gray-200">
                            <p className="text-muted-foreground italic">No upcoming sessions found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {bookings.map((booking, idx) => (
                                <motion.div
                                    key={booking.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className="apple-card p-5 group">
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-colors">
                                                    <span className="text-xs font-bold text-muted-foreground uppercase">{format(new Date(booking.start_time), 'MMM')}</span>
                                                    <span className="text-lg font-bold text-foreground leading-none">{format(new Date(booking.start_time), 'd')}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{booking.service?.name || 'Session'}</h4>
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(booking.start_time), 'h:mm a')}</span>
                                                        <span>•</span>
                                                        <span className="font-medium text-foreground">{booking.display_name || 'Guest User'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-600 border-blue-100">
                                                    Scheduled
                                                </Badge>
                                                <Button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setIsLogModalOpen(true);
                                                    }}
                                                    className="apple-button h-10"
                                                >
                                                    Complete Session
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
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
