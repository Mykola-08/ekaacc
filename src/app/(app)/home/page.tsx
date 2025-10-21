'use client';
import { StatCard } from '@/components/eka/dashboard/stat-card';
// QuickActions removed from Home; replaced by Goal Roadmap + Journal placeholders
import { NextSession } from '@/components/eka/dashboard/next-session';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';
// (react hooks already imported above)
import { VipBenefitsCard } from '@/components/eka/vip-benefits-card';
import { UserStatusBadges } from '@/components/eka/user-status-badges';

export default function HomePage() {
  const { currentUser, isLoading, sessions, reports, updateUser } = useData();
  const { toast } = useToast();
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
           {/* Goal Roadmap & Journal placeholders (replacing Quick Actions) */}
           <AnimatedCard delay={500}>
             <GoalJournalPanel userId={currentUser?.id} />
           </AnimatedCard>
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

function GoalJournalPanel({ userId }: { userId?: string | null }) {
  const [roadmapText, setRoadmapText] = useState<string | null>(null);
  const [journalText, setJournalText] = useState<string | null>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [loadingJournal, setLoadingJournal] = useState(false);
  const toast = useToast()?.toast;

  const generateRoadmap = async () => {
    setLoadingRoadmap(true);
    try {
      const res = await fxService.generateAIReport(userId || 'user-unknown', 'Summarize goals and propose roadmap');
      // fxService.generateAIReport may return [userMsg, aiMsg] or a string; normalize
      const ai = Array.isArray(res) ? (res[1]?.content || res[1]) : (res as any)?.content || res;
      setRoadmapText(typeof ai === 'string' ? ai : JSON.stringify(ai));
      toast?.({ title: 'Roadmap generated' });
    } catch (e) {
      toast?.({ variant: 'destructive', title: 'AI unavailable' });
    } finally { setLoadingRoadmap(false); }
  };

  const generateJournal = async () => {
    setLoadingJournal(true);
    try {
      const res = await fxService.generateAIReport(userId || 'user-unknown', 'Summarize recent journal entries');
      const ai = Array.isArray(res) ? (res[1]?.content || res[1]) : (res as any)?.content || res;
      setJournalText(typeof ai === 'string' ? ai : JSON.stringify(ai));
      toast?.({ title: 'Journal summary generated' });
    } catch (e) {
      toast?.({ variant: 'destructive', title: 'AI unavailable' });
    } finally { setLoadingJournal(false); }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Goal Roadmap</h3>
            <p className="text-sm text-muted-foreground">AI-driven goals and milestones based on your sessions.</p>
          </div>
          <div>
            <Button size="sm" onClick={generateRoadmap} disabled={loadingRoadmap}>{loadingRoadmap ? 'Generating…' : 'Generate'}</Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {roadmapText ? <pre className="whitespace-pre-wrap text-sm bg-muted/20 p-3 rounded">{roadmapText}</pre> : 'No roadmap yet. Click Generate to analyze your recent sessions and propose milestones.'}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Journal Insights</h3>
            <p className="text-sm text-muted-foreground">Summarize recent journal entries and surface trends.</p>
          </div>
          <div>
            <Button size="sm" onClick={generateJournal} disabled={loadingJournal}>{loadingJournal ? 'Summarizing…' : 'Summarize'}</Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {journalText ? <pre className="whitespace-pre-wrap text-sm bg-muted/20 p-3 rounded">{journalText}</pre> : 'No insights yet. Click Summarize to generate an AI summary of your journal activity.'}
        </div>
      </div>
    </div>
  );
}

    