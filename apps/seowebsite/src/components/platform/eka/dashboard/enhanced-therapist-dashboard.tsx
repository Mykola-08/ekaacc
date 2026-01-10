'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  ArrowUpRight,
  Calendar,
  Users,
  FileText,
  Settings,
  DollarSign,
  Shield,
  TestTube2,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  MessageSquare,
  BarChart3,
  Activity,
  Zap,
  Target,
  PlayCircle
} from "lucide-react";

import { useAuth } from '@/lib/platform/supabase-auth';
import { useAppStore } from '@/store/platform/app-store';
import { useToast } from '@/hooks/platform/use-toast';
import { SettingsShell } from "@/components/platform/eka/settings/settings-shell";
import { SettingsHeader } from "@/components/platform/eka/settings/settings-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { Avatar, AvatarFallback } from '@/components/platform/ui/avatar';
import { Skeleton } from '@/components/platform/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/platform/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';
import { cn } from '@/lib/platform/utils';
import { generateTherapyRecommendations } from '@/ai/ai-service';
import type { User, Session as AppSession, UserRole } from "@/lib/platform/types";

import fxService from '@/lib/platform/fx-service';
import { format } from "date-fns";

// Dynamic imports for heavy components
// @ts-expect-error - test-tools module not yet implemented
const TestTools = dynamic(() => import("@/components/platform/eka/test-tools").then((mod) => mod.TestTools));
const ClientBilling = dynamic(() => import("@/components/platform/eka/client-billing").then((mod) => mod.ClientBilling));
const AdminPanel = dynamic(() => import('@/components/platform/eka/admin-panel').then((m) => m.AdminPanel));
const BookingCalendar = dynamic(() => import('@/components/platform/eka/booking-calendar'));
const SessionAssessmentForm = dynamic(() => import('@/components/platform/eka/forms/session-assessment-form').then(m => m.SessionAssessmentForm));

