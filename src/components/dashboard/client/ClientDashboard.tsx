'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
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
  Sun03Icon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
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
import { AlertTriangle, Shield, X } from 'lucide-react';
import {
  MorphingActionButton,
  ProgressRing,
  MotivationalQuote,
  CountdownTimer,
} from '@/components/ui';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function ClientDashboard({
  profile,
  wallet,
  nextBooking,
  plans,
  activeUsage,
  goals,
  recentErrors = [],
}: any) {
  const { t } = useLanguage();
  const router = useRouter();
  const [showIdentity, setShowIdentity] = useState(profile?.identity_status !== 'verified');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );

  const handleBookClick = () => {
    setBookingStatus('loading');
    setTimeout(() => {
      router.push('/book');
    }, 800);
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('page.dashboard.goodMorning') || 'Good Morning'
      : hour < 18
        ? t('page.dashboard.goodAfternoon') || 'Good Afternoon'
        : t('page.dashboard.goodEvening') || 'Good Evening';
  const GreetingIcon = hour < 12 || hour < 18 ? Sun03Icon : Moon02Icon;
  const quickActions = [
    {
      title: t('page.dashboard.bookSession') || 'Book a Session',
      description: t('page.bookings.subtitle') || 'Find availability and schedule your next visit.',
      href: '/book',
      icon: Calendar01Icon,
    },
    {
      title: t('nav.bookings') || 'My Bookings',
      description: t('page.bookings.subtitle') || 'Review upcoming and past appointments.',
      href: '/bookings',
      icon: Clock01Icon,
    },
    {
      title: t('nav.journal') || 'Journal',
      description: 'Track mood, progress, and personal notes.',
      href: '/journal',
      icon: ActivityIcon,
    },
    {
      title: t('nav.subscriptions') || 'Plans',
      description: 'Browse memberships and manage your benefits.',
      href: '/plans',
      icon: PlusSignIcon,
    },
    {
      title: t('nav.features') || 'All Features',
      description: t('page.features.subtitle') || 'Explore all available tools and pages in one place.',
      href: '/features',
      icon: ActivityIcon,
    },
  ];

  return (
    <motion.div
      className="mx-auto max-w-7xl space-y-8 pb-20 font-sans"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      {/* Header is now handled by Layout + Simplified Page Title */}
      {/* <DashboardHeader title="Wellness Dashboard" showDate={true} /> */}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Welcome & Main Action */}
        <div className="space-y-8 lg:col-span-2">
          {/* Hero Section - Clean White */}
          <section className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[20px] border border-border bg-card p-8 shadow-sm">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                <HugeiconsIcon icon={GreetingIcon} className="size-4" strokeWidth={2.5} />
                <span className="text-[11px] font-bold tracking-wider uppercase">{t('page.dashboard.dailyUpdate') || 'Daily Update'}</span>
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                {greeting},{' '}
                <span className="text-blue-600">{profile.first_name || 'Member'}</span>.
              </h1>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Your wellness journey is moving forward. You have{' '}
                {wallet?.balance_cents ? 'funds available' : 'no active balance'} and{' '}
                {nextBooking ? 'an upcoming session.' : 'no sessions scheduled today.'}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleBookClick}
                  disabled={bookingStatus === 'loading'}
                  size="lg"
                  className="h-12 rounded-[20px] bg-blue-600 px-8 text-base font-bold shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700"
                >
                  {bookingStatus === 'loading' ? 'Scheduling...' : t('page.dashboard.bookSession') || 'Book a Session'}
                </Button>
                <Link href="/wallet">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-[20px] border-border px-6 text-base font-bold text-foreground hover:bg-muted"
                  >
                    {t('page.dashboard.manageWallet') || 'Manage Wallet'}
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Next Session */}
            <Card className="group flex min-h-[200px] flex-col justify-between rounded-[20px] border border-border bg-card p-6 shadow-sm transition-all hover:border-blue-100">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  {t('page.dashboard.nextUp') || 'NEXT UP'}
                </span>
                <div className="rounded-xl bg-muted p-2 text-muted-foreground transition-colors group-hover:bg-blue-50 group-hover:text-blue-500">
                  <HugeiconsIcon icon={Calendar01Icon} className="size-5" strokeWidth={2.5} />
                </div>
              </div>
              {nextBooking ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-xl font-bold tracking-tight text-foreground">
                      {nextBooking.service?.name}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <HugeiconsIcon icon={Clock01Icon} className="size-4" strokeWidth={2.5} />
                      <span>
                        {format(new Date(nextBooking.start_time), 'EEEE, MMM d @ h:mm a')}
                      </span>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="secondary"
                    className="h-10 w-full rounded-xl bg-muted font-bold text-foreground hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Link href={`/bookings/${nextBooking.id}`}>{t('page.dashboard.viewDetails') || 'View Details'}</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-end">
                  <p className="mb-4 font-medium text-muted-foreground">{t('page.dashboard.noSessions') || 'No confirmed sessions.'}</p>
                  <Link
                    href="/book"
                    className="group/link flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
                  >
                    {t('page.dashboard.checkAvailability') || 'Check availability'}{' '}
                    <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" strokeWidth={2.5} />
                  </Link>
                </div>
              )}
            </Card>

            {/* Wallet Balance */}
            <Card className="group flex min-h-[200px] flex-col justify-between rounded-[20px] border border-border bg-card p-6 shadow-sm transition-all hover:border-emerald-100">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  {t('page.dashboard.balance') || 'BALANCE'}
                </span>
                <div className="rounded-xl bg-muted p-2 text-muted-foreground transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-500">
                  <HugeiconsIcon icon={Wallet01Icon} className="size-5" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold tracking-tight text-foreground">
                  €{(wallet?.balance_cents || 0) / 100}
                </div>
                <p className="mt-2 text-xs font-medium text-muted-foreground">{t('page.dashboard.availableFunds') || 'Available funds'}</p>
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <Link
                  href="/wallet"
                  className="group/link flex items-center gap-1 text-sm font-bold text-emerald-600 hover:underline"
                >
                  {t('page.dashboard.addFunds') || 'Add funds'}{' '}
                  <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" strokeWidth={2.5} />
                </Link>
              </div>
            </Card>
          </div>

          {/* Goal Tracker */}
          <div className="pt-2">
            <div className="overflow-hidden rounded-[20px] border border-border bg-card p-2 shadow-sm">
              <GoalTracker initialGoals={goals || []} />
            </div>
          </div>

          <section className="pt-2">
            <h3 className="mb-4 px-1 text-lg font-bold text-foreground">{t('dashboard.user.quickActions') || 'Quick Actions'}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-start gap-4 rounded-[20px] border border-border bg-card p-5 shadow-sm transition-all hover:border-blue-100 hover:shadow-md"
                >
                  <div className="rounded-xl bg-muted p-3 text-muted-foreground transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                    <HugeiconsIcon icon={action.icon} className="size-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{action.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar / Secondary Actions */}
        <div className="space-y-6">
          {/* Daily Mood Check-In */}
          <div className="rounded-[20px] border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-foreground">{t('page.dashboard.dailyCheckin') || 'Daily Check-in'}</h3>
            <MoodCheckIn />
          </div>

          <AnimatePresence>
            {showIdentity && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative overflow-hidden rounded-[20px] border border-blue-100 bg-blue-50 p-6"
              >
                <button
                  onClick={() => setShowIdentity(false)}
                  className="absolute top-4 right-4 z-10 rounded-full p-1 text-blue-400 transition-colors hover:text-blue-600"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mb-2 flex items-center gap-3 text-blue-700">
                  <Shield className="h-5 w-5" />
                  <h3 className="font-bold">Verify Identity</h3>
                </div>
                <p className="mb-4 text-xs leading-relaxed text-blue-600/80">
                  Complete verification to unlock all features.
                </p>
                <IdentityVerificationForm currentStatus={profile?.identity_status || 'none'} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-[20px] border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <HugeiconsIcon
                icon={ActivityIcon}
                className="h-4 w-4 text-muted-foreground"
                strokeWidth={2.5}
              />
              <h3 className="text-lg font-bold text-foreground">{t('page.dashboard.systemStatus') || 'System Status'}</h3>
            </div>
            {recentErrors.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                {t('page.dashboard.normalOp') || 'Normal Operation'}
              </div>
            ) : (
              <div className="space-y-3">
                {recentErrors.map((error: any) => (
                  <div key={error.id} className="rounded-xl border border-red-100 bg-red-50 p-3">
                    <p className="text-xs leading-snug font-semibold text-red-900">
                      {error.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Journal or Quote - Simplified */}
          <div className="overflow-hidden rounded-[20px]">
            <MotivationalQuote />
          </div>
        </div>
      </div>

      {/* Marketplace / History Section */}
      <div className="border-t border-border pt-8">
        {!activeUsage && plans && plans.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold">{t('page.dashboard.membershipPlans') || 'Membership Plans'}</h3>
              <Link href="/plans" className="text-primary text-sm font-bold hover:underline">
                {t('page.dashboard.viewAll') || 'View all'}
              </Link>
            </div>
            <PlanMarketplace plans={plans.slice(0, 2)} />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="px-1 text-lg font-bold tracking-tight">{t('page.dashboard.recentActivity') || 'Recent Activity'}</h3>
          <RecentActivity />
        </div>
      </div>
    </motion.div>
  );
}
