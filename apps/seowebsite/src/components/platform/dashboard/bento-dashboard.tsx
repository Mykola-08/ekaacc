'use client';

import { 
  Activity, 
  Calendar, 
  CreditCard, 
  Settings, 
  User, 
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@ekaacc/shared-ui';

import { TaskManager } from './TaskManager';

interface BentoDashboardProps {
  user?: {
    name: string;
    email: string;
  };
}

export function BentoDashboard({ user }: BentoDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-w-7xl mx-auto animate-in fade-in duration-300 pb-20">
      {/* Welcome Card - Large */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-0 flex flex-col justify-between group hover:shadow-3xl transition-all animate-in slide-in-from-bottom-4 duration-500 relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-3 text-balance tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Welcome back, {user?.name || 'Guest'}</h2>
          <p className="text-muted-foreground text-lg font-medium">Your wellness journey is on track. You have 2 upcoming sessions this week.</p>
        </div>
        <div className="mt-8 flex gap-3 relative z-10">
          <Button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 h-14 text-md font-bold shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all hover:scale-105">
            Book New Session
          </Button>
          <Button variant="outline" className="rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5 h-14 px-8 font-semibold">
            View Schedule
          </Button>
        </div>
      </div>

      {/* Stats Card - Small */}
      <div className="col-span-1 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-3xl p-6 border-0 shadow-xl flex flex-col justify-between animate-in slide-in-from-bottom-4 duration-500 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 relative overflow-hidden group" style={{ animationDelay: '0.2s' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        <div className="flex justify-between items-start relative z-10">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl text-blue-600 dark:text-blue-400 shadow-lg">
            <TrendingUp size={24} />
          </div>
          <span className="text-xs font-bold bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 px-3 py-1.5 rounded-full text-blue-600 dark:text-blue-300 shadow-md">+12%</span>
        </div>
        <div className="relative z-10">
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 tracking-tight">24</div>
          <div className="text-sm text-muted-foreground font-bold uppercase tracking-wide">Sessions Completed</div>
        </div>
      </div>

      {/* Wallet Card - Small */}
      <div className="col-span-1 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-3xl p-6 border-0 shadow-xl flex flex-col justify-between animate-in slide-in-from-bottom-4 duration-500 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 relative overflow-hidden group" style={{ animationDelay: '0.3s' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        <div className="flex justify-between items-start relative z-10">
          <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-2xl text-emerald-600 dark:text-emerald-400 shadow-lg">
            <CreditCard size={24} />
          </div>
        </div>
        <div className="relative z-10">
          <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 tracking-tight">€120</div>
          <div className="text-sm text-muted-foreground font-bold uppercase tracking-wide">Balance Available</div>
        </div>
      </div>

      {/* Upcoming Session - Tall */}
      <div className="col-span-1 md:col-span-1 row-span-2 bg-gradient-to-br from-card via-card to-card/90 backdrop-blur-sm text-foreground rounded-3xl p-8 shadow-2xl border-0 flex flex-col relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500 group" style={{ animationDelay: '0.4s' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-500" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-8 z-10 relative">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl backdrop-blur-md shadow-lg">
             <Clock className="text-indigo-600 dark:text-indigo-400" size={20} />
          </div>
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Next Session</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center z-10 relative">
          <div className="text-6xl font-bold mb-2 tracking-tighter bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">14:00</div>
          <div className="text-muted-foreground text-xl mb-8 font-semibold">Tomorrow</div>
          <div className="mt-auto space-y-1">
            <div className="font-bold text-2xl">Integrative Therapy</div>
            <div className="text-muted-foreground text-md font-medium">with Dr. Sarah Smith</div>
          </div>
        </div>
        
        <button className="mt-8 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-md font-bold transition-all z-10 relative cursor-pointer shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95">
          Reschedule
        </button>
      </div>

      {/* Task Manager (CRUD + Morphing Action) */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 row-span-2 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '0.5s' }}>
         <TaskManager />
      </div>


    </div>
  );
}

function ActionButton({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 group cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <Icon size={20} className="text-zinc-700 dark:text-zinc-300" />
      </div>
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
    </button>
  );
}
