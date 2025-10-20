'use client';
import { StatCard } from '@/components/eka/dashboard/stat-card';
import { QuickActions } from '@/components/eka/dashboard/quick-actions';
import { NextSession } from '@/components/eka/dashboard/next-session';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Award, CalendarDays, TrendingDown, Sparkles } from 'lucide-react';
import { DashboardHero } from '@/components/eka/dashboard/dashboard-hero';
import { GoalProgress } from '@/components/eka/dashboard/goal-progress';
import { useData } from '@/context/unified-data-context';
import type { Report, Session, User } from '@/lib/types';
import { useMemo, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { PersonalizationDialog } from '@/components/eka/personalization-dialog';
import { PersonalizationReminder } from '@/components/eka/personalization-reminder';
import { AnimatedCard, GlowCard } from '@/components/eka/animated-card';
import { VipBenefitsCard } from '@/components/eka/vip-benefits-card';
import { UserStatusBadges } from '@/components/eka/user-status-badges';

export default function HomePage() {
  const { currentUser, isLoading, sessions, reports, updateUser } = useData();
  const [showPersonalizationDialog, setShowPersonalizationDialog] = useState(false);

  // Decides whether to show the dialog based on the user's status
  useEffect(() => {
    if (!isLoading && currentUser && !currentUser.personalizationCompleted) {
      setShowPersonalizationDialog(true);
    } else {
      setShowPersonalizationDialog(false);
    }
  }, [currentUser, isLoading]);

  const handleDialogClose = () => {
    setShowPersonalizationDialog(false);
  }

  const handleFormSubmit = (data: { goals: string; interests: string; squareCustomerId: string }) => {
    updateUser({
      personalizationCompleted: true,
      personalization: {
        goals: data.goals,
        interests: data.interests,
        values: '',
        preferences: ''
      },
    });
    // Note: squareCustomerId would be handled separately in a real app
    console.log('Square Customer ID:', data.squareCustomerId);
    setShowPersonalizationDialog(false);
  };

  const upcomingSessions = useMemo(() => sessions?.filter(s => new Date(s.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [], [sessions]);
  const completedSessions = useMemo(() => sessions?.filter(s => new Date(s.date) < new Date()) || [], [sessions]);

  const targetSessions = currentUser?.goal?.targetSessions ?? 10;
  
  const dashboardWidgets = useMemo(() => {
    return currentUser?.dashboardWidgets || {
        goalProgress: true,
        quickActions: true,
        nextSession: true,
        recentActivity: true,
    }
  }, [currentUser]);

  const userStats = [
      {
        title: 'Pain Reduction',
        value: '20%',
        change: '5%',
        changeType: 'increase' as const,
        icon: TrendingDown,
      },
      {
        title: 'Mobility',
        value: '15%',
        change: '3%',
        changeType: 'increase' as const,
        icon: Activity,
      },
      {
        title: 'Sessions',
        value: `${completedSessions.length}/${targetSessions}`,
        change: `+${completedSessions.length}`,
        changeType: 'increase' as const,
        icon: CalendarDays,
      },
      {
        title: 'Milestones',
        value: '3/5',
        change: '+1',
        changeType: 'increase' as const,
        icon: Award,
      },
    ];

  return (
    <div className="flex flex-col gap-8 md:gap-12">
        {showPersonalizationDialog && <PersonalizationDialog onClose={handleDialogClose} onSubmit={handleFormSubmit} />}
        
        {currentUser && !currentUser.personalizationCompleted && !showPersonalizationDialog && (
            <PersonalizationReminder onOpen={() => setShowPersonalizationDialog(true)} />
        )}

      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <DashboardHero />
      </div>

      {/* VIP Benefits Card - Only show for VIP users */}
      {currentUser?.isVip && currentUser.vipTier && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <VipBenefitsCard user={currentUser} />
        </div>
      )}
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat, index) => (
          <div 
            key={stat.title}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
           {isLoading && !dashboardWidgets.goalProgress ? null :
             isLoading ? <Skeleton className="w-full h-[400px]" /> :
             dashboardWidgets.goalProgress && (
                <AnimatedCard delay={400}>
                  <GoalProgress 
                      sessionsCompleted={completedSessions.length} 
                      goal={currentUser?.goal?.description}
                      targetSessions={targetSessions}
                  />
                </AnimatedCard>
            )}
           {dashboardWidgets.quickActions && (
             <AnimatedCard delay={500}>
               <QuickActions />
             </AnimatedCard>
           )}
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8">
          {dashboardWidgets.nextSession && (
            <AnimatedCard delay={600}>
              <NextSession sessions={upcomingSessions} isLoading={isLoading} />
            </AnimatedCard>
          )}
          {dashboardWidgets.recentActivity && (
             <AnimatedCard delay={700}>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                </CardTitle>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    </div>
                ) : reports && reports.length > 0 ? (
                    <ul className="space-y-4">
                    {reports.slice(0, 3).map((report) => (
                        <li key={report.id} className="text-sm p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <p className="font-medium">{report.title}</p>
                        <p className="text-muted-foreground">
                            {report.author} - {report.date ? format(new Date(report.date), 'yyyy-MM-dd') : 'No date'}
                        </p>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                    <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No recent activity.</p>
                    </div>
                )}
                </CardContent>
            </AnimatedCard>
          )}
        </div>
      </div>
    </div>
  );
}

    