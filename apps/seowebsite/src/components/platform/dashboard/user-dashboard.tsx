'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/platform/auth-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { Separator } from '@/components/platform/ui/separator';
import { 
  Calendar, 
  Wallet, 
  Target, 
  Clock, 
  ArrowRight, 
  Plus, 
  BookOpen,
  MessageSquare
} from 'lucide-react';

export function UserDashboard() {
  const { user } = useAuth();
  
  // These would typically come from a data hook like useDataService or similar
  // For now, we structure the UI to be ready for the data
  const stats = [
    { 
      label: 'Wallet Balance', 
      value: '€0.00', 
      icon: Wallet,
      description: 'Available credits',
      action: '/subscriptions'
    },
    { 
      label: 'Next Session', 
      value: 'Not scheduled', 
      icon: Calendar,
      description: 'Book your next visit',
      action: '/sessions'
    },
    { 
      label: 'Active Goals', 
      value: '0', 
      icon: Target,
      description: 'Wellness objectives',
      action: '/progress'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Member'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your wellness journey and manage your sessions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="default" className="shadow-sm">
            <Link href="/booking">
              <Plus className="mr-2 h-4 w-4" />
              Book Session
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                {stat.description}
              </p>
              {stat.action && (
                <Button variant="ghost" size="sm" className="w-full justify-start px-0 h-auto text-xs text-primary hover:text-primary/80" asChild>
                  <Link href={stat.action} className="flex items-center">
                    Manage <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Main Content Area */}
        <div className="col-span-1 md:col-span-4 space-y-6">
          {/* Upcoming Sessions */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border-dashed border-2 rounded-lg bg-muted/20">
                <Clock className="h-8 w-8 mb-3 opacity-50" />
                <p className="font-medium">No upcoming sessions</p>
                <p className="text-sm mb-4">Ready to continue your journey?</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/booking">Book Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

           {/* Recent Activity */}
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No recent activity recorded.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/journal">
                  <BookOpen className="mr-2 h-4 w-4" />
                  New Journal Entry
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Therapist
                </Link>
              </Button>
               <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/wallet/top-up">
                  <Wallet className="mr-2 h-4 w-4" />
                  Add Funds
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tips / Info */}
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-primary">Wellness Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                "Consistency is key. Even a 5-minute daily check-in can significantly improve your mental well-being over time."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
