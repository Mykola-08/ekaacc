'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, Calendar as CalendarIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { toast } from '@/components/ui/morphing-toaster';
import { StatsCard } from './StatsCard';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

// Mock initial state: true = available, false = blocked
const INITIAL_AVAILABILITY = DAYS.reduce(
  (acc, day) => {
    acc[day] = HOURS.reduce(
      (hAcc, hour) => {
        hAcc[hour] = true; // Default all open
        return hAcc;
      },
      {} as Record<string, boolean>
    );
    return acc;
  },
  {} as Record<string, Record<string, boolean>>
);

export function AvailabilityManager() {
  const [availability, setAvailability] = useState(INITIAL_AVAILABILITY);
  const [hasChanges, setHasChanges] = useState(false);

  const toggleSlot = (day: string, hour: string) => {
    if (!availability[day]) return;

    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: !prev[day]?.[hour],
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Mock save
    toast.success('Availability updated successfully');
    setHasChanges(false);
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Availability"
        subtitle="Manage your weekly working hours and time blocks."
      >
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className={cn(
            'h-10 rounded-lg px-6 font-semibold transition-all',
            hasChanges
              ? 'bg-foreground text-background hover:bg-foreground/90'
              : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
          )}
        >
          <Save className="mr-2 h-4 w-4" strokeWidth={2.5} />
          Save Changes
        </Button>
      </DashboardHeader>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Quick Stats */}
        <StatsCard
          icon={Clock}
          label="Weekly Hours"
          value="40h"
          colorClass="bg-card text-foreground"
        />
        <StatsCard
          icon={CalendarIcon}
          label="Days Active"
          value="5/7"
          colorClass="bg-card text-foreground"
        />
      </div>

      <div className="bg-card border-border overflow-hidden rounded-xl border p-6 md:p-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-muted-foreground w-20 pb-6 text-left text-xs font-semibold tracking-wider uppercase">
                  Time
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="text-foreground min-w-[80px] pb-6 text-center text-sm font-semibold tracking-wider uppercase"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {HOURS.map((hour) => (
                <tr key={hour} className="group hover:bg-secondary/50 transition-colors">
                  <td className="text-muted-foreground group-hover:text-foreground py-4 font-mono text-xs font-semibold transition-colors">
                    {hour}
                  </td>
                  {DAYS.map((day) => {
                    const isAvailable = availability[day]?.[hour] ?? false;
                    return (
                      <td key={`${day}-${hour}`} className="p-2 text-center">
                        <button
                          onClick={() => toggleSlot(day, hour)}
                          className={cn(
                            'flex h-10 w-full items-center justify-center rounded-lg border-2 transition-all duration-200',
                            isAvailable
                              ? 'bg-card hover:border-primary text-primary border-transparent'
                              : 'border-border text-muted hover:bg-secondary bg-transparent'
                          )}
                        >
                          {isAvailable ? (
                            <Check className="h-4 w-4" strokeWidth={3} />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-muted-foreground mt-8 flex items-center justify-center gap-8 text-sm font-semibold">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 border-primary/20 text-primary flex h-5 w-5 items-center justify-center rounded-md border-2">
            <Check className="h-3 w-3" strokeWidth={4} />
          </div>
          <span className="text-foreground">Available</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-border h-5 w-5 rounded-md border-2 border-transparent"></div>
          <span>Blocked</span>
        </div>
      </div>
    </div>
  );
}
