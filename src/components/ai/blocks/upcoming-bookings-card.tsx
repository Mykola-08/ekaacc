"use client";

/**
 * Upcoming Bookings Card
 *
 * Displays upcoming therapy/wellness session bookings with a clean card UI.
 */

import * as motion from "motion/react-client";
import { Calendar, Clock, User } from "lucide-react";

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
    month: d.toLocaleDateString("en", { month: "short" }),
    time: d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}

export function UpcomingBookingsCard({ bookings }: UpcomingBookingsProps) {
  if (bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border p-4 w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <p className="text-sm font-semibold">Upcoming Sessions</p>
        </div>
        <p className="text-muted-foreground text-sm">No upcoming sessions. Would you like to book one?</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card rounded-2xl border p-4 w-full max-w-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="text-primary h-4 w-4" />
        <p className="text-sm font-semibold">Upcoming Sessions</p>
      </div>

      <div className="space-y-2.5">
        {bookings.map((b, i) => {
          const { day, month, time } = formatDate(b.date);
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="bg-muted/50 flex items-center gap-3 rounded-xl p-3"
            >
              <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg">
                <span className="text-sm font-bold leading-none">{day}</span>
                <span className="text-[9px] uppercase leading-none">{month}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{b.service}</p>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{time}</span>
                  {b.therapist && (
                    <>
                      <User className="ml-1 h-3 w-3" />
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
