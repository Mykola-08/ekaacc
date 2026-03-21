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
import {
  Notification01Icon,
  CheckmarkCircle01Icon,
  Calendar03Icon,
  Message01Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function notificationIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes('book') || t.includes('session') || t.includes('appointment'))
    return <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-3.5" />;
  if (t.includes('message') || t.includes('chat'))
    return <HugeiconsIcon icon={Message01Icon} className="text-success size-3.5" />;
  if (t.includes('alert') || t.includes('urgent') || t.includes('cancel'))
    return <HugeiconsIcon icon={AlertCircleIcon} className="text-destructive size-3.5" />;
  return <HugeiconsIcon icon={Notification01Icon} className="text-muted-foreground size-3.5" />;
}

export function NotificationDropdown() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [markingAll, setMarkingAll] = useState(false);

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

  const { notifications, setNotifications } = useNotifications(userId);
  const markAllRead = async () => {
    setNotifications((prev: any) => prev.map((n: any) => ({ ...n, read: true })));
  };
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    if (!markAllRead || markingAll) return;
    setMarkingAll(true);
    try {
      await markAllRead();
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative size-8 transition-colors duration-150',
            unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <HugeiconsIcon icon={Notification01Icon} className="size-4" strokeWidth={2} />
          {unreadCount > 0 && (
            <span className="bg-destructive ring-background animate-in zoom-in-50 absolute top-2.5 right-2.5 h-2 w-2 rounded-full ring-2 duration-200" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="mt-2 w-80 p-0" sideOffset={6}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="p-0 text-sm font-semibold tracking-tight">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                {unreadCount}
              </span>
            )}
          </DropdownMenuLabel>
          {unreadCount > 0 && markAllRead && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-6 gap-1 px-2 text-[11px]"
              onClick={handleMarkAllRead}
              disabled={markingAll}
            >
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" />
              Mark all read
            </Button>
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />

        {notifications.length === 0 ? (
          <div className="text-muted-foreground/60 flex flex-col items-center justify-center py-10 text-center">
            <HugeiconsIcon
              icon={Notification01Icon}
              className="mb-2.5 size-9 opacity-20"
              strokeWidth={1.5}
            />
            <span className="text-sm font-medium">All caught up</span>
            <span className="mt-0.5 text-xs">No notifications yet</span>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            <div className="flex flex-col gap-0.5 p-2">
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className={cn(
                    'group cursor-pointer rounded-[calc(var(--radius)*0.8)] border border-transparent p-3 transition-all duration-150 outline-none',
                    'hover:bg-muted/60 hover:border-border/50 focus:bg-muted/60',
                    !n.read && 'bg-secondary/60'
                  )}
                >
                  <div className="flex w-full gap-2.5">
                    {/* Icon */}
                    <div className="bg-muted mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                      {notificationIcon(n.title)}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            'text-sm leading-tight',
                            !n.read
                              ? 'text-foreground font-semibold'
                              : 'text-foreground/80 font-medium'
                          )}
                        >
                          {n.title}
                        </span>
                        {!n.read && (
                          <span className="bg-primary mt-1 size-1.5 shrink-0 rounded-full" />
                        )}
                      </div>
                      <span className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                        {n.message}
                      </span>
                      <span className="text-muted-foreground/50 mt-0.5 text-[10px] font-medium tracking-wider uppercase">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        )}

        {/* Footer — view all */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2">
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-[calc(var(--radius)*0.8)] px-3 py-2"
              >
                <Link
                  href="/notifications"
                  className="text-muted-foreground flex w-full items-center justify-between text-xs"
                >
                  View all notifications
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                </Link>
              </DropdownMenuItem>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
