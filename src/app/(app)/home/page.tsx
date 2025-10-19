'use client';
import { StatCard } from '@/components/eka/dashboard/stat-card';
import { QuickActions } from '@/components/eka/dashboard/quick-actions';
import { NextSession } from '@/components/eka/dashboard/next-session';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Award, CalendarDays, TrendingDown } from 'lucide-react';
import { DashboardHero } from '@/components/eka/dashboard/dashboard-hero';
import { GoalProgress } from '@/components/eka/dashboard/goal-progress';
import { useCollection, useUser, useFirestore, collection, doc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { useUserContext } from '@/context/user-context';
import type { Report, Session, User } from '@/lib/types';
import { useMemo, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { PersonalizationDialog } from '@/components/eka/personalization-dialog';
import { PersonalizationReminder } from '@/components/eka/personalization-reminder';

export default function HomePage() {
  const { user } = useUser();
  const { currentUser, isLoading: isUserContextLoading } = useUserContext();
  const firestore = useFirestore();
  const [showPersonalizationDialog, setShowPersonalizationDialog] = useState(false);

  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  
  const sessionsRef = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'sessions') : null, [user, firestore]);
  const { data: sessions, isLoading: isLoadingSessions } = useCollection<Session>(sessionsRef);

  const reportsRef = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'reports') : null, [user, firestore]);
  const { data: reports, isLoading: isLoadingReports } = useCollection<Report>(reportsRef);
  
  // Decides whether to show the dialog based on the user's status
  useEffect(() => {
    if (!isUserContextLoading && currentUser && !currentUser.personalizationCompleted) {
      setShowPersonalizationDialog(true);
    } else {
      setShowPersonalizationDialog(false);
    }
  }, [currentUser, isUserContextLoading]);

  const handleDialogClose = () => {
    setShowPersonalizationDialog(false);
  }

  const handleFormSubmit = (data: { goals: string; interests: string; squareCustomerId: string }) => {
    if (userRef) {
        updateDocumentNonBlocking(userRef, {
            personalizationCompleted: true,
            personalization: {
              goals: data.goals,
              interests: data.interests
            },
            squareCustomerId: data.squareCustomerId,
        });
    }
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

      <DashboardHero />
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
           {(isUserContextLoading || isLoadingSessions) && !dashboardWidgets.goalProgress ? null :
             (isUserContextLoading || isLoadingSessions) ? <Skeleton className="w-full h-[400px]" /> :
             dashboardWidgets.goalProgress && (
                <GoalProgress 
                    sessionsCompleted={completedSessions.length} 
                    goal={currentUser?.goal?.description}
                    targetSessions={targetSessions}
                />
            )}
           {dashboardWidgets.quickActions && <QuickActions />}
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8">
          {dashboardWidgets.nextSession && <NextSession sessions={upcomingSessions} isLoading={isLoadingSessions} />}
          {dashboardWidgets.recentActivity && (
             <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                </CardTitle>
                </CardHeader>
                <CardContent>
                {isLoadingReports ? (
                    <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    </div>
                ) : reports && reports.length > 0 ? (
                    <ul className="space-y-4">
                    {reports.slice(0, 3).map((report) => (
                        <li key={report.id} className="text-sm">
                        <p className="font-medium">{report.title}</p>
                        <p className="text-muted-foreground">
                            {report.author} - {report.date ? format(new Date(report.date), 'MMMM d, yyyy') : 'No date'}
                        </p>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                    No recent activity.
                    </div>
                )}
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

    