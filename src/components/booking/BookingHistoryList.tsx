'use client';

import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar03Icon, Clock01Icon, Location01Icon, CancelCircleIcon, ArrowLeft01Icon, Cancel01Icon, Navigation01Icon, Calendar02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/morphing-toaster';
import { cancelBookingAction } from '@/server/actions/booking-actions';
import { createClient } from '@/lib/supabase/client';
import { useBookingRealtime } from '@/hooks/useBookingRealtime';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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
      <div className="bg-card border-muted flex flex-col items-center justify-center rounded-[calc(var(--radius)*0.8)] border-2 border-dashed py-24 text-center">
        <div className="bg-background mb-6 rounded-full p-6">
          <HugeiconsIcon icon={Calendar03Icon} className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-foreground text-xl font-semibold tracking-tight">No bookings yet</h3>
        <p className="text-muted-foreground mt-2 max-w-xs font-medium">
          Your wellness journey begins with your first session.
        </p>
      </div>
    );
  }

  const upcoming = bookings.filter((b) => new Date(b.startTime) > new Date());
  const past = bookings.filter((b) => new Date(b.startTime) <= new Date());

  return (
    <div>
      {upcoming.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-foreground text-base font-bold tracking-tight">Upcoming</h2>
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
              {upcoming.length}
            </span>
          </div>
          <div className="grid gap-4">
            {upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} isUpcoming userId={userId} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div className={cn('space-y-4', upcoming.length > 0 && 'mt-8')}>
          <h2 className="text-muted-foreground text-base font-bold tracking-tight">Past Sessions</h2>
          <div className="grid gap-4 opacity-70 transition-opacity duration-300 hover:opacity-100">
            {past.map((booking) => (
              <BookingCard key={booking.id} booking={booking} userId={userId} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({
  booking,
  isUpcoming,
  userId,
}: {
  booking: Booking;
  isUpcoming?: boolean;
  userId?: string;
}) {
  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this session?')) return;

    if (userId) {
      const res = await cancelBookingAction(booking.id, userId);
      if (res.success) {
        toast.success('Booking cancelled successfully');
      } else {
        toast.error('Failed to cancel booking');
      }
    }
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[calc(var(--radius)*0.8)] transition-all duration-300',
        isUpcoming
          ? 'bg-card border border-transparent hover:-translate-y-0.5'
          : 'bg-card border-border border'
      )}
    >
      <div className="flex flex-col justify-between gap-8 p-8 md:flex-row md:items-center">
        <div className="flex flex-1 items-start gap-6">
          {/* Enhanced Date Block */}
          <div
            className={cn(
              'flex h-18 min-w-18 flex-col items-center justify-center rounded-[calc(var(--radius)*0.8)]',
              isUpcoming ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-muted-foreground'
            )}
          >
            <span className="text-xs font-black tracking-widest uppercase opacity-80">
              {format(new Date(booking.startTime), 'MMM')}
            </span>
            <span className="text-2xl font-black tracking-tighter">
              {format(new Date(booking.startTime), 'd')}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between md:justify-start md:gap-4">
              <StatusBadge status={booking.status} />
              {isUpcoming && booking.serviceName && (
                <span className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                  <HugeiconsIcon icon={Location01Icon} className="size-3" /> In-person
                </span>
              )}
            </div>

            <h3
              className={cn(
                'text-xl font-semibold tracking-tight transition-colors md:text-2xl',
                isUpcoming ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {booking.serviceName}
            </h3>

            <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Clock01Icon} className="size-4" />
                {format(new Date(booking.startTime), 'h:mm a')} -{' '}
                {format(new Date(booking.endTime), 'h:mm a')}
              </div>
            </div>
          </div>
        </div>

        {isUpcoming && booking.status !== 'cancelled' && (
          <div className="border-border flex shrink-0 flex-row gap-3 border-t pt-6 md:flex-col md:border-t-0 md:pt-0">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive h-9 w-full rounded-full text-xs font-semibold md:w-32"
              onClick={handleCancel}
            >
              <HugeiconsIcon icon={Cancel01Icon} className="mr-2 size-3" />
              Cancel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info('Rescheduling coming soon')}
              className="text-muted-foreground hover:text-foreground h-9 w-full rounded-full text-xs font-semibold md:w-32"
            >
              <HugeiconsIcon icon={Calendar02Icon} className="mr-2 size-3" />
              Reschedule
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-primary h-9 w-full p-0 text-xs font-semibold hover:no-underline hover:opacity-80 md:w-32"
            >
              <HugeiconsIcon icon={Navigation01Icon} className="mr-2 size-3" />
              Details
            </Button>
          </div>
        )}

        {!isUpcoming && (
          <div className="border-border flex shrink-0 flex-row gap-3 border-t pt-4 md:flex-col md:border-t-0 md:pt-0">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 w-full rounded-full text-xs font-semibold md:w-auto"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 size-3" />
              Book Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
