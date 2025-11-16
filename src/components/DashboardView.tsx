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
import { Skeleton, Button } from '@/components/keep';
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
      <div className="apple-page">
        <div className="apple-container">
          <div className="apple-space-y-8" role="status" aria-label="Loading dashboard">
            <Skeleton className="h-24 w-full apple-rounded-xl skeleton-modern" />
            <div className="apple-grid-4">
              <Skeleton className="h-36 w-full apple-rounded-xl skeleton-modern" />
              <Skeleton className="h-36 w-full apple-rounded-xl skeleton-modern" />
              <Skeleton className="h-36 w-full apple-rounded-xl skeleton-modern" />
              <Skeleton className="h-36 w-full apple-rounded-xl skeleton-modern" />
            </div>
            <div className="apple-grid-3">
              <Skeleton className="h-80 w-full apple-rounded-xl skeleton-modern" />
              <Skeleton className="h-80 w-full apple-rounded-xl skeleton-modern" />
            </div>
            <span className="sr-only">Loading your personalized dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <ComprehensiveOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (!currentUser) {
    return (
      <div className="apple-page">
        <div className="apple-container">
          <div className="apple-flex-center min-h-[70vh] apple-text-center apple-p-8 apple-rounded-2xl apple-bg-muted/30">
            <div className="apple-max-w-md">
              <UserIcon className="w-16 h-16 text-muted-foreground apple-mb-6" />
              <h2 className="apple-title-section apple-mb-4">Welcome to EKA</h2>
              <p className="apple-text-body apple-mb-8">
                Your personalized space for mental wellness and growth. Sign in to access your dashboard and begin your journey.
              </p>
              <div className="apple-flex apple-gap-4 apple-mb-6">
                <Button 
                  onClick={() => router.push('/login?tab=login')} 
                  className="apple-button-primary"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => router.push('/login?tab=signup')} 
                  variant="outline"
                  className="apple-button-outline"
                >
                  Sign Up
                </Button>
              </div>
              <p className="apple-text-caption">
                New to EKA? Create an account to get started with personalized mental wellness tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apple-page">
      <div className="apple-container">
        <div className="apple-space-y-12">
          <WelcomeHeader />
          <StatsGrid sessions={sessions} />
          <div className="apple-grid-3">
            <div className="apple-space-y-8">
              <NextSession sessions={upcomingSessions} isLoading={dataLoading} />
              <AIGoalSuggestions />
            </div>
            <div className="apple-space-y-8">
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
      </div>
    </div>
  );
}
