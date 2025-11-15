'use client';

import { useEffect, useState, useMemo } from 'react';
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
      <div className="space-y-8">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-80 w-full lg:col-span-2 rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <ComprehensiveOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 glass-effect rounded-2xl">
        <UserIcon className="w-16 h-16 text-muted-foreground mb-6" />
        <h2 className="text-3xl font-bold gradient-text mb-4">Welcome to EKA</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          It looks like your profile is not fully set up yet. Let's get you started with a quick onboarding process.
        </p>
        <Button 
          onClick={() => setShowOnboarding(true)} 
          className="hover-lift bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg"
          size="lg"
        >
          Begin Onboarding
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
    </div>
  );
}
