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
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-[14px] relative border-none bg-[#FEFFFE] hover:bg-[#F9F9F8] shadow-sm hover:shadow-md transition-all">
          <Bell className="h-4 w-4 text-[#222222]" strokeWidth={2.5} />
          {unreadCount > 0 && (
             <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#FF3F40] ring-2 ring-white"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] rounded-[32px] p-4 bg-[#FEFFFE] border-[#F5F5F5] shadow-[0_20px_60px_rgba(0,0,0,0.08)] mt-4">
        <DropdownMenuLabel className="px-4 py-3 text-base font-bold tracking-tight text-[#222222] flex items-center justify-between">
            Notifications
            {unreadCount > 0 && (
                <span className="text-[10px] bg-[#222222] text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>
            )}
        </DropdownMenuLabel>
        
        {notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-[#999999]/60">
                <Bell className="w-10 h-10 mb-3 opacity-20" strokeWidth={1.5} />
                <span className="text-sm font-medium">No notifications yet</span>
            </div>
        ) : (
            <div className="flex flex-col gap-1 mt-2">
                {notifications.map((n) => (
                    <DropdownMenuItem 
                        key={n.id} 
                        className={cn(
                            "cursor-pointer rounded-[20px] p-4 focus:bg-[#F9F9F8] hover:bg-[#F9F9F8] transition-all outline-none border border-transparent hover:border-[#F0F0F0] group",
                            !n.read ? "bg-[#F9F9F8]" : "bg-transparent"
                        )}
                    >
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex justify-between items-start gap-3">
                            <span className={cn("text-sm leading-tight text-[#222222]", !n.read ? "font-bold" : "font-medium")}>{n.title}</span>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-[#4DAFFF] shrink-0 mt-1.5"></span>}
                        </div>
                        <span className="text-xs text-[#555555] font-normal leading-relaxed line-clamp-2">{n.message}</span>
                        <span className="text-[10px] text-[#999999] font-bold uppercase tracking-wider pt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</span>
                    </div>
                    </DropdownMenuItem>
                ))}
            </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
