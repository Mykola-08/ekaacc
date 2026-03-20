'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getAvailableSlotsAction } from '@/server/actions/booking-actions';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert01Icon, Loading03Icon, Clock01Icon } from '@hugeicons/core-free-icons';

interface DateTimeStepProps {
  selectedDate?: Date;
  onSelectDate: (date: Date | undefined) => void;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  serviceId: string;
}

export function DateTimeStep({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  serviceId,
}: DateTimeStepProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      setError(null);
      return;
    }

    async function fetchSlots() {
      setLoading(true);
      setError(null);

      const isoDate = selectedDate.toISOString();
      const res = await getAvailableSlotsAction(serviceId, isoDate);

      if (res.success && Array.isArray(res.data)) {
        const mapped = (res.data as any[])
          .map((slot) =>
            new Date(slot.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          )
          .filter(Boolean);

        setSlots(mapped);
      } else {
        setSlots([]);
        setError(res.error || 'Could not load time slots for this date.');
      }

      setLoading(false);
    }

    fetchSlots();
  }, [selectedDate, serviceId]);

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Pick a Date & Time</h2>
        <p className="text-muted-foreground text-sm">
          Choose when you'd like your session to take place.
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="bg-card rounded-[var(--radius)] border p-3 shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              onSelectDate(d);
              onSelectTime('');
            }}
            className="rounded-[calc(var(--radius)*0.8)]"
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </div>

        <div className="flex-1">
          {formattedDate ? (
            <>
              <div className="mb-4 flex items-center gap-2">
                <HugeiconsIcon icon={Clock01Icon} className="text-muted-foreground size-4" />
                <h3 className="text-foreground text-sm font-semibold">{formattedDate}</h3>
              </div>

              {loading ? (
                <div className="flex h-32 items-center justify-center">
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="text-muted-foreground size-6 animate-spin"
                  />
                </div>
              ) : error ? (
                <div className="text-destructive bg-destructive/10 flex items-start gap-2 rounded-[var(--radius)] p-3 text-sm">
                  <HugeiconsIcon icon={Alert01Icon} className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((time) => (
                    <button
                      key={time}
                      onClick={() => onSelectTime(time)}
                      className={cn(
                        'focus-visible:ring-primary rounded-[calc(var(--radius)*0.8)] border py-2.5 text-sm font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                        selectedTime === time
                          ? 'border-primary bg-primary text-primary-foreground shadow-md'
                          : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No slots available for this date.</p>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center py-12 text-center">
              <div>
                <HugeiconsIcon
                  icon={Clock01Icon}
                  className="text-muted-foreground/30 mx-auto mb-3 size-10"
                />
                <p className="text-muted-foreground text-sm">
                  Select a date to see available times
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
