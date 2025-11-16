'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { WelcomeHeader } from './eka/dashboard/welcome-header';
import { StatsGrid } from './eka/dashboard/stats-grid';
import { NextSession } from './eka/dashboard/next-session';
import { GoalProgress } from './eka/dashboard/goal-progress';
import AIGoalSuggestions from './AIGoalSuggestions';
import PersonalBlock from './PersonalBlock';
import { ComprehensiveOnboarding } from '@/components/eka/comprehensive-onboarding';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User as UserIcon } from 'lucide-react';
import type { Session, Report, User } from '@/lib/types';

export default function DashboardView() {
  const { user: currentUser, loading: authLoading, user } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (dataService && user?.id) {
      setDataLoading(true);
      Promise.all([
        dataService.getSessions(user.id),
        dataService.getReports(user.id),
        dataService.getCurrentUser(),
      ]).then(([userSessions, userReports, userProfile]) => {
        setSessions(userSessions || []);
        setReports(userReports || []);
        setUserData(userProfile);
      }).finally(() => {
        setDataLoading(false);
      });
    } else if (!authLoading) {
      setDataLoading(false);
    }
  }, [dataService, user, authLoading]);

  const updateUser = async (data: Partial<User>) => {
    if (dataService && currentUser?.id) {
      await dataService.updateUser(currentUser.id, data);
    }
  };

  useEffect(() => {
    if (!authLoading && userData && !userData.personalizationCompleted) {
      setShowOnboarding(true);
    }
  }, [userData, authLoading]);

  const handleOnboardingComplete = (personalizationData: Partial<User['personalization']>) => {
    updateUser({
      personalizationCompleted: true,
      personalization: personalizationData,
    });
    setShowOnboarding(false);
  };

  const upcomingSessions = useMemo(
    () => sessions?.filter(s => new Date(s.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [],
    [sessions]
  );

  if (authLoading || dataLoading) {
    return (
      <div className="space-y-8" role="status" aria-label="Loading dashboard">
        <Skeleton className="h-24 w-full rounded-xl skeleton-modern" />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-36 w-full rounded-xl skeleton-modern" />
          <Skeleton className="h-36 w-full rounded-xl skeleton-modern" />
          <Skeleton className="h-36 w-full rounded-xl skeleton-modern" />
          <Skeleton className="h-36 w-full rounded-xl skeleton-modern" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-80 w-full lg:col-span-2 rounded-xl skeleton-modern" />
          <Skeleton className="h-80 w-full rounded-xl skeleton-modern" />
        </div>
        <span className="sr-only">Loading your personalized dashboard...</span>
      </div>
    );
  }

  if (showOnboarding) {
    return <ComprehensiveOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 rounded-2xl bg-muted/30">
        <UserIcon className="w-16 h-16 text-muted-foreground mb-6" />
        <h2 className="text-4xl font-semibold text-foreground mb-4">Welcome to EKA</h2>
        <p className="text-muted-foreground max-w-md mb-8 text-lg">
          Your personalized space for mental wellness and growth. Sign in to access your dashboard and begin your journey.
        </p>
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={() => router.push('/login?tab=login')} 
            variant="default"
            size="lg"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => router.push('/login?tab=signup')} 
            variant="ghost"
            size="lg"
          >
            Sign Up
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          New to EKA? Create an account to get started with personalized mental wellness tools.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <WelcomeHeader />
      <StatsGrid sessions={sessions} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <NextSession sessions={upcomingSessions} isLoading={dataLoading} />
          <AIGoalSuggestions />
        </div>
        <div className="space-y-8">
          <PersonalBlock />
          {userData?.goal && (
            <GoalProgress
              sessionsCompleted={userData.goal.currentSessions || 0}
              goal={userData.goal.description || ''}
              targetSessions={userData.goal.targetSessions || 10}
            />
          )}
        </div>
      </div>
    </div>
  );
}
