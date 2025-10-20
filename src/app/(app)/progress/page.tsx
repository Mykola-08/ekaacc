'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Activity, Target, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ProgressPage() {
  // Mock data - replace with real data from Firebase
  const progressData = {
    painReduction: {
      current: 3,
      baseline: 8,
      target: 2,
      history: [
        { date: '2025-09-20', level: 8 },
        { date: '2025-09-27', level: 7 },
        { date: '2025-10-04', level: 6 },
        { date: '2025-10-11', level: 4 },
        { date: '2025-10-18', level: 3 },
      ],
    },
    mobility: {
      current: 75,
      baseline: 50,
      target: 90,
      history: [
        { date: '2025-09-20', score: 50 },
        { date: '2025-09-27', score: 55 },
        { date: '2025-10-04', score: 62 },
        { date: '2025-10-11', score: 70 },
        { date: '2025-10-18', score: 75 },
      ],
    },
    sessionsCompleted: 8,
    sessionGoal: 12,
    streakDays: 14,
    achievements: [
      { id: '1', name: 'First Session', description: 'Completed your first therapy session', earned: true, date: '2025-09-20' },
      { id: '2', name: 'Consistent Week', description: 'Completed exercises 7 days in a row', earned: true, date: '2025-10-01' },
      { id: '3', name: 'Pain Progress', description: 'Reduced pain by 50%', earned: true, date: '2025-10-15' },
      { id: '4', name: 'Halfway There', description: 'Completed 50% of your session goal', earned: true, date: '2025-10-18' },
      { id: '5', name: 'Goal Achieved', description: 'Reached your wellness goal', earned: false, date: null },
    ],
  };

  const painReduction =
    ((progressData.painReduction.baseline - progressData.painReduction.current) /
      progressData.painReduction.baseline) *
    100;

  const mobilityImprovement =
    ((progressData.mobility.current - progressData.mobility.baseline) /
      (progressData.mobility.target - progressData.mobility.baseline)) *
    100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Progress Tracker</h1>
        <p className="text-muted-foreground">
          Track your wellness journey and celebrate your achievements
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pain Reduction</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{painReduction.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              From level {progressData.painReduction.baseline} to{' '}
              {progressData.painReduction.current}
            </p>
            <Progress value={painReduction} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobility Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.mobility.current}%</div>
            <p className="text-xs text-muted-foreground">
              Target: {progressData.mobility.target}%
            </p>
            <Progress value={mobilityImprovement} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressData.sessionsCompleted}/{progressData.sessionGoal}
            </div>
            <p className="text-xs text-muted-foreground">
              {((progressData.sessionsCompleted / progressData.sessionGoal) * 100).toFixed(0)}% Complete
            </p>
            <Progress
              value={(progressData.sessionsCompleted / progressData.sessionGoal) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.streakDays} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pain" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pain">Pain Levels</TabsTrigger>
          <TabsTrigger value="mobility">Mobility</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="pain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pain Level Tracker</CardTitle>
              <CardDescription>Monitor your pain levels over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.painReduction.history.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex-1">
                      <Progress value={(10 - entry.level) * 10} className="h-8" />
                    </div>
                    <div className="w-16 text-right font-medium">
                      Level {entry.level}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mobility Score</CardTitle>
              <CardDescription>Track your mobility improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.mobility.history.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex-1">
                      <Progress value={entry.score} className="h-8" />
                    </div>
                    <div className="w-16 text-right font-medium">{entry.score}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Milestones you've reached on your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${
                      achievement.earned
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-muted/50 border-muted opacity-60'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        achievement.earned ? 'bg-primary/10' : 'bg-muted'
                      }`}
                    >
                      <Award
                        className={`h-6 w-6 ${
                          achievement.earned ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Earned on{' '}
                          {new Date(achievement.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
