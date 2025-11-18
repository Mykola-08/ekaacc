'use client'

import { Users, Calendar, TrendingUp, MessageSquare, Clock, FileText, Award, Settings, Bell } from 'lucide-react'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
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
      color: 'text-blue-600'
    },
    {
      title: 'Sessions This Week',
      value: '18',
      change: '4 completed today',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Client Satisfaction',
      value: '4.9/5',
      change: '+0.2 this month',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      title: 'Response Rate',
      value: '98%',
      change: 'Excellent',
      icon: MessageSquare,
      color: 'text-orange-600'
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
      color: 'bg-blue-500'
    },
    {
      title: 'Schedule Session',
      description: 'Book a new therapy session',
      icon: Calendar,
      href: '/sessions/booking',
      color: 'bg-green-500'
    },
    {
      title: 'Client Messages',
      description: 'Check and respond to messages',
      icon: MessageSquare,
      href: '/messages',
      color: 'bg-purple-500'
    },
    {
      title: 'Reports',
      description: 'View progress reports and analytics',
      icon: FileText,
      href: '/progress-reports',
      color: 'bg-orange-500'
    }
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/10 to-blue-50/10">
        {/* Header Section */}
        <section className="relative overflow-hidden py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 text-sm font-medium text-purple-700">
                  <Award className="h-4 w-4" />
                  Professional Therapist Dashboard
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  {welcomeMessage}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Manage your practice, track client progress, and deliver exceptional care.
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">Practice Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {therapistStats.map((stat, index) => (
                  <Card key={stat.title} className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{stat.title}</h3>
                      <p className="text-sm text-muted-foreground">{stat.change}</p>
                      <div className="mt-3">
                        <Progress value={75} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <Card key={action.title} className="h-full bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300 cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors border-purple-200"
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
        <section className="py-8 bg-gradient-to-r from-purple-50/20 to-blue-50/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Today's Schedule</h2>
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
                      <Card key={index} className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                                <Clock className="h-5 w-5 text-purple-600" />
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
                      <Card key={index} className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-purple-600" />
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
    </DashboardLayout>
  )
}