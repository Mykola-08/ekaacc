"use client";

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, MoreVertical, Plus } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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

    const stats = useMemo(() => {
        const total = schedule.length;
        const confirmed = schedule.filter(s => s.status === 'confirmed').length;
        const pending = schedule.filter(s => s.status === 'pending').length;
        return { total, confirmed, pending };
    }, [schedule]);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-foreground tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        {format(today, 'EEEE, MMMM do, yyyy')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <NotificationDropdown />
                    <Button variant="outline" className="rounded-full shadow-sm hover:bg-muted">View Calendar</Button>
                    <Button className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Block
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-full">
                    <Card className="h-full hover:scale-[1.02] transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">For today</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="h-full">
                    <Card className="h-full hover:scale-[1.02] transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-teal-600">{stats.confirmed}</div>
                            <p className="text-xs text-muted-foreground mt-1">Sessions confirmed</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="h-full">
                    <Card className="h-full hover:scale-[1.02] transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-amber-500">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Schedule List */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Today's Schedule</h2>
                </div>
                
                <div className="space-y-4">
                    {schedule.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border text-center">
                            <div className="p-4 bg-muted rounded-full mb-3">
                                <Calendar className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground font-medium">No bookings scheduled for today.</p>
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
    
    // Updated badges to use semantic tokens closer to design system
    const statusMap = {
        confirmed: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
        pending: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
        cancelled: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
        completed: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    };
    
    // @ts-ignore
    const statusColor = statusMap[item.status] || 'bg-secondary text-secondary-foreground';

    return (
        <Card className="group hover:shadow-md transition-all duration-300 border-none shadow-sm bg-card overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Time Column */}
                <div className="p-6 md:w-48 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-border/50 bg-muted/10">
                    <div className="text-center md:text-left">
                        <span className="block text-2xl font-bold text-foreground">
                            {format(startTime, 'HH:mm')}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium">
                            {format(endTime, 'HH:mm')}
                        </span>
                    </div>
                </div>

                {/* Details Column */}
                <div className="flex-1 p-6 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                             <Badge variant="outline" className={`rounded-full px-3 py-0.5 font-normal ${statusColor} border`}>
                                {item.status}
                            </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                            {item.services?.title || 'Custom Session'}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{item.services?.duration} min</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" />
                                <span className="font-medium text-foreground/80">{clientName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                        {item.status === 'pending' && (
                             <div className="flex gap-2 w-full md:w-auto">
                                <Button size="sm" className="flex-1 md:flex-none gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-sm">
                                    <CheckCircle className="w-4 h-4" />
                                    Confirm
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 md:flex-none gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/30 rounded-full">
                                    <XCircle className="w-4 h-4" />
                                    Decline
                                </Button>
                             </div>
                        )}
                        {item.status === 'confirmed' && (
                            <Button size="sm" variant="secondary" className="w-full md:w-auto gap-2 rounded-full bg-secondary/80 hover:bg-secondary">
                                <MapPin className="w-4 h-4" />
                                Check In
                            </Button>
                        )}
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem className="rounded-lg cursor-pointer">View Details</DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg cursor-pointer">Reschedule</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive rounded-lg cursor-pointer focus:bg-destructive/10 focus:text-destructive">Cancel Booking</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </Card>
    );
}
