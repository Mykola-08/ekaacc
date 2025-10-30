'use client';

import { StatCard } from '@/components/eka/dashboard/stat-card';
import { NextSession } from '@/components/eka/dashboard/next-session';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, CalendarDays, Target, Sparkles, HeartPulse, Smile, Zap, ArrowRight, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { DashboardHero } from '@/components/eka/dashboard/dashboard-hero';
import { GoalProgress } from '@/components/eka/dashboard/goal-progress';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { useMemo, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ComprehensiveOnboarding } from '@/components/eka/comprehensive-onboarding';
import { AnimatedCard } from '@/components/eka/animated-card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Session, Report, User } from '@/lib/types';
import Link from 'next/link';
import { 
  WelcomeHero, 
  MotivationalCard, 
  SessionRecommendationsCard, 
  FeedbackCard, 
  NextStepsCard 
} from '@/components/eka/personalization';
import DashboardView from '@/components/DashboardView';

export default function HomePage() {
  const { appUser: currentUser, loading, user, refreshAppUser } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();

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
    } else if (!loading) {
      setDataLoading(false);
    }
  }, [dataService, user, loading]);

  const updateUser = async (data: Partial<User>) => {
    if (dataService && currentUser?.id) {
      await dataService.updateUser(currentUser.id, data);
      await refreshAppUser(); // Refresh user data from auth context
    }
  };

  // Track page visit for personalization
  useEffect(() => {
    if (currentUser && currentUser.personalizationCompleted) {
      // Activity tracking removed - personalizationEngine not available
      // TODO: Re-implement if needed
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Generate personalized content
  useEffect(() => {
    if (currentUser && currentUser.personalizationCompleted && currentUser.personalization) {
      // Personalized data generation removed - personalizationEngine not available
      // TODO: Re-implement if needed
    }
  }, [currentUser, currentUser?.activityData]);

  useEffect(() => {
    if (!loading && currentUser && !currentUser.personalizationCompleted) {
      setShowOnboarding(true);
    }
  }, [currentUser, loading]);

  const handleOnboardingComplete = (personalizationData: Partial<User['personalization']>) => {
    updateUser({
      personalizationCompleted: true,
      personalization: personalizationData,
    });
    setShowOnboarding(false);
    toast({
      title: '🎉 Welcome to EKA!',
      description: 'Your personalized dashboard is ready.',
      duration: 5000
    });
  };

  const upcomingSessions = useMemo(
    () => sessions?.filter(s => new Date(s.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [],
    [sessions]
  );
  
  const completedSessions = useMemo(
    () => sessions?.filter(s => new Date(s.date) < new Date()) || [],
    [sessions]
  );

  const targetSessions = currentUser?.goal?.targetSessions ?? 10;
  const personalization = currentUser?.personalization;

  const personalizedStats = useMemo(() => [
    {
      title: 'Wellness Score',
      value: personalization?.aiPersonalizationScore ? `${personalization.aiPersonalizationScore}%` : '...',
      change: '+5%',
      changeType: 'increase' as const,
      icon: HeartPulse,
    },
    {
      title: 'Sessions Complete',
      value: `${completedSessions.length}/${targetSessions}`,
      change: `${Math.round((completedSessions.length / (sessions?.length || 1)) * 100)}% of total`,
      changeType: 'increase' as const,
      icon: Activity,
    },
    {
      title: 'Mood Trend',
      value: 'N/A', // mood removed from Report type
      change: 'vs last week',
      changeType: 'neutral' as const,
      icon: Smile,
    },
    {
      title: 'Next Goal',
      value: currentUser?.goal?.description ?? 'Set a Goal',
      change: `Sessions: ${currentUser?.goal?.currentSessions ?? 0}/${currentUser?.goal?.targetSessions ?? 0}`,
      changeType: 'neutral' as const,
      icon: Target,
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [personalization, completedSessions.length, targetSessions, sessions?.length, reports, currentUser?.goal]);

  if (loading || dataLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full lg:col-span-2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <ComprehensiveOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (!currentUser || !personalization) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Could not load user data. Please try again later.</p>
      </div>
    );
  }

  return (
    <DashboardView />
  );
}
