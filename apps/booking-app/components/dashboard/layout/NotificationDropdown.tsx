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
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg relative border-none bg-card hover:bg-secondary shadow-sm hover:shadow-md transition-all">
          <Bell className="h-4 w-4 text-foreground" strokeWidth={2.5} />
          {unreadCount > 0 && (
             <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] rounded-2xl p-4 bg-card border-border shadow-[0_20px_60px_rgba(0,0,0,0.08)] mt-4">
        <DropdownMenuLabel className="px-4 py-3 text-base font-bold tracking-tight text-foreground flex items-center justify-between">
            Notifications
            {unreadCount > 0 && (
                <span className="text-xs bg-foreground text-background px-2 py-0.5 rounded-full">{unreadCount} New</span>
            )}
        </DropdownMenuLabel>
        
        {notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground/60">
                <Bell className="w-10 h-10 mb-3 opacity-20" strokeWidth={1.5} />
                <span className="text-sm font-medium">No notifications yet</span>
            </div>
        ) : (
            <div className="flex flex-col gap-1 mt-2">
                {notifications.map((n) => (
                    <DropdownMenuItem 
                        key={n.id} 
                        className={cn(
                            "cursor-pointer rounded-xl p-4 focus:bg-secondary hover:bg-secondary transition-all outline-none border border-transparent hover:border-border group",
                            !n.read ? "bg-secondary" : "bg-transparent"
                        )}
                    >
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex justify-between items-start gap-3">
                            <span className={cn("text-sm leading-tight text-foreground", !n.read ? "font-bold" : "font-medium")}>{n.title}</span>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5"></span>}
                        </div>
                        <span className="text-xs text-muted-foreground font-normal leading-relaxed line-clamp-2">{n.message}</span>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider pt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</span>
                    </div>
                    </DropdownMenuItem>
                ))}
            </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
