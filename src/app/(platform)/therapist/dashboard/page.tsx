import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TherapistDashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent dark:from-purple-900/10" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Therapist Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-lg font-medium">
              Welcome back. Here is your daily overview.
            </p>
          </div>
          <Button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm font-bold tracking-wide text-white uppercase shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95">
            Start Session
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="from-card via-card to-card/95 group relative flex flex-col gap-4 overflow-hidden rounded-[20px] border-0 bg-gradient-to-br p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            <div className="relative mb-2 flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 shadow-lg transition-transform duration-300 group-hover:scale-110 dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-400">
              {/* Icon placeholder */}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                Upcoming Sessions
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-foreground text-4xl font-semibold tracking-tight">8</span>
                <span className="text-sm font-medium text-green-500">+2 today</span>
              </div>
            </div>
          </div>

          <div className="from-card via-card to-card/95 group relative flex flex-col gap-4 overflow-hidden rounded-[20px] border-0 bg-gradient-to-br p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
            <div className="relative mb-2 flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 shadow-lg transition-transform duration-300 group-hover:scale-110 dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                Pending Notes
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-foreground text-4xl font-semibold tracking-tight">3</span>
                <span className="text-sm font-medium text-amber-500">Needs Review</span>
              </div>
            </div>
          </div>

          <div className="from-card via-card to-card/95 group relative flex flex-col gap-4 overflow-hidden rounded-[20px] border-0 bg-gradient-to-br p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
            <div className="relative mb-2 flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-600 shadow-lg transition-transform duration-300 group-hover:scale-110 dark:from-cyan-900/40 dark:to-cyan-800/40 dark:text-cyan-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                Active Clients
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-foreground text-4xl font-semibold tracking-tight">124</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="from-card via-card to-card/95 relative overflow-hidden rounded-[20px] border-0 bg-gradient-to-br p-8 shadow-xl backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            <h2 className="text-foreground relative mb-6 text-xl font-bold">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/therapist/clients"
                className="bg-secondary hover:bg-secondary/80 group flex min-w-35 flex-1 flex-col items-center justify-center gap-2 rounded-[16px] p-4 text-center transition-colors"
              >
                <span className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
                  View Clients
                </span>
              </Link>
              <Link
                href="/therapist/session-notes"
                className="bg-secondary hover:bg-secondary/80 group flex min-w-35 flex-1 flex-col items-center justify-center gap-2 rounded-[16px] p-4 text-center transition-colors"
              >
                <span className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
                  Session Notes
                </span>
              </Link>
              <Link
                href="/therapist/billing"
                className="bg-secondary hover:bg-secondary/80 group flex min-w-35 flex-1 flex-col items-center justify-center gap-2 rounded-[16px] p-4 text-center transition-colors"
              >
                <span className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
                  Billing
                </span>
              </Link>
            </div>
          </div>

          <div className="bg-card/80 border-border/40 text-muted-foreground hover:border-primary/30 flex items-center justify-center rounded-[20px] border border-dashed p-8 text-sm shadow-lg backdrop-blur-sm transition-colors">
            <span className="flex items-center gap-2">
              <span className="bg-primary/40 h-2 w-2 animate-pulse rounded-full" />
              Calendar Integration Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
