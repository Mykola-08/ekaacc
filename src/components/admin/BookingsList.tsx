'use client';

import { Booking } from '@/types/booking';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FilterBar } from '@/components/ui/filter-bar';
import { PageSection } from '@/components/ui/page-section';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';

interface BookingsListProps {
  bookings: Booking[];
}

export function BookingsList({ bookings }: BookingsListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      <PageSection
        title="Reservations"
        description="Comprehensive view of all platform sessions."
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email or service..."
        filters={['all', 'scheduled', 'pending', 'completed', 'canceled']}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <EmptyState icon={Calendar03Icon} title="No bookings found" />
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
  return (
    <Card className="apple-card flex flex-col items-center gap-6 p-5 md:flex-row">
      {/* Date Block */}
      <div className="flex min-w-[100px] flex-row items-center gap-3 md:flex-col md:items-start md:gap-0">
        <div className="text-foreground text-2xl font-semibold tracking-tight">
          {format(new Date(booking.startTime), 'MMM do')}
        </div>
        <div className="text-muted-foreground text-sm font-medium">
          {format(new Date(booking.startTime), 'h:mm a')}
        </div>
      </div>

      {/* Main Info */}
      <div className="w-full flex-1 space-y-1 text-center md:text-left">
        <h3 className="text-foreground text-lg font-semibold">{booking.serviceName}</h3>
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
        <StatusBadge status={booking.status} />

        <div className="min-w-[80px] text-right">
          <div className="text-foreground font-semibold">
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
