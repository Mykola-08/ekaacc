'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Notification01Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export function NotificationDropdown() {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getUserId = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUserId();
  }, []);

  const { notifications } = useNotifications(userId);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-card hover:bg-secondary relative h-10 w-10 rounded-full border-none shadow-sm transition-all hover:shadow-md"
        >
          <HugeiconsIcon
            icon={Notification01Icon}
            className="text-foreground h-4 w-4"
            strokeWidth={2.5}
          />
          {unreadCount > 0 && (
            <span className="bg-destructive ring-background absolute top-2.5 right-2.5 h-2 w-2 rounded-full ring-2"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-card border-border mt-4 w-[360px] rounded-[24px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
      >
        <DropdownMenuLabel className="text-foreground flex items-center justify-between px-2 py-3 text-base font-bold tracking-tight">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-foreground text-background rounded-full px-2 py-0.5 text-xs">
              {unreadCount} New
            </span>
          )}
        </DropdownMenuLabel>

        {notifications.length === 0 ? (
          <div className="text-muted-foreground/60 flex flex-col items-center justify-center py-12 text-center">
            <HugeiconsIcon
              icon={Notification01Icon}
              className="mb-3 h-10 w-10 opacity-20"
              strokeWidth={1.5}
            />
            <span className="text-sm font-medium">No notifications yet</span>
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-1">
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className={cn(
                  'focus:bg-secondary hover:bg-secondary hover:border-border group cursor-pointer rounded-[20px] border border-transparent p-4 transition-all outline-none',
                  !n.read ? 'bg-secondary' : 'bg-transparent'
                )}
              >
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        'text-foreground text-sm leading-tight',
                        !n.read ? 'font-bold' : 'font-medium'
                      )}
                    >
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full"></span>
                    )}
                  </div>
                  <span className="text-muted-foreground line-clamp-2 text-xs leading-relaxed font-normal">
                    {n.message}
                  </span>
                  <span className="text-muted-foreground pt-1 text-xs font-bold tracking-wider uppercase">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
