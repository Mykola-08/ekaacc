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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-w-7xl mx-auto animate-hero-fade-in pb-20">
      {/* Welcome Card - Large */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-white dark:bg-zinc-900 rounded-[32px] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between group hover:shadow-md transition-shadow animate-hero-slide-up bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-50" style={{ animationDelay: '0.1s' }}>
        <div>
          <h2 className="text-3xl font-bold mb-3 text-balance tracking-tight">Welcome back, {user?.name || 'Guest'}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">Your wellness journey is on track. You have 2 upcoming sessions this week.</p>
        </div>
        <div className="mt-8 flex gap-3">
          <Button className="rounded-full bg-primary text-white hover:bg-primary/90 px-6 h-12 text-md">
            Book New Session
          </Button>
          <Button variant="outline" className="rounded-full border-zinc-200 dark:border-zinc-700 h-12 px-6">
            View Schedule
          </Button>
        </div>
      </div>

      {/* Stats Card - Small */}
      <div className="col-span-1 bg-blue-50/50 dark:bg-blue-900/10 rounded-[32px] p-6 border border-blue-100 dark:border-blue-800/50 flex flex-col justify-between animate-hero-slide-up hover:scale-[1.02] transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-start">
          <div className="p-3 bg-white dark:bg-blue-800/50 rounded-2xl text-blue-600 dark:text-blue-400 shadow-sm">
            <TrendingUp size={24} />
          </div>
          <span className="text-xs font-bold bg-white dark:bg-blue-900/50 px-3 py-1.5 rounded-full text-blue-600 dark:text-blue-300 shadow-sm">+12%</span>
        </div>
        <div>
          <div className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-1 tracking-tight">24</div>
          <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Sessions Completed</div>
        </div>
      </div>

      {/* Wallet Card - Small */}
      <div className="col-span-1 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[32px] p-6 border border-emerald-100 dark:border-emerald-800/50 flex flex-col justify-between animate-hero-slide-up hover:scale-[1.02] transition-transform duration-300" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between items-start">
          <div className="p-3 bg-white dark:bg-emerald-800/50 rounded-2xl text-emerald-600 dark:text-emerald-400 shadow-sm">
            <CreditCard size={24} />
          </div>
        </div>
        <div>
          <div className="text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-1 tracking-tight">€120</div>
          <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Balance Available</div>
        </div>
      </div>

      {/* Upcoming Session - Tall */}
      <div className="col-span-1 md:col-span-1 row-span-2 bg-zinc-900 dark:bg-black text-white rounded-[32px] p-8 shadow-2xl flex flex-col relative overflow-hidden animate-hero-slide-up group" style={{ animationDelay: '0.4s' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors duration-500" />
        
        <div className="flex items-center gap-2 mb-8 z-10">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
             <Clock className="text-zinc-200" size={20} />
          </div>
          <span className="text-sm font-semibold text-zinc-300">Next Session</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center z-10">
          <div className="text-5xl font-bold mb-2 tracking-tighter">14:00</div>
          <div className="text-zinc-400 text-xl mb-8">Tomorrow</div>
          <div className="mt-auto space-y-1">
            <div className="font-bold text-xl">Integrative Therapy</div>
            <div className="text-zinc-400 text-md">with Dr. Sarah Smith</div>
          </div>
        </div>
        
        <button className="mt-8 w-full py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl text-md font-bold transition-colors z-10 cursor-pointer shadow-lg shadow-white/5">
          Reschedule
        </button>
      </div>

      {/* Task Manager (CRUD + Morphing Action) */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 row-span-2 animate-hero-slide-up" style={{ animationDelay: '0.5s' }}>
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
