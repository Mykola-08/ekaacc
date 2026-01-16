"use client";

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, MoreVertical, Plus, ArrowUpRight } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/context/LanguageContext';
import { useBookingRealtime } from "@/hooks/useBookingRealtime";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

export function TherapistDashboard({ schedule }: { schedule: any[] }) {
    const today = new Date();
    const { t } = useLanguage();
    const router = useRouter();

    // Listen for booking updates
    useBookingRealtime((payload) => {
        console.log("Realtime update received:", payload);
        toast.info("Schedule updated");
        router.refresh();
    });

    const stats = useMemo(() => {
        const total = schedule.length;
        const confirmed = schedule.filter(s => s.status === 'confirmed').length;
        const pending = schedule.filter(s => s.status === 'pending').length;
        return { total, confirmed, pending };
    }, [schedule]);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-12 p-6 md:p-10 animate-in fade-in duration-700">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground/90">{t('nav.dashboard')}</h1>
                    <p className="text-lg text-muted-foreground font-light flex items-center gap-2 mt-2">
                        <Calendar className="w-4 h-4 opacity-70" />
                        {format(today, 'EEEE, MMMM do, yyyy')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationDropdown />
                    <Button variant="outline" className="rounded-full border-border/40 hover:bg-foreground/5 shadow-none backdrop-blur-md">
                        {t('therapist.view_calendar')}
                    </Button>
                    <Button className="rounded-full px-5 h-10 font-medium bg-foreground text-background hover:opacity-90 shadow-none">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('therapist.add_block')}
                    </Button>
                </div>
            </div>

            {/* Notion-like Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group p-6 rounded-[28px] glass-card hover:bg-white/80 transition-all duration-500">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{t('therapist.total_bookings')}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-semibold tracking-tighter text-foreground">{stats.total}</span>
                        <span className="text-muted-foreground font-light">{t('therapist.for_today')}</span>
                    </div>
                </div>
                
                <div className="group p-6 rounded-[28px] glass-card hover:bg-white/80 transition-all duration-500">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{t('status.confirmed')}</h3>
                    <div className="flex items-baseline gap-2">
                         <span className="text-5xl font-semibold tracking-tighter text-primary dark:text-blue-400">{stats.confirmed}</span>
                        <span className="text-muted-foreground font-light">{t('therapist.sessions_confirmed')}</span>
                    </div>
                </div>

                <div className="group p-6 rounded-[28px] glass-card hover:bg-white/80 transition-all duration-500">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{t('status.pending')}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-semibold tracking-tighter text-amber-500 dark:text-amber-400">{stats.pending}</span>
                         <span className="text-muted-foreground font-light">{t('therapist.awaiting_action')}</span>
                    </div>
                </div>
            </div>

            {/* Manual Verification Queue (NEW) */}
             <div className="p-8 rounded-4xl border border-border/50 bg-background/50">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-foreground/80">Payment Verifications</h2>
                    <Button variant="ghost" size="sm">View All</Button>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
                        No pending proofs to review.
                    </div>
                 </div>
            </div>

            {/* Minimal Schedule List */}
            <div className="space-y-6">
                <h2 className="text-xl font-medium text-foreground/80">Today's Schedule</h2>
                
                <div className="space-y-4">
                    {schedule.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 rounded-[28px] border border-dashed border-black/10 text-center glass-card">
                            <div className="p-4 bg-foreground/5 rounded-full mb-4">
                                <Calendar className="w-6 h-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-muted-foreground font-light text-lg">No bookings scheduled for today.</p>
                        </div>
                    ) : (
                        schedule.map((item, index) => (
                            <div key={item.id}>
                                <ScheduleCard item={item} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function ScheduleCard({ item }: { item: ScheduleItem }) {
    const startTime = new Date(item.start_time);
    const endTime = new Date(item.end_time);
    const clientName = item.profiles 
        ? `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() || item.profiles.email 
        : 'Unknown Client';
    
    // Minimalist status indicators
    const statusColor = {
        confirmed: 'bg-blue-500/10 text-primary dark:text-blue-400 border-blue-200/50',
        pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50',
        cancelled: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50',
        completed: 'bg-muted text-muted-foreground border-border/50',
    }[item.status as string] || 'bg-secondary text-secondary-foreground';

    return (
        <div className="group relative rounded-2xl glass-card hover:bg-white/80 transition-all duration-300 overflow-hidden">
            <div className="flex flex-col md:flex-row">
                
                {/* Time - Minimal */}
                <div className="p-6 md:w-40 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-black/5 bg-black/2">
                    <div className="text-center md:text-left space-y-1">
                        <span className="block text-xl font-semibold tracking-tight text-foreground/90">
                            {format(startTime, 'HH:mm')}
                        </span>
                        <span className="block text-sm text-muted-foreground font-mono opacity-70">
                            {format(endTime, 'HH:mm')}
                        </span>
                    </div>
                </div>

                {/* Content - Clean */}
                <div className="flex-1 p-6 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                             <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium uppercase tracking-wider border ${statusColor}`}>
                                {item.status}
                            </span>
                            <span className="text-sm text-muted-foreground font-light flex items-center gap-1">
                                <Clock className="w-3 h-3 opacity-50" />
                                {item.services?.duration} min
                            </span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-foreground tracking-tight">
                            {item.services?.title || 'Custom Session'}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Avatar className="w-6 h-6 border border-border/50">
                                <AvatarFallback className="text-[10px] bg-foreground/5">{(clientName || '??').substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-normal text-foreground/80">{clientName}</span>
                        </div>
                    </div>

                    {/* Actions - Flat */}
                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                        {item.status === 'pending' && (
                             <div className="flex gap-3 w-full md:w-auto">
                                <Button size="sm" className="flex-1 md:flex-none h-9 rounded-xl bg-green-600/90 hover:bg-green-600 text-white shadow-none border border-transparent">
                                    <CheckCircle className="w-4 h-4 mr-2 opacity-90" />
                                    Confirm
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 md:flex-none h-9 rounded-xl text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/30">
                                    <XCircle className="w-4 h-4 mr-2 opacity-90" />
                                    Decline
                                </Button>
                             </div>
                        )}
                        {item.status === 'confirmed' && (
                            <Button size="sm" variant="secondary" className="w-full md:w-auto h-9 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground shadow-none">
                                <MapPin className="w-3.5 h-3.5 mr-2 opacity-60" />
                                Check In
                            </Button>
                        )}
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-foreground/5">
                                    <MoreVertical className="w-4 h-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl glass-panel shadow-lg">
                                <DropdownMenuItem className="rounded-lg cursor-pointer my-1">View Details</DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg cursor-pointer my-1">Reschedule</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive rounded-lg cursor-pointer my-1">Cancel Booking</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
}
