'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { firebaseServices } from '@/firebase/firebaseClient';
import { ref, onValue, off } from 'firebase/database';
import PersonalBlock from './PersonalBlock';
import { requestPushPermissionAndRegister } from '@/firebase/messagingClient';
import { loadPreferences } from '@/firebase/onboardingStore';
import AIGoalSuggestions from './AIGoalSuggestions';
import { USE_MOCK_DATA } from '@/services/data-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight, Bell, CheckCircle2, Clock, HeartPulse, Settings, Smile, Target, TrendingUp, User as UserIcon, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ComprehensiveOnboarding } from '@/components/eka/comprehensive-onboarding';
import { useToast } from '@/hooks/use-toast';
import type { Session, Report, User } from '@/lib/types';
import Link from 'next/link';
import { StatCard } from './eka/dashboard/stat-card';
import { NextSession } from './eka/dashboard/next-session';
import { GoalProgress } from './eka/dashboard/goal-progress';
import { TextEffect, InView, AnimatedNumber, TextLoop } from '@/components/motion-primitives';

export default function DashboardView() {
  const { appUser: currentUser, loading: authLoading, user, refreshAppUser, signOut } = useAuth();
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
      value: personalization?.aiPersonalizationScore ? `${personalization.aiPersonalizationScore}%` : 'N/A',
      icon: HeartPulse,
      trend: '+5%',
    },
    {
      title: 'Sessions Done',
      value: `${completedSessions.length}`,
      icon: Activity,
      trend: `${Math.round((completedSessions.length / (sessions?.length || 1)) * 100)}%`,
    },
    {
      title: 'Mood',
      value: 'Positive', // Placeholder
      icon: Smile,
      trend: 'Up',
    },
    {
      title: 'Streak',
      value: '3 days', // Placeholder
      icon: Zap,
      trend: 'New Record',
    },
  ], [personalization, completedSessions.length, sessions?.length]);

  const handleEnableNotifications = async () => {
    if (!user) return;
    try {
      await requestPushPermissionAndRegister(user.uid);
      toast({
        title: 'Success',
        description: 'Notifications have been enabled.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to enable notifications. Please check your browser settings.',
        variant: 'destructive',
      });
    }
  };

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

  if (!currentUser || !personalization) {
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
      <header className="flex justify-between items-center mb-8">
        <div>
          <TextEffect 
            per="word" 
            preset="fade-in-blur"
            className="text-3xl font-bold text-gray-800 dark:text-white"
          >
            {`Hello, ${currentUser.name?.split(' ')[0] || 'there'}`}
          </TextEffect>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's your wellness snapshot for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleEnableNotifications}>
            <Bell className="h-5 w-5" />
          </Button>
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          <Button onClick={signOut} variant="outline">Logout</Button>
        </div>
      </header>

      {/* Stats Grid */}
      <InView className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {personalizedStats.map((stat, index) => (
          <InView 
            key={stat.title}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
          >
            <Card className="bg-white dark:bg-gray-800/50 border-none shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</CardTitle>
                <stat.icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {typeof stat.value === 'number' ? (
                    <AnimatedNumber value={stat.value} />
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          </InView>
        ))}
      </InView>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <NextSession sessions={upcomingSessions} isLoading={dataLoading} />
          <AIGoalSuggestions />
        </div>

        {/* Right Column */}
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

