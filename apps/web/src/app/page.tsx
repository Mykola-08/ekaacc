'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sparkles, Heart, Shield, Zap, Brain, Users, BookOpen, TrendingUp, Calendar, MessageSquare, Target, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { PageContainer } from '@/components/eka/page-container'
import { SurfacePanel } from '@/components/eka/surface-panel'
const MedicalDisclaimer = dynamic(() => import('@/components/medical-disclaimer'), { ssr: false })

export default function HomePage() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()

  // Auto-redirect authenticated users to home/dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has completed onboarding
      if (!user.personalizationCompleted) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return (
      <PageContainer>
        <SurfacePanel className="flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
          </div>
        </SurfacePanel>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <SurfacePanel>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Wellness Platform
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Your Complete Wellness
              <span className="block text-primary">Management Platform</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              EKA Account is your centralized wellness platform combining therapy management, 
              mood tracking, AI-powered insights, and personalized health guidance all in one place. 
              Track progress, connect with therapists, and transform your mental and physical wellbeing.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Button asChild size="lg">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">
                Create Account
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need for Wellness
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools designed to support your mental and physical health journey
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Brain,
              title: 'AI-Powered Insights',
              description: 'Get personalized recommendations and insights based on your wellness patterns and progress.',
            },
            {
              icon: Users,
              title: 'Therapist Connect',
              description: 'Book sessions, manage appointments, and communicate with licensed therapists seamlessly.',
            },
            {
              icon: Heart,
              title: 'Mood & Progress Tracking',
              description: 'Log daily moods, track wellness goals, and visualize your journey with intuitive charts.',
            },
            {
              icon: BookOpen,
              title: 'Digital Journaling',
              description: 'Private, secure journaling space to reflect on thoughts, feelings, and daily experiences.',
            },
            {
              icon: TrendingUp,
              title: 'Goal Management',
              description: 'Set wellness goals, track milestones, and celebrate achievements along your journey.',
            },
            {
              icon: Calendar,
              title: 'Session Scheduling',
              description: 'Easy appointment booking with automated reminders and calendar integration.',
            },
            {
              icon: MessageSquare,
              title: 'Secure Messaging',
              description: 'Communicate privately with your care team through encrypted messaging.',
            },
            {
              icon: Shield,
              title: 'Privacy First',
              description: 'Bank-level encryption and HIPAA compliance ensure your data stays private and secure.',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4, opacity: 0.95 }}
            >
              <Card className="border-muted hover:border-border transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with your wellness journey in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Account',
                description: 'Sign up in seconds with email or social login. Complete a quick personalization survey to tailor your experience.',
                icon: Users,
              },
              {
                step: '2',
                title: 'Set Your Goals',
                description: 'Define wellness objectives, connect with therapists, and configure your tracking preferences.',
                icon: Target,
              },
              {
                step: '3',
                title: 'Track & Improve',
                description: 'Log daily moods, attend sessions, get AI insights, and watch your progress grow over time.',
                icon: Award,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="relative h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <item.icon className="h-16 w-16 text-muted-foreground/20" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader className="space-y-4 pb-8 pt-12">
              <div className="inline-flex items-center justify-center">
                <Badge variant="secondary" className="px-4 py-1">
                  <Sparkles className="w-3 h-3 mr-2" />
                  Start Your Wellness Journey Today
                </Badge>
              </div>
              <CardTitle className="text-3xl sm:text-4xl font-bold">
                Ready to Transform Your Wellbeing?
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Join thousands of users already improving their mental and physical health with EKA Account
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-base">
                  <Link href="/signup">
                    Get Started Free
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • Free forever plan available
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </SurfacePanel>
    </PageContainer>
  )
}
