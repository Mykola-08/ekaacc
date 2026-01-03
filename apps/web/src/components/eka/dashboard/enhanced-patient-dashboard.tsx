'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
// import { WellnessInsights } from './dashboard-hero'; // Removed - not exported from there
import { StatsGrid } from '@/components/eka/dashboard/stats-grid';
import { NextSession } from '@/components/eka/dashboard/next-session';
import { GoalProgress } from '@/components/eka/dashboard/goal-progress';
import { WelcomeHeader } from '@/components/eka/dashboard/welcome-header';
import { AIHelpWidget } from '@/components/ai-help-widget';
import BehavioralInsightsWidget from '@/components/eka/behavioral-insights-widget';
import PersonalBlock from '@/components/PersonalBlock';
import { ComprehensiveOnboarding } from '@/components/eka/comprehensive-onboarding';
import { PersonalizationLoader } from '@/components/eka/onboarding/personalization-loader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Heart, Brain, Calendar, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import type { Session, Report, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateWellnessInsights } from '@/ai/ai-service';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/eka/page-container';
import { SurfacePanel } from '@/components/eka/surface-panel';

// Enhanced calming color palette for mental health
const calmingColors = {
  primary: 'from-blue-50 to-indigo-100',
  secondary: 'from-green-50 to-teal-100',
  accent: 'from-purple-50 to-pink-100',
  neutral: 'from-gray-50 to-slate-100'
};

