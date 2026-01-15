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
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground">No bookings found</h3>
                <p>You haven't booked any sessions yet.</p>
            </div>
        );
    }

    const upcoming = bookings.filter(b => new Date(b.startTime) > new Date());
    const past = bookings.filter(b => new Date(b.startTime) <= new Date());

    return (
        <div className="space-y-8 animate-slide-up">
            {upcoming.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-serif text-primary flex items-center gap-2">
                        Upcoming Sessions
                        <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">{upcoming.length}</Badge>
                    </h2>
                    <div className="grid gap-4">
                        {upcoming.map(booking => (
                            <BookingCard key={booking.id} booking={booking} isUpcoming />
                        ))}
                    </div>
                </div>
            )}

            {past.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-serif text-muted-foreground">Past Sessions</h2>
                    <div className="grid gap-4 opacity-80 hover:opacity-100 transition-opacity">
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
    const statusColor = {
        confirmed: 'bg-teal-100 text-teal-800 border-teal-200',
        pending: 'bg-amber-100 text-amber-800 border-amber-200',
        cancelled: 'bg-slate-100 text-slate-800 border-slate-200',
        completed: 'bg-blue-100 text-blue-800 border-blue-200',
    }[booking.status] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
        <Card className={cn(
            "border border-border/50 transition-all duration-300",
            isUpcoming ? "shadow-md hover:shadow-lg bg-card" : "bg-muted/30 hover:bg-muted/50"
        )}>
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="space-y-3">
                    <div className="flex items-start justify-between md:justify-start md:gap-4">
                        <h3 className="font-semibold text-lg text-foreground">{booking.serviceName}</h3>
                        <Badge variant="outline" className={cn("capitalize shadow-none", statusColor)}>
                            {booking.status}
                        </Badge>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 bg-background/50 px-2 py-1 rounded-md border border-border/50">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground/80">
                                {format(new Date(booking.startTime), 'MMM do, yyyy')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 bg-background/50 px-2 py-1 rounded-md border border-border/50">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>
                                {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                            </span>
                        </div>
                    </div>
                </div>

                {isUpcoming && (
                    <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-border pl-0 md:pl-6">
                         <div className="text-right">
                             <div className="text-sm font-medium">Main Studio</div>
                             <div className="text-xs text-muted-foreground">Room 3</div>
                         </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
