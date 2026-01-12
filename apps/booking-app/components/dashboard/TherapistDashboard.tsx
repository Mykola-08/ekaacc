"use client";

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, MoreVertical } from "lucide-react";
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
        <div className="w-full max-w-6xl mx-auto space-y-8 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-serif text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        {format(today, 'EEEE, MMMM do, yyyy')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <NotificationDropdown />
                    <Button variant="outline" className="rounded-full">View Calendar</Button>
                    <Button className="rounded-full">Add Block</Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <Card className="rounded-[1.5rem]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">For today</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <Card className="rounded-[1.5rem]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.confirmed}</div>
                            <p className="text-xs text-muted-foreground">Sessions confirmed</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <Card className="rounded-[1.5rem]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground">Awaiting action</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Schedule List */}
            <div className="space-y-4">
                <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <h2 className="text-xl font-semibold">Today's Schedule</h2>
                </div>
                
                <div className="space-y-4">
                    {schedule.length === 0 ? (
                        <div className="text-center py-12 bg-muted/30 rounded-[1.5rem] border border-dashed animate-slide-up" style={{ animationDelay: '500ms' }}>
                            <p className="text-muted-foreground">No bookings scheduled for today.</p>
                        </div>
                    ) : (
                        schedule.map((item, index) => (
                            <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${500 + index * 100}ms` }}>
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
    
    const statusMap = {
        confirmed: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
        pending: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
        cancelled: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
        completed: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    };
    
    const statusColor = statusMap[item.status as keyof typeof statusMap] || 'bg-secondary text-secondary-foreground';

    return (
        <Card className="hover:shadow-md transition-shadow duration-200 rounded-[1.5rem] overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Time Column */}
                <div className="p-6 md:w-48 flex flex-row md:flex-col justify-between md:justify-center items-center border-b md:border-b-0 md:border-r bg-muted/10">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-foreground">
                            {format(startTime, 'HH:mm')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            to {format(endTime, 'HH:mm')}
                        </span>
                    </div>
                    <Badge variant="outline" className={`mt-0 md:mt-2 ${statusColor} border`}>
                        {item.status}
                    </Badge>
                </div>

                {/* Details Column */}
                <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                {item.services?.title || 'Custom Session'}
                                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    {item.services?.duration} min
                                </span>
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                <User className="w-4 h-4" />
                                <span className="font-medium text-foreground">{clientName}</span>
                            </div>
                            {item.profiles?.phone && (
                                <p className="text-sm text-muted-foreground ml-6">{item.profiles.phone}</p>
                            )}
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Cancel Booking</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex gap-2 mt-2">
                        {item.status === 'pending' && (
                             <>
                                <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full">
                                    <CheckCircle className="w-4 h-4" />
                                    Confirm
                                </Button>
                                <Button size="sm" variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full">
                                    <XCircle className="w-4 h-4" />
                                    Decline
                                </Button>
                             </>
                        )}
                        {item.status === 'confirmed' && (
                            <Button size="sm" variant="secondary" className="gap-2 rounded-full">
                                <MapPin className="w-4 h-4" />
                                Check In
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
