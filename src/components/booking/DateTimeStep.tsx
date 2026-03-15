'use client';
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getAvailableSlotsAction } from '@/server/actions/booking-actions';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';

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
      // Simulate real slots integration; fetch available slots action
      const isoDate = selectedDate!.toISOString();
      const res = await getAvailableSlotsAction(serviceId, isoDate);
      if (res.success && res.data && Array.isArray(res.data) && Array.isArray(res.data) && res.data.length > 0) {
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
        // Fallback for demonstration
        setSlots(['09:00', '10:00', '11:00', '13:00', '14:30', '16:00']);
      }
      setLoading(false);
    }
    fetchSlots();
  }, [selectedDate, serviceId]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Select Date & Time</h2>
        <p className="text-muted-foreground">Choose when you would like to have your session.</p>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="bg-muted/20 rounded-lg border p-2 shadow-sm">
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

        <div className="flex-1">
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">
            {selectedDate
              ? selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Select a date first'}
          </h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <HugeiconsIcon icon={Loading03Icon} className="text-muted-foreground animate-spin" />
            </div>
          ) : selectedDate ? (
            <div className="grid grid-cols-3 gap-3">
              {slots.map((time) => (
                <button
                  key={time}
                  onClick={() => onSelectTime(time)}
                  className={cn(
                    'rounded-xl border py-3 text-sm font-semibold transition-all',
                    selectedTime === time
                      ? 'border-primary bg-primary text-primary-foreground shadow-md'
                      : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
