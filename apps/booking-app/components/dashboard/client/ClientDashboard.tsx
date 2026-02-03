'use client';

import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, ArrowUpRight, Wallet } from "lucide-react";
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
import { motion } from 'framer-motion';

export function ClientDashboard({ profile, wallet, nextBooking, plans, activeUsage, goals }: any) {
    const { t } = useLanguage();

    return (
        <DashboardLayout profile={profile}>
            <div
                className="space-y-6 animate-enter-fast"
            >
                <DashboardHeader title="My Wellness" showDate={false} />

                {/* Top Row: Welcome + Active Plan */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <WelcomeBanner
                            title={`Welcome, ${profile.first_name || 'Guest'}`}
                            subtitle="Ready for your next session?"
                            action={
                                <Button asChild className="rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 px-6">
                                    <Link href="/book">Book Now</Link>
                                </Button>
                            }
                        />
                    </div>
                    <div>
                        {activeUsage ? (
                            <PlanUsageCard usage={activeUsage} />
                        ) : (
                            <Link href="/plans">
                                <div className="h-full min-h-[140px] flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-transparent rounded-[28px] border border-dashed border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><Plus className="w-5 h-5" /></div>
                                    <span className="font-semibold text-primary">Get a Membership</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/wallet" className="block h-full">
                        <StatsCard
                            icon={Wallet}
                            label="Wallet Balance"
                            value={<span className="font-mono">€{(wallet?.balance_cents || 0) / 100}</span>}
                            colorClass="bg-blue-50 text-blue-600"
                            action={<ArrowUpRight className="w-5 h-5 text-muted-foreground/50" />}
                        />
                    </Link>

                    {/* Next Session */}
                    <div
                        className="bg-card p-6 rounded-[28px] border border-border shadow-sm hover:shadow-md transition-shadow animate-slide-in-right"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-muted-foreground uppercase">Next Session</span>
                            {nextBooking && <span className="bg-purple-100 text-purple-700 px-2 text-xs rounded-full font-bold">SOON</span>}
                        </div>
                        {nextBooking ? (
                            <div className="mt-2">
                                <div className="text-xl font-bold">{nextBooking.service_name || 'Session'}</div>
                                <div className="text-muted-foreground flex items-center gap-2 mt-1">
                                    <Clock className="w-4 h-4" />
                                    {format(new Date(nextBooking.start_time), 'MMM do, h:mm a')}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 text-muted-foreground font-medium">No upcoming sessions.</div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* New Goal Tracker */}
                    <GoalTracker initialGoals={goals || []} />

                    {/* Identity Prompt (if not verified) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 bg-card rounded-[28px] border border-border shadow-sm"
                    >
                        <h3 className="font-bold mb-4">Identity Status</h3>
                        {/* Placeholder for Identity status check passed as prop, using generic 'pending' for example if unknown */}
                        <IdentityVerificationForm currentStatus={profile?.identity_status || 'none'} />
                    </div>
                </div>

                {/* Marketplace Teaser if no plan */}
                {!activeUsage && plans && plans.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Recommended Plans</h3>
                        <PlanMarketplace plans={plans.slice(0, 2)} />
                    </div>
                )}

                <h3 className="text-xl font-semibold px-1">Recent Activity</h3>
                <RecentActivity />
            </div>
        </DashboardLayout>
    );
}
