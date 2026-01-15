'use client';

import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Booking = {
    id: string;
    serviceName: string;
    startTime: string;
    endTime: string;
    status: string;
};

interface BookingHistoryListProps {
    bookings: Booking[];
}

export function BookingHistoryList({ bookings }: BookingHistoryListProps) {
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
                            <BookingCard key={booking.id} booking={booking} isUpcoming />
                        ))}
                    </div>
                </div>
            )}

            {past.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-medium text-muted-foreground">Past History</h2>
                    <div className="grid gap-4 opacity-70 hover:opacity-100 transition-all duration-500">
                        {past.map(booking => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function BookingCard({ booking, isUpcoming }: { booking: Booking, isUpcoming?: boolean }) {
    // Minimal status colors
    const statusStyle = {
        confirmed: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/40',
        pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/40',
        cancelled: 'bg-red-500/5 text-red-600/80 border-red-200/30',
        completed: 'bg-muted text-muted-foreground border-border/50',
    }[booking.status] || 'bg-muted text-muted-foreground';

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
                            statusStyle
                        )}>
                            {booking.status}
                        </span>
                        {isUpcoming && <span className="text-xs text-muted-foreground font-light flex items-center gap-1"><MapPin className="w-3 h-3" /> Main Studio</span>}
                    </div>
                    
                    <h3 className="font-medium text-xl md:text-2xl text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {booking.serviceName}
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground font-light pt-1">
                        <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 opacity-50" />
                            <span className="text-foreground/80">
                                {format(new Date(booking.startTime), 'EEEE, MMMM do, yyyy')}
                            </span>
                        </div>
                        <div className="hidden sm:block w-px h-3 bg-border/60"></div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 opacity-50" />
                            <span>
                                {format(new Date(booking.startTime), 'h:mm a')} — {format(new Date(booking.endTime), 'h:mm a')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Optional Action Area */}
                {isUpcoming && (
                     <div className="pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-border/30 pl-0 md:pl-8 flex flex-row md:flex-col gap-3 justify-end">
                        <Badge variant="outline" className="w-fit self-end md:self-auto rounded-full px-3 font-normal opacity-50 border-foreground/20">
                            Details
                        </Badge>
                     </div>
                )}
            </div>
        </div>
    )
}
