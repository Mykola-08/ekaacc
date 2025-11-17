'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoleGuard } from '@/components/role-guard';
import { useAuth } from '@/context/auth-context';
import { 
  Calendar, 
  Users, 
  FileText, 
  Award, 
  Clock, 
  TrendingUp,
  MessageSquare,
  BookOpen,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TherapistDashboardProps {
  className?: string;
}

export function TherapistDashboard({ className }: TherapistDashboardProps) {
  const { user } = useAuth();

  // Mock data - in real app, fetch based on therapist ID
  const stats = {
    totalPatients: 24,
    upcomingSessions: 8,
    completedSessions: 156,
    pendingReports: 12,
    averageRating: 4.8,
    responseTime: '2.3 hours'
  };

  const recentPatients = [
    { id: 1, name: 'John Doe', lastSession: '2024-01-15', status: 'active', nextAppointment: '2024-01-22' },
    { id: 2, name: 'Jane Smith', lastSession: '2024-01-12', status: 'active', nextAppointment: '2024-01-20' },
    { id: 3, name: 'Mike Johnson', lastSession: '2024-01-10', status: 'pending', nextAppointment: '2024-01-25' }
  ];

  const upcomingSessions = [
    { id: 1, patient: 'John Doe', time: '09:00 AM', duration: '60 min', type: 'Individual Therapy' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', duration: '45 min', type: 'Follow-up' },
    { id: 3, patient: 'Mike Johnson', time: '02:00 PM', duration: '60 min', type: 'Initial Consultation' }
  ];

  return (
    <RoleGuard allowedRoles={['Therapist', 'Admin']}>
      <div className={className}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Therapist Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, Dr. {user?.name || 'Therapist'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {stats.averageRating} Rating
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats.responseTime} avg response
              </Badge>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPatients}</div>
                <p className="text-xs text-muted-foreground">
                  Active patients under care
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
                <p className="text-xs text-muted-foreground">
                  Sessions scheduled today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedSessions}</div>
                <p className="text-xs text-muted-foreground">
                  Total sessions this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingReports}</div>
                <p className="text-xs text-muted-foreground">
                  Reports awaiting completion
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Sessions</CardTitle>
                <CardDescription>
                  Your scheduled appointments for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{session.patient}</p>
                        <p className="text-sm text-muted-foreground">{session.type}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-medium">{session.time}</p>
                        <p className="text-xs text-muted-foreground">{session.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>
                  Patients with recent activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Last session: {patient.lastSession}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={patient.status === 'active' ? 'default' : 'outline'}>
                          {patient.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Next: {patient.nextAppointment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common therapist tasks and tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <Button className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Write Session Report
                </Button>
                <Button className="justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Patient
                </Button>
                <Button className="justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Assign Exercise
                </Button>
                <Button className="justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Session
                </Button>
                <Button className="justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Progress
                </Button>
                <Button className="justify-start">
                  <Award className="mr-2 h-4 w-4" />
                  Update Treatment Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}

interface PatientDashboardProps {
  className?: string;
}

export function PatientDashboard({ className }: PatientDashboardProps) {
  const { user } = useAuth();

  const stats = {
    totalSessions: 12,
    upcomingAppointments: 2,
    completedExercises: 24,
    journalEntries: 18,
    currentStreak: 7,
    wellnessScore: 4.2
  };

  const upcomingAppointments = [
    { id: 1, therapist: 'Dr. Smith', date: '2024-01-22', time: '10:00 AM', type: 'Individual Therapy' },
    { id: 2, therapist: 'Dr. Johnson', date: '2024-01-25', time: '02:30 PM', type: 'Group Session' }
  ];

  const recentExercises = [
    { id: 1, name: 'Breathing Exercise', completed: '2024-01-15', duration: '10 min' },
    { id: 2, name: 'Mindfulness Meditation', completed: '2024-01-14', duration: '15 min' },
    { id: 3, name: 'Stretching Routine', completed: '2024-01-13', duration: '20 min' }
  ];

  return (
    <RoleGuard allowedRoles={['Patient', 'VIP Patient', 'Admin']}>
      <div className={className}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Patient'}</h1>
              <p className="text-muted-foreground">
                Continue your wellness journey
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stats.currentStreak} day streak
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {stats.wellnessScore}/5 wellness
              </Badge>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSessions}</div>
                <p className="text-xs text-muted-foreground">
                  Completed sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
                <p className="text-xs text-muted-foreground">
                  Scheduled appointments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Exercises</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedExercises}</div>
                <p className="text-xs text-muted-foreground">
                  Exercises completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.journalEntries}</div>
                <p className="text-xs text-muted-foreground">
                  Entries written
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>
                  Your scheduled therapy sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.therapist}</p>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-medium">{appointment.date}</p>
                        <p className="text-xs text-muted-foreground">{appointment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Exercises */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Exercises</CardTitle>
                <CardDescription>
                  Exercises you've completed recently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentExercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">Completed: {exercise.completed}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{exercise.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Continue your wellness journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <Button className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Write Journal Entry
                </Button>
                <Button className="justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Do Today's Exercise
                </Button>
                <Button className="justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Therapist
                </Button>
                <Button className="justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
                <Button className="justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Progress
                </Button>
                <Button className="justify-start">
                  <Award className="mr-2 h-4 w-4" />
                  View Achievements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}

interface ReceptionDashboardProps {
  className?: string;
}

export function ReceptionDashboard({ className }: ReceptionDashboardProps) {
  const stats = {
    totalAppointments: 45,
    todayAppointments: 12,
    pendingConfirmations: 8,
    checkedIn: 7,
    cancellations: 2,
    noShows: 1
  };

  const todaySchedule = [
    { id: 1, patient: 'John Doe', time: '09:00 AM', therapist: 'Dr. Smith', status: 'checked-in' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', therapist: 'Dr. Johnson', status: 'confirmed' },
    { id: 3, patient: 'Mike Johnson', time: '02:00 PM', therapist: 'Dr. Brown', status: 'pending' },
    { id: 4, patient: 'Sarah Wilson', time: '03:30 PM', therapist: 'Dr. Davis', status: 'confirmed' }
  ];

  return (
    <RoleGuard allowedRoles={['Reception', 'Admin']}>
      <div className={className}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reception Dashboard</h1>
              <p className="text-muted-foreground">
                Manage appointments and patient check-ins
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stats.checkedIn} checked in
              </Badge>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayAppointments}</div>
                <p className="text-xs text-muted-foreground">
                  Scheduled for today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.checkedIn}</div>
                <p className="text-xs text-muted-foreground">
                  Patients checked in
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingConfirmations}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting confirmation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancellations</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.cancellations}</div>
                <p className="text-xs text-muted-foreground">
                  Today's cancellations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                Appointment schedule for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySchedule.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">{appointment.therapist}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">{appointment.time}</p>
                      <Badge 
                        variant={
                          appointment.status === 'checked-in' ? 'default' :
                          appointment.status === 'confirmed' ? 'outline' :
                          'secondary'
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common reception tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <Button className="justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
                <Button className="justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Check In Patient
                </Button>
                <Button className="justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  View Schedule
                </Button>
                <Button className="justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Reminder
                </Button>
                <Button className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Process Payment
                </Button>
                <Button className="justify-start">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Handle Cancellation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}