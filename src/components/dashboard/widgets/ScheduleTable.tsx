'use client';

import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Search, Filter, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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
    <div className="bg-card border-border overflow-hidden rounded-xl border">
      <div className="flex flex-col items-start justify-between gap-4 p-8 pb-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-foreground mb-2 text-[24px] font-semibold tracking-tight">
            Today's Schedule
          </h2>
          <p className="text-muted-foreground leading-relaxed font-medium">
            Manage your daily appointments and blocks.
          </p>
        </div>
        <Button
          onClick={onAddBlock}
          className="bg-foreground text-background hover:bg-foreground/90 h-9 rounded-lg px-6 font-semibold transition-colors"
        >
          <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} />
          Add Time Block
        </Button>
      </div>

      {/* Search / Filter Bar */}
      <div className="flex gap-4 px-8 pb-8">
        <div className="bg-secondary text-muted-foreground focus-within:border-foreground/10 focus-within:bg-card flex h-9 flex-1 items-center gap-3 rounded-lg border-2 border-transparent px-4 text-sm font-semibold transition-all">
          <Search className="h-4 w-4 opacity-70" strokeWidth={2.5} /> Search bookings...
        </div>
        <div className="bg-secondary text-foreground hover:bg-secondary/70 flex h-9 cursor-pointer items-center justify-between gap-2 rounded-lg border-2 border-transparent px-4 text-sm font-semibold transition-colors md:w-48">
          <span>All Statuses</span>{' '}
          <Filter className="text-muted-foreground h-4 w-4" strokeWidth={2.5} />
        </div>
      </div>

      <div className="border-border border-t">
        {schedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-secondary text-muted-foreground mb-6 rounded-full p-6">
              <Calendar className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <p className="text-foreground mb-2 text-lg font-semibold">
              No bookings scheduled for today.
            </p>
            <p className="text-muted-foreground mx-auto max-w-xs text-sm">
              Your schedule looks clear. You can add time blocks manually if needed.
            </p>
          </div>
        ) : (
          // Table Header
          <div className="w-full">
            <div className="bg-secondary text-muted-foreground border-border grid grid-cols-12 gap-4 border-b px-8 py-5 text-xs font-semibold tracking-[0.1em] uppercase">
              <div className="col-span-4 md:col-span-3">Details</div>
              <div className="col-span-3 md:col-span-2">Status</div>
              <div className="hidden md:col-span-3 md:block">Client</div>
              <div className="col-span-3 md:col-span-2">Time</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-border divide-y">
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
    ? `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() ||
      item.profiles.email
    : 'Unknown Client';

  // Status Badge Style - Porcelain System
  const statusStyles: Record<string, string> = {
    confirmed: 'bg-success/10 text-success border-success/20',
    pending: 'bg-warning/10 text-warning border-vip-gold-1/20 animate-pulse',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
    completed: 'bg-secondary text-muted-foreground border-border',
  };

  const statusClass =
    statusStyles[item.status] || 'bg-secondary text-muted-foreground border-border';

  return (
    <div className="hover:bg-secondary group grid grid-cols-12 items-center gap-4 px-8 py-5 transition-colors">
      {/* Service & Title */}
      <div className="col-span-4 md:col-span-3">
        <div className="text-foreground truncate text-[15px] font-semibold">
          {item.services?.title || 'Custom Session'}
        </div>
        <div className="text-muted-foreground text-xs font-medium md:hidden">{clientName}</div>
      </div>

      {/* Status Pill */}
      <div className="col-span-3 md:col-span-2">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase',
            statusClass
          )}
        >
          {item.status}
        </span>
      </div>

      {/* Client (Desktop) */}
      <div className="hidden md:col-span-3 md:block">
        <div className="flex items-center gap-3">
          <Avatar className="border-border h-9 w-9 border">
            <AvatarFallback className="bg-secondary text-muted-foreground text-xs font-semibold">
              {(clientName?.substring(0, 2) || '??').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-[14px] font-semibold">{clientName}</span>
        </div>
      </div>

      {/* Time */}
      <div className="col-span-3 md:col-span-2">
        <div className="text-foreground font-mono text-[14px] font-semibold">
          {format(startTime, 'HH:mm')}
        </div>
        <div className="text-muted-foreground text-xs font-medium">
          {item.services?.duration} min
        </div>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex justify-end gap-2">
        {item.status === 'pending' ? (
          <div className="flex gap-2">
            <Button
              size="icon"
              className="h-9 w-9 rounded-lg border border-transparent bg-success/10 text-success shadow-none transition-all hover:bg-success/100 hover:text-foreground"
            >
              <CheckCircle className="h-5 w-5" strokeWidth={2.5} />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 rounded-lg border border-transparent bg-destructive/10 text-destructive shadow-none transition-all hover:bg-destructive hover:text-foreground"
            >
              <XCircle className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-secondary hover:text-foreground h-9 w-9 rounded-md"
              >
                <MoreVertical className="h-5 w-5" strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border rounded-lg p-2">
              <DropdownMenuItem className="hover:bg-secondary focus:bg-secondary cursor-pointer rounded-lg px-4 py-2 text-[13px] font-medium transition-colors">
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer rounded-lg px-4 py-2 text-[13px] font-medium transition-colors">
                Cancel Booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
