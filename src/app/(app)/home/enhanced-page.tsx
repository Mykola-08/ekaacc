'use client'

import { Sparkles, Heart, Brain, Shield, Zap, Calendar, Target, MessageSquare, TrendingUp } from 'lucide-react'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { NumberTicker } from '@/components/ui/number-ticker'
import { BlurIn } from '@/components/ui/blur-in'
import { motion } from 'framer-motion'

export default function PatientDashboardPage() {
  const { user } = useSimpleAuth()

  const welcomeMessage = user?.profile.full_name 
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
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
        {/* Enhanced Hero Section with AceternityUI */}
        <section className="relative overflow-hidden py-16 sm:py-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="mx-auto max-w-3xl text-center space-y-8">
              <BlurIn>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 px-4 py-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-muted-foreground">Your Wellness Journey</span>
                </div>
              </BlurIn>
              
              <BlurIn delay={0.1}>
                <AnimatedGradientText className="text-5xl md:text-6xl font-bold leading-tight">
                  {welcomeMessage}
                </AnimatedGradientText>
              </BlurIn>
              
              <BlurIn delay={0.2}>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Take control of your mental wellness with personalized tools, progress tracking, 
                  and professional support tailored to your needs.
                </p>
              </BlurIn>
            </div>
          </div>
        </section>

        {/* Enhanced Quick Actions with shadcn blocks */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <BlurIn delay={0.3}>
              <div className="text-center mb-12">
                <AnimatedGradientText className="text-3xl font-bold mb-4">
                  Quick Actions
                </AnimatedGradientText>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Access your most important wellness tools and features
                </p>
              </div>
            </BlurIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm group-hover:bg-white/80 dark:group-hover:bg-slate-800/80">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg font-semibold">{action.title}</CardTitle>
                      <CardDescription className="text-sm">{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 border-2 group-hover:border-0 group-hover:shadow-lg"
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
        </section>

        {/* Enhanced Wellness Stats with NumberTicker */}
        <section className="py-16 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <BlurIn delay={0.8}>
              <div className="text-center mb-12">
                <AnimatedGradientText className="text-3xl font-bold mb-4">
                  Your Progress
                </AnimatedGradientText>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Track your wellness journey with real-time insights
                </p>
              </div>
            </BlurIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wellnessStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <stat.icon className={`h-12 w-12 ${stat.color} opacity-80`} />
                      </div>
                      <div className="text-4xl font-bold text-foreground mb-2">
                        <NumberTicker value={parseInt(stat.value)} />
                        {stat.value.includes('%') && '%'}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{stat.title}</h3>
                      <p className="text-sm text-muted-foreground">{stat.change}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Wellness Features */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <BlurIn delay={1.2}>
              <div className="text-center mb-16">
                <AnimatedGradientText className="text-4xl font-bold mb-6">
                  Your Wellness Toolkit
                </AnimatedGradientText>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Discover powerful tools and resources designed to support your mental health journey
                </p>
              </div>
            </BlurIn>
            
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
                  <div className="text-center p-8 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300 group-hover:shadow-2xl">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}