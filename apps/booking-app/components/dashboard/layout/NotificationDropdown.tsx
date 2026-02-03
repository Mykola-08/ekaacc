'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell, Info } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export function NotificationDropdown() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const getUserId = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);
    };
    getUserId();
  }, []);

  const { notifications } = useNotifications(userId);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full relative border-black/10 hover:bg-black/5 shadow-sm">
          <Bell className="h-4 w-4 opacity-70" />
          {unreadCount > 0 && (
             <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl shadow-black/5 mt-2">
        <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold tracking-tight opacity-70">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-2 bg-slate-100 dark:bg-slate-800" />
        
        {notifications.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-center text-muted-foreground opacity-60">
                <Bell className="w-8 h-8 mb-2 opacity-20" />
                <span className="text-xs">No notifications yet</span>
            </div>
        ) : (
            notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="cursor-pointer rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 transition-colors my-1">
                  <div className="flex flex-col gap-1.5 w-full">
                     <div className="flex justify-between items-start">
                        <span className={cn("text-sm leading-none text-foreground/90", !n.read ? "font-semibold" : "font-medium")}>{n.title}</span>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900 shrink-0 mt-0.5"></span>}
                     </div>
                     <span className="text-xs text-muted-foreground font-light line-clamp-2">{n.message}</span>
                     <span className="text-[10px] text-muted-foreground/50 text-right">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</span>
                  </div>
                </DropdownMenuItem>
            ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
