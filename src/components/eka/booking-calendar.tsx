"use client";

import React, { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
// booking type removed; calendar only needs date slots
import fxService from '@/lib/fx-service';
import { Button } from '@/components/ui/button';

interface BookingCalendarProps {
  value?: string | null; // ISO datetime (local)
  onChange: (isoLocal: string) => void;
}

export default function BookingCalendar({ value, onChange }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(value ? new Date(value) : new Date());
  const hours = Array.from({ length: 11 }).map((_, i) => 8 + i); // 8..18

  // build a map of busy slots for selected date
  const busySlots = useMemo(() => {
    const dateKey = selectedDate.toISOString().slice(0,10);
    // try using fxService cached bookings if available
    try {
      const all = (fxService as any).getAllBookingsSync ? (fxService as any).getAllBookingsSync() : [];
      return (all || []).filter((b:any) => (b.date || '').slice(0,10) === dateKey).map((b:any) => new Date(b.date).getHours());
    } catch (e) {
      return [];
    }
  }, [selectedDate]);

  const handleSelectSlot = (hour: number) => {
    const dt = new Date(selectedDate);
    dt.setHours(hour, 0, 0, 0);
    onChange(dt.toISOString().slice(0,16));
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <DayPicker mode="single" selected={selectedDate} onSelect={(d:any)=> d && setSelectedDate(d)} />
      </div>
      <div>
        <div className="grid gap-2">
          {hours.map(h => {
            const disabled = busySlots.includes(h);
            const label = `${h}:00`;
            return (
              <Button key={h} onClick={()=>handleSelectSlot(h)} disabled={disabled} variant={disabled ? 'ghost' : 'default'}>
                {label} {disabled ? ' (Booked)' : ''}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
