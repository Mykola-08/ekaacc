'use client';
import { StatCard } from '@/components/eka/dashboard/stat-card';
import { userStats } from '@/lib/data';
import { QuickActions } from '@/components/eka/dashboard/quick-actions';
import { AiAssistant } from '@/components/eka/dashboard/ai-assistant';
import { NextSession } from '@/components/eka/dashboard/next-session';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { reports } from '@/lib/data';
import { Activity } from 'lucide-react';
import { DashboardHero } from '@/components/eka/dashboard/dashboard-hero';
import { GoalProgress } from '@/components/eka/dashboard/goal-progress';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <DashboardHero />
      
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
          <GoalProgress />
          <QuickActions />
        </div>
        
        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8">
          <NextSession />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length > 0 ? (
                <ul className="space-y-4">
                  {reports.slice(0, 3).map((report) => (
                    <li key={report.id} className="text-sm">
                      <p className="font-medium">{report.title}</p>
                      <p className="text-muted-foreground">
                        {report.author} - {report.date}
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
        </div>
      </div>
    </div>
  );
}
