'use client'

import { Sparkles, Heart, Brain, Shield, Zap, Calendar, Target, MessageSquare, TrendingUp } from 'lucide-react'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-in fade-in duration-500">
                <Sparkles className="h-4 w-4" />
                Your Wellness Journey
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl animate-in fade-in duration-500 delay-100">
                {welcomeMessage}
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-muted-foreground animate-in fade-in duration-500 delay-200">
                Take control of your mental wellness with personalized tools, progress tracking, 
                and professional support tailored to your needs.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="animate-in fade-in duration-500 delay-300">
              <h2 className="text-2xl font-bold text-foreground mb-8">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <div
                    key={action.title}
                    className="animate-in fade-in duration-500 delay-400"
                    style={{ animationDelay: `${400 + index * 100}ms` }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
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
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          onClick={() => window.location.href = action.href}
                        >
                          Get Started
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Wellness Stats */}
        <section className="py-12 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="animate-in fade-in duration-500 delay-500">
              <h2 className="text-2xl font-bold text-foreground mb-8">Your Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wellnessStats.map((stat, index) => (
                  <div
                    key={stat.title}
                    className="animate-in fade-in duration-500"
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <stat.icon className={`h-8 w-8 ${stat.color}`} />
                          <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{stat.title}</h3>
                        <p className="text-sm text-muted-foreground">{stat.change}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Wellness Features */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="animate-in fade-in duration-500 delay-700 text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Your Wellness Toolkit</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover powerful tools and resources designed to support your mental health journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'Mental Health Tracking',
                  description: 'Monitor your mood patterns and emotional wellbeing with our comprehensive tracking tools.',
                  color: 'text-blue-600'
                },
                {
                  icon: Heart,
                  title: 'Emotional Support',
                  description: 'Connect with licensed therapists and access evidence-based therapeutic techniques.',
                  color: 'text-red-600'
                },
                {
                  icon: Shield,
                  title: 'Safe & Secure',
                  description: 'Your privacy is our priority. All your data is encrypted and protected.',
                  color: 'text-green-600'
                },
                {
                  icon: Target,
                  title: 'Goal Setting',
                  description: 'Set and track personal wellness goals with our structured approach.',
                  color: 'text-purple-600'
                },
                {
                  icon: Zap,
                  title: 'Quick Insights',
                  description: 'Get personalized recommendations based on your progress and patterns.',
                  color: 'text-yellow-600'
                },
                {
                  icon: Sparkles,
                  title: 'Mindfulness Tools',
                  description: 'Access guided meditations, breathing exercises, and relaxation techniques.',
                  color: 'text-indigo-600'
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="animate-in fade-in duration-500 text-center"
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <div className={`w-16 h-16 ${feature.color} bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}