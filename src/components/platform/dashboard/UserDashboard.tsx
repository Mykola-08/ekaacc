'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CreditCard,
  Star,
  ChevronRight,
  Activity,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useAuth } from '@/context/platform/auth-context';
import { useLanguage } from '@/context/LanguageContext';

interface UserDashboardProps {
  upcomingSession?: {
    start_time: string;
    service?: { name: string };
  } | null;
  walletBalance?: number;
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function UserDashboard({ upcomingSession, walletBalance }: UserDashboardProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const sessionDate = upcomingSession ? new Date(upcomingSession.start_time) : null;
  const formattedDate = sessionDate
    ? sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'None';
  const formattedTime = sessionDate
    ? sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '';
  const serviceName = upcomingSession?.service?.name || 'Session';

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-12">
      {/* Header Section */}
      <div className="animate-fade-in flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="from-foreground to-foreground/70 mb-3 bg-gradient-to-r bg-clip-text text-5xl leading-tight font-bold tracking-tight text-transparent">
            {t('dashboard.welcome', { name: user?.first_name || 'Guest' })}
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            {t('dashboard.subtitle') || 'Here is what is happening with your wellness today.'}
          </p>
        </div>
        <div>
          <Link
            href="/services"
            className="focus:ring-primary/50 inline-flex items-center justify-center rounded-full border-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-blue-500/30 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {t('common.bookNow')}
          </Link>
        </div>
      </div>

      {/* Tabs Section using Headless UI */}
      <TabGroup as="div" className="space-y-8">
        <TabList className="from-muted/30 to-muted/50 border-border/30 flex w-fit space-x-2 rounded-full border bg-gradient-to-r p-2 shadow-lg backdrop-blur-sm">
          {['Overview', 'Schedule', 'Wallet'].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                cn(
                  'w-36 rounded-full py-3 text-sm leading-5 font-bold transition-all outline-none',
                  'focus:ring-primary/20 focus:ring-2',
                  selected
                    ? 'from-card via-card to-card text-foreground bg-gradient-to-r shadow-xl shadow-black/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                )
              }
            >
              {t(`dashboard.tabs.${category.toLowerCase()}`) || category}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel className="animate-slide-up space-y-8 focus:outline-none">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Next Session Card */}
              <div className="group from-card via-card to-card/95 relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                <div className="relative z-10 mb-4 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                    {t('dashboard.stats.nextSession')}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg dark:from-blue-900/40 dark:to-indigo-900/40">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="relative z-10 space-y-1">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
                    {formattedDate}
                  </div>
                  {upcomingSession ? (
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {formattedTime} • {serviceName}
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-sm font-medium">No sessions booked</p>
                  )}
                </div>
              </div>

              {/* Credits Card */}
              <div className="group from-card via-card to-card/95 relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                <div className="relative z-10 mb-4 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                    {t('dashboard.stats.credits')}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-lg dark:from-emerald-900/40 dark:to-teal-900/40">
                    <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="relative z-10 space-y-1">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
                    {walletBalance !== undefined ? (walletBalance / 100).toFixed(2) : '0.00'}{' '}
                    <span className="text-muted-foreground text-xl">€</span>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    Available balance
                  </p>
                </div>
              </div>

              {/* Wellness Score Card */}
              <div className="group from-card via-card to-card/95 relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5" />
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                <div className="relative z-10 mb-4 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                    {t('dashboard.stats.wellnessScore')}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 shadow-lg dark:from-violet-900/40 dark:to-purple-900/40">
                    <Activity className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
                <div className="relative z-10 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                      85
                    </div>
                    <span className="text-sm font-bold text-green-500">+2%</span>
                  </div>
                  <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full shadow-inner">
                    <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/50" />
                  </div>
                </div>
              </div>

              {/* Streak Card */}
              <div className="group from-card via-card to-card/95 relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5" />
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                <div className="relative z-10 mb-4 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                    {t('dashboard.stats.streak')}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-lg dark:from-orange-900/40 dark:to-amber-900/40">
                    <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="relative z-10 space-y-1">
                  <div className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-3xl font-bold text-transparent">
                    3 {t('common.days')}
                  </div>
                  <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                    Keep it burning!
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Upcoming Sessions Section */}
              <div className="from-card via-card to-card/95 relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl lg:col-span-2">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
                <div className="relative z-10 mb-8 flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-foreground text-2xl font-bold">
                      {t('dashboard.upcoming.title')}
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">
                      {t('dashboard.upcoming.subtitle')}
                    </p>
                  </div>
                  <button className="text-foreground hover:text-primary hover:bg-primary/5 flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold transition-colors">
                    {t('common.viewAll')} <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative z-10 space-y-4">
                  {/* Session Item 1 */}
                  <div className="group hover:bg-card/50 border-border/30 hover:border-primary/30 flex cursor-pointer items-center gap-5 rounded-2xl border p-5 shadow-md backdrop-blur-sm transition-all hover:shadow-lg">
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border-0 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 shadow-lg dark:from-orange-900/40 dark:to-amber-900/40 dark:text-orange-400">
                      <span className="text-xs font-bold tracking-wide uppercase">Oct</span>
                      <span className="text-2xl font-bold">22</span>
                    </div>
                    <div className="min-w-0 grow">
                      <h3 className="text-foreground group-hover:text-primary text-base font-bold transition-colors">
                        Deep Tissue Massage
                      </h3>
                      <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4" /> 4:00 PM - 5:00 PM
                      </p>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center rounded-full border-0 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 text-xs font-bold text-green-700 shadow-md dark:from-green-900/40 dark:to-emerald-900/40 dark:text-green-400">
                        Confirmed
                      </span>
                    </div>
                  </div>

                  {/* Session Item 2 */}
                  <div className="group hover:bg-card/50 border-border/30 hover:border-primary/30 flex cursor-pointer items-center gap-5 rounded-2xl border p-5 shadow-md backdrop-blur-sm transition-all hover:shadow-lg">
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border-0 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 shadow-lg dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400">
                      <span className="text-xs font-bold tracking-wide uppercase">Oct</span>
                      <span className="text-2xl font-bold">28</span>
                    </div>
                    <div className="min-w-0 grow">
                      <h3 className="text-foreground group-hover:text-primary text-base font-bold transition-colors">
                        Kinesiology Session
                      </h3>
                      <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4" /> 11:00 AM - 12:00 PM
                      </p>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center rounded-full border-0 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-xs font-bold text-blue-700 shadow-md dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo/Feature Content */}
              <div className="from-card via-card/95 to-card/90 text-foreground group relative flex flex-col justify-between overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-8 shadow-2xl backdrop-blur-sm lg:col-span-1">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl transition-transform duration-700 group-hover:scale-110" />

                <div className="relative z-10">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border-0 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 text-xs font-bold shadow-lg dark:from-amber-900/40 dark:to-orange-900/40">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="text-amber-700 dark:text-amber-300">Premium Member</span>
                  </div>
                  <h3 className="mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                    {t('dashboard.promo.title') || 'Upgrade to Premium'}
                  </h3>
                  <p className="text-muted-foreground mb-8 text-sm leading-relaxed font-medium">
                    {t('dashboard.promo.description') ||
                      'Get exclusive access to priority bookings, discounts, and premium wellness content.'}
                  </p>

                  <ul className="mb-8 space-y-3">
                    <li className="text-foreground flex items-center gap-3 text-sm font-semibold">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-400/50" />
                      10% off all sessions
                    </li>
                    <li className="text-foreground flex items-center gap-3 text-sm font-semibold">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-400/50" />
                      Priority Booking
                    </li>
                    <li className="text-foreground flex items-center gap-3 text-sm font-semibold">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-400/50" />
                      Advanced Analytics
                    </li>
                  </ul>
                </div>

                <button className="relative z-10 w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-bold text-white shadow-xl shadow-indigo-500/25 transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-95">
                  {t('common.upgrade')}
                </button>
              </div>
            </div>
          </TabPanel>

          <TabPanel className="from-card via-card to-card/95 animate-slide-up relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-12 text-center shadow-xl backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
            <div className="relative z-10 mx-auto max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-xl dark:from-blue-900/40 dark:to-indigo-900/40">
                <Calendar className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-foreground mb-3 text-2xl font-bold">Full Booking Schedule</h3>
              <p className="text-muted-foreground mb-6 font-medium">
                This feature is under active development. Check back soon for deeper calendar
                integration.
              </p>
            </div>
          </TabPanel>

          <TabPanel className="from-card via-card to-card/95 animate-slide-up relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br p-12 text-center shadow-xl backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
            <div className="relative z-10 mx-auto max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-xl dark:from-emerald-900/40 dark:to-teal-900/40">
                <CreditCard className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-foreground mb-3 text-2xl font-bold">Wallet Management</h3>
              <p className="text-muted-foreground mb-6 font-medium">
                Manage your credits, payment methods, and transaction history here soon.
              </p>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
