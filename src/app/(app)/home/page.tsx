'use client';
import { StatCard } from '@/components/eka/dashboard/stat-card';
// QuickActions removed from Home; replaced by Goal Roadmap + Journal placeholders
import { NextSession } from '@/components/eka/dashboard/next-session';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Award, CalendarDays, TrendingDown, Sparkles, Target, MapPin, BookOpen, Brain, Lightbulb, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { DashboardHero } from '@/components/eka/dashboard/dashboard-hero';
import { GoalProgress } from '@/components/eka/dashboard/goal-progress';
import { useData } from '@/context/unified-data-context';
import type { Report, Session, User } from '@/lib/types';
import { useMemo, useState, useEffect, memo, useCallback } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGoalMilestones } from '@/hooks/use-goal-milestones';
import { useJournalStats } from '@/hooks/use-journal-stats';
import { useProgress } from '@/context/progress-context';

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
  const { updateProgress } = useProgress();

  const generateRoadmap = async () => {
    setLoadingRoadmap(true);
    updateProgress(10, 'Analyzing your goals...');
    try {
      updateProgress(40, 'Generating personalized roadmap...');
      const res = await fxService.generateAIReport(userId || 'user-unknown', 'Summarize goals and propose roadmap');
      updateProgress(80, 'Finalizing recommendations...');
      const ai = Array.isArray(res) ? (res[1]?.content || res[1]) : (res as any)?.content || res;
      setRoadmapText(typeof ai === 'string' ? ai : JSON.stringify(ai));
      updateProgress(100, 'Roadmap ready!');
      toast?.({ title: 'Roadmap generated' });
    } catch (e) {
      toast?.({ variant: 'destructive', title: 'AI unavailable' });
    } finally { setLoadingRoadmap(false); }
  };

  const generateJournal = async () => {
    setLoadingJournal(true);
    updateProgress(10, 'Reading your journal entries...');
    try {
      updateProgress(40, 'Analyzing patterns and themes...');
      const res = await fxService.generateAIReport(userId || 'user-unknown', 'Summarize recent journal entries');
      updateProgress(80, 'Generating insights...');
      const ai = Array.isArray(res) ? (res[1]?.content || res[1]) : (res as any)?.content || res;
      setJournalText(typeof ai === 'string' ? ai : JSON.stringify(ai));
      updateProgress(100, 'Insights ready!');
      toast?.({ title: 'Journal summary generated' });
    } catch (e) {
      toast?.({ variant: 'destructive', title: 'AI unavailable' });
    } finally { setLoadingJournal(false); }
  };

  // Use real data hooks
  const { milestones, completedCount, totalCount, progressPercentage, isLoading: loadingMilestones } = useGoalMilestones();
  const { stats: journalStats, loading: loadingJournalStats } = useJournalStats();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Goal Roadmap Card */}
      <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Goal Roadmap</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Your personalized journey to wellness
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Overview */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Overall Progress</span>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {loadingMilestones ? '...' : `${Math.round(progressPercentage)}% Complete`}
            </Badge>
          </div>
          
          {/* Milestones */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Milestones
              <Badge variant="outline" className="text-xs">
                {loadingMilestones ? '...' : `${completedCount}/${totalCount}`}
              </Badge>
            </h4>
            {loadingMilestones ? (
              // Loading state
              Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-16 w-full" />
              ))
            ) : (
              milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="mt-0.5">
                    {milestone.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {milestone.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {format(new Date(milestone.dueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* AI Generated Roadmap */}
          {roadmapText && (
            <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">AI Insights</span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{roadmapText}</p>
            </div>
          )}

          {/* Generate Button */}
          <Button 
            onClick={generateRoadmap} 
            disabled={loadingRoadmap}
            className="w-full"
            variant={roadmapText ? "outline" : "default"}
          >
            {loadingRoadmap ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {roadmapText ? 'Regenerate Roadmap' : 'Generate AI Roadmap'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Journal Insights Card */}
      <Card className="relative overflow-hidden border-2 hover:border-purple-500/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <BookOpen className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-xl">Journal Insights</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Discover patterns in your wellness journey
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingJournalStats ? (
            // Loading state
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : journalStats ? (
            <>
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Entries</span>
                  </div>
                  <p className="text-2xl font-bold">{journalStats.totalEntries}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Avg. Mood</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{journalStats.avgMood}</p>
                    <span className={`text-xs ${journalStats.moodTrend === 'up' ? 'text-green-500' : journalStats.moodTrend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {journalStats.moodTrend === 'up' ? '↑' : journalStats.moodTrend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mood Trend */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mood Trend</span>
                  <Badge 
                    variant="secondary" 
                    className={
                      journalStats.moodTrend === 'up' 
                        ? 'bg-green-500/10 text-green-500' 
                        : journalStats.moodTrend === 'down'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-muted-foreground/10 text-muted-foreground'
                    }
                  >
                    {journalStats.moodTrend === 'up' ? '↗ Improving' : journalStats.moodTrend === 'down' ? '↘ Declining' : '→ Stable'}
                  </Badge>
                </div>
                <Progress value={journalStats.avgMood * 20} className="h-2" />
              </div>

              {/* Top Themes */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Top Themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {journalStats.topThemes.map((theme, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="bg-purple-500/5 border-purple-500/20 text-purple-700 dark:text-purple-300"
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Weekly Streak */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Writing Streak</span>
                  </div>
                  <span className="text-xl font-bold text-orange-500">{journalStats.weeklyStreak} days 🔥</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No journal data available yet</p>
            </div>
          )}

          {/* AI Generated Summary */}
          {journalText && (
            <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-semibold">AI Summary</span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{journalText}</p>
            </div>
          )}

          {/* Generate Button */}
          <Button 
            onClick={generateJournal} 
            disabled={loadingJournal}
            className="w-full bg-purple-500 hover:bg-purple-600"
            variant={journalText ? "outline" : "default"}
          >
            {loadingJournal ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                {journalText ? 'Refresh Insights' : 'Generate AI Insights'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    