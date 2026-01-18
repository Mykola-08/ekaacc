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
import { useLanguage } from '@/react-app/contexts/LanguageContext';

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

export function UserDashboardHeadless({ upcomingSession, walletBalance }: UserDashboardProps) {
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
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                        {t('dashboard.welcome', { name: user?.first_name || 'Guest' })}
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        {t('dashboard.subtitle') || 'Here is what is happening with your wellness today.'}
                    </p>
                </div>
                <div>
                    <Link
                        href="/services"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        {t('common.bookNow')}
                    </Link>
                </div>
            </div>

            {/* Tabs Section using Headless UI */}
            <TabGroup as="div" className="space-y-8">
                <TabList className="flex space-x-2 rounded-full bg-muted/50 p-1.5 w-fit">
                    {['Overview', 'Schedule', 'Wallet'].map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                cn(
                                    'w-32 rounded-full py-2.5 text-sm font-semibold leading-5 transition-all outline-none',
                                    'focus:ring-2 focus:ring-black/5',
                                    selected
                                        ? 'bg-card text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground/90 hover:bg-card/50'
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
                            <div className="relative group overflow-hidden bg-white rounded-[32px] p-6 border border-black/5 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-semibold text-muted-foreground/80 uppercase tracking-wider">{t('dashboard.stats.nextSession')}</span>
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-foreground">{formattedDate}</div>
                                    {upcomingSession ? (
                                        <p className="text-sm font-medium text-blue-600">{formattedTime} • {serviceName}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground/80">No sessions booked</p>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl -mr-10 -mb-10 group-hover:bg-blue-100/50 transition-colors" />
                            </div>

                            {/* Credits Card */}
                            <div className="relative group overflow-hidden bg-white rounded-[32px] p-6 border border-black/5 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-semibold text-muted-foreground/80 uppercase tracking-wider">{t('dashboard.stats.credits')}</span>
                                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                        <CreditCard className="h-5 w-5 text-emerald-600" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-foreground">
                                        {walletBalance !== undefined ? (walletBalance / 100).toFixed(2) : '0.00'} <span className="text-lg text-muted-foreground/80">€</span>
                                    </div>
                                    <p className="text-sm font-medium text-emerald-600">Available balance</p>
                                </div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full blur-2xl -mr-10 -mb-10 group-hover:bg-emerald-100/50 transition-colors" />
                            </div>

                            {/* Wellness Score Card */}
                            <div className="relative group overflow-hidden bg-white rounded-[32px] p-6 border border-black/5 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-semibold text-muted-foreground/80 uppercase tracking-wider">{t('dashboard.stats.wellnessScore')}</span>
                                    <div className="h-10 w-10 rounded-full bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                                        <Activity className="h-5 w-5 text-violet-600" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-2xl font-bold text-foreground">85</div>
                                        <span className="text-sm text-green-500 font-medium">+2%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-violet-600 w-[85%] rounded-full" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-violet-50/50 rounded-full blur-2xl -mr-10 -mb-10 group-hover:bg-violet-100/50 transition-colors" />
                            </div>

                            {/* Streak Card */}
                            <div className="relative group overflow-hidden bg-card rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-semibold text-muted-foreground/80 uppercase tracking-wider">{t('dashboard.stats.streak')}</span>
                                    <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                        <TrendingUp className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-foreground">3 {t('common.days')}</div>
                                    <p className="text-sm font-medium text-orange-600">Keep it burning!</p>
                                </div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-50/50 rounded-full blur-2xl -mr-10 -mb-10 group-hover:bg-orange-100/50 transition-colors" />
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Upcoming Sessions Section */}
                            <div className="lg:col-span-2 bg-white rounded-[32px] border border-black/5 shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold text-foreground">{t('dashboard.upcoming.title')}</h2>
                                        <p className="text-sm text-muted-foreground">{t('dashboard.upcoming.subtitle')}</p>
                                    </div>
                                    <button className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors">
                                        {t('common.viewAll')} &rarr;
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Session Item 1 */}
                                    <div className="group flex items-center gap-5 p-4 rounded-[24px] hover:bg-muted/30 transition-colors border border-transparent hover:border-black/5 cursor-pointer">
                                        <div className="shrink-0 h-16 w-16 rounded-2xl bg-orange-50 text-orange-600 flex flex-col items-center justify-center border border-orange-100">
                                            <span className="text-xs font-bold uppercase">Oct</span>
                                            <span className="text-xl font-bold">22</span>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h3 className="text-base font-bold text-foreground group-hover:text-blue-600 transition-colors">Deep Tissue Massage</h3>
                                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> 4:00 PM - 5:00 PM
                                            </p>
                                        </div>
                                        <div className="shrink-0">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                Confirmed
                                            </span>
                                        </div>
                                    </div>

                                    {/* Session Item 2 */}
                                    <div className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                                        <div className="shrink-0 h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center border border-blue-100">
                                            <span className="text-xs font-bold uppercase">Oct</span>
                                            <span className="text-xl font-bold">28</span>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h3 className="text-base font-bold text-foreground group-hover:text-blue-600 transition-colors">Kinesiology Session</h3>
                                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> 11:00 AM - 12:00 PM
                                            </p>
                                        </div>
                                        <div className="shrink-0">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                Pending
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Promo/Feature Content */}
                            <div className="relative overflow-hidden rounded-[32px] bg-gray-900 p-8 text-white shadow-xl lg:col-span-1 flex flex-col justify-between group">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-700" />

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/10 backdrop-blur-md text-xs font-medium border border-white/20 mb-6">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span>Premium Member</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{t('dashboard.promo.title') || 'Upgrade to Premium'}</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                        {t('dashboard.promo.description') || 'Get exclusive access to priority bookings, discounts, and premium wellness content.'}
                                    </p>

                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-center gap-3 text-sm text-gray-200">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                            10% off all sessions
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-200">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                            Priority Booking
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-200">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                            Advanced Analytics
                                        </li>
                                    </ul>
                                </div>

                                <button className="relative z-10 w-full py-3.5 bg-white text-foreground rounded-full font-bold hover:bg-muted transition-colors active:scale-95 duration-200 shadow-lg">
                                    {t('common.upgrade')}
                                </button>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel className="p-12 text-center bg-card rounded-[32px] border border-gray-100 shadow-sm animate-slide-up">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-muted-foreground/80" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Full Booking Schedule</h3>
                            <p className="text-muted-foreground mb-6">This feature is under active development. Check back soon for deeper calendar integration.</p>
                        </div>
                    </TabPanel>

                    <TabPanel className="p-12 text-center bg-card rounded-[32px] border border-gray-100 shadow-sm animate-slide-up">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-muted/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-muted-foreground/80" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Wallet Management</h3>
                            <p className="text-muted-foreground mb-6">Manage your credits, payment methods, and transaction history here soon.</p>
                        </div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
}
