'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, TrendingUp, MessageSquare, Clock, FileText, Award, Settings, Bell } from 'lucide-react'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export default function TherapistDashboardPage() {
  const { user } = useSimpleAuth()

  const welcomeMessage = user?.profile.full_name 
    ? `Welcome back, Dr. ${user.profile.full_name}!` 
    : 'Welcome to your therapist dashboard!'

  const therapistStats = [
    {
      title: 'Active Clients',
      value: '24',
      change: '+3 this month',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Sessions This Week',
      value: '18',
      change: '4 completed today',
      icon: Calendar,
      color: 'text-primary'
    },
    {
      title: 'Client Satisfaction',
      value: '4.9/5',
      change: '+0.2 this month',
      icon: Award,
      color: 'text-primary'
    },
    {
      title: 'Response Rate',
      value: '98%',
      change: 'Excellent',
      icon: MessageSquare,
      color: 'text-primary'
    }
  ]

  const upcomingSessions = [
    {
      client: 'Sarah Johnson',
      time: '10:00 AM',
      type: 'Individual Therapy',
      duration: '50 min',
      status: 'confirmed'
    },
    {
      client: 'Michael Chen',
      time: '11:30 AM',
      type: 'Couples Therapy',
      duration: '60 min',
      status: 'confirmed'
    },
    {
      client: 'Emma Davis',
      time: '2:00 PM',
      type: 'Individual Therapy',
      duration: '50 min',
      status: 'pending'
    },
    {
      client: 'James Wilson',
      time: '3:30 PM',
      type: 'Group Therapy',
      duration: '90 min',
      status: 'confirmed'
    }
  ]

  const recentActivities = [
    {
      client: 'Sarah Johnson',
      action: 'completed session',
      time: '2 hours ago',
      type: 'session'
    },
    {
      client: 'Michael Chen',
      action: 'sent message',
      time: '4 hours ago',
      type: 'message'
    },
    {
      client: 'Emma Davis',
      action: 'booked new appointment',
      time: '6 hours ago',
      type: 'booking'
    },
    {
      client: 'James Wilson',
      action: 'submitted progress report',
      time: '1 day ago',
      type: 'report'
    }
  ]

  const quickActions = [
    {
      title: 'View Clients',
      description: 'Manage your client list and profiles',
      icon: Users,
      href: '/therapist/clients',
      color: 'bg-primary/10'
    },
    {
      title: 'Schedule Session',
      description: 'Book a new therapy session',
      icon: Calendar,
      href: '/sessions/booking',
      color: 'bg-primary/10'
    },
    {
      title: 'Client Messages',
      description: 'Check and respond to messages',
      icon: MessageSquare,
      href: '/messages',
      color: 'bg-primary/10'
    },
    {
      title: 'Reports',
      description: 'View progress reports and analytics',
      icon: FileText,
      href: '/progress-reports',
      color: 'bg-primary/10'
    }
  ]

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-8 h-8 text-primary" />
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {welcomeMessage}
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                  Manage your practice, track client progress, and deliver exceptional care
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Practice Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {therapistStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border-muted hover:border-border transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <span className="text-3xl font-bold text-primary">{stat.value}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{stat.title}</h3>
                      <p className="text-sm text-muted-foreground">{stat.change}</p>
                      <div className="mt-3">
                        <Progress value={75} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

        {/* Quick Actions */}
        <section className="py-8">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action) => (
                  <Card key={action.title} className="h-full border hover:bg-accent/40 transition-colors cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-muted">
                        <action.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.location.href = action.href}
                      >
                        Open
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Sessions */}
        <section className="py-8">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-foreground">Today's Schedule</h2>
                <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
                  <Calendar className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Sessions</h3>
                  <div className="space-y-4">
                    {upcomingSessions.map((session, index) => (
                      <Card key={index} className="border hover:bg-accent/40 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                <Clock className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{session.client}</h4>
                                <p className="text-sm text-muted-foreground">{session.type} • {session.duration}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">{session.time}</p>
                              <Badge variant={session.status === 'confirmed' ? 'default' : 'secondary'} className="bg-purple-100 text-purple-700">
                                {session.status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activities</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <Card key={index} className="border hover:bg-accent/40 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                              <Users className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-foreground">
                                <span className="font-semibold">{activity.client}</span> {activity.action}
                              </p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}