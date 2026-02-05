'use client';

import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Search, Filter, CheckCircle, XCircle, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ScheduleItem = {
    id: string;
    start_time: string;
    end_time: string;
    status: string;
    services: {
        title: string;
        duration: number;
    } | null;
    profiles: {
        first_name: string | null;
        last_name: string | null;
        email: string | null;
        phone: string | null;
    } | null;
};

interface ScheduleTableProps {
    schedule: any[];
    onAddBlock: () => void;
}

export function ScheduleTable({ schedule, onAddBlock }: ScheduleTableProps) {
    return (
        <div className="bg-[#FEFFFE] rounded-[32px] border border-[#F5F5F5] shadow-sm overflow-hidden">
            <div className="p-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-[24px] font-bold text-[#222222] tracking-tight mb-2">Today's Schedule</h2>
                    <p className="text-[#999999] font-medium leading-relaxed">Manage your daily appointments and blocks.</p>
                </div>
                <Button
                    onClick={onAddBlock}
                    className="rounded-[16px] px-6 h-12 font-bold bg-[#222222] text-white hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#222222]/20">
                    <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
                    Add Time Block
                </Button>
            </div>

            {/* Search / Filter Bar */}
            <div className="px-8 pb-8 flex gap-4">
                <div className="bg-[#F9F9F8] h-12 rounded-[16px] flex items-center px-4 flex-1 text-[#999999] text-sm font-bold gap-3 border-2 border-transparent focus-within:border-[#222222]/10 focus-within:bg-[#FEFFFE] transition-all">
                    <Search className="w-4 h-4 opacity-70" strokeWidth={2.5} /> Search bookings...
                </div>
                <div className="bg-[#F9F9F8] h-12 rounded-[16px] flex items-center px-4 md:w-48 text-[#222222] text-sm font-bold gap-2 justify-between cursor-pointer hover:bg-[#F0F0F0] transition-colors border-2 border-transparent">
                    <span>All Statuses</span> <Filter className="w-4 h-4 text-[#999999]" strokeWidth={2.5} />
                </div>
            </div>

            <div className="border-t border-[#F5F5F5]">
                {schedule.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="p-6 bg-[#F9F9F8] rounded-full mb-6 text-[#999999]">
                            <Calendar className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <p className="text-[#222222] font-bold text-lg mb-2">No bookings scheduled for today.</p>
                        <p className="text-[#999999] text-sm max-w-xs mx-auto">Your schedule looks clear. You can add time blocks manually if needed.</p>
                    </div>
                ) : (
                    // Table Header
                    <div className="w-full">
                        <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-[#F9F9F8] text-[11px] font-bold text-[#999999] uppercase tracking-[0.1em] border-b border-[#F5F5F5]">
                            <div className="col-span-4 md:col-span-3">Details</div>
                            <div className="col-span-3 md:col-span-2">Status</div>
                            <div className="hidden md:block md:col-span-3">Client</div>
                            <div className="col-span-3 md:col-span-2">Time</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>
                        <div className="divide-y divide-[#F5F5F5]">
                            {schedule.map((item) => (
                                <ScheduleRow key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ScheduleRow({ item }: { item: ScheduleItem }) {
    const startTime = new Date(item.start_time);
    const clientName = item.profiles
        ? `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() || item.profiles.email
        : 'Unknown Client';

    // Status Badge Style - Porcelain System
    const statusStyles: Record<string, string> = {
        confirmed: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
        pending: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 animate-pulse',
        cancelled: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
        completed: 'bg-[#F9F9F8] text-[#999999] border-[#EAEAEA]',
    };

    const statusClass = statusStyles[item.status] || 'bg-[#F9F9F8] text-[#999999] border-[#EAEAEA]';

    return (
        <div className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-[#F9F9F8] transition-colors group">
            {/* Service & Title */}
            <div className="col-span-4 md:col-span-3">
                <div className="font-bold text-[#222222] text-[15px] truncate">{item.services?.title || 'Custom Session'}</div>
                <div className="text-xs text-[#999999] font-medium md:hidden">{clientName}</div>
            </div>

            {/* Status Pill */}
            <div className="col-span-3 md:col-span-2">
                <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", statusClass)}>
                    {item.status}
                </span>
            </div>

            {/* Client (Desktop) */}
            <div className="hidden md:block md:col-span-3">
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 border border-[#EAEAEA]">
                        <AvatarFallback className="text-[11px] bg-[#F9F9F8] font-bold text-[#999999]">
                            {(clientName?.substring(0, 2) || '??').toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-[14px] font-bold text-[#555555]">{clientName}</span>
                </div>
            </div>

            {/* Time */}
            <div className="col-span-3 md:col-span-2">
                <div className="font-mono text-[14px] font-bold text-[#222222]">
                    {format(startTime, 'HH:mm')}
                </div>
                <div className="text-xs text-[#999999] font-medium">
                    {item.services?.duration} min
                </div>
            </div>

            {/* Actions */}
            <div className="col-span-2 flex justify-end gap-2">
                {item.status === 'pending' ? (
                    <div className="flex gap-2">
                        <Button size="icon" className="h-9 w-9 rounded-[12px] bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981] hover:text-white shadow-none border border-transparent transition-all">
                            <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
                        </Button>
                        <Button size="icon" className="h-9 w-9 rounded-[12px] bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white shadow-none border border-transparent transition-all">
                            <XCircle className="w-5 h-5" strokeWidth={2.5} />
                        </Button>
                    </div>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[10px] text-[#999999] hover:bg-[#EAEAEA] hover:text-[#222222]">
                                <MoreVertical className="w-5 h-5" strokeWidth={2} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-[20px] p-2 border-[#EAEAEA] shadow-lg">
                            <DropdownMenuItem className="rounded-[12px] cursor-pointer font-medium text-[13px] px-4 py-2 hover:bg-[#F9F9F8] transition-colors focus:bg-[#F9F9F8]">View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-[#EF4444] rounded-[12px] cursor-pointer font-medium text-[13px] px-4 py-2 hover:bg-[#EF4444]/10 transition-colors focus:bg-[#EF4444]/10">Cancel Booking</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}
