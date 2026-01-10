'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { useAppStore } from '@/store/platform/app-store';
import { Card } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Progress } from '@/components/platform/ui/progress';
import { User, Calendar, TrendingUp, Heart, Clock, Target } from 'lucide-react';
import type { Session, Report, User as UserType } from '@/lib/platform/types';
import { MinimalLayout } from '@/components/platform/layout/minimal-layout';
import { FloatingAIAssistant } from '@/components/platform/ai/enhanced-ai-chat';
import { AIDashboard } from '@/components/platform/ai/ai-dashboard';

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
    <Card 
      onClick={onClick}
      className={`p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h4 className="text-xl font-semibold">{value}</h4>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
}

function MinimalNextSession({ sessions }: { sessions: Session[] }) {
  const nextSession = sessions[0];
  
  if (!nextSession) {
    return (
      <Card className="p-6">
        <h4 className="text-xl font-semibold mb-4">Next Session</h4>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
          <p className="text-base text-gray-600 mb-4">No upcoming sessions scheduled</p>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => window.location.href = '/sessions/booking'}
          >
            Book Session
          </Button>
        </div>
      </Card>
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
    <Card className="p-6">
      <h4 className="text-xl font-semibold mb-4">Next Session</h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-secondary-500" />
          <div>
            <p className="text-base font-medium">{formattedDate} at {formattedTime}</p>
            <p className="text-sm text-gray-600">{nextSession.duration} minutes</p>
          </div>
        </div>
        {nextSession.therapist && (
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-secondary-500" />
            <p className="text-base">{nextSession.therapist}</p>
          </div>
        )}
        {nextSession.type && (
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-secondary-500" />
            <p className="text-base">{nextSession.type}</p>
          </div>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm"
        className="mt-4 w-full"
        onClick={() => window.location.href = '/sessions'}
      >
        View All Sessions
      </Button>
    </Card>
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
    <Card className="p-6">
      <h4 className="text-xl font-semibold mb-4">Goal Progress</h4>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">{goal}</p>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-secondary-500" />
            <p className="text-sm font-medium">
              {sessionsCompleted} / {targetSessions} sessions
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-600">
          {progress >= 100 ? 'Goal completed!' : `${Math.round(progress)}% complete`}
        </p>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        className="mt-4 w-full"
        onClick={() => window.location.href = '/progress'}
      >
        Update Goals
      </Button>
    </Card>
  );
}

function MinimalQuickActions({ onToggleAI }: { onToggleAI: () => void }) {
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
    },
    {
      icon: User,
      title: 'AI Assistant',
      description: 'Get personalized wellness insights',
      onClick: onToggleAI
    }
  ];

  return (
    <Card className="p-6">
      <h4 className="text-xl font-semibold mb-4">Quick Actions</h4>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="default"
            className="w-full justify-start text-left"
            onClick={() => action.onClick ? action.onClick() : window.location.href = action.href}
          >
            <div className="p-2 bg-primary-100 rounded-lg mr-3">
              <action.icon className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium block">{action.title}</p>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}

export default function MinimalPatientDashboard() {
  const { user, loading: authLoading } = useAuth();
  const dataService = useAppStore((state) => state.dataService);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [showAIDashboard, setShowAIDashboard] = useState(false);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading your dashboard...</p>
        </div>
      </MinimalLayout>
    );
  }

  if (!user) {
    return (
      <MinimalLayout centered>
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome</h2>
            <p className="text-gray-600 mb-6">
              Your profile is not fully set up yet. Let's personalize your experience.
            </p>
            <Button 
              variant="default" 
              size="default"
              onClick={() => window.location.href = '/onboarding'}
            >
              Get Started
            </Button>
          </div>
        </Card>
      </MinimalLayout>
    );
  }

  return (
    <MinimalLayout centered={false}>
      {showAIDashboard ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Analytics Dashboard</h1>
              <p className="text-base text-gray-600">
                Monitor your AI usage and insights
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIDashboard(false)}
            >
              Back to Dashboard
            </Button>
          </div>
          <AIDashboard userId={user.id} subscriptionTier="premium" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.name || user.email}
            </h1>
            <p className="text-base text-gray-600">
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
              value={userData?.linkedTherapist ? 'Assigned' : 'Not assigned'}
              subtitle="Current"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <MinimalNextSession sessions={upcomingSessions} />
              <MinimalQuickActions onToggleAI={() => setShowAIDashboard(true)} />
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
              
              <Card className="p-6">
                <h4 className="text-xl font-semibold mb-4">Need Help?</h4>
                <p className="text-base text-gray-600 mb-4">
                  If you have questions or need support, our team is here to help.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => window.location.href = '/messages'}
                >
                  Contact Support
                </Button>
              </Card>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating AI Assistant */}
      <FloatingAIAssistant userId={user.id} subscriptionTier="premium" />
    </MinimalLayout>
  );
}