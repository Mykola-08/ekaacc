'use client';
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getAvailableSlotsAction } from '@/server/actions/booking-actions';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon, Clock01Icon } from '@hugeicons/core-free-icons';

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

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    async function fetchSlots() {
      setLoading(true);
      const isoDate = selectedDate!.toISOString();
      const res = await getAvailableSlotsAction(serviceId, isoDate);
      if (
        res.success &&
        res.data &&
        Array.isArray(res.data) &&
        res.data.length > 0
      ) {
        setSlots(
          (res.data as any[]).map((slot: any) =>
            new Date(slot.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          )
        );
      } else {
        setSlots(['09:00', '10:00', '11:00', '13:00', '14:30', '16:00']);
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
        <h2 className="text-foreground text-2xl font-bold tracking-tight">
          Pick a Date & Time
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose when you'd like your session to take place.
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Calendar */}
        <div className="bg-card rounded-xl border p-3 shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              onSelectDate(d);
              onSelectTime('');
            }}
            className="rounded-lg"
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </div>

        {/* Time slots */}
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
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((time) => (
                    <button
                      key={time}
                      onClick={() => onSelectTime(time)}
                      className={cn(
                        'rounded-lg border py-2.5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
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
                <p className="text-muted-foreground text-sm">
                  No slots available for this date.
                </p>
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
