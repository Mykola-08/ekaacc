'use client';

import { StatCard } from '@/components/eka/dashboard/stat-card';
import { NextSession } from '@/components/eka/dashboard/next-session';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, CalendarDays, Target, Sparkles, HeartPulse, Smile, Zap, ArrowRight, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { DashboardHero } from '@/components/eka/dashboard/dashboard-hero';
import { GoalProgress } from '@/components/eka/dashboard/goal-progress';
import { useData } from '@/context/unified-data-context';
import { useMemo, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ComprehensiveOnboarding } from '@/components/eka/comprehensive-onboarding';
import { AnimatedCard } from '@/components/eka/animated-card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { User } from '@/lib/types';
import { PersonalizationEngine } from '@/lib/personalization-engine';
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
  const { currentUser, isLoading, sessions, reports, updateUser } = useData();
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [personalizedData, setPersonalizedData] = useState<ReturnType<typeof PersonalizationEngine.generatePersonalizedData> | null>(null);

  // Track page visit for personalization
  useEffect(() => {
    if (currentUser && currentUser.personalizationCompleted) {
      const activityUpdates = PersonalizationEngine.trackActivity(currentUser, {
        type: 'page-visit',
        data: { page: '/home' }
      });
      // merge with existing activityData to avoid overwriting fields
      updateUser({ activityData: { ...(currentUser.activityData || {}), ...activityUpdates } });
    }
  }, [currentUser, updateUser]);

  // Generate personalized content
  useEffect(() => {
    if (currentUser && currentUser.personalizationCompleted && currentUser.personalization) {
      // regenerate whenever user profile or activityData changes
      const data = PersonalizationEngine.generatePersonalizedData(currentUser);
      setPersonalizedData(data);
    }
  }, [currentUser, currentUser?.activityData]);

  useEffect(() => {
    if (!isLoading && currentUser && !currentUser.personalizationCompleted) {
      setShowOnboarding(true);
    }
  }, [currentUser, isLoading]);

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
      value: personalization?.aiPersonalizationScore ? `${personalization.aiPersonalizationScore}%` : '75%',
      change: '+5%',
      changeType: 'increase' as const,
      icon: HeartPulse,
    },
    {
      title: 'Sessions Complete',
      value: `${completedSessions.length}/${targetSessions}`,
      change: `+${completedSessions.length}`,
      changeType: 'increase' as const,
      icon: CalendarDays,
    },
    {
      title: 'Active Goals',
      value: personalization?.therapeuticGoals?.length?.toString() || '3',
      change: 'On track',
      changeType: 'increase' as const,
      icon: Target,
    },
    {
      title: 'Mood Trend',
      value: 'Improving',
      change: '+12%',
      changeType: 'increase' as const,
      icon: Smile,
    },
  ], [completedSessions, targetSessions, personalization]);

  // Show onboarding if user hasn't completed personalization
  if (showOnboarding) {
    return <ComprehensiveOnboarding onComplete={handleOnboardingComplete} />;
  }

  // Show loading skeleton only while initial data is loading
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 pb-8">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  // If user exists but hasn't completed personalization, trigger onboarding
  if (currentUser && !currentUser.personalizationCompleted && !showOnboarding) {
    setShowOnboarding(true);
    return (
      <div className="flex flex-col gap-6 pb-8">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  // Generate personalized data if not yet set (user completed personalization)
  if (currentUser && currentUser.personalizationCompleted && !personalizedData) {
    const data = PersonalizationEngine.generatePersonalizedData(currentUser);
    setPersonalizedData(data);
  }

  // Final safety check - if personalizedData is still null, show loading
  if (!personalizedData || !currentUser) {
    return (
      <div className="flex flex-col gap-6 pb-8">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <DashboardView />
    </div>
  );
}
