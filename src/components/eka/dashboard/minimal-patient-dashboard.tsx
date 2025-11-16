'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { MinimalCard } from '@/components/ui/minimal-card';
import { MinimalButton } from '@/components/ui/minimal-button';
import { User, Calendar, TrendingUp, Heart, Clock, Target } from 'lucide-react';
import type { Session, Report, User as UserType } from '@/lib/types';
import { MinimalLayout } from '@/components/layout/minimal-layout';

function MinimalStatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle,
  onClick 
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  onClick?: () => void;
}) {
  return (
    <MinimalCard 
      variant="default" 
      interactive={!!onClick}
      onClick={onClick}
      className="p-6"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </MinimalCard>
  );
}

function MinimalNextSession({ sessions }: { sessions: Session[] }) {
  const nextSession = sessions[0];
  
  if (!nextSession) {
    return (
      <MinimalCard variant="default" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Session</h3>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No upcoming sessions scheduled</p>
          <MinimalButton 
            variant="primary" 
            size="sm"
            className="mt-4"
            onClick={() => window.location.href = '/sessions/booking'}
          >
            Book Session
          </MinimalButton>
        </div>
      </MinimalCard>
    );
  }

  const sessionDate = new Date(nextSession.date);
  const formattedDate = sessionDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  const formattedTime = sessionDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <MinimalCard variant="default" className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Session</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">{formattedDate} at {formattedTime}</p>
            <p className="text-sm text-gray-600">{nextSession.duration} minutes</p>
          </div>
        </div>
        {nextSession.therapist && (
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900">{nextSession.therapist}</p>
          </div>
        )}
        {nextSession.type && (
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900">{nextSession.type}</p>
          </div>
        )}
      </div>
      <MinimalButton 
        variant="outline" 
        size="sm"
        className="mt-4 w-full"
        onClick={() => window.location.href = '/sessions'}
      >
        View All Sessions
      </MinimalButton>
    </MinimalCard>
  );
}

function MinimalGoalProgress({ 
  sessionsCompleted, 
  goal, 
  targetSessions 
}: { 
  sessionsCompleted: number;
  goal: string;
  targetSessions: number;
}) {
  const progress = Math.min((sessionsCompleted / targetSessions) * 100, 100);
  
  return (
    <MinimalCard variant="default" className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">{goal}</p>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {sessionsCompleted} / {targetSessions} sessions
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          {progress >= 100 ? 'Goal completed!' : `${Math.round(progress)}% complete`}
        </p>
      </div>
      <MinimalButton 
        variant="outline" 
        size="sm"
        className="mt-4 w-full"
        onClick={() => window.location.href = '/progress'}
      >
        Update Goals
      </MinimalButton>
    </MinimalCard>
  );
}

function MinimalQuickActions() {
  const actions = [
    {
      icon: Calendar,
      title: 'Book Session',
      description: 'Schedule your next therapy session',
      href: '/sessions/booking'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Update your wellness goals',
      href: '/progress'
    },
    {
      icon: Heart,
      title: 'Daily Check-in',
      description: 'Log your mood and feelings',
      href: '/journal'
    }
  ];

  return (
    <MinimalCard variant="default" className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <MinimalButton
            key={index}
            variant="ghost"
            size="md"
            className="w-full justify-start text-left"
            onClick={() => window.location.href = action.href}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <action.icon className="w-4 h-4 text-gray-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          </MinimalButton>
        ))}
      </div>
    </MinimalCard>
  );
}

export default function MinimalPatientDashboard() {
  const { user, loading: authLoading } = useAuth();
  const dataService = useAppStore((state) => state.dataService);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [userData, setUserData] = useState<UserType | null>(null);

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

  const upcomingSessions = useMemo(
    () => sessions?.filter(s => new Date(s.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [],
    [sessions]
  );

  const completedSessions = useMemo(
    () => sessions?.filter(s => new Date(s.date) < new Date()).length || 0,
    [sessions]
  );

  const totalReports = reports?.length || 0;

  if (authLoading || dataLoading) {
    return (
      <MinimalLayout centered>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </MinimalLayout>
    );
  }

  if (!user) {
    return (
      <MinimalLayout centered>
        <MinimalCard variant="default" className="p-8 max-w-md">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome</h2>
            <p className="text-gray-600 mb-6">
              Your profile is not fully set up yet. Let's personalize your experience.
            </p>
            <MinimalButton 
              variant="primary" 
              size="md"
              onClick={() => window.location.href = '/onboarding'}
            >
              Get Started
            </MinimalButton>
          </div>
        </MinimalCard>
      </MinimalLayout>
    );
  }

  return (
    <MinimalLayout centered={false}>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || user.email}
          </h1>
          <p className="text-gray-600">
            Here's your wellness journey overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MinimalStatCard
            icon={Calendar}
            title="Upcoming Sessions"
            value={upcomingSessions.length}
            subtitle="Scheduled"
            onClick={() => window.location.href = '/sessions'}
          />
          <MinimalStatCard
            icon={TrendingUp}
            title="Completed Sessions"
            value={completedSessions}
            subtitle="Total"
            onClick={() => window.location.href = '/progress'}
          />
          <MinimalStatCard
            icon={Heart}
            title="Reports"
            value={totalReports}
            subtitle="Available"
            onClick={() => window.location.href = '/progress-reports'}
          />
          <MinimalStatCard
            icon={User}
            title="Therapist"
            value={userData?.therapist || 'Not assigned'}
            subtitle="Current"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <MinimalNextSession sessions={upcomingSessions} />
            <MinimalQuickActions />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {userData?.goal && (
              <MinimalGoalProgress
                sessionsCompleted={userData.goal.currentSessions || 0}
                goal={userData.goal.description || ''}
                targetSessions={userData.goal.targetSessions || 10}
              />
            )}
            
            <MinimalCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you have questions or need support, our team is here to help.
              </p>
              <MinimalButton 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={() => window.location.href = '/messages'}
              >
                Contact Support
              </MinimalButton>
            </MinimalCard>
          </div>
        </div>
      </div>
    </MinimalLayout>
  );
}