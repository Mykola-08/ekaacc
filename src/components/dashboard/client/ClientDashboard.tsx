'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
    Calendar01Icon, 
    Clock01Icon, 
    PlusSignIcon, 
    ArrowUpRight01Icon, 
    Wallet01Icon, 
    Shield01Icon, 
    Cancel01Icon, 
    ActivityIcon,
    Moon02Icon,
    Sun03Icon
} from "@hugeicons/core-free-icons";
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { WelcomeBanner } from '../widgets/WelcomeBanner';
import { StatsCard } from '../widgets/StatsCard';
import { RecentActivity } from '../widgets/RecentActivity';
import { PlanUsageCard } from '@/components/plans/PlanUsageCard';
import { PlanMarketplace } from '@/components/plans/PlanMarketplace';
import { GoalTracker } from '@/components/dashboard/goals/GoalTracker';
import { IdentityVerificationForm } from '@/components/identity/IdentityVerificationForm';
import { MoodCheckIn } from '../widgets/MoodCheckIn';
import { JournalTeaser } from '../widgets/JournalTeaser';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MorphingActionButton,
    ProgressRing,
    MotivationalQuote,
    CountdownTimer
} from '@/components/ui';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

export function ClientDashboard({ profile, wallet, nextBooking, plans, activeUsage, goals }: any) {
    const { t } = useLanguage();
    const router = useRouter();
    const [showIdentity, setShowIdentity] = useState(profile?.identity_status !== 'verified');
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleBookClick = () => {
        setBookingStatus('loading');
        setTimeout(() => {
            router.push('/book');
        }, 800);
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
    const GreetingIcon = hour < 12 || hour < 18 ? Sun03Icon : Moon02Icon;

    return (
        <DashboardLayout profile={profile}>
            <motion.div
                className="space-y-10 max-w-6xl mx-auto pb-20"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    ease: [0.25, 1, 0.5, 1],
                }}
            >
                <DashboardHeader title="Wellness Dashboard" showDate={true} />

                {/* Primary User Focus - Simplified High Contrast */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Welcome & Main Action */}
                    <div className="lg:col-span-2 space-y-10">
                        <section className="bg-card border border-border/40 rounded-[36px] p-10 shadow-xl shadow-foreground/5 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                                        <HugeiconsIcon icon={GreetingIcon} className="size-5" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-sm font-bold uppercase tracking-widest text-primary/70">Daily Update</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 tracking-tight leading-tight">
                                    Good {greeting}, <span className="text-primary italic">{profile.first_name || 'Member'}</span>.
                                </h1>
                                <p className="text-muted-foreground text-xl mb-10 max-w-lg leading-relaxed opacity-90">
                                    Your wellness journey is moving forward. You have {wallet?.balance_cents ? 'funds available' : 'no active balance'} and {nextBooking ? 'an upcoming session.' : 'no sessions scheduled today.'}
                                </p>
                                
                                <div className="flex flex-wrap gap-5">
                                    <Button
                                        onClick={handleBookClick}
                                        disabled={bookingStatus === 'loading'}
                                        size="lg"
                                        className="rounded-full px-10 h-14 text-lg font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all active:scale-95 group-hover:-translate-y-1"
                                    >
                                        {bookingStatus === 'loading' ? 'Scheduling...' : 'Book a Session'}
                                    </Button>
                                    <Link href="/wallet">
                                        <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-base font-bold border-2 hover:bg-secondary/50 transition-all border-border/50">
                                            Manage Wallet
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            
                            {/* Decorative Background Element */}
                            <div className="absolute right-0 top-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Next Session */}
                            <Card className="p-8 rounded-[36px] border border-border/40 bg-card shadow-lg shadow-foreground/5 flex flex-col justify-between min-h-[240px] hover:border-primary/30 transition-all duration-300 hover:shadow-xl group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-primary animate-pulse" />
                                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Next Up</span>
                                    </div>
                                    <div className="p-2 rounded-xl bg-secondary/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <HugeiconsIcon icon={Calendar01Icon} className="size-5" strokeWidth={2.5} />
                                    </div>
                                </div>
                                {nextBooking ? (
                                    <div className="space-y-6">
                                        <div>
                                            <div className="text-2xl font-bold tracking-tight text-foreground leading-tight">{nextBooking.service?.name}</div>
                                            <div className="flex items-center gap-2 text-muted-foreground mt-2 font-semibold">
                                                <HugeiconsIcon icon={Clock01Icon} className="size-4" strokeWidth={2.5} />
                                                <span className="text-sm">{format(new Date(nextBooking.start_time), 'EEEE, MMM d @ h:mm a')}</span>
                                            </div>
                                        </div>
                                        <Button asChild variant="secondary" className="w-full rounded-2xl h-12 font-bold hover:bg-primary/10 hover:text-primary transition-all">
                                            <Link href={`/bookings/${nextBooking.id}`}>View Details</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full justify-between">
                                        <p className="text-muted-foreground font-semibold text-lg opacity-80">No confirmed sessions coming up soon.</p>
                                        <Link href="/book" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group/link">
                                            Check availability <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
                                        </Link>
                                    </div>
                                )}
                            </Card>

                            {/* Simple Wallet Balance */}
                            <Card className="p-8 rounded-[36px] border border-border/40 bg-card shadow-lg shadow-foreground/5 flex flex-col justify-between min-h-[240px] hover:border-primary/30 transition-all duration-300 hover:shadow-xl group">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Balance</span>
                                    <div className="p-2 rounded-xl bg-secondary/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <HugeiconsIcon icon={Wallet01Icon} className="size-5" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-5xl font-serif font-bold text-foreground tabular-nums tracking-tighter">
                                        €{(wallet?.balance_cents || 0) / 100}
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground mt-3 opacity-90">Available for booking sessions</p>
                                </div>
                                <div className="mt-6 pt-6 border-t border-border/30">
                                    <Link href="/wallet" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group/link">
                                        Add funds <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
                                    </Link>
                                </div>
                            </Card>
                        </div>

                        {/* Goal Tracker */}
                        <div className="pt-6">
                             <div className="flex items-center justify-between mb-6 px-1">
                                <h3 className="text-2xl font-serif font-bold tracking-tight">Your Focus</h3>
                                <div className="p-1 rounded-full bg-primary/5">
                                    <HugeiconsIcon icon={ActivityIcon} className="size-5 text-primary/40" strokeWidth={2.5} />
                                </div>
                             </div>
                             <div className="bg-card border border-border/40 rounded-[36px] p-2 shadow-sm overflow-hidden">
                                <GoalTracker initialGoals={goals || []} />
                             </div>
                        </div>
                    </div>

                    {/* Sidebar / Secondary Actions */}
                    <div className="space-y-8">
                        {/* Daily Mood Check-In */}
                        <div className="bg-card border border-border/40 rounded-[36px] p-8 shadow-lg shadow-foreground/5">
                            <h3 className="font-bold text-xl font-serif text-foreground mb-6">Daily Check-in</h3>
                            <MoodCheckIn />
                        </div>

                        <AnimatePresence>
                            {showIdentity && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-6 bg-primary/5 rounded-3xl border border-primary/10 relative overflow-hidden"
                                >
                                    <button
                                        onClick={() => setShowIdentity(false)}
                                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10 p-1 hover:bg-background/50 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center gap-3 mb-3 text-primary">
                                        <Shield className="w-5 h-5" />
                                        <h3 className="font-bold">Verify Identity</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">Complete verification to unlock all platform features.</p>
                                    <IdentityVerificationForm currentStatus={profile?.identity_status || 'none'} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Journal or Quote - Simplified */}
                        <MotivationalQuote />
                    </div>
                </div>

                {/* Marketplace / History Section */}
                <div className="pt-8 border-t border-border">
                    {!activeUsage && plans && plans.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold font-serif">Membership Plans</h3>
                                <Link href="/plans" className="text-sm font-bold text-primary hover:underline">View all</Link>
                            </div>
                            <PlanMarketplace plans={plans.slice(0, 2)} />
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold px-1 tracking-tight">Recent Activity</h3>
                        <RecentActivity />
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
