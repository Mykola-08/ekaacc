'use client';

import React, { useMemo } from 'react';
import { format } from 'date-fns';
import {
  TrendingUp,
  TrendingDown,
  HeartPulse,
  Award,
  Activity,
  Target,
  Brain,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Report } from '@/lib/platform/types/types';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface ProgressContentProps {
  reports: Report[];
}

export function ProgressContentHeadless({ reports }: ProgressContentProps) {
  const progressData = useMemo(() => {
    return reports
      .map((report) => ({
        date: report.createdAt || new Date(),
        mood: report.mood || 8,
        score: report.overallScore || 0,
        notes: report.notes || '',
        trend: report.trend || 'stable',
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest first
  }, [reports]);

  const stats = useMemo(() => {
    const totalSessions = reports.length;
    const avgMood =
      totalSessions > 0
        ? reports.reduce((sum, report) => sum + (report.mood || 8), 0) / totalSessions
        : 8.5; // Default mock for empty
    const completedGoals = reports.filter((report) => report.goalProgress === 100).length;

    return { totalSessions, avgMood, completedGoals };
  }, [reports]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-12">
      {/* Header */}
      <div className="animate-fade-in flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            <Brain className="h-3 w-3" />
            <span>Wellness Journey</span>
          </div>
          <h1 className="text-foreground text-4xl leading-tight font-extrabold tracking-tight">
            My Progress
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Track your well-being, mood, and achievements over time.
          </p>
        </div>
      </div>

      <div className="animate-slide-up grid gap-6 md:grid-cols-3">
        {/* Stat: Sessions */}
        <div className="group bg-card relative overflow-hidden rounded-3xl border border-border p-8 shadow-sm transition-all duration-300 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground/80 text-sm font-semibold tracking-wide uppercase">
                Total Sessions
              </p>
              <h3 className="text-foreground mt-2 text-4xl font-semibold">{stats.totalSessions}</h3>
              <p className="text-muted-foreground mt-2 text-sm">Completed sessions</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 text-primary transition-transform group-hover:scale-110">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Stat: Avg Mood */}
        <div className="group bg-card relative overflow-hidden rounded-3xl border border-border p-8 shadow-sm transition-all duration-300 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground/80 text-sm font-semibold tracking-wide uppercase">
                Average Mood
              </p>
              <h3 className="text-foreground mt-2 text-4xl font-semibold">
                {stats.avgMood.toFixed(1)}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">On a 1-10 scale</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50 text-pink-600 transition-transform group-hover:scale-110">
              <HeartPulse className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Stat: Goals */}
        <div className="group bg-card relative overflow-hidden rounded-3xl border border-border p-8 shadow-sm transition-all duration-300 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground/80 text-sm font-semibold tracking-wide uppercase">
                Goals Met
              </p>
              <h3 className="text-foreground mt-2 text-4xl font-semibold">{stats.completedGoals}</h3>
              <p className="text-muted-foreground mt-2 text-sm">Milestones achieved</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition-transform group-hover:scale-110">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <TabGroup as="div" className="animate-slide-up space-y-8" style={{ animationDelay: '100ms' }}>
        <TabList className="bg-muted/80 flex w-fit space-x-2 rounded-lg p-1.5">
          <Tab
            className={({ selected }) =>
              cn(
                'rounded-xl px-6 py-2.5 text-sm leading-5 font-semibold transition-all outline-none',
                'focus:ring-2 focus:ring-black/5',
                selected
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground/90 hover:bg-card/50'
              )
            }
          >
            Timeline
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                'rounded-xl px-6 py-2.5 text-sm leading-5 font-semibold transition-all outline-none',
                'focus:ring-2 focus:ring-black/5',
                selected
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground/90 hover:bg-card/50'
              )
            }
          >
            Insights
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel className="focus:outline-none">
            <div className="space-y-6">
              {progressData.length === 0 ? (
                <div className="bg-card rounded-3xl border border-border p-12 text-center shadow-sm">
                  <div className="bg-muted/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
                    <Target className="text-muted-foreground/80 h-8 w-8" />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">Start your journey</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete your first session to see your progress here.
                  </p>
                </div>
              ) : (
                progressData.map((report, idx) => (
                  <div
                    key={idx}
                    className="group bg-card rounded-lg border border-border p-8 shadow-sm transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-6 md:flex-row">
                      {/* Date Column */}
                      <div className="flex shrink-0 items-center gap-2 md:w-32 md:flex-col md:items-start">
                        <span className="text-muted-foreground/80 text-sm font-semibold tracking-wider uppercase">
                          {format(new Date(report.date), 'MMM yyyy')}
                        </span>
                        <span className="text-foreground text-3xl font-semibold">
                          {format(new Date(report.date), 'dd')}
                        </span>
                      </div>

                      {/* Content Column */}
                      <div className="grow space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-foreground text-xl font-semibold">Session Report</h3>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                                report.score >= 8
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-primary/5 text-primary'
                              )}
                            >
                              Score: {report.score}/10
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                          {report.notes ||
                            'Comprehensive session focusing on core strength and mindfulness techniques.'}
                        </p>

                        {/* Metrics Bars */}
                        <div className="mt-4 grid gap-4 border-t border-border pt-4 md:grid-cols-2">
                          <div>
                            <div className="mb-1 flex justify-between">
                              <span className="text-muted-foreground text-xs font-semibold uppercase">
                                Mood
                              </span>
                              <span className="text-foreground text-xs font-semibold">
                                {report.mood}/10
                              </span>
                            </div>
                            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                              <div
                                className="h-full rounded-full bg-violet-500 transition-all duration-1000"
                                style={{ width: `${report.mood * 10}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mb-1 flex justify-between">
                              <span className="text-muted-foreground text-xs font-semibold uppercase">
                                Focus
                              </span>
                              <span className="text-foreground text-xs font-semibold">High</span>
                            </div>
                            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                              <div className="h-full w-[85%] rounded-full bg-primary" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabPanel>

          <TabPanel className="focus:outline-none">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
                <h3 className="text-foreground mb-6 text-xl font-semibold">Mood Analysis</h3>
                <div className="flex h-64 items-end justify-between gap-10 px-2">
                  {' '}
                  {/* Mock Chart */}
                  {[60, 45, 75, 50, 80, 70, 90].map((h, i) => (
                    <div key={i} className="group relative w-full rounded-t-xl bg-violet-100">
                      <div
                        className="absolute bottom-0 w-full rounded-t-xl bg-violet-500 transition-all duration-500 group-hover:bg-violet-600"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="text-muted-foreground/80 mt-4 flex justify-between text-xs font-medium">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
                <h3 className="text-foreground mb-6 text-xl font-semibold">Focus Areas</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Mobility', val: 85, color: 'bg-emerald-500' },
                    { label: 'Strength', val: 60, color: 'bg-primary' },
                    { label: 'Mindfulness', val: 92, color: 'bg-purple-500' },
                    { label: 'Consistency', val: 78, color: 'bg-orange-500' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="mb-2 flex justify-between">
                        <span className="text-foreground/90 font-medium">{item.label}</span>
                        <span className="text-foreground font-semibold">{item.val}%</span>
                      </div>
                      <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
