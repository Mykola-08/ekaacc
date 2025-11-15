'use client';

import { useMemo } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { StatCard } from './stat-card';
import { Activity, HeartPulse, Smile, Zap } from 'lucide-react';
import type { Session } from '@/lib/types';

interface StatsGridProps {
  sessions: Session[];
}

export function StatsGrid({ sessions }: StatsGridProps) {
  const { user: appUser } = useAuth();
  const personalization = (appUser as any)?.personalization;

  const completedSessions = useMemo(
    () => sessions?.filter(s => new Date(s.date) < new Date()) || [],
    [sessions]
  );

  const personalizedStats = useMemo(() => [
    {
      title: 'Wellness Score',
      value: personalization?.aiPersonalizationScore ? `${personalization.aiPersonalizationScore}%` : 'N/A',
      icon: HeartPulse,
      trend: '+5%',
    },
    {
      title: 'Sessions Done',
      value: completedSessions.length,
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {personalizedStats.map((stat, index) => (
        <div key={stat.title} className="hover-lift">
          <StatCard {...stat} index={index} />
        </div>
      ))}
    </div>
  );
}
