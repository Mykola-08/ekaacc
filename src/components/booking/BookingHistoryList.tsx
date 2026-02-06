'use client';

import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Calendar03Icon, 
  Clock01Icon, 
  LocationFavouriteIcon, 
  Cancel01Icon, 
  ArrowLeft01Icon, 
  UnavailableIcon, 
  Navigation03Icon, 
  Calendar01Icon 
} from "@hugeicons/core-free-icons";
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
            <div className="flex flex-col items-center justify-center py-24 bg-card/50 rounded-[36px] text-center border-2 border-dashed border-muted">
                <div className="p-6 bg-background rounded-full mb-6 shadow-sm">
                    <HugeiconsIcon icon={Calendar03Icon} className="w-8 h-8 text-muted-foreground" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">No bookings yet</h3>
                <p className="text-muted-foreground font-medium mt-2 max-w-xs">
                    Your wellness journey begins with your first session.
                </p>
            </div>
        );
    }

    const upcoming = bookings.filter(b => new Date(b.startTime) > new Date());
    const past = bookings.filter(b => new Date(b.startTime) <= new Date());

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            {upcoming.length > 0 && (
                <div className="space-y-8">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                        Upcoming
                        <span className="text-xs font-bold font-mono bg-foreground text-background px-2.5 py-1 rounded-lg">
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
                <div className="space-y-8">
                    <h2 className="text-xl font-bold text-muted-foreground">Past History</h2>
                    <div className="grid gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
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
    const statusStyles = {
        confirmed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100/50",
        pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-100/50",
        cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-100/50",
        completed: 'bg-secondary text-muted-foreground ring-1 ring-border',
    };

    // Default to pending if unknown
    const badgeClass = statusStyles[booking.status.toLowerCase() as keyof typeof statusStyles] || statusStyles.pending;

    const handleCancel = async () => {
        if(!confirm("Are you sure you want to cancel this session?")) return;
        
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
            "group relative rounded-[36px] overflow-hidden transition-all duration-300",
            isUpcoming 
                ? "bg-card shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 border border-transparent" 
                : "bg-card border border-border"
        )}>
            <div className="p-8 flex flex-col md:flex-row gap-8 md:items-center justify-between">
                <div className="flex items-start gap-6 flex-1">
                     {/* Enhanced Date Block */}
                     <div className={cn(
                        "flex flex-col items-center justify-center min-w-[72px] h-[72px] rounded-2xl",
                        isUpcoming ? "bg-primary/10 text-primary" : "bg-secondary/50 text-muted-foreground"
                    )}>
                        <span className="text-xs font-black uppercase tracking-widest opacity-80">
                            {format(new Date(booking.startTime), 'MMM')}
                        </span>
                        <span className="text-2xl font-black tracking-tighter">
                            {format(new Date(booking.startTime), 'd')}
                        </span>
                    </div>

                    <div className="space-y-3 md:space-y-2 flex-1">
                        <div className="flex items-center justify-between md:justify-start md:gap-4">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", 
                                badgeClass
                            )}>
                                {booking.status}
                            </span>
                            {isUpcoming && <span className="text-xs text-muted-foreground font-bold flex items-center gap-1"><HugeiconsIcon icon={LocationFavouriteIcon} className="w-3 h-3" strokeWidth={2.5} /> Main Studio</span>}
                        </div>
                        
                        <h3 className={cn(
                            "font-bold text-xl md:text-2xl tracking-tight transition-colors",
                            isUpcoming ? "text-foreground" : "text-muted-foreground"
                        )}>
                            {booking.serviceName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground font-medium text-sm">
                            <div className="flex items-center gap-2">
                                <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4" strokeWidth={2.5} />
                                {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                            </div>
                        </div>
                    </div>
                </div>

                {isUpcoming && booking.status !== 'cancelled' && (
                    <div className="flex flex-row md:flex-col gap-3 shrink-0 pt-6 md:pt-0 border-t md:border-t-0 border-border">
                        <Button variant="outline" size="sm" className="w-full md:w-32 text-xs font-bold h-9 rounded-full border-rose-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={handleCancel}>
                           <HugeiconsIcon icon={UnavailableIcon} className="w-3 h-3 mr-2" strokeWidth={2.5} />
                           Cancel
                        </Button>
                         <Button variant="ghost" size="sm" onClick={() => toast.info("Rescheduling coming soon")} className="w-full md:w-32 text-xs font-bold h-9 rounded-full text-muted-foreground hover:text-foreground">
                           <HugeiconsIcon icon={Calendar01Icon} className="w-3 h-3 mr-2" strokeWidth={2.5} />
                           Reschedule
                        </Button>
                        <Button variant="link" size="sm" asChild className="w-full md:w-32 text-xs font-bold h-9 text-primary p-0 hover:no-underline hover:opacity-80">
                           <Link href="https://maps.google.com/?q=Main+Studio" target="_blank" rel="noreferrer">
                              <HugeiconsIcon icon={Navigation03Icon} className="w-3 h-3 mr-2" strokeWidth={2.5} />
                              Get Directions
                           </Link>
                        </Button>
                    </div>
                )}
                
                {!isUpcoming && (
                     <div className="flex flex-row md:flex-col gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                        <Button variant="secondary" size="sm" className="w-full md:w-auto text-xs font-bold h-9 rounded-full">
                           <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3 h-3 mr-2" strokeWidth={2.5} />
                           Book Again
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
