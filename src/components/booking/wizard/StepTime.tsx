'use client';

import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface StepTimeProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeSlots: string[];
  loadingSlots: boolean;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export function StepTime({
  date,
  setDate,
  timeSlots,
  loadingSlots,
  selectedTime,
  onTimeSelect,
}: StepTimeProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card border-border rounded-[20px] border p-4 shadow-sm">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="flex w-full justify-center"
          disabled={(date) => date < new Date() || date.getDay() === 0}
        />
      </div>
      <div className="space-y-6">
        <Label className="text-foreground text-lg font-bold">Available Slots</Label>
        {loadingSlots ? (
          <div className="text-muted-foreground flex items-center justify-center py-12">
            <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-6 w-6 animate-spin" />
            Looking for slots...
          </div>
        ) : timeSlots.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant="outline"
                className={cn(
                  'h-12 rounded-[20px] border-2 font-semibold transition-all',
                  selectedTime === time
                    ? 'bg-foreground text-background border-foreground hover:bg-foreground/90 scale-105 transform shadow-md'
                    : 'bg-card border-border text-foreground hover:border-muted hover:bg-secondary'
                )}
                onClick={() => onTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        ) : (
          <div className="bg-secondary border-border rounded-[20px] border py-12 text-center">
            <p className="text-muted-foreground font-medium">No slots available for this date.</p>
            <p className="text-muted-foreground mt-2 text-xs">Try selecting another day.</p>
          </div>
        )}
        <p className="text-muted-foreground text-center text-xs font-medium">
          All times are in local time.
        </p>
      </div>
    </div>
  );
}
