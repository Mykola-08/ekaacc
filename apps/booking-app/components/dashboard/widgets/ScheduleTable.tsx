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
        <div className="bg-card rounded-[36px] border border-border shadow-sm overflow-hidden">
            <div className="p-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-[24px] font-semibold text-foreground tracking-tight">Today's Schedule</h2>
                    <p className="text-muted-foreground font-medium">Manage your daily appointments.</p>
                </div>
                <Button
                    onClick={onAddBlock}
                    className="rounded-[18px] px-6 h-12 font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-none">
                    <Plus className="w-5 h-5 mr-2" strokeWidth={2.75} />
                    Add Time Block
                </Button>
            </div>

            {/* Search / Filter Bar (Mock) */}
            <div className="px-8 pb-6 flex gap-4">
                <div className="bg-secondary/50 h-12 rounded-[16px] flex items-center px-4 flex-1 text-muted-foreground text-sm font-medium gap-2">
                    <Search className="w-4 h-4 opacity-50" /> Search bookings...
                </div>
                <div className="bg-secondary/50 h-12 rounded-[16px] flex items-center px-4 md:w-48 text-muted-foreground text-sm font-medium gap-2 justify-between cursor-pointer hover:bg-secondary/70 transition-colors">
                    <span>All Statuses</span> <Filter className="w-4 h-4 opacity-50" />
                </div>
            </div>

            <div className="border-t border-border">
                {schedule.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="p-4 bg-secondary rounded-full mb-4 text-muted-foreground">
                            <Calendar className="w-8 h-8" strokeWidth={2} />
                        </div>
                        <p className="text-muted-foreground font-medium text-lg">No bookings scheduled for today.</p>
                    </div>
                ) : (
                    // Table Header
                    <div className="w-full">
                        <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-secondary/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <div className="col-span-4 md:col-span-3">Details</div>
                            <div className="col-span-3 md:col-span-2">Status</div>
                            <div className="hidden md:block md:col-span-3">Client</div>
                            <div className="col-span-3 md:col-span-2">Time</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>
                        <div className="divide-y divide-border/60">
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

    // Status Badge Style
    const statusStyles: Record<string, string> = {
        confirmed: 'bg-emerald-100/50 text-emerald-700 border-emerald-200',
        pending: 'bg-amber-100/50 text-amber-700 border-amber-200',
        cancelled: 'bg-red-100/50 text-red-700 border-red-200',
        completed: 'bg-gray-100 text-gray-600 border-gray-200',
    };

    const statusClass = statusStyles[item.status] || 'bg-gray-100 text-gray-600';

    return (
        <div className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-secondary/30 transition-colors group">
            {/* Service & Title */}
            <div className="col-span-4 md:col-span-3">
                <div className="font-semibold text-foreground text-[15px] truncate">{item.services?.title || 'Custom Session'}</div>
                <div className="text-xs text-muted-foreground font-medium md:hidden">{clientName}</div>
            </div>

            {/* Status Pill */}
            <div className="col-span-3 md:col-span-2">
                <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border", statusClass)}>
                    {item.status}
                </span>
            </div>

            {/* Client (Desktop) */}
            <div className="hidden md:block md:col-span-3">
                <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-[10px] bg-secondary font-bold text-muted-foreground">
                            {(clientName?.substring(0, 2) || '??').toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-[14px] font-medium text-muted-foreground">{clientName}</span>
                </div>
            </div>

            {/* Time */}
            <div className="col-span-3 md:col-span-2">
                <div className="font-mono text-[14px] font-medium text-foreground">
                    {format(startTime, 'HH:mm')}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                    {item.services?.duration} min
                </div>
            </div>

            {/* Actions */}
            <div className="col-span-2 flex justify-end gap-2">
                {item.status === 'pending' ? (
                    <div className="flex gap-1">
                        <Button size="icon" className="h-9 w-9 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 shadow-none border-0">
                            <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button size="icon" className="h-9 w-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 shadow-none border-0">
                            <XCircle className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl p-2">
                            <DropdownMenuItem className="rounded-lg cursor-pointer font-medium text-[13px]">View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive rounded-lg cursor-pointer font-medium text-[13px]">Cancel</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}
