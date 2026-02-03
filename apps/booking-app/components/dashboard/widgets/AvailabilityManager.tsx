'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Clock, Calendar as CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { toast } from "sonner";
import { StatsCard } from './StatsCard';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

// Mock initial state: true = available, false = blocked
const INITIAL_AVAILABILITY = DAYS.reduce((acc, day) => {
    acc[day] = HOURS.reduce((hAcc, hour) => {
        hAcc[hour] = true; // Default all open
        return hAcc;
    }, {} as Record<string, boolean>);
    return acc;
}, {} as Record<string, Record<string, boolean>>);

export function AvailabilityManager() {
    const [availability, setAvailability] = useState(INITIAL_AVAILABILITY);
    const [hasChanges, setHasChanges] = useState(false);

    const toggleSlot = (day: string, hour: string) => {
        if (!availability[day]) return;

        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [hour]: !prev[day]?.[hour]
            }
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        // Mock save
        toast.success("Availability updated successfully");
        setHasChanges(false);
    };

    return (
        <div className="space-y-6">
            <DashboardHeader title="Availability" subtitle="Manage your weekly working hours and time blocks.">
                <Button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={cn(
                        "rounded-full transition-all",
                        hasChanges ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "opacity-50"
                    )}
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </DashboardHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <StatsCard
                    icon={Clock}
                    label="Weekly Hours"
                    value="40h"
                    colorClass="bg-purple-50 text-purple-600"
                />
                <StatsCard
                    icon={CalendarIcon}
                    label="Days Active"
                    value="5/7"
                    colorClass="bg-blue-50 text-blue-600"
                />
            </div>

            <div className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden p-6 md:p-8">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left font-medium text-muted-foreground pb-6 w-20">Time</th>
                                {DAYS.map(day => (
                                    <th key={day} className="text-center font-bold text-foreground pb-6 min-w-[80px]">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {HOURS.map(hour => (
                                <tr key={hour} className="group">
                                    <td className="py-4 font-mono text-sm text-muted-foreground">{hour}</td>
                                    {DAYS.map(day => {
                                        const isAvailable = availability[day]?.[hour] ?? false;
                                        return (
                                            <td key={`${day}-${hour}`} className="p-2 text-center">
                                                <button
                                                    onClick={() => toggleSlot(day, hour)}
                                                    className={cn(
                                                        "w-full h-10 rounded-xl transition-all duration-200 flex items-center justify-center border-2",
                                                        isAvailable
                                                            ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-200"
                                                            : "bg-secondary/40 border-transparent text-muted-foreground/40 hover:bg-secondary/60"
                                                    )}
                                                >
                                                    {isAvailable ? <Check className="w-4 h-4" strokeWidth={3} /> : <X className="w-4 h-4" />}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-emerald-50 border-2 border-emerald-100"></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-secondary/40"></div>
                        <span>Blocked</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
