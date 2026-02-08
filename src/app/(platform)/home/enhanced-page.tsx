'use client';

import React from 'react';

import {
  Sparkles,
  Heart,
  Brain,
  Shield,
  Zap,
  Calendar,
  Target,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { PageContainer } from '@/components/platform/eka/page-container';
import { PageHeader } from '@/components/platform/eka/page-header';
import { SurfacePanel } from '@/components/platform/eka/surface-panel';
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/platform/ui/avatar';
import { motion } from 'framer-motion';

export default function PatientDashboardPage() {
  const { user } = useSimpleAuth();

  const welcomeMessage = user?.profile?.full_name
    ? `Welcome back, ${user.profile.full_name}!`
    : 'Welcome to your wellness journey!';

  const quickActions = [
    {
      title: 'Book Session',
      description: 'Schedule your next therapy session',
      icon: Calendar,
      href: '/sessions/booking',
      color: 'bg-blue-500',
    },
    {
      title: 'View Progress',
      description: 'Check your wellness progress',
      icon: TrendingUp,
      href: '/progress',
      color: 'bg-green-500',
    },
    {
      title: 'Set Goals',
      description: 'Define your wellness objectives',
      icon: Target,
      href: '/goals',
      color: 'bg-purple-500',
    },
    {
      title: 'Messages',
      description: 'Communicate with your therapist',
      icon: MessageSquare,
      href: '/messages',
      color: 'bg-orange-500',
    },
  ];

  const wellnessStats = [
    {
      title: 'Sessions Completed',
      value: '12',
      change: '+2 this month',
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'Goals Achieved',
      value: '8',
      change: '+3 this week',
      icon: Target,
      color: 'text-green-600',
    },
    {
      title: 'Progress Score',
      value: '85%',
      change: '+5% this month',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={welcomeMessage}
        description="Personalized tools, tracking, and professional support"
        badge="Wellness"
      />
      <SurfacePanel className="relative overflow-hidden py-12 sm:py-16">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <div>
              <div className="bg-secondary/50 border-border inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                <Sparkles className="text-primary h-4 w-4" />
                <span className="text-muted-foreground text-sm font-medium">
                  Your Wellness Journey
                </span>
              </div>
            </div>

            <div>
              <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
                {welcomeMessage}
              </h1>
            </div>

            <div>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed">
                Take control of your mental wellness with personalized tools, progress tracking, and
                professional support tailored to your needs.
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
            <div className="mb-12 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold">Quick Actions</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Access your most important wellness tools and features
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -2, opacity: 0.95 }}
                className="group"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                      <action.icon className="text-primary h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{action.title}</CardTitle>
                    <CardDescription className="text-sm">{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="group-hover:bg-primary group-hover:text-primary-foreground w-full transition-all duration-300"
                      onClick={() => (window.location.href = action.href)}
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
            <div className="mb-12 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold">Your Progress</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Track your wellness journey with real-time insights
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {wellnessStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -2, opacity: 0.95 }}
              >
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex items-center justify-center">
                      <stat.icon className="text-primary h-12 w-12 opacity-80" />
                    </div>
                    <div className="text-foreground mb-2 text-4xl font-bold">{stat.value}</div>
                    <h3 className="text-foreground mb-1 font-semibold">{stat.title}</h3>
                    <p className="text-muted-foreground text-sm">{stat.change}</p>
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
            <div className="mb-16 text-center">
              <h2 className="text-foreground mb-6 text-4xl font-bold">Your Wellness Toolkit</h2>
              <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed">
                Discover powerful tools and resources designed to support your mental health journey
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                title: 'Mental Health Tracking',
                description:
                  'Monitor your mood patterns and emotional wellbeing with our comprehensive tracking tools.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Heart,
                title: 'Emotional Support',
                description:
                  'Connect with licensed therapists and access evidence-based therapeutic techniques.',
                color: 'from-red-500 to-pink-500',
              },
              {
                icon: Shield,
                title: 'Safe & Secure',
                description:
                  'Your privacy is our priority. All your data is encrypted and protected.',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Target,
                title: 'Goal Setting',
                description: 'Set and track personal wellness goals with our structured approach.',
                color: 'from-purple-500 to-indigo-500',
              },
              {
                icon: Zap,
                title: 'Quick Insights',
                description:
                  'Get personalized recommendations based on your progress and patterns.',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: Sparkles,
                title: 'Mindfulness Tools',
                description:
                  'Access guided meditations, breathing exercises, and relaxation techniques.',
                color: 'from-indigo-500 to-blue-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-card/50 dark:bg-primary/90/50 hover:bg-card/70 dark:hover:bg-primary/90/70 rounded-2xl border border-white/20 p-8 text-center backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl dark:border-slate-700/50">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-linear-to-br ${feature.color} mx-auto mb-6 flex items-center justify-center shadow-lg transition-opacity group-hover:opacity-90`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-foreground mb-3 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SurfacePanel>
    </PageContainer>
  );
}