// AI-powered session insights component
function SessionInsights({ sessions }: { sessions: AppSession[] }) {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateInsights() {
      try {
        setLoading(true);
        const sessionContext = {
          totalSessions: sessions.length,
          upcomingSessions: sessions.filter(s => new Date(s.date) > new Date()).length,
          completedThisWeek: sessions.filter(s => {
            const sessionDate = new Date(s.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return sessionDate >= weekAgo && sessionDate <= new Date() && s.status === 'Completed';
          }).length
        };

        const recommendations = await generateTherapyRecommendations(
          `Generate actionable insights for therapist practice management with ${sessionContext.totalSessions} total sessions, ${sessionContext.upcomingSessions} upcoming, and ${sessionContext.completedThisWeek} completed this week.`,
          JSON.stringify(sessionContext)
        );

        const insightsList = recommendations.map((rec, index) => ({
          id: index,
          text: rec.description,
          type: index === 0 ? 'priority' : index === 1 ? 'opportunity' : 'trend',
          confidence: rec.confidence
        }));

        setInsights(insightsList);
      } catch (error) {
        console.error('Error generating session insights:', error);
        setInsights([
          { id: 1, text: 'Focus on building stronger therapeutic alliances with new clients.', type: 'priority', confidence: 0.8 },
          { id: 2, text: 'Consider implementing more structured session frameworks.', type: 'opportunity', confidence: 0.7 }
        ]);
      } finally {
        setLoading(false);
      }
    }

    if (sessions.length > 0) {
      generateInsights();
    }
  }, [sessions]);

  if (loading) {
    return (
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            AI Session Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const insightIcons = {
    priority: AlertCircle,
    opportunity: Target,
    trend: TrendingUp
  };

  const insightColors = {
    priority: 'text-red-500',
    opportunity: 'text-blue-500',
    trend: 'text-green-500'
  };

  return (
    <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-500" />
          AI Session Insights
        </CardTitle>
        <CardDescription>Data-driven recommendations for your practice</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insightIcons[insight.type as keyof typeof insightIcons];
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50"
              >
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${insightColors[insight.type as keyof typeof insightColors]}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{insight.text}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced stat card with trend indicators
function EnhancedStatCard({ 
  title, 
  value, 
  trend, 
  icon: Icon,
  color = 'blue' 
}: {
  title: string;
  value: string;
  trend?: { value: number; direction: 'up' | 'down' };
  icon: any;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    orange: 'from-orange-50 to-orange-100 border-orange-200'
  };

  return (
    <motion.div
      whileHover={{ y: -2, opacity: 0.95 }}
      className={cn(
        "p-6 rounded-xl border-2 bg-gradient-to-br transition-all duration-300",
        colorClasses[color]
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className={`w-4 h-4 ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend.direction === 'up' ? '+' : '-'}{trend.value}%
              </span>
            </div>
          )}
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </motion.div>
  );
}

// Quick action panel for therapists
function TherapistQuickActions({ onAction }: { onAction: (action: string) => void }) {
  const actions = [
    {
      id: 'new-session',
      title: 'Start Session',
      description: 'Begin a new therapy session',
      icon: PlayCircle,
      color: 'green',
      priority: 'high'
    },
    {
      id: 'assessment',
      title: 'Assessment',
      description: 'Complete patient assessment',
      icon: FileText,
      color: 'blue',
      priority: 'medium'
    },
    {
      id: 'notes',
      title: 'Session Notes',
      description: 'Add session documentation',
      icon: MessageSquare,
      color: 'purple',
      priority: 'medium'
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Check practice metrics',
      icon: BarChart3,
      color: 'orange',
      priority: 'low'
    }
  ];

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-500" />
          Quick Actions
        </CardTitle>
        <CardDescription>Streamline your workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <motion.div
              key={action.id}
              whileHover={{ y: -2, opacity: 0.95 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all duration-300",
                "bg-gradient-to-br hover:shadow-lg"
              )}
              onClick={() => onAction(action.id)}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full", `bg-${action.color}-100`)}>
                  <action.icon className={cn("w-5 h-5", `text-${action.color}-600`)} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{action.title}</h4>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </div>
              </div>
              {action.priority === 'high' && (
                <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
                  Priority
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced session list with AI insights
function EnhancedSessionList({ sessions }: { sessions: AppSession[] }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Session Schedule
          </CardTitle>
          <CardDescription>Manage your upcoming appointments</CardDescription>
        </div>
        <Badge variant="outline">{sessions.length} sessions</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.slice(0, 5).map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {session.therapist.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {session.status === 'Upcoming' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{session.type}</h4>
                  <p className="text-sm text-gray-600">{session.therapist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {format(new Date(session.date), "p, MMM d")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={cn("px-2 py-1 text-xs", getStatusColor(session.status))}>
                  {session.status}
                </Badge>
                <Button 
                  variant={session.status === 'Upcoming' ? 'default' : 'outline'}
                  size="sm"
                  className="hover-lift"
                >
                  {session.status === 'Upcoming' ? 'Start' : 'View'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main enhanced therapist dashboard
export default function EnhancedTherapistDashboard() {
  const { user: appUser } = useAuth();
  const isTestMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';
  const isAdmin = appUser?.role?.name === 'Admin';
  const router = useRouter();
  const { toast } = useToast();
  const dataService = useAppStore((state) => state.dataService);

  const [currentUser, setCurrentUser] = useState<User | null>(appUser as User | null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [upcomingSessions, setUpcomingSessions] = useState<AppSession[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { setCurrentUser(appUser as User | null); }, [appUser]);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      if (!dataService || !currentUser) return;
      setIsLoading(true);
      try {
        const [bookings, users] = await Promise.all([
          fxService.getBookings(),
          fxService.getUsers(),
        ]);
        
        const mappedSessions = bookings.map((booking: any) => ({
          id: booking.id || String(Math.random()),
          therapist: booking.therapistName || "EKA Therapist",
          therapistAvatarUrl: "https://i.pravatar.cc/150?u=square",
          date: booking.start_at || booking.date || new Date().toISOString(),
          time: new Date(booking.start_at || booking.date || new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          duration: booking.duration || 0,
          status: booking.status || "Upcoming",
          type: booking.appointment_segments?.[0]?.service_variation_data?.name || booking.serviceName || "Unknown Service",
          userId: booking.userId || booking.customer_id,
        } as AppSession));

        setUpcomingSessions(mappedSessions);
        setPatients(users.filter((u: User) => u.role === 'Patient'));
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        toast({ 
          variant: "destructive", 
          title: "Error", 
          description: "Could not load dashboard data." 
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [dataService, currentUser, toast]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-session':
        router.push('/sessions/live');
        break;
      case 'assessment':
        router.push('/forms');
        break;
      case 'notes':
        router.push('/sessions');
        break;
      case 'analytics':
        setActiveTab('analytics');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const thisWeek = new Date(today.setDate(today.getDate() - 7));
    
    return {
      upcoming: upcomingSessions.filter(s => new Date(s.date) > new Date()).length,
      activeClients: patients.length,
      completedToday: upcomingSessions.filter(s => format(new Date(s.date), 'yyyy-MM-dd') === todayStr && s.status === 'Completed').length,
      completedThisWeek: upcomingSessions.filter(s => new Date(s.date) >= thisWeek && s.status === 'Completed').length,
      revenueToday: 520,
      revenueTrend: { value: 12, direction: 'up' as const }
    };
  }, [upcomingSessions, patients]);

  const TABS = [
    { value: "dashboard", label: "Dashboard", icon: <Activity className="h-4 w-4 mr-2" /> },
    { value: "clients", label: "Clients", icon: <Users className="h-4 w-4 mr-2" /> },
    { value: "sessions", label: "Sessions", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { value: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { value: "billing", label: "Billing", icon: <DollarSign className="h-4 w-4 mr-2" /> },
    { value: "settings", label: "Settings", icon: <Settings className="h-4 w-4 mr-2" /> },
    ...(isAdmin ? [{ value: "admin", label: "Admin", icon: <Shield className="h-4 w-4 mr-2" /> }] : []),
    ...(isTestMode ? [{ value: "test-tools", label: "Test Tools", icon: <TestTube2 className="h-4 w-4 mr-2" /> }] : []),
  ];

  if (isLoading) {
    return (
      <SettingsShell>
        <SettingsHeader
          title="Therapist Dashboard"
          description="Loading your practice overview..."
        />
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </SettingsShell>
    );
  }

  return (
    <SettingsShell>
      <SettingsHeader
        title="Therapist Dashboard"
        description="Manage your practice with AI-powered insights and efficient workflows."
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${TABS.length}, 1fr)`}}>
          {TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center">
              {tab.icon} {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Enhanced Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <EnhancedStatCard 
              title="Upcoming Sessions" 
              value={stats.upcoming.toString()} 
              icon={Calendar}
              color="blue"
            />
            <EnhancedStatCard 
              title="Active Clients" 
              value={stats.activeClients.toString()} 
              icon={Users}
              color="green"
            />
            <EnhancedStatCard 
              title="Completed Today" 
              value={stats.completedToday.toString()} 
              icon={CheckCircle}
              color="purple"
            />
            <EnhancedStatCard 
              title="Revenue Today" 
              value={`€${stats.revenueToday}`} 
              icon={DollarSign}
              color="orange"
              trend={stats.revenueTrend}
            />
          </div>

          {/* Quick Actions Panel */}
          <TherapistQuickActions onAction={handleQuickAction} />

          {/* AI Session Insights */}
          <SessionInsights sessions={upcomingSessions} />

          {/* Enhanced Session List */}
          <EnhancedSessionList sessions={upcomingSessions} />
        </TabsContent>

        <TabsContent value="clients">
          <ClientsManagement patients={patients} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionManagement sessions={upcomingSessions} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard sessions={upcomingSessions} patients={patients} stats={stats} />
        </TabsContent>

        <TabsContent value="billing">
          <ClientBilling client={currentUser as User} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="settings">
          <TherapistSettings />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admin">
            <AdminPanel />
          </TabsContent>
        )}

        {isTestMode && (
          <TabsContent value="test-tools">
            <TestTools />
          </TabsContent>
        )}
      </Tabs>
    </SettingsShell>
  );
}

// Placeholder components for new tabs
function ClientsManagement({ patients, isLoading }: { patients: User[], isLoading: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Client Management
        </CardTitle>
        <CardDescription>Comprehensive client directory with AI-powered insights</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Enhanced client management with AI-powered recommendations and progress tracking coming soon...</p>
      </CardContent>
    </Card>
  );
}

function SessionManagement({ sessions }: { sessions: AppSession[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Session Management
        </CardTitle>
        <CardDescription>Advanced session scheduling and documentation tools</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Enhanced session management with AI-assisted documentation and workflow optimization coming soon...</p>
      </CardContent>
    </Card>
  );
}

function AnalyticsDashboard({ sessions, patients, stats }: { sessions: AppSession[], patients: User[], stats: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Practice Analytics
        </CardTitle>
        <CardDescription>AI-powered insights and practice performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Advanced analytics dashboard with predictive insights and practice optimization recommendations coming soon...</p>
      </CardContent>
    </Card>
  );
}

function TherapistSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Therapist Settings
        </CardTitle>
        <CardDescription>Configure your practice preferences and AI assistance settings</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Enhanced settings panel with AI customization and workflow preferences coming soon...</p>
      </CardContent>
    </Card>
  );
}