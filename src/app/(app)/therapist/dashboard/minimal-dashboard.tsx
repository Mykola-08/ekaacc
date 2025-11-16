'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Users,
  FileText,
  DollarSign,
  Clock,
  TrendingUp,
  MessageSquare,
  Activity,
  Target
} from "lucide-react";

import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { MinimalCard } from '@/components/ui/minimal-card';
import { MinimalButton } from '@/components/ui/minimal-button';
import { MinimalLayout } from '@/components/layout/minimal-layout';
import { format } from "date-fns";
import type { User, Session as AppSession } from "@/lib/types";
import fxService from '@/lib/fx-service';

function MinimalStatCard({ 
  title, 
  value, 
  change, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  change: string; 
  icon: React.ElementType 
}) {
  return (
    <MinimalCard variant="default" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className="h-5 w-5 text-gray-600" />
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{change}</p>
      </div>
    </MinimalCard>
  );
}

function MinimalUpcomingSessions({ sessions }: { sessions: AppSession[] }) {
  const upcomingSessions = sessions
    .filter(s => new Date(s.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  if (upcomingSessions.length === 0) {
    return (
      <MinimalCard variant="default" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No upcoming sessions scheduled</p>
          <MinimalButton 
            variant="outline" 
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

  return (
    <MinimalCard variant="default" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
        <MinimalButton 
          variant="ghost" 
          size="sm"
          onClick={() => window.location.href = '/sessions'}
        >
          View All
        </MinimalButton>
      </div>
      <div className="space-y-3">
        {upcomingSessions.map((session) => {
          const sessionDate = new Date(session.date);
          const formattedDate = format(sessionDate, "MMM d, yyyy");
          const formattedTime = format(sessionDate, "h:mm a");

          return (
            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{session.therapist}</p>
                <p className="text-sm text-gray-600">{session.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formattedTime}</p>
                <p className="text-sm text-gray-600">{formattedDate}</p>
              </div>
            </div>
          );
        })}
      </div>
    </MinimalCard>
  );
}

function MinimalRecentClients({ clients }: { clients: User[] }) {
  return (
    <MinimalCard variant="default" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
        <MinimalButton 
          variant="ghost" 
          size="sm"
          onClick={() => window.location.href = '/therapists'}
        >
          View All
        </MinimalButton>
      </div>
      <div className="space-y-3">
        {clients.slice(0, 5).map((client) => (
          <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{client.name || client.email}</p>
              <p className="text-sm text-gray-600">{client.personalization?.mood || 'No mood data'}</p>
            </div>
            <div className="text-right">
              <MinimalButton 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = `/messages?user=${client.id}`}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Message
              </MinimalButton>
            </div>
          </div>
        ))}
      </div>
    </MinimalCard>
  );
}

export default function MinimalTherapistDashboard() {
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  
  const [sessions, setSessions] = useState<AppSession[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser || !dataService) return;
    
    setIsLoading(true);
    try {
      // Get sessions for this therapist
      const allSessions = await dataService.getAllSessions();
      const therapistSessions = allSessions.filter(session => 
        session.therapistId === currentUser.id || 
        session.therapist === currentUser.name ||
        session.therapist === currentUser.email
      );
      
      // Get unique clients
      const clientIds = [...new Set(therapistSessions.map(s => s.userId))];
      const clientData = await Promise.all(
        clientIds.map(id => dataService.getUserById(id))
      );
      
      setSessions(therapistSessions);
      setClients(clientData.filter(Boolean) as User[]);
    } catch (error) {
      console.error('Error fetching therapist dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, dataService]);

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchDashboardData();
    }
  }, [currentUser, authLoading, fetchDashboardData]);

  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const upcomingSessions = sessions.filter(s => new Date(s.date) >= new Date()).length;
    const completedSessions = sessions.filter(s => s.status === 'Completed').length;
    const totalClients = clients.length;
    const activeClients = clients.filter(c => 
      c.lastActive && new Date(c.lastActive) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    return {
      totalSessions: totalSessions.toString(),
      upcomingSessions: upcomingSessions.toString(),
      completedSessions: completedSessions.toString(),
      totalClients: totalClients.toString(),
      activeClients: activeClients.toString()
    };
  }, [sessions, clients]);

  if (authLoading || isLoading) {
    return (
      <MinimalLayout centered>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </MinimalLayout>
    );
  }

  return (
    <MinimalLayout centered={false}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Therapist Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser?.name || currentUser?.email}</p>
          </div>
          <div className="flex gap-2">
            <MinimalButton 
              variant="outline" 
              size="md"
              onClick={() => window.location.href = '/sessions/booking'}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Session
            </MinimalButton>
            <MinimalButton 
              variant="primary" 
              size="md"
              onClick={() => window.location.href = '/therapist/templates'}
            >
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </MinimalButton>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MinimalStatCard
            title="Total Sessions"
            value={stats.totalSessions}
            change="All completed sessions"
            icon={Activity}
          />
          <MinimalStatCard
            title="Upcoming Sessions"
            value={stats.upcomingSessions}
            change="Scheduled sessions"
            icon={Calendar}
          />
          <MinimalStatCard
            title="Total Clients"
            value={stats.totalClients}
            change="Active clients"
            icon={Users}
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MinimalUpcomingSessions sessions={sessions} />
          <MinimalRecentClients clients={clients} />
        </div>

        {/* Quick Actions */}
        <MinimalCard variant="default" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MinimalButton 
              variant="outline" 
              size="md"
              className="w-full"
              onClick={() => window.location.href = '/sessions'}
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Sessions
            </MinimalButton>
            <MinimalButton 
              variant="outline" 
              size="md"
              className="w-full"
              onClick={() => window.location.href = '/therapists'}
            >
              <Users className="w-4 h-4 mr-2" />
              My Clients
            </MinimalButton>
            <MinimalButton 
              variant="outline" 
              size="md"
              className="w-full"
              onClick={() => window.location.href = '/progress-reports'}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Reports
            </MinimalButton>
            <MinimalButton 
              variant="outline" 
              size="md"
              className="w-full"
              onClick={() => window.location.href = '/messages'}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </MinimalButton>
          </div>
        </MinimalCard>
      </div>
    </MinimalLayout>
  );
}