'use client';

/**
 * Upcoming Bookings Card
 *
 * Displays upcoming therapy/wellness session bookings with a clean card UI.
 */

import * as motion from 'motion/react-client';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon, Clock01Icon, UserIcon } from '@hugeicons/core-free-icons';

interface Booking {
  id: string;
  service: string;
  date: string;
  status: string;
  therapist?: string | null;
}

interface UpcomingBookingsProps {
  bookings: Booking[];
}

function formatDate(dateStr: string): { day: string; month: string; time: string } {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString(),
    month: d.toLocaleDateString('en', { month: 'short' }),
    time: d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }),
  };
}

export function UpcomingBookingsCard({ bookings }: UpcomingBookingsProps) {
  if (bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card w-full max-w-sm rounded-[calc(var(--radius)*0.8)] border p-4"
      >
        <div className="mb-2 flex items-center gap-2">
          <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground size-4"  />
          <p className="text-sm font-semibold">Upcoming Sessions</p>
        </div>
        <p className="text-muted-foreground text-sm">
          No upcoming sessions. Would you like to book one?
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card w-full max-w-sm rounded-[calc(var(--radius)*0.8)] border p-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-4"  />
        <p className="text-sm font-semibold">Upcoming Sessions</p>
      </div>

      <div className=".5">
        {bookings.map((b, i) => {
          const { day, month, time } = formatDate(b.date);
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="bg-muted/50 flex items-center gap-3 rounded-[var(--radius)] p-3"
            >
              <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-[calc(var(--radius)*0.8)]">
                <span className="text-sm leading-none font-semibold">{day}</span>
                <span className="text-[9px] leading-none uppercase">{month}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{b.service}</p>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <HugeiconsIcon icon={Clock01Icon} className="size-3"  />
                  <span>{time}</span>
                  {b.therapist && (
                    <>
                      <HugeiconsIcon icon={UserIcon} className="ml-1 size-3"  />
                      <span className="truncate">{b.therapist}</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
