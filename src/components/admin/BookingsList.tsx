'use client';

import { Booking } from '@/types/booking';
import { format } from 'date-fns';
import { CheckCircle, Clock, XCircle, Search, Calendar, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BookingsListProps {
  bookings: Booking[];
}

export function BookingsList({ bookings }: BookingsListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'scheduled' | 'pending' | 'completed' | 'canceled'
  >('all');

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      booking.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      booking.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in h-full w-full space-y-8 p-6 md:p-12">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Comprehensive view of all platform sessions.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="flex flex-col items-center gap-4 p-4 md:flex-row">
        <div className="relative w-full flex-1 md:w-auto">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by name, email or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
          {['all', 'scheduled', 'pending', 'completed', 'canceled'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status as any)}
              className={cn(
                'h-9 rounded-full px-5 capitalize',
                statusFilter === status ? 'bg-primary' : 'text-muted-foreground border-border'
              )}
            >
              {status}
            </Button>
          ))}
        </div>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card className="bg-muted/50 flex flex-col items-center justify-center border-dashed py-20">
            <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Calendar className="text-muted-foreground h-6 w-6" />
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
  const config =
    statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.scheduled;
  const StatusIcon = config.icon;

  return (
    <Card className="apple-card flex flex-col items-center gap-6 p-5 md:flex-row">
      {/* Date Block */}
      <div className="flex min-w-[100px] flex-row items-center gap-3 md:flex-col md:items-start md:gap-0">
        <div className="text-foreground text-2xl font-bold tracking-tight">
          {format(new Date(booking.startTime), 'MMM do')}
        </div>
        <div className="text-muted-foreground text-sm font-medium">
          {format(new Date(booking.startTime), 'h:mm a')}
        </div>
      </div>

      {/* Main Info */}
      <div className="w-full flex-1 space-y-1 text-center md:text-left">
        <h3 className="text-foreground text-lg font-bold">{booking.serviceName}</h3>
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <span className="text-muted-foreground bg-muted/50 border-border flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm">
            <span className="bg-muted-foreground/50 h-1.5 w-1.5 rounded-full" />
            {booking.displayName || 'Guest'}
          </span>
          {booking.email && (
            <span className="text-muted-foreground hidden text-sm sm:inline">{booking.email}</span>
          )}
        </div>
      </div>

      {/* Status & Price */}
      <div className="flex w-full items-center justify-between gap-6 md:w-auto md:justify-end">
        <Badge variant={config.variant} className="gap-2 px-3 py-1.5 tracking-wider uppercase">
          <StatusIcon className="h-3 w-3" />
          {booking.status}
        </Badge>

        <div className="min-w-[80px] text-right">
          <div className="text-foreground font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: booking.currency || 'EUR',
            }).format((booking.basePriceCents || 0) / 100)}
          </div>
        </div>

        <div className="bg-border hidden h-8 w-px md:block" />

        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal className="text-muted-foreground h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
