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
        <div className="space-y-8">
            <DashboardHeader title="Availability" subtitle="Manage your weekly working hours and time blocks.">
                <Button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={cn(
                        "rounded-[16px] h-10 px-6 font-bold transition-all",
                        hasChanges ? "bg-[#222222] text-white shadow-lg shadow-[#222222]/20 hover:bg-black hover:scale-105 active:scale-95" : "bg-[#EAEAEA] text-[#999999] opacity-50 cursor-not-allowed"
                    )}
                >
                    <Save className="w-4 h-4 mr-2" strokeWidth={2.5} />
                    Save Changes
                </Button>
            </DashboardHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <StatsCard
                    icon={Clock}
                    label="Weekly Hours"
                    value="40h"
                    colorClass="bg-[#F9F9F8] text-[#222222]"
                />
                <StatsCard
                    icon={CalendarIcon}
                    label="Days Active"
                    value="5/7"
                    colorClass="bg-[#F9F9F8] text-[#222222]"
                />
            </div>

            <div className="bg-[#FEFFFE] rounded-[32px] border border-[#F5F5F5] shadow-sm p-6 md:p-8 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left font-bold text-[#999999] pb-6 w-20 uppercase text-[11px] tracking-wider">Time</th>
                                {DAYS.map(day => (
                                    <th key={day} className="text-center font-bold text-[#222222] pb-6 min-w-[80px] text-sm uppercase tracking-wider">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {HOURS.map(hour => (
                                <tr key={hour} className="group hover:bg-[#F9F9F8] transition-colors">
                                    <td className="py-4 font-mono text-[11px] font-bold text-[#999999] group-hover:text-[#222222] transition-colors">{hour}</td>
                                    {DAYS.map(day => {
                                        const isAvailable = availability[day]?.[hour] ?? false;
                                        return (
                                            <td key={`${day}-${hour}`} className="p-2 text-center">
                                                <button
                                                    onClick={() => toggleSlot(day, hour)}
                                                    className={cn(
                                                        "w-full h-10 rounded-[12px] transition-all duration-200 flex items-center justify-center border-2",
                                                        isAvailable 
                                                            ? "bg-[#F7F8F9] border-transparent hover:border-[#4DAFFF] text-[#4DAFFF]" 
                                                            : "bg-transparent border-[#EEEEEE] text-[#DDDDDD] hover:bg-[#F9F9F8]"
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
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm font-bold text-[#999999]">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-[6px] bg-[#4DAFFF]/10 border-2 border-[#4DAFFF]/20 flex items-center justify-center text-[#4DAFFF]">
                         <Check className="w-3 h-3" strokeWidth={4} />
                    </div>
                    <span className="text-[#222222]">Available</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-[6px] bg-[#F5F5F5] border-2 border-transparent"></div>
                    <span>Blocked</span>
                </div>
            </div>
        </div>
    );
}
