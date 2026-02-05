import React from 'react';
import { Button } from '@/components/platform/ui/button';
import Link from 'next/link';

export default function TherapistDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent dark:from-purple-900/10 pointer-events-none" />
      
      <div className="relative z-10 space-y-8 p-8 max-w-7xl mx-auto">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Therapist Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-lg font-medium">Welcome back. Here is your daily overview.</p>
          </div>
          <Button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all uppercase tracking-wide text-sm font-bold hover:scale-105 active:scale-95">
            Start Session
          </Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-8 rounded-3xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
             <div className="relative h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                {/* Icon placeholder */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Upcoming Sessions</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-foreground tracking-tight">8</span>
                    <span className="text-sm text-green-500 font-medium">+2 today</span>
                </div>
             </div>
           </div>
           
           <div className="p-8 rounded-3xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 pointer-events-none" />
             <div className="relative h-12 w-12 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Pending Notes</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-foreground tracking-tight">3</span>
                    <span className="text-sm text-amber-500 font-medium">Needs Review</span>
                </div>
             </div>
           </div>
           
           <div className="p-8 rounded-3xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 pointer-events-none" />
             <div className="relative h-12 w-12 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-800/40 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
             </div>
             <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Active Clients</h3>
                <div className="flex items-baseline gap-2">
                   <span className="text-4xl font-semibold text-foreground tracking-tight">124</span>
                </div>
             </div>
           </div>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-3xl border-0 p-8 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
                <h2 className="text-xl font-bold text-foreground mb-6 relative">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                     <Link href="/therapist/clients" className="flex-1 min-w-35 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors flex flex-col items-center justify-center gap-2 text-center group">
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">View Clients</span>
                     </Link>
                     <Link href="/therapist/session-notes" className="flex-1 min-w-35 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors flex flex-col items-center justify-center gap-2 text-center group">
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Session Notes</span>
                     </Link>
                     <Link href="/therapist/billing" className="flex-1 min-w-35 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors flex flex-col items-center justify-center gap-2 text-center group">
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Billing</span>
                     </Link>
                </div>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/40 p-8 shadow-lg flex items-center justify-center text-muted-foreground text-sm border-dashed hover:border-primary/30 transition-colors">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" />
                  Calendar Integration Coming Soon
                </span>
            </div>
       </div>
      </div>
    </div>
  );
}
