'use client';

import React from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/platform/ui/card';
import { 
  Users, 
  Calendar, 
  FileText
} from 'lucide-react';

export function TherapistDashboard() {
  const { user } = useAuth();

  // Mock Data for UI Structure
  const stats = [
    { label: 'Total Patients', value: '0', icon: Users, desc: 'Active patients' },
    { label: 'Today\'s Sessions', value: '0', icon: Calendar, desc: 'Scheduled today' },
    { label: 'Pending Reviews', value: '0', icon: FileText, desc: 'Notes to complete' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Therapist Portal</h1>
          <p className="text-muted-foreground mt-1">
            Dr. {user?.user_metadata?.name || user?.email?.split('@')[0]}
          </p>
        </div>
        <div className="flex gap-2">
           {/* <Button variant="outline" asChild>
            <Link href="#">Manage Availability</Link>
          </Button>
          <Button asChild>
            <Link href="#">View Calendar</Link>
          </Button> */}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Main Content: Schedule & Patients */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                You have no sessions scheduled for today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-dashed border-2 rounded-lg bg-muted/10">
                <Calendar className="h-10 w-10 mb-4 opacity-25" />
                <p>No appointments found</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Latest client interactions</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="text-sm text-muted-foreground">No recent patients.</div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Tasks & Notifications */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-3 bg-muted/40 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Complete Setup</p>
                  <p className="text-xs text-muted-foreground">Finalize your provider profile.</p>
                </div>
              </div>
               {/* Example Empty State if everything is done */}
               {/* <p className="text-sm text-muted-foreground text-center py-4">All tasks completed!</p> */}
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle className="text-base">System Status</CardTitle>
            </CardHeader>
             <CardContent>
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                 <div className="h-2 w-2 rounded-full bg-green-500"></div>
                 Platform Operational
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
