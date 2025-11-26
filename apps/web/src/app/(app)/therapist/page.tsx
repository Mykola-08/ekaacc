"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from "@/context/auth-context";
import { Calendar, Clock, User, FileText, TrendingUp, Activity, Users, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDataService } from "@/services/data-service";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function TherapistDashboard() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [myClients, setMyClients] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const dataService = await getDataService();
          const [userSessions, userReports] = await Promise.all([
            dataService.getSessions(currentUser.id),
            dataService.getReports(currentUser.id),
          ]);
          setSessions(userSessions);
          setReports(userReports);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          toast({
            title: "Error",
            description: "Could not load dashboard data.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [currentUser, toast]);
  
  // Filter sessions assigned to the current therapist
  const mySessions = sessions.filter(
    session => session.therapist === (currentUser?.email?.split('@')[0] || currentUser?.id) || session.userId === currentUser?.id
  );

  const todaySessions = mySessions.filter(s => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });

  const upcomingSessions = mySessions.filter(s => new Date(s.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completedSessions = mySessions.filter(s => s.status === 'Completed' || new Date(s.date) < new Date());
  const pendingReports = reports.filter(r => r.author === (currentUser?.email?.split('@')[0] || currentUser?.id));

  useEffect(() => {
    loadClients();
  }, [currentUser, mySessions]);

  const loadClients = async () => {
    if (!currentUser?.id) return;
    try {
      const service = await getDataService();
      const allUsers = await service.getAllUsers();
      // Get unique patient IDs from my sessions
      const patientIds = [...new Set(mySessions.map(s => s.userId))].filter(id => id);
      const clients = allUsers.filter(u => patientIds.includes(u.id));
      setMyClients(clients);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const therapistStats = [
    {
      title: 'Today\'s Sessions',
      value: todaySessions.length.toString(),
      description: `${mySessions.length} total`,
      icon: Calendar,
    },
    {
      title: 'Total Clients',
      value: myClients.length.toString(),
      description: 'Active patients',
      icon: Users,
    },
    {
      title: 'Completed Sessions',
      value: completedSessions.length.toString(),
      description: 'All time',
      icon: CheckCircle2,
    },
    {
      title: 'Pending Reports',
      value: pendingReports.length.toString(),
      description: 'To complete',
      icon: FileText,
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Therapist Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {currentUser?.profile?.full_name || currentUser?.email?.split('@')[0] || 'Therapist'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/therapist/session-notes')}>
            <FileText className="h-4 w-4 mr-2" />
            Session Notes
          </Button>
          <Button onClick={() => router.push('/therapist/templates')}>
            <Activity className="h-4 w-4 mr-2" />
            Templates
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {therapistStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Sessions
            </CardTitle>
            <CardDescription>Sessions scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            {todaySessions.length > 0 ? (
              <div className="space-y-4">
                {todaySessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{session.therapist || 'Patient'}</p>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {format(new Date(session.date), 'HH:mm')} - {session.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">
                        {session.status || 'Scheduled'}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/sessions/${session.id}`)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No sessions scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/therapist/bookings')}>
                <Calendar className="h-4 w-4 mr-2" />
                View Bookings
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/therapist/session-notes')}>
                <FileText className="h-4 w-4 mr-2" />
                Session Notes
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/therapist/clients')}>
                <Users className="h-4 w-4 mr-2" />
                View Clients
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/therapist/templates')}>
                <FileText className="h-4 w-4 mr-2" />
                Report Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Upcoming Sessions
          </CardTitle>
          <CardDescription>Next scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{session.therapist || 'Patient'}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(session.date), 'MMM dd, yyyy')} at {session.time}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => router.push(`/sessions/${session.id}`)}>
                    Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No upcoming sessions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
