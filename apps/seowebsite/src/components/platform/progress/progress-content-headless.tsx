'use client';

import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, HeartPulse, Award, Activity, Target, Brain, Calendar, ChevronRight } from 'lucide-react';
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
    return reports.map(report => ({
      date: report.createdAt || new Date(),
      mood: report.mood || 8,
      score: report.overallScore || 0,
      notes: report.notes || '',
      trend: report.trend || 'stable'
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest first
  }, [reports]);

  const stats = useMemo(() => {
    const totalSessions = reports.length;
    const avgMood = totalSessions > 0 
      ? reports.reduce((sum, report) => sum + (report.mood || 8), 0) / totalSessions 
      : 8.5; // Default mock for empty
    const completedGoals = reports.filter(report => report.goalProgress === 100).length;
    
    return { totalSessions, avgMood, completedGoals };
  }, [reports]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold mb-3">
              <Brain className="w-3 h-3" />
              <span>Wellness Journey</span>
           </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
            My Progress
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            Track your well-being, mood, and achievements over time.
          </p>
        </div>
      </div>

       <div className="grid gap-6 md:grid-cols-3 animate-slide-up">
            {/* Stat: Sessions */}
            <div className="group relative overflow-hidden bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                 <div className="flex items-start justify-between">
                    <div>
                         <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Total Sessions</p>
                         <h3 className="text-4xl font-bold text-gray-900 mt-2">{stats.totalSessions}</h3>
                         <p className="text-sm text-gray-500 mt-2">Completed sessions</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-blue-50 text-blue-600">
                        <Activity className="h-6 w-6" />
                    </div>
                 </div>
            </div>

             {/* Stat: Avg Mood */}
            <div className="group relative overflow-hidden bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                 <div className="flex items-start justify-between">
                    <div>
                         <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Average Mood</p>
                         <h3 className="text-4xl font-bold text-gray-900 mt-2">{stats.avgMood.toFixed(1)}</h3>
                         <p className="text-sm text-gray-500 mt-2">On a 1-10 scale</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-pink-50 text-pink-600">
                         <HeartPulse className="h-6 w-6" />
                    </div>
                 </div>
            </div>

             {/* Stat: Goals */}
            <div className="group relative overflow-hidden bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                 <div className="flex items-start justify-between">
                    <div>
                         <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Goals Met</p>
                         <h3 className="text-4xl font-bold text-gray-900 mt-2">{stats.completedGoals}</h3>
                         <p className="text-sm text-gray-500 mt-2">Milestones achieved</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-amber-50 text-amber-600">
                        <Award className="h-6 w-6" />
                    </div>
                 </div>
            </div>
       </div>

       <TabGroup as="div" className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
         <TabList className="flex space-x-2 rounded-2xl bg-gray-100/80 p-1.5 w-fit">
            <Tab className={({ selected }) =>
                cn(
                'px-6 py-2.5 rounded-xl text-sm font-semibold leading-5 transition-all outline-none',
                'focus:ring-2 focus:ring-black/5',
                selected
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                )
            }>
                Timeline
            </Tab>
            <Tab className={({ selected }) =>
                cn(
                'px-6 py-2.5 rounded-xl text-sm font-semibold leading-5 transition-all outline-none',
                'focus:ring-2 focus:ring-black/5',
                selected
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                )
            }>
                Insights
            </Tab>
         </TabList>

         <TabPanels>
            <TabPanel className="focus:outline-none">
                 <div className="space-y-6">
                    {progressData.length === 0 ? (
                        <div className="p-12 text-center bg-white rounded-4xl border border-gray-100 shadow-sm">
                             <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Target className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start your journey</h3>
                            <p className="text-gray-500 mb-6">Complete your first session to see your progress here.</p>
                        </div>
                    ) : (
                        progressData.map((report, idx) => (
                             <div key={idx} className="group bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 hover:shadow-lg transition-all duration-300">
                                <div className="flex flex-col md:flex-row gap-6">
                                     {/* Date Column */}
                                    <div className="md:w-32 shrink-0 flex md:flex-col items-center md:items-start gap-2">
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{format(new Date(report.date), 'MMM yyyy')}</span>
                                        <span className="text-3xl font-bold text-gray-900">{format(new Date(report.date), 'dd')}</span>
                                    </div>

                                    {/* Content Column */}
                                    <div className="grow space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-gray-900">Session Report</h3>
                                            <div className="flex items-center gap-2">
                                                 <span className={cn(
                                                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold",
                                                    report.score >= 8 ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                                                 )}>
                                                    Score: {report.score}/10
                                                 </span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-600 leading-relaxed">
                                            {report.notes || "Comprehensive session focusing on core strength and mindfulness techniques."}
                                        </p>

                                        {/* Metrics Bars */}
                                        <div className="grid gap-4 md:grid-cols-2 mt-4 pt-4 border-t border-gray-100">
                                             <div>
                                                 <div className="flex justify-between mb-1">
                                                     <span className="text-xs font-semibold text-gray-500 uppercase">Mood</span>
                                                     <span className="text-xs font-bold text-gray-900">{report.mood}/10</span>
                                                 </div>
                                                 <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                     <div 
                                                        className="h-full bg-violet-500 rounded-full transition-all duration-1000" 
                                                        style={{ width: `${report.mood * 10}%` }} 
                                                     />
                                                 </div>
                                             </div>
                                              <div>
                                                 <div className="flex justify-between mb-1">
                                                     <span className="text-xs font-semibold text-gray-500 uppercase">Focus</span>
                                                     <span className="text-xs font-bold text-gray-900">High</span>
                                                 </div>
                                                 <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                     <div className="h-full bg-blue-500 rounded-full w-[85%]" />
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
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                         <h3 className="font-bold text-xl text-gray-900 mb-6">Mood Analysis</h3>
                         <div className="h-64 flex items-end justify-between px-2 gap-10"> {/* Mock Chart */}
                            {[60, 45, 75, 50, 80, 70, 90].map((h, i) => (
                                <div key={i} className="w-full bg-violet-100 rounded-t-xl relative group">
                                     <div 
                                        className="absolute bottom-0 w-full bg-violet-500 rounded-t-xl transition-all duration-500 group-hover:bg-violet-600"
                                        style={{ height: `${h}%` }}
                                     />
                                </div>
                            ))}
                         </div>
                         <div className="flex justify-between mt-4 text-xs font-medium text-gray-400">
                             <span>Mon</span>
                             <span>Tue</span>
                             <span>Wed</span>
                             <span>Thu</span>
                             <span>Fri</span>
                             <span>Sat</span>
                             <span>Sun</span>
                         </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                         <h3 className="font-bold text-xl text-gray-900 mb-6">Focus Areas</h3>
                         <div className="space-y-6">
                             {[
                                 { label: 'Mobility', val: 85, color: 'bg-emerald-500' },
                                 { label: 'Strength', val: 60, color: 'bg-blue-500' },
                                 { label: 'Mindfulness', val: 92, color: 'bg-purple-500' },
                                 { label: 'Consistency', val: 78, color: 'bg-orange-500' },
                             ].map((item, i) => (
                                 <div key={i}>
                                     <div className="flex justify-between mb-2">
                                         <span className="font-medium text-gray-700">{item.label}</span>
                                         <span className="font-bold text-gray-900">{item.val}%</span>
                                     </div>
                                     <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                         <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }} />
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
