'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Heart, 
  Brain, 
  Calendar, 
  Target, 
  Activity,
  ArrowRight,
  Sparkles 
} from 'lucide-react';

export function MinimalistDashboard() {
  const stats = [
    { title: 'Mood Score', value: '7.8', change: '+0.5', icon: Heart, color: 'text-red-500' },
    { title: 'Sessions', value: '12', change: '+2', icon: Brain, color: 'text-blue-500' },
    { title: 'Goals Progress', value: '68%', change: '+8%', icon: Target, color: 'text-green-500' },
    { title: 'Streak', value: '5 days', change: '+1', icon: Activity, color: 'text-purple-500' },
  ];

  const recentActivities = [
    { type: 'mood', title: 'Logged mood', time: '2 hours ago', value: 'Happy' },
    { type: 'session', title: 'Completed session', time: '1 day ago', value: 'Mindfulness' },
    { type: 'goal', title: 'Goal progress', time: '2 days ago', value: 'Exercise' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your wellness journey</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="text-xs font-medium text-green-600">{stat.change}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                  <Button variant="outline" size="sm" className="text-sm">
                    View all
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
                <CardDescription>Your latest wellness activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      whileHover={{ x: 4 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {activity.type === 'mood' && <Heart className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'session' && <Brain className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'goal' && <Target className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                      <div className="text-sm text-gray-600">{activity.value}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                <CardDescription>Common tasks to support your wellness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <motion.button
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Heart className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Log mood</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Book session</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">View progress</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Get insights</span>
                    </div>
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}