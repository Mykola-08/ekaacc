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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="eka-container eka-section-spacing">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Wellness Platform
            </Badge>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Your Complete Wellness
              <span className="block text-primary mt-2">Management Platform</span>
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
            <Button asChild size="lg" className="eka-transition">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="eka-transition">
              <Link href="/signup">
                Create Account
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="eka-container eka-section-spacing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eka-page-header text-center"
        >
          <h2 className="eka-page-title">
            Everything You Need for Wellness
          </h2>
          <p className="eka-page-description text-lg max-w-2xl mx-auto">
            Comprehensive tools designed to support your mental and physical health journey
          </p>
        </motion.div>
        
        <div className="eka-grid-4">
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
              whileHover={{ scale: 1.02 }}
              className="eka-transition"
            >
              <Card className="eka-card-hover h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 eka-transition group-hover:bg-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-muted/30 eka-section-spacing">
        <div className="eka-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="eka-page-header text-center"
          >
            <h2 className="eka-page-title">
              How It Works
            </h2>
            <p className="eka-page-description text-lg max-w-2xl mx-auto">
              Get started with your wellness journey in three simple steps
            </p>
          </motion.div>

          <div className="eka-grid-3">
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
                <Card className="eka-card-elevated h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center opacity-20">
                      <item.icon className="h-20 w-20 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="eka-container eka-section-spacing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <Card className="eka-card-elevated border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
            <CardHeader className="space-y-4 pb-8 pt-12">
              <div className="inline-flex items-center justify-center">
                <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
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
                <Button asChild size="lg" className="text-base eka-transition">
                  <Link href="/signup">
                    Get Started Free
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base eka-transition">
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
    </div>
  )
}
