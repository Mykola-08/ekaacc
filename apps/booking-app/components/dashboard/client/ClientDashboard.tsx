'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Plus, ArrowUpRight, Wallet, Shield, X, Activity } from "lucide-react";
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
import { motion, AnimatePresence } from 'motion/react';
import {
    MorphingActionButton,
    ProgressRing,
    MotivationalQuote,
    CountdownTimer
} from '@ekaacc/shared-ui';
import { useRouter } from 'next/navigation';

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

    return (
        <DashboardLayout profile={profile}>
            <motion.div
                className="space-y-6 h-full"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    ease: [0.25, 1, 0.5, 1],
                }}
            >
                <DashboardHeader title="Wellness Dashboard" showDate={true} />

                {/* Main Action Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <WelcomeBanner
                            title="Welcome back,"
                            firstName={profile.first_name || 'Member'}
                            subtitle="Ready for your next session? We're here to help you grow and heal."
                            action={
                                <Button
                                    onClick={handleBookClick}
                                    disabled={bookingStatus === 'loading'}
                                    size="lg"
                                    className="rounded-full font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                                >
                                    {bookingStatus === 'loading' ? 'Scheduling...' : 'Book a Session'}
                                </Button>
                            }
                        />
                    </div>
                    {/* Wallet Component - Minimal Zinc */}
                    <Link href="/wallet" className="group h-full">
                        <Card className="h-full p-6 rounded-2xl border border-border bg-surface hover:bg-surface-container/50 transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-sm hover:shadow-md cursor-pointer active:scale-[0.98]">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-2xl bg-surface-container text-primary">
                                    <Wallet className="w-5 h-5" strokeWidth={2} />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-muted opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                            <div className="mt-4">
                                <span className="text-[13px] font-semibold text-muted uppercase tracking-wide">Available Balance</span>
                                <div className="text-[32px] font-bold tracking-tight tabular-nums text-primary mt-1">€{(wallet?.balance_cents || 0) / 100}</div>
                            </div>
                        </Card>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Wellness Tracking */}
                    <div className="md:col-span-2">
                        <MoodCheckIn />
                    </div>

                    {/* Next Session - Standard Card */}
                    <Card className="p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Upcoming Session</span>
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                                <Calendar className="w-5 h-5" strokeWidth={2} />
                            </div>
                        </div>
                        {nextBooking ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-lg font-bold tracking-tight leading-tight">{nextBooking.service?.name}</div>
                                    <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                                        <Clock className="w-4 h-4" strokeWidth={2.75} />
                                        <span>
                                            {format(new Date(nextBooking.start_time), 'EEEE, MMM d')}
                                        </span>
                                    </div>
                                    <div className="py-2">
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Starts in</div>
                                        <CountdownTimer targetDate={nextBooking.start_time} />
                                    </div>
                                </div>
                                <Button asChild variant="secondary" className="w-full rounded-2xl h-11 text-xs font-bold bg-secondary/80 hover:bg-secondary">
                                    <Link href={`/bookings/${nextBooking.id}`}>Manage Session</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground font-medium italic">No sessions scheduled.</p>
                                <Button asChild className="w-full rounded-2xl h-11 text-xs font-bold bg-primary hover:bg-primary/90 shadow-md">
                                    <Link href="/book">Secure a Slot</Link>
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Secondary Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <GoalTracker initialGoals={goals || []} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Card className="p-6 rounded-2xl border-border bg-card/50 backdrop-blur-sm flex items-center gap-6 shadow-sm">
                                <ProgressRing progress={75} size={80} strokeWidth={8} color="hsl(var(--primary))" />
                                <div>
                                    <div className="font-bold text-primary">Activity</div>
                                    <div className="text-2xl font-black text-accent tabular-nums">75%</div>
                                    <div className="text-[10px] font-bold uppercase text-muted tracking-widest">Daily Goal</div>
                                </div>
                            </Card>
                            <Card className="p-6 rounded-2xl border-border bg-card/50 backdrop-blur-sm flex items-center gap-6 shadow-sm">
                                <ProgressRing progress={85} size={80} strokeWidth={8} color="hsl(142 76% 36%)" />
                                <div>
                                    <div className="font-bold text-primary">Wellness</div>
                                    <div className="text-2xl font-black text-emerald-500 tabular-nums">85%</div>
                                    <div className="text-[10px] font-bold uppercase text-muted tracking-widest">Score</div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <MotivationalQuote />

                        <AnimatePresence>
                            {showIdentity && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
                                    <button
                                        onClick={() => setShowIdentity(false)}
                                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <h3 className="font-bold mb-3 flex items-center gap-2 relative z-10">
                                        <Shield className="w-4 h-4 text-primary" strokeWidth={2.75} />
                                        Identity Verification
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Please verify your identity to access full platform features and ensure secure bookings.</p>
                                    <IdentityVerificationForm currentStatus={profile?.identity_status || 'none'} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <JournalTeaser />
                        {activeUsage && <PlanUsageCard usage={activeUsage} compact />}
                    </div>
                </div>

                {/* Exploration: Marketplace & History */}
                <div className="space-y-6 pt-4 border-t border-border/40">
                    {!activeUsage && plans && plans.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-lg font-bold tracking-tight">Recommended for You</h3>
                                <Link href="/plans" className="text-sm font-semibold text-primary hover:underline">See all plans</Link>
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