// AI-powered wellness insights component
function WellnessInsights({ userData }: { userData: User }) {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateInsights() {
      try {
        setLoading(true);
        const context = {
          sessionsCompleted: userData.goal?.currentSessions || 0,
          mood: userData.personalization?.mood || 'neutral',
          goals: userData.goal?.description || 'Wellness journey'
        };

        const insights = await generateWellnessInsights({
          userData: {
            sessionsCompleted: context.sessionsCompleted,
            mood: String(context.mood),
            goals: context.goals,
            name: userData.name || undefined,
          },
          context: 'patient-dashboard'
        });

        // Parse the response into structured insights
        const insightsList = insights.map((text, index) => ({
          id: index,
          text: text,
          type: index % 2 === 0 ? 'positive' : 'suggestion',
          confidence: 0.85
        }));

        setInsights(insightsList);
      } catch (error) {
        console.error('Error generating wellness insights:', error);
        setInsights([
          { id: 1, text: 'Keep up the great work on your wellness journey!', type: 'positive', confidence: 0.8 },
          { id: 2, text: 'Consider setting a small daily goal to maintain momentum.', type: 'suggestion', confidence: 0.7 }
        ]);
      } finally {
        setLoading(false);
      }
    }

    if (userData) {
      generateInsights();
    }
  }, [userData]);

  if (loading) {
    return (
      <Card className="border-0 bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Wellness Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Wellness Insights
        </CardTitle>
        <CardDescription>Personalized recommendations for your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 rounded-lg transition-all duration-300",
                  insight.type === 'positive' 
                    ? 'bg-green-50/50 text-green-900' 
                    : 'bg-blue-50/50 text-blue-900'
                )}
              >
                <div className="flex items-start gap-3">
                  {insight.type === 'positive' ? (
                    <Heart className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium">{insight.text}</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {insight.type === 'positive' ? 'Achievement' : 'Suggestion'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(insight.confidence * 100)}% confidence
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick action cards with calming design
function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  color = 'blue',
  onClick 
}: {
  icon: any;
  title: string;
  description: string;
  action: string;
  color?: 'blue' | 'green' | 'purple' | 'teal';
  onClick?: () => void;
}) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200',
    green: 'from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200',
    teal: 'from-teal-50 to-teal-100 border-teal-200 hover:from-teal-100 hover:to-teal-200'
  };

  return (
    <motion.div
      whileHover={{ y: -2, opacity: 0.95 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "p-8 rounded-2xl cursor-pointer transition-all duration-200 bg-muted/20 hover:bg-muted/30",
        "border-0 group"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-6">
        <div className={cn("p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors")}>
          <Icon className={cn("w-6 h-6 text-primary")} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary">
              {action}
            </span>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function EnhancedPatientDashboard() {
  const { user: currentUser, loading: authLoading, user } = useAuth();
  const dataService = useAppStore((state) => state.dataService);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [showAIWidget, setShowAIWidget] = useState(false);

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

  const handleOnboardingComplete = async (personalizationData: Partial<User['personalization']>) => {
    setIsPersonalizing(true);
    
    try {
      const response = await fetch('/api/ai/generate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingData: personalizationData }),
      });
      
      if (!response.ok) throw new Error('Failed to generate profile');
      
      const { profile } = await response.json();
      
      const finalData = {
        ...personalizationData,
        aiProfile: profile
      };

      await updateUser({
        personalizationCompleted: true,
        personalization: finalData,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowOnboarding(false);
    } catch (error) {
      console.error('Personalization failed:', error);
      await updateUser({
        personalizationCompleted: true,
        personalization: personalizationData,
      });
      setShowOnboarding(false);
    } finally {
      setIsPersonalizing(false);
    }
  };

  const upcomingSessions = useMemo(
    () => sessions?.filter(s => new Date(s.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [],
    [sessions]
  );

  const quickActions = [
    {
      icon: Calendar,
      title: 'Book Session',
      description: 'Schedule your next therapy session',
      action: 'Book Now',
      color: 'blue' as const,
      onClick: () => window.location.href = '/sessions/booking'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Update your wellness goals',
      action: 'Update Goals',
      color: 'green' as const,
      onClick: () => window.location.href = '/progress'
    },
    {
      icon: Heart,
      title: 'Daily Check-in',
      description: 'Log your mood and feelings',
      action: 'Check In',
      color: 'purple' as const,
      onClick: () => window.location.href = '/journal'
    }
  ];

  if (authLoading || dataLoading) {
    return (
      <PageContainer>
        <SurfacePanel className="space-y-8">
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
        </SurfacePanel>
      </PageContainer>
    );
  }

  if (isPersonalizing) {
    return <PersonalizationLoader />;
  }

  if (showOnboarding) {
    return <ComprehensiveOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (!currentUser) {
    return (
      <PageContainer>
        <SurfacePanel className="flex items-center justify-center">
          <div className="text-center p-8 rounded-2xl max-w-md bg-muted/30">
            <UserIcon className="w-16 h-16 text-muted-foreground mb-6" />
            <h2 className="text-3xl font-semibold text-foreground mb-4">Welcome to Your Wellness Journey</h2>
            <p className="text-muted-foreground mb-8">
              It looks like your profile is not fully set up yet. Let's personalize your experience.
            </p>
            <Button 
              onClick={() => setShowOnboarding(true)} 
              variant="default"
              size="lg"
            >
              Personalize My Experience
            </Button>
          </div>
        </SurfacePanel>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SurfacePanel className="space-y-12">
        {/* Enhanced Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <WelcomeHeader />
        </motion.div>

        {/* Stats Grid with Enhanced Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatsGrid sessions={sessions} />
        </motion.div>

        {/* Quick Actions - Beautiful Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-3 lg:grid-cols-3"
        >
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </motion.div>

        {/* Main Dashboard Grid - Beautiful Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <NextSession sessions={upcomingSessions} isLoading={dataLoading} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <WellnessInsights userData={userData!} />
            </motion.div>

            {/* AI Behavioral Insights Widget */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <BehavioralInsightsWidget />
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <PersonalBlock />
            </motion.div>

            {userData?.goal && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <GoalProgress
                  sessionsCompleted={userData.goal.currentSessions || 0}
                  goal={userData.goal.description || ''}
                  targetSessions={userData.goal.targetSessions || 10}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* AI Help Widget - Floating */}
        <AIHelpWidget />
      </SurfacePanel>
    </PageContainer>
  );
}