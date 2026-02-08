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
        className="from-card via-card to-card/95 group hover:shadow-3xl animate-in slide-in-from-bottom-4 relative col-span-1 row-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 md:col-span-2 lg:col-span-2"
        style={{ animationDelay: '0.1s' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-purple-500/5 blur-2xl" />
        <div className="relative z-10">
          <h2 className="from-foreground to-foreground/70 mb-3 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-balance text-transparent">
            Welcome back, {user?.name || 'Guest'}
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            Your wellness journey is on track. You have 2 upcoming sessions this week.
          </p>
        </div>
        <div className="relative z-10 mt-8 flex gap-3">
          <Button className="text-md h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-blue-500/30">
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
        className="from-card via-card to-card/95 animate-in slide-in-from-bottom-4 group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-6 shadow-xl backdrop-blur-sm transition-all duration-300 duration-500 hover:scale-105 hover:shadow-2xl"
        style={{ animationDelay: '0.2s' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 p-3 text-blue-600 shadow-lg dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400">
            <TrendingUp size={24} />
          </div>
          <span className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 text-xs font-bold text-blue-600 shadow-md dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-300">
            +12%
          </span>
        </div>
        <div className="relative z-10">
          <div className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            24
          </div>
          <div className="text-muted-foreground text-sm font-bold tracking-wide uppercase">
            Sessions Completed
          </div>
        </div>
      </div>

      {/* Wallet Card - Small */}
      <div
        className="from-card via-card to-card/95 animate-in slide-in-from-bottom-4 group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-6 shadow-xl backdrop-blur-sm transition-all duration-300 duration-500 hover:scale-105 hover:shadow-2xl"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 p-3 text-emerald-600 shadow-lg dark:from-emerald-900/40 dark:to-teal-900/40 dark:text-emerald-400">
            <CreditCard size={24} />
          </div>
        </div>
        <div className="relative z-10">
          <div className="mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            €120
          </div>
          <div className="text-muted-foreground text-sm font-bold tracking-wide uppercase">
            Balance Available
          </div>
        </div>
      </div>

      {/* Upcoming Session - Tall */}
      <div
        className="from-card via-card to-card/90 text-foreground animate-in slide-in-from-bottom-4 group relative col-span-1 row-span-2 flex flex-col overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-8 shadow-2xl backdrop-blur-sm duration-500 md:col-span-1"
        style={{ animationDelay: '0.4s' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-500 group-hover:bg-indigo-500/15" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-purple-500/10 blur-2xl" />

        <div className="relative z-10 mb-8 flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 p-2 shadow-lg backdrop-blur-md dark:from-indigo-900/40 dark:to-purple-900/40">
            <Clock className="text-indigo-600 dark:text-indigo-400" size={20} />
          </div>
          <span className="text-muted-foreground text-sm font-bold tracking-wide uppercase">
            Next Session
          </span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center">
          <div className="mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-6xl font-bold tracking-tighter text-transparent">
            14:00
          </div>
          <div className="text-muted-foreground mb-8 text-xl font-semibold">Tomorrow</div>
          <div className="mt-auto space-y-1">
            <div className="text-2xl font-bold">Integrative Therapy</div>
            <div className="text-muted-foreground text-md font-medium">with Dr. Sarah Smith</div>
          </div>
        </div>

        <button className="text-md relative z-10 mt-8 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-95">
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
    <button className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-zinc-50 p-4 transition-all duration-200 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 dark:bg-zinc-700">
        <Icon size={20} className="text-zinc-700 dark:text-zinc-300" />
      </div>
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
    </button>
  );
}
