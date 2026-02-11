'use client';

import React, { useState, useMemo } from 'react';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon,
  Clock01Icon,
  PlusSignIcon,
  ArrowUpRight01Icon,
  Wallet01Icon,
  ActivityIcon,
  Moon02Icon,
  Sun03Icon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { RecentActivity } from '../widgets/RecentActivity';
import { PlanUsageCard } from '@/components/plans/PlanUsageCard';
import { PlanMarketplace } from '@/components/plans/PlanMarketplace';
import { GoalTracker } from '@/components/dashboard/goals/GoalTracker';
import { IdentityVerificationForm } from '@/components/identity/IdentityVerificationForm';
import { MoodCheckIn } from '../widgets/MoodCheckIn';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, ArrowRight, Sparkles, TrendingUp, Calendar, Heart, ChevronRight } from 'lucide-react';
import { MotivationalQuote } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

/* ─── Greeting logic ──────────────────────────────── */
function getGreeting(t: (k: string) => string | undefined) {
  const hour = new Date().getHours();
  if (hour < 12) return { text: t('page.dashboard.goodMorning') || 'Good Morning', icon: Sun03Icon, period: 'morning' };
  if (hour < 18) return { text: t('page.dashboard.goodAfternoon') || 'Good Afternoon', icon: Sun03Icon, period: 'afternoon' };
  return { text: t('page.dashboard.goodEvening') || 'Good Evening', icon: Moon02Icon, period: 'evening' };
}

function formatBookingDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`;
  if (isTomorrow(date)) return `Tomorrow at ${format(date, 'h:mm a')}`;
  const days = differenceInDays(date, new Date());
  if (days <= 7) return `${format(date, 'EEEE')} at ${format(date, 'h:mm a')}`;
  return format(date, 'MMM d, yyyy @ h:mm a');
}

/* ─── Quick Actions ───────────────────────────────── */
const QUICK_ACTIONS = (t: (k: string) => string | undefined) => [
  {
    title: t('page.dashboard.bookSession') || 'Book a Session',
    description: t('page.bookings.subtitle') || 'Find availability and schedule your next visit.',
    href: '/book',
    icon: Calendar01Icon,
    accent: 'group-hover:bg-info/10 group-hover:text-info',
  },
  {
    title: t('nav.bookings') || 'My Bookings',
    description: 'Review upcoming and past appointments.',
    href: '/bookings',
    icon: Clock01Icon,
    accent: 'group-hover:bg-success/10 group-hover:text-success',
  },
  {
    title: t('nav.journal') || 'Journal',
    description: 'Track mood, progress, and personal notes.',
    href: '/wellness',
    icon: ActivityIcon,
    accent: 'group-hover:bg-accent/10 group-hover:text-accent-foreground',
  },
  {
    title: t('nav.subscriptions') || 'Plans',
    description: 'Browse memberships and manage your benefits.',
    href: '/finances?tab=plans',
    icon: PlusSignIcon,
    accent: 'group-hover:bg-warning/10 group-hover:text-warning',
  },
];

/* ─── Client Dashboard ────────────────────────────── */
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
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading'>('idle');

  const greeting = useMemo(() => getGreeting(t), [t]);
  const quickActions = useMemo(() => QUICK_ACTIONS(t), [t]);
  const walletBalance = (wallet?.balance_cents || 0) / 100;
  const hasActiveGoals = goals && goals.length > 0;
  const goalProgress = hasActiveGoals 
    ? Math.round((goals.filter((g: any) => g.status === 'completed').length / goals.length) * 100) 
    : 0;

  const handleBookClick = () => {
    setBookingStatus('loading');
    router.push('/book');
  };

  return (
    <motion.div
      className="mx-auto max-w-7xl space-y-8 px-2 py-6 font-sans sm:px-4 md:px-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* ── Hero Section ─────────────────────────────── */}
      <section className="rounded-xl border border-border bg-card p-6 sm:p-8 md:p-10">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1.5">
            <HugeiconsIcon icon={greeting.icon} className="size-3.5 text-primary" strokeWidth={2.5} />
            <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">
              {t('page.dashboard.dailyUpdate') || 'Daily Update'}
            </span>
          </div>

          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {greeting.text},{' '}
            <span className="text-primary">{profile.first_name || 'Member'}</span>.
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {nextBooking 
              ? `Your next session is ${formatBookingDate(nextBooking.start_time)}.`
              : 'You have no upcoming sessions. Ready to book one?'
            }
            {walletBalance > 0 && ` You have €${walletBalance.toFixed(2)} available.`}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleBookClick}
              disabled={bookingStatus === 'loading'}
              className="h-10 gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Calendar className="h-4 w-4" />
              {bookingStatus === 'loading' ? 'Opening...' : t('page.dashboard.bookSession') || 'Book a Session'}
            </Button>
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-xl border-border px-6 text-sm font-semibold text-foreground hover:bg-secondary"
              asChild
            >
              <Link href="/finances">
                <HugeiconsIcon icon={Wallet01Icon} className="h-4 w-4" />
                {t('page.dashboard.manageWallet') || 'Manage Wallet'}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats Row ────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Next Session Card */}
        <Card className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Next Session
            </span>
            <div className="rounded-lg bg-muted p-1.5 text-muted-foreground">
              <HugeiconsIcon icon={Calendar01Icon} className="size-4" strokeWidth={2.5} />
            </div>
          </div>
          {nextBooking ? (
            <div>
              <div className="text-lg font-semibold tracking-tight text-foreground">
                {nextBooking.service?.name || 'Session'}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <HugeiconsIcon icon={Clock01Icon} className="size-3.5" strokeWidth={2.5} />
                <span>{formatBookingDate(nextBooking.start_time)}</span>
              </div>
              <Link 
                href={`/bookings/${nextBooking.id}`} 
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                View Details <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">No confirmed sessions</p>
              <Link 
                href="/book" 
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Check availability <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </Card>

        {/* Wallet Balance */}
        <Card className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Balance
            </span>
            <div className="rounded-lg bg-muted p-1.5 text-muted-foreground">
              <HugeiconsIcon icon={Wallet01Icon} className="size-4" strokeWidth={2.5} />
            </div>
          </div>
          <div className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            €{walletBalance.toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Available funds</p>
          <Link 
            href="/finances" 
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            {walletBalance > 0 ? 'Manage' : 'Add funds'} <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>

        {/* Goals Progress */}
        <Card className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Goals
            </span>
            <div className="rounded-lg bg-muted p-1.5 text-muted-foreground">
              <TrendingUp className="size-4" strokeWidth={2} />
            </div>
          </div>
          {hasActiveGoals ? (
            <div>
              <div className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                {goals.length}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Progress value={goalProgress} className="h-1.5 flex-1" />
                <span className="text-xs font-medium text-muted-foreground tabular-nums">{goalProgress}%</span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">No active goals</p>
              <Link 
                href="/wellness" 
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Set a goal <Sparkles className="h-3 w-3" />
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* ── Main Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Goal Tracker */}
          {hasActiveGoals && (
            <Card className="overflow-hidden rounded-xl border border-border bg-card p-5">
              <GoalTracker initialGoals={goals} />
            </Card>
          )}

          {/* Quick Actions */}
          <section>
            <h3 className="mb-3 text-sm font-semibold tracking-tight text-foreground">
              {t('dashboard.user.quickActions') || 'Quick Actions'}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-start gap-3.5 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className={cn(
                    'rounded-lg bg-muted p-2.5 text-muted-foreground transition-colors',
                    action.accent
                  )}>
                    <HugeiconsIcon icon={action.icon} className="size-4" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-foreground">{action.title}</h4>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </section>

          {/* Plan Marketplace */}
          {!activeUsage && plans && plans.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  {t('page.dashboard.membershipPlans') || 'Membership Plans'}
                </h3>
                <Link href="/plans" className="text-xs font-semibold text-primary hover:underline">
                  {t('page.dashboard.viewAll') || 'View all'}
                </Link>
              </div>
              <PlanMarketplace plans={plans.slice(0, 2)} />
            </section>
          )}

          {/* Recent Activity */}
          <section>
            <h3 className="mb-3 text-sm font-semibold tracking-tight text-foreground">
              {t('page.dashboard.recentActivity') || 'Recent Activity'}
            </h3>
            <RecentActivity />
          </section>
        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="space-y-4">
          {/* Mood Check-In */}
          <MoodCheckIn />

          {/* Identity Verification Banner */}
          <AnimatePresence>
            {showIdentity && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="relative border-primary/20 bg-primary/5 p-5">
                  <button
                    onClick={() => setShowIdentity(false)}
                    className="absolute top-3 right-3 rounded-full p-1 text-primary/50 transition-colors hover:text-primary"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="mb-3 flex items-center gap-2 text-primary">
                    <Shield className="h-4 w-4" />
                    <h3 className="text-sm font-semibold">Verify Identity</h3>
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-primary/80">
                    Complete verification to unlock all features.
                  </p>
                  <IdentityVerificationForm currentStatus={profile?.identity_status || 'none'} />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* System Status */}
          <Card className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <HugeiconsIcon icon={ActivityIcon} className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
              <h3 className="text-sm font-semibold text-foreground">
                {t('page.dashboard.systemStatus') || 'System Status'}
              </h3>
            </div>
            {recentErrors.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2.5 text-sm font-medium text-success dark:bg-success/10 dark:text-success">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success/100" />
                </span>
                {t('page.dashboard.normalOp') || 'All Systems Normal'}
              </div>
            ) : (
              <div className="space-y-2">
                {recentErrors.slice(0, 3).map((error: any) => (
                  <div key={error.id} className="rounded-lg border border-destructive/15 bg-destructive/5 p-3">
                    <p className="text-xs font-medium text-destructive">{error.message}</p>
                    <p className="mt-1 text-[10px] text-destructive/60">{error.route}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Motivational Quote */}
          <div className="overflow-hidden rounded-xl">
            <MotivationalQuote />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
