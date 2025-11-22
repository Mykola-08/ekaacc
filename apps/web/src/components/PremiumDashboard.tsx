'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Heart, 
  Brain, 
  Calendar, 
  Users, 
  Award,
  Activity,
  Smile
} from 'lucide-react';

interface PremiumDashboardProps {
  sessions?: any[];
  user?: any;
}

export default function PremiumDashboard({ sessions = [], user }: PremiumDashboardProps) {
  const upcomingSessions = sessions.filter(s => new Date(s.date) >= new Date()).slice(0, 3);
  const completedSessions = sessions.filter(s => new Date(s.date) < new Date()).length;
  const totalSessions = sessions.length;
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  const stats = [
    {
      title: "Wellness Score",
      value: "85%",
      change: "+5%",
      icon: Heart,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up"
    },
    {
      title: "Sessions Completed",
      value: completedSessions.toString(),
      change: "+2 this week",
      icon: Brain,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "up"
    },
    {
      title: "Mood Average",
      value: "7.8/10",
      change: "+0.3 today",
      icon: Smile,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "up"
    },
    {
      title: "Streak Days",
      value: "12",
      change: "Personal best!",
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      trend: "up"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-8 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              You're making great progress on your wellness journey
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border border-gray-200">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">All systems active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                      {stat.change}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Your Progress</CardTitle>
                    <CardDescription className="text-gray-600">
                      Track your wellness journey and achievements
                    </CardDescription>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                    {progressPercentage.toFixed(0)}% Complete
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Session Completion</span>
                    <span className="font-medium text-gray-900">{completedSessions}/{totalSessions}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">This Week</p>
                        <p className="text-lg font-semibold text-gray-900">3 Sessions</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Improvement</p>
                        <p className="text-lg font-semibold text-gray-900">+15%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Recent Activity</CardTitle>
                <CardDescription className="text-gray-600">
                  Your latest sessions and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {session.therapist.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{session.therapist}</p>
                          <p className="text-sm text-gray-600">{session.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{new Date(session.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{session.time}</p>
                      </div>
                    </div>
                  ))}
                  {upcomingSessions.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No upcoming sessions scheduled</p>
                      <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                        Schedule a Session
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg hover:from-blue-100 hover:to-blue-200/50 transition-all duration-200">
                  <Heart className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Log Mood</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg hover:from-green-100 hover:to-green-200/50 transition-all duration-200">
                  <Brain className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Journal Entry</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg hover:from-purple-100 hover:to-purple-200/50 transition-all duration-200">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Join Community</span>
                </button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Wellness Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Daily Wellness Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
                  <p className="text-gray-800 font-medium mb-2">🌟 Today's Focus</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Take 5 minutes to practice deep breathing. This simple exercise can reduce stress and improve your mental clarity throughout the day.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}