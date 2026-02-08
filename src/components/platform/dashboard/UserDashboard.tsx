'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import {
    Calendar, Clock, CreditCard, Star, ChevronRight, Activity,
    TrendingUp, Sparkles
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
    const formattedDate = sessionDate ? sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None';
    const formattedTime = sessionDate ? sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
    const serviceName = upcomingSession?.service?.name || 'Session';

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in">
                <div>
                    <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight mb-3">
                        {t('dashboard.welcome', { name: user?.first_name || 'Guest' })}
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium">
                        {t('dashboard.subtitle') || 'Here is what is happening with your wellness today.'}
                    </p>
                </div>
                <div>
                    <Link
                        href="/services"
                        className="inline-flex items-center justify-center px-8 py-4 border-0 text-base font-bold rounded-full text-white bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 transition-all shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 hover:scale-105 active:scale-95"
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        {t('common.bookNow')}
                    </Link>
                </div>
            </div>

            {/* Tabs Section using Headless UI */}
            <TabGroup as="div" className="space-y-8">
                <TabList className="flex space-x-2 rounded-full bg-gradient-to-r from-muted/30 to-muted/50 backdrop-blur-sm p-2 w-fit border border-border/30 shadow-lg">
                    {['Overview', 'Schedule', 'Wallet'].map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                cn(
                                    'w-36 rounded-full py-3 text-sm font-bold leading-5 transition-all outline-none',
                                    'focus:ring-2 focus:ring-primary/20',
                                    selected
                                        ? 'bg-gradient-to-r from-card via-card to-card text-foreground shadow-xl shadow-black/5'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                                )
                            }
                        >
                            {t(`dashboard.tabs.${category.toLowerCase()}`) || category}
                        </Tab>
                    ))}
                </TabList>

                <TabPanels>
                    <TabPanel className="space-y-8 focus:outline-none animate-slide-up">
                        {/* Stats Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Next Session Card */}
                            <div className="relative group overflow-hidden bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none" />
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('dashboard.stats.nextSession')}</span>
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center shadow-lg">
                                        <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{formattedDate}</div>
                                    {upcomingSession ? (
                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{formattedTime} • {serviceName}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground font-medium">No sessions booked</p>
                                    )}
                                </div>
                            </div>

                            {/* Credits Card */}
                            <div className="relative group overflow-hidden bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('dashboard.stats.credits')}</span>
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shadow-lg">
                                        <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                        {walletBalance !== undefined ? (walletBalance / 100).toFixed(2) : '0.00'} <span className="text-xl text-muted-foreground">€</span>
                                    </div>
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Available balance</p>
                                </div>
                            </div>

                            {/* Wellness Score Card */}
                            <div className="relative group overflow-hidden bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 pointer-events-none" />
                                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('dashboard.stats.wellnessScore')}</span>
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 flex items-center justify-center shadow-lg">
                                        <Activity className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                                    </div>
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">85</div>
                                        <span className="text-sm text-green-500 font-bold">+2%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-violet-600 to-purple-600 w-[85%] rounded-full shadow-lg shadow-violet-500/50" />
                                    </div>
                                </div>
                            </div>

                            {/* Streak Card */}
                            <div className="relative group overflow-hidden bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 pointer-events-none" />
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('dashboard.stats.streak')}</span>
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 flex items-center justify-center shadow-lg">
                                        <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">3 {t('common.days')}</div>
                                    <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">Keep it burning!</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Upcoming Sessions Section */}
                            <div className="lg:col-span-2 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-2xl border-0 shadow-xl p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none" />
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-foreground">{t('dashboard.upcoming.title')}</h2>
                                        <p className="text-sm text-muted-foreground font-medium">{t('dashboard.upcoming.subtitle')}</p>
                                    </div>
                                    <button className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1 px-4 py-2 rounded-full hover:bg-primary/5">
                                        {t('common.viewAll')} <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {/* Session Item 1 */}
                                    <div className="group flex items-center gap-5 p-5 rounded-2xl hover:bg-card/50 backdrop-blur-sm transition-all border border-border/30 hover:border-primary/30 cursor-pointer shadow-md hover:shadow-lg">
                                        <div className="shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 text-orange-600 dark:text-orange-400 flex flex-col items-center justify-center border-0 shadow-lg">
                                            <span className="text-xs font-bold uppercase tracking-wide">Oct</span>
                                            <span className="text-2xl font-bold">22</span>
                                        </div>
                                        <div className="grow min-w-0">
                                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">Deep Tissue Massage</h3>
                                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 font-medium">
                                                <Clock className="w-4 h-4" /> 4:00 PM - 5:00 PM
                                            </p>
                                        </div>
                                        <div className="shrink-0">
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 dark:from-green-900/40 dark:to-emerald-900/40 dark:text-green-400 border-0 shadow-md">
                                                Confirmed
                                            </span>
                                        </div>
                                    </div>

                                    {/* Session Item 2 */}
                                    <div className="group flex items-center gap-5 p-5 rounded-2xl hover:bg-card/50 backdrop-blur-sm transition-all border border-border/30 hover:border-primary/30 cursor-pointer shadow-md hover:shadow-lg">
                                        <div className="shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center border-0 shadow-lg">
                                            <span className="text-xs font-bold uppercase tracking-wide">Oct</span>
                                            <span className="text-2xl font-bold">28</span>
                                        </div>
                                        <div className="grow min-w-0">
                                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">Kinesiology Session</h3>
                                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 font-medium">
                                                <Clock className="w-4 h-4" /> 11:00 AM - 12:00 PM
                                            </p>
                                        </div>
                                        <div className="shrink-0">
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400 border-0 shadow-md">
                                                Pending
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Promo/Feature Content */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm p-8 text-foreground shadow-2xl lg:col-span-1 flex flex-col justify-between group border-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
                                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-700" />

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-xs font-bold border-0 mb-6 shadow-lg">
                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                        <span className="text-amber-700 dark:text-amber-300">Premium Member</span>
                                    </div>
                                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t('dashboard.promo.title') || 'Upgrade to Premium'}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-medium">
                                        {t('dashboard.promo.description') || 'Get exclusive access to priority bookings, discounts, and premium wellness content.'}
                                    </p>

                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-center gap-3 text-sm font-semibold text-foreground">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-400/50" />
                                            10% off all sessions
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-semibold text-foreground">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-400/50" />
                                            Priority Booking
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-semibold text-foreground">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-400/50" />
                                            Advanced Analytics
                                        </li>
                                    </ul>
                                </div>

                                <button className="relative z-10 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-bold transition-all active:scale-95 duration-200 shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105">
                                    {t('common.upgrade')}
                                </button>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel className="p-12 text-center bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-2xl border-0 shadow-xl animate-slide-up relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none" />
                        <div className="max-w-md mx-auto relative z-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">Full Booking Schedule</h3>
                            <p className="text-muted-foreground mb-6 font-medium">This feature is under active development. Check back soon for deeper calendar integration.</p>
                        </div>
                    </TabPanel>

                    <TabPanel className="p-12 text-center bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-2xl border-0 shadow-xl animate-slide-up relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
                        <div className="max-w-md mx-auto relative z-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <CreditCard className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">Wallet Management</h3>
                            <p className="text-muted-foreground mb-6 font-medium">Manage your credits, payment methods, and transaction history here soon.</p>
                        </div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
}


