'use client';

import { usePresence } from "@/hooks/usePresence";
import { Badge } from "@/components/ui/badge";

interface TherapistStatusProps {
    staffId: string;
    roomName?: string;
}

export function TherapistStatus({ staffId, roomName = 'global_staff_presence' }: TherapistStatusProps) {
    // In a real app, staff would join this room when they log in to their dashboard.
    // For now, we simulate monitoring the room.
    const { onlineUsers } = usePresence({ roomName, user: null }); // Passive observer

    const isOnline = onlineUsers.some(u => u.staff_id === staffId || u.user_id === staffId);

    if (!isOnline) {
        return <Badge variant="outline" className="text-muted-foreground border-muted">Offline</Badge>;
    }

    return (
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Online Now
        </span>
    );
}

