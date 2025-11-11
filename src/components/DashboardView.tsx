'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
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
  const { appUser: currentUser, loading: authLoading, user, refreshAppUser } = useAuth();
  const dataService = useAppStore((state) => state.dataService);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (dataService && user?.uid) {
      setDataLoading(true);
      Promise.all([
        dataService.getSessions(user.uid),
        dataService.getReports(user.uid),
      ]).then(([userSessions, userReports]) => {
        setSessions(userSessions || []);
        setReports(userReports || []);
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
      await refreshAppUser();
    }
  };

  useEffect(() => {
    if (!authLoading && currentUser && !currentUser.personalizationCompleted) {
      setShowOnboarding(true);
    }
  }, [currentUser, authLoading]);

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
      <div className="p-6 lg:p-8 space-y-8 bg-gray-50/50 dark:bg-gray-900/50">
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 w-full lg:col-span-2 rounded-lg" />
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <ComprehensiveOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <UserIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Welcome to EKA</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          It looks like your profile is not fully set up yet. Please complete the onboarding process to get started.
        </p>
        <Button onClick={() => setShowOnboarding(true)} className="mt-6">Begin Onboarding</Button>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 dark:bg-background min-h-screen">
      <WelcomeHeader />
      <StatsGrid sessions={sessions} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <NextSession sessions={upcomingSessions} isLoading={dataLoading} />
          <AIGoalSuggestions />
        </div>
        <div className="space-y-8">
          <PersonalBlock />
          {currentUser.goal && (
            <GoalProgress
              sessionsCompleted={currentUser.goal.currentSessions || 0}
              goal={currentUser.goal.description}
              targetSessions={currentUser.goal.targetSessions || 10}
            />
          )}
        </div>
      </div>
    </main>
  );
}
