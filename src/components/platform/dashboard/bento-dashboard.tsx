'use client';

import {
 Activity,
 Calendar,
 CreditCard,
 Settings,
 User,
 ArrowRight,
 TrendingUp,
 Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

import { TaskManager } from './TaskManager';

interface BentoDashboardProps {
 user?: {
 name: string;
 email: string;
 };
}

export function BentoDashboard({ user }: BentoDashboardProps) {
 return (
 <div className="animate-in fade-in mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 pb-20 duration-300 md:grid-cols-3 lg:grid-cols-4">
 {/* Welcome Card - Large */}
 <div
 className="from-card via-card to-card/95 group hover:shadow-md animate-in slide-in-from-bottom-4 relative col-span-1 row-span-1 flex flex-col justify-between overflow-hidden rounded-lg border-0 bg-linear-to-br p-8 shadow-sm backdrop-blur-sm transition-all duration-500 md:col-span-2 lg:col-span-2"
 style={{ animationDelay: '0.1s' }}
 >
 <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 to-muted" />
 <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
 <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-muted blur-2xl" />
 <div className="relative z-10">
 <h2 className="from-foreground to-foreground/70 mb-3 bg-linear-to-r bg-clip-text text-4xl font-semibold tracking-tight text-balance text-transparent">
 Welcome back, {user?.name || 'Guest'}
 </h2>
 <p className="text-muted-foreground text-lg font-medium">
 Your wellness journey is on track. You have 2 upcoming sessions this week.
 </p>
 </div>
 <div className="relative z-10 mt-8 flex gap-3">
 <Button className="text-md h-10 rounded-full bg-linear-to-r from-primary to-primary/70 px-8 font-semibold text-primary-foreground shadow-sm transition-all hover:scale-105 hover:from-primary/90 hover:to-primary/60 hover:shadow-md">
 Book New Session
 </Button>
 <Button
 variant="outline"
 className="border-border/50 hover:border-primary/50 hover:bg-primary/5 h-14 rounded-full px-8 font-semibold"
 >
 View Schedule
 </Button>
 </div>
 </div>

 {/* Stats Card - Small */}
 <div
 className="from-card via-card to-card/95 animate-in slide-in-from-bottom-4 group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-lg border-0 bg-linear-to-br p-6 shadow-sm backdrop-blur-sm transition-all duration-300 duration-500 hover:scale-105 hover:shadow-md"
 style={{ animationDelay: '0.2s' }}
 >
 <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 to-primary/5" />
 <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
 <div className="relative z-10 flex items-start justify-between">
 <div className="rounded-lg bg-linear-to-br from-muted to-muted p-3 text-primary shadow-sm ">
 <TrendingUp size={24} />
 </div>
 <span className="rounded-full bg-linear-to-r from-primary/5 to-primary/5 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm ">
 +12%
 </span>
 </div>
 <div className="relative z-10">
 <div className="mb-2 bg-linear-to-r from-primary to-primary bg-clip-text text-5xl font-semibold tracking-tight text-transparent">
 24
 </div>
 <div className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
 Sessions Completed
 </div>
 </div>
 </div>

 {/* Wallet Card - Small */}
 <div
 className="from-card via-card to-card/95 animate-in slide-in-from-bottom-4 group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-lg border-0 bg-linear-to-br p-6 shadow-sm backdrop-blur-sm transition-all duration-300 duration-500 hover:scale-105 hover:shadow-md"
 style={{ animationDelay: '0.3s' }}
 >
 <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-success/5 to-success/5" />
 <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-success/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
 <div className="relative z-10 flex items-start justify-between">
 <div className="rounded-lg bg-linear-to-br from-success/20 to-success/20 p-3 text-success shadow-lg dark:from-success/20 dark:to-success/20 dark:text-success">
 <CreditCard size={24} />
 </div>
 </div>
 <div className="relative z-10">
 <div className="mb-2 bg-linear-to-r from-success to-success bg-clip-text text-5xl font-semibold tracking-tight text-transparent">
 €120
 </div>
 <div className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
 Balance Available
 </div>
 </div>
 </div>

 {/* Upcoming Session - Tall */}
 <div
 className="from-card via-card to-card/90 text-foreground animate-in slide-in-from-bottom-4 group relative col-span-1 row-span-2 flex flex-col overflow-hidden rounded-lg border-0 bg-linear-to-br p-8 shadow-sm backdrop-blur-sm duration-500 md:col-span-1"
 style={{ animationDelay: '0.4s' }}
 >
 <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 to-muted" />
 <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/15" />
 <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-muted blur-2xl" />

 <div className="relative z-10 mb-8 flex items-center gap-2">
 <div className="rounded-lg bg-linear-to-br from-muted to-muted p-2 shadow-sm backdrop-blur-md dark:from-accent/20 dark:to-accent/20">
 <Clock className="text-primary " size={20} />
 </div>
 <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
 Next Session
 </span>
 </div>

 <div className="relative z-10 flex flex-1 flex-col justify-center">
 <div className="mb-2 bg-linear-to-r from-primary to-primary/70 bg-clip-text text-6xl font-semibold tracking-tighter text-transparent">
 14:00
 </div>
 <div className="text-muted-foreground mb-8 text-xl font-semibold">Tomorrow</div>
 <div className="mt-auto space-y-1">
 <div className="text-2xl font-semibold">Integrative Therapy</div>
 <div className="text-muted-foreground text-md font-medium">with Dr. Sarah Smith</div>
 </div>
 </div>

 <button className="text-md relative z-10 mt-8 w-full cursor-pointer rounded-lg bg-linear-to-r from-primary to-primary/70 py-4 font-semibold text-primary-foreground shadow-sm transition-all hover:scale-105 hover:from-primary/90 hover:to-primary/60 hover:shadow-md active:scale-95">
 Reschedule
 </button>
 </div>

 {/* Task Manager (CRUD + Morphing Action) */}
 <div
 className="animate-in slide-in-from-bottom-4 col-span-1 row-span-2 duration-500 md:col-span-2 lg:col-span-3"
 style={{ animationDelay: '0.5s' }}
 >
 <TaskManager />
 </div>
 </div>
 );
}

function ActionButton({ icon: Icon, label }: { icon: any; label: string }) {
 return (
 <button className="group flex cursor-pointer flex-col items-center justify-center rounded-lg bg-muted p-4 transition-all duration-200 hover:bg-muted dark:bg-muted/50">
 <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm transition-transform group-hover:scale-110 dark:bg-muted/80">
 <Icon size={20} className="text-foreground " />
 </div>
 <span className="text-sm font-medium text-muted-foreground ">{label}</span>
 </button>
 );
}
