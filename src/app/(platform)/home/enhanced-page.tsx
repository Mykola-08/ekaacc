'use client'

import React from 'react'

import { Sparkles, Heart, Brain, Shield, Zap, Calendar, Target, MessageSquare, TrendingUp } from 'lucide-react'
import { PageContainer } from '@/components/platform/eka/page-container'
import { PageHeader } from '@/components/platform/eka/page-header'
import { SurfacePanel } from '@/components/platform/eka/surface-panel'
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card'
import { Button } from '@/components/platform/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/platform/ui/avatar'
import { motion } from 'framer-motion'

export default function PatientDashboardPage() {
 const { user } = useSimpleAuth()

 const welcomeMessage = user?.profile?.full_name 
  ? `Welcome back, ${user.profile.full_name}!` 
  : 'Welcome to your wellness journey!'

 const quickActions = [
  {
   title: 'Book Session',
   description: 'Schedule your next therapy session',
   icon: Calendar,
   href: '/sessions/booking',
   color: 'bg-blue-500'
  },
  {
   title: 'View Progress',
   description: 'Check your wellness progress',
   icon: TrendingUp,
   href: '/progress',
   color: 'bg-green-500'
  },
  {
   title: 'Set Goals',
   description: 'Define your wellness objectives',
   icon: Target,
   href: '/goals',
   color: 'bg-purple-500'
  },
  {
   title: 'Messages',
   description: 'Communicate with your therapist',
   icon: MessageSquare,
   href: '/messages',
   color: 'bg-orange-500'
  }
 ]

 const wellnessStats = [
  {
   title: 'Sessions Completed',
   value: '12',
   change: '+2 this month',
   icon: Calendar,
   color: 'text-blue-600'
  },
  {
   title: 'Goals Achieved',
   value: '8',
   change: '+3 this week',
   icon: Target,
   color: 'text-green-600'
  },
  {
   title: 'Progress Score',
   value: '85%',
   change: '+5% this month',
   icon: TrendingUp,
   color: 'text-purple-600'
  }
 ]

 return (
  <PageContainer>
   <PageHeader
    title={welcomeMessage}
    description="Personalized tools, tracking, and professional support"
    badge="Wellness"
   />
    <SurfacePanel className="relative overflow-hidden py-12 sm:py-16">
     
     <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
      <div className="mx-auto max-w-3xl text-center space-y-8">
       <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border px-4 py-2">
         <Sparkles className="h-4 w-4 text-primary" />
         <span className="text-sm font-medium text-muted-foreground">Your Wellness Journey</span>
        </div>
       </div>
       
       <div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
         {welcomeMessage}
        </h1>
       </div>
       
       <div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
         Take control of your mental wellness with personalized tools, progress tracking, 
         and professional support tailored to your needs.
        </p>
       </div>
      </div>
     </div>
    </SurfacePanel>

    <SurfacePanel className="py-16">
     <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <motion.div 
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5, delay: 0.3 }}
      >
       <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-foreground">
         Quick Actions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
         Access your most important wellness tools and features
        </p>
       </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       {quickActions.map((action, index) => (
        <motion.div
         key={action.title}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
         whileHover={{ y: -2, opacity: 0.95 }}
         className="group"
        >
         <Card className="h-full hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
           <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/20">
            <action.icon className="h-6 w-6 text-primary" />
           </div>
           <CardTitle className="text-lg font-semibold">{action.title}</CardTitle>
           <CardDescription className="text-sm">{action.description}</CardDescription>
          </CardHeader>
          <CardContent>
           <Button 
            variant="outline" 
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
            onClick={() => window.location.href = action.href}
           >
            Get Started
           </Button>
          </CardContent>
         </Card>
        </motion.div>
       ))}
      </div>
     </div>
    </SurfacePanel>

    <SurfacePanel className="py-16">
     <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5, delay: 0.8 }}
      >
       <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-foreground">
         Your Progress
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
         Track your wellness journey with real-time insights
        </p>
       </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {wellnessStats.map((stat, index) => (
        <motion.div
         key={stat.title}
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
         whileHover={{ y: -2, opacity: 0.95 }}
        >
         <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
           <div className="flex items-center justify-center mb-4">
            <stat.icon className="h-12 w-12 text-primary opacity-80" />
           </div>
           <div className="text-4xl font-bold text-foreground mb-2">
            {stat.value}
           </div>
           <h3 className="font-semibold text-foreground mb-1">{stat.title}</h3>
           <p className="text-sm text-muted-foreground">{stat.change}</p>
          </CardContent>
         </Card>
        </motion.div>
       ))}
      </div>
     </div>
    </SurfacePanel>

    <SurfacePanel className="py-20">
     <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5, delay: 1.2 }}
      >
       <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-6 text-foreground">
         Your Wellness Toolkit
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
         Discover powerful tools and resources designed to support your mental health journey
        </p>
       </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {[
        {
         icon: Brain,
         title: 'Mental Health Tracking',
         description: 'Monitor your mood patterns and emotional wellbeing with our comprehensive tracking tools.',
         color: 'from-blue-500 to-cyan-500'
        },
        {
         icon: Heart,
         title: 'Emotional Support',
         description: 'Connect with licensed therapists and access evidence-based therapeutic techniques.',
         color: 'from-red-500 to-pink-500'
        },
        {
         icon: Shield,
         title: 'Safe & Secure',
         description: 'Your privacy is our priority. All your data is encrypted and protected.',
         color: 'from-green-500 to-emerald-500'
        },
        {
         icon: Target,
         title: 'Goal Setting',
         description: 'Set and track personal wellness goals with our structured approach.',
         color: 'from-purple-500 to-indigo-500'
        },
        {
         icon: Zap,
         title: 'Quick Insights',
         description: 'Get personalized recommendations based on your progress and patterns.',
         color: 'from-yellow-500 to-orange-500'
        },
        {
         icon: Sparkles,
         title: 'Mindfulness Tools',
         description: 'Access guided meditations, breathing exercises, and relaxation techniques.',
         color: 'from-indigo-500 to-blue-500'
        }
       ].map((feature, index) => (
        <motion.div
         key={feature.title}
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
         whileHover={{ y: -5 }}
         className="group"
        >
         <div className="text-center p-8 rounded-2xl bg-card/50 dark:bg-primary/90/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-card/70 dark:hover:bg-primary/90/70 transition-all duration-300 group-hover:shadow-2xl">
          <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:opacity-90 transition-opacity shadow-lg`}>
           <feature.icon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
         </div>
        </motion.div>
       ))}
      </div>
     </div>
    </SurfacePanel>
  </PageContainer>
 )
}
