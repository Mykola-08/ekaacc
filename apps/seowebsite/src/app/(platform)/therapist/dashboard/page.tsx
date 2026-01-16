import React from 'react';
import { Button } from '@/components/platform/ui/button';
import Link from 'next/link';

export default function TherapistDashboardPage() {
  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Therapist Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back. Here is your daily overview.</p>
          </div>
          <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 shadow-lg hover:shadow-xl transition-all uppercase tracking-wide text-xs font-bold">
            Start Session
          </Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-8 rounded-3xl bg-card border border-border/60 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
             <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
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
           
           <div className="p-8 rounded-3xl bg-card border border-border/60 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
             <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-2">
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
           
           <div className="p-8 rounded-3xl bg-card border border-border/60 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
             <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-2">
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
            <div className="bg-card rounded-3xl border border-border/60 p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
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

            <div className="bg-card rounded-3xl border border-border/60 p-8 shadow-sm flex items-center justify-center text-muted-foreground text-sm border-dashed">
                Calendar Integration Coming Soon
            </div>
       </div>
    </div>
  );
}
