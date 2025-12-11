'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Heart, 
  BookOpen,
  Clock,
  Activity,
  Users,
  Award,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAsyncOperation } from '@/hooks/use-async-operation';
import { LoadingContainer, CardSkeleton, TableSkeleton } from '@/components/ui/loading-states';
import { SectionErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { logger } from '@/lib/logging';

interface ActivityItem {
  id: string;
  type: 'session' | 'goal' | 'milestone' | 'message' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  color: string;
}

interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color: string;
}

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

// Mock data - in a real app, this would come from an API
const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'session',
    title: 'Session with Dr. Smith',
    description: 'Cognitive behavioral therapy session completed',
    timestamp: '2 hours ago',
    icon: Calendar,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: '2',
    type: 'milestone',
    title: 'Goal Milestone Reached',
    description: 'Completed 30-day meditation streak',
    timestamp: '1 day ago',
    icon: Target,
    color: 'text-green-600 bg-green-100'
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message from Therapist',
    description: 'Follow-up notes from your last session',
    timestamp: '2 days ago',
    icon: MessageSquare,
    color: 'text-purple-600 bg-purple-100'
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Achievement Unlocked',
    description: 'First week of consistent journaling',
    timestamp: '3 days ago',
    icon: Award,
    color: 'text-yellow-600 bg-yellow-100'
  }
];

const mockStats: StatCard[] = [
  {
    label: 'Sessions This Month',
    value: 8,
    change: 12,
    icon: Calendar,
    color: 'text-blue-600'
  },
  {
    label: 'Goals Completed',
    value: 24,
    change: 8,
    icon: Target,
    color: 'text-green-600'
  },
  {
    label: 'Progress Score',
    value: '85%',
    change: 15,
    icon: TrendingUp,
    color: 'text-purple-600'
  },
  {
    label: 'Wellness Streak',
    value: '21 days',
    icon: Heart,
    color: 'text-red-600'
  }
];

const quickActions: QuickAction[] = [
  {
    label: 'Book Session',
    href: '/sessions/booking',
    icon: Calendar,
    color: 'bg-blue-500 hover:bg-blue-600',
    description: 'Schedule your next therapy session'
  },
  {
    label: 'View Progress',
    href: '/progress',
    icon: TrendingUp,
    color: 'bg-green-500 hover:bg-green-600',
    description: 'Track your wellness journey'
  },
  {
    label: 'Set Goals',
    href: '/goals',
    icon: Target,
    color: 'bg-purple-500 hover:bg-purple-600',
    description: 'Define new wellness objectives'
  },
  {
    label: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    color: 'bg-orange-500 hover:bg-orange-600',
    description: 'Communicate with your care team'
  },
  {
    label: 'Academy',
    href: '/academy',
    icon: BookOpen,
    color: 'bg-indigo-500 hover:bg-indigo-600',
    description: 'Learn wellness techniques'
  }
];

export function EnhancedDashboard() {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [stats, setStats] = useState<StatCard[]>(mockStats);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate API call with error handling
  const { data: dashboardData, loading, error, retry } = useAsyncOperation(
    async () => {
      logger.info('Loading dashboard data');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate occasional errors for testing
      if (Math.random() < 0.1) {
        throw new Error('Failed to load dashboard data');
      }
      
      return {
        activities: mockActivities,
        stats: mockStats,
      };
    },
    {
      errorContext: { operation: 'dashboard_data_load' },
      onSuccess: (data) => {
        logger.info('Dashboard data loaded successfully');
        setActivities(data.activities);
        setStats(data.stats);
      },
      onError: (error) => {
        logger.error('Failed to load dashboard data', error);
      },
    }
  );

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new activity every 30 seconds (for demo purposes)
      if (Math.random() > 0.8) {
        const newActivity: ActivityItem = {
          id: Date.now().toString(),
          type: 'session',
          title: 'New Activity',
          description: 'Real-time update from your wellness journey',
          timestamp: 'Just now',
          icon: Activity,
          color: 'text-blue-600 bg-blue-100'
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 items
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await retry();
      // Add a new activity to show refresh worked
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: 'milestone',
        title: 'Data Refreshed',
        description: 'Dashboard updated with latest information',
        timestamp: 'Just now',
        icon: RefreshCw,
        color: 'text-green-600 bg-green-100'
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    } catch (error) {
      logger.error('Failed to refresh dashboard', error as Error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <SectionErrorBoundary sectionName="Dashboard">
      <LoadingContainer
        isLoading={loading}
        isError={!!error}
        error={error || undefined}
        onRetry={retry}
        loadingMessage="Loading your dashboard..."
        errorTitle="Failed to load dashboard"
        errorMessage="We couldn't load your dashboard data. Please try again."
      >
        <div className="space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Welcome back! 👋</CardTitle>
                    <p className="text-muted-foreground">Track your wellness journey and stay on top of your goals</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="transition-all duration-200"
                  >
                    <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} delay={index * 0.1} />
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Updates
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {activities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </AnimatePresence>
                {activities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <QuickActionButton key={action.label} action={action} />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Weekly Progress</CardTitle>
              <Badge variant="outline" className="text-xs">
                This Week
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Meditation Sessions</span>
                <span className="text-sm text-muted-foreground">5/7 completed</span>
              </div>
              <Progress value={71} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Exercise Goals</span>
                <span className="text-sm text-muted-foreground">4/5 completed</span>
              </div>
              <Progress value={80} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sleep Schedule</span>
                <span className="text-sm text-muted-foreground">6/7 completed</span>
              </div>
              <Progress value={86} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
            </div>
      </LoadingContainer>
    </SectionErrorBoundary>
  );
}

function StatCard({ stat, delay }: { stat: StatCard; delay: number }) {
  const Icon = stat.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="border-muted hover:border-primary/30 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <Icon className={cn("h-4 w-4", stat.color)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stat.value}</div>
          {stat.change !== undefined && (
            <div className={cn(
              "text-xs mt-1 flex items-center",
              stat.change > 0 ? "text-green-600" : "text-red-600"
            )}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {stat.change > 0 ? '+' : ''}{stat.change}% from last month
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ActivityItem({ activity }: { activity: ActivityItem }) {
  const Icon = activity.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-4 py-3 border-b border-muted last:border-0"
    >
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", activity.color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{activity.title}</p>
        <p className="text-sm text-muted-foreground">{activity.description}</p>
      </div>
      <div className="text-xs text-muted-foreground">
        {activity.timestamp}
      </div>
    </motion.div>
  );
}

function QuickActionButton({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        asChild
        variant="outline"
        className={cn(
          "w-full justify-start transition-all duration-200",
          "hover:shadow-md hover:shadow-primary/10"
        )}
      >
        <Link href={action.href}>
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", action.color)}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{action.label}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>
      </Button>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      </Card>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-3 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b border-muted last:border-0">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2 mt-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full mb-3" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}