'use client';

import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, XCircle, Undo2, Ban, Navigation, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { cancelBookingAction } from "@/server/actions/booking-actions";
import { createClient } from "@/lib/supabase/client"; 
import Link from 'next/link';
import { useBookingRealtime } from "@/hooks/useBookingRealtime";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Booking = {
    id: string;
    serviceName: string;
    startTime: string;
    endTime: string;
    status: string;
};

interface BookingHistoryListProps {
    bookings: Booking[];
    userId?: string; // Optional, can be derived but better passed
}

export function BookingHistoryList({ bookings: initialBookings, userId }: BookingHistoryListProps) {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);

    // Sync state if server prop changes
    useEffect(() => {
        setBookings(initialBookings);
    }, [initialBookings]);

    // Handle realtime updates
    useBookingRealtime((payload) => {
        if (payload.eventType === 'UPDATE') {
            setBookings((current) => 
                current.map((b) => {
                    if (b.id === payload.new.id) {
                        return { 
                            ...b, 
                            status: payload.new.status,
                            // If user is just looking at history, update other fields if needed
                            // Note: payload keys are snake_case (e.g. start_time), Booking type is camelCase
                            // Mapping is required if we want to update times, but usually status is the main realtime change here.
                        };
                    }
                    return b;
                })
            );
            toast.info(`Booking status updated: ${payload.new.status}`);
        } else {
            // For INSERT (New booking) or DELETE (Cancelled/Deleted), 
            // the data structure (joins) is complex, so simpler to refresh server data.
            router.refresh(); 
        }
    });

    if (!bookings || bookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-background/30 backdrop-blur-sm rounded-3xl border border-dashed border-border/60 text-center">
                <div className="p-5 bg-foreground/5 rounded-full mb-6">
                    <Calendar className="w-8 h-8 text-muted-foreground/60" />
                </div>
                <h3 className="text-xl font-medium text-foreground tracking-tight">No bookings yet</h3>
                <p className="text-muted-foreground font-light mt-2 max-w-64">
                    Your wellness journey begins with your first session.
                </p>
            </div>
        );
    }

    const upcoming = bookings.filter(b => new Date(b.startTime) > new Date());
    const past = bookings.filter(b => new Date(b.startTime) <= new Date());

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {upcoming.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-medium text-foreground/80 flex items-center gap-3">
                        Upcoming
                        <span className="text-xs font-mono bg-foreground/5 text-foreground/70 px-2 py-1 rounded-md">
                            {upcoming.length}
                        </span>
                    </h2>
                    <div className="grid gap-6">
                        {upcoming.map(booking => (
                            <BookingCard key={booking.id} booking={booking} isUpcoming userId={userId} />
                        ))}
                    </div>
                </div>
            )}

            {past.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-medium text-muted-foreground">Past History</h2>
                    <div className="grid gap-4 opacity-70 hover:opacity-100 transition-all duration-500">
                        {past.map(booking => (
                            <BookingCard key={booking.id} booking={booking} userId={userId} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function BookingCard({ booking, isUpcoming, userId }: { booking: Booking, isUpcoming?: boolean, userId?: string }) {
    // Minimal status colors
    const statusStyle: any = {
        confirmed: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/40',
        pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/40',
        cancelled: 'bg-red-500/5 text-red-600/80 border-red-200/30',
        completed: 'bg-muted text-muted-foreground border-border/50',
    };
    
    // Fallback safely
    const badgeClass = statusStyle[booking.status] || 'bg-muted text-muted-foreground';

    const handleCancel = async () => {
        if(!confirm("Are you sure you want to cancel this session?")) return;
        
        // We'd ideally need the userId here. 
        // For now simulating a client-side call or using a passed ID.
        // In a real scenario, useSession() hook or similar.
        if (userId) {
             const res = await cancelBookingAction(booking.id, userId);
             if (res.success) {
                 toast.success("Booking cancelled successfully");
             } else {
                 toast.error("Failed to cancel booking");
             }
        }
    };

    return (
        <div className={cn(
            "group relative rounded-2xl border transition-all duration-300 overflow-hidden",
            isUpcoming 
                ? "bg-background/40 backdrop-blur-xl border-border/60 hover:bg-background/60 hover:shadow-sm" 
                : "bg-background/20 border-border/30 hover:bg-background/40"
        )}>
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="space-y-3 md:space-y-2 flex-1">
                    <div className="flex items-center justify-between md:justify-start md:gap-4">
                        <span className={cn(
                            "px-2.5 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider border", 
                            badgeClass
                        )}>
                            {booking.status}
                        </span>
                        {isUpcoming && <span className="text-xs text-muted-foreground font-light flex items-center gap-1"><MapPin className="w-3 h-3" /> Main Studio</span>}
                    </div>
                    
                    <h3 className="font-medium text-xl md:text-2xl text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {booking.serviceName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-blue-500/70" />
                             {format(new Date(booking.startTime), 'EEEE, MMMM do')}
                        </div>
                        <div className="flex items-center gap-2">
                             <Clock className="w-4 h-4 text-amber-500/70" />
                             {format(new Date(booking.startTime), 'h:mm a')}
                        </div>
                    </div>
                </div>

                {isUpcoming && booking.status !== 'cancelled' && (
                    <div className="flex flex-row md:flex-col gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                        <Button variant="outline" size="sm" className="w-full md:w-auto text-xs h-9 border-red-200/50 text-red-600/80 hover:bg-red-50 hover:text-red-700" onClick={handleCancel}>
                           <Ban className="w-3 h-3 mr-2" />
                           Cancel
                        </Button>
                         <Button variant="ghost" size="sm" onClick={() => toast.info("Rescheduling coming soon")} className="w-full md:w-auto text-xs h-9 text-muted-foreground hover:text-foreground">
                           <CalendarDays className="w-3 h-3 mr-2" />
                           Reschedule
                        </Button>
                        <Button variant="link" size="sm" asChild className="w-full md:w-auto text-xs h-9 text-muted-foreground p-0">
                           <Link href="https://maps.google.com/?q=Main+Studio" target="_blank" rel="noreferrer">
                              <Navigation className="w-3 h-3 mr-2" />
                              Get Directions
                           </Link>
                        </Button>
                    </div>
                )}
                
                {!isUpcoming && (
                     <div className="flex flex-row md:flex-col gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                        <Button variant="secondary" size="sm" className="w-full md:w-auto text-xs h-9">
                           <Undo2 className="w-3 h-3 mr-2" />
                           Book Again
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
