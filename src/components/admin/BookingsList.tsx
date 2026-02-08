'use client';

import { Booking } from "@/types/booking";
import { format } from "date-fns";
import { CheckCircle, Clock, XCircle, Search, Calendar, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookingsListProps {
    bookings: Booking[];
}

export function BookingsList({ bookings }: BookingsListProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'pending' | 'completed' | 'canceled'>('all');

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.displayName?.toLowerCase().includes(search.toLowerCase()) ||
            booking.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
            booking.email?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="w-full h-full p-6 md:p-12 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Reservations</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Comprehensive view of all platform sessions.</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by name, email or service..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {['all', 'scheduled', 'pending', 'completed', 'canceled'].map(status => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(status as any)}
                            className={cn("capitalize rounded-full px-5 h-9", statusFilter === status ? "bg-primary" : "text-muted-foreground border-border")}
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </Card>

            {/* List */}
            <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                    <Card className="py-20 flex flex-col items-center justify-center border-dashed bg-muted/50">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-medium">No bookings found</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredBookings.map((booking) => (
                            <BookingRow key={booking.id} booking={booking} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function BookingRow({ booking }: { booking: Booking }) {
    const statusConfig = {
        scheduled: { icon: Calendar, variant: 'default' as const },
        pending: { icon: Clock, variant: 'secondary' as const },
        confirmed: { icon: CheckCircle, variant: 'secondary' as const }, // Assuming emerald maps to secondary or default usually, I'll use outline or specific class if needed, but badge variants are limited. Let's use outline for generic happy path or custom class.
        completed: { icon: CheckCircle, variant: 'outline' as const },
        canceled: { icon: XCircle, variant: 'destructive' as const },
    };

    // Fallback
    const config = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.scheduled;
    const StatusIcon = config.icon;

    return (
        <Card className="p-5 flex flex-col md:flex-row items-center gap-6 apple-card">

            {/* Date Block */}
            <div className="flex flex-row md:flex-col items-center md:items-start min-w-[100px] gap-3 md:gap-0">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                    {format(new Date(booking.startTime), 'MMM do')}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                    {format(new Date(booking.startTime), 'h:mm a')}
                </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 w-full text-center md:text-left space-y-1">
                <h3 className="text-lg font-bold text-foreground">{booking.serviceName}</h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                        {booking.displayName || 'Guest'}
                    </span>
                    {booking.email && (
                        <span className="hidden sm:inline text-sm text-muted-foreground">
                            {booking.email}
                        </span>
                    )}
                </div>
            </div>

            {/* Status & Price */}
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <Badge variant={config.variant} className="gap-2 px-3 py-1.5 uppercase tracking-wider">
                    <StatusIcon className="w-3 h-3" />
                    {booking.status}
                </Badge>

                <div className="text-right min-w-[80px]">
                    <div className="font-bold text-foreground">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: booking.currency || 'EUR' }).format((booking.basePriceCents || 0) / 100)}
                    </div>
                </div>

                <div className="w-px h-8 bg-border hidden md:block" />

                <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                </Button>
            </div>
        </Card>
    );
}

