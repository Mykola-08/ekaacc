'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Heart, Shield, Zap } from 'lucide-react'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { BlurIn } from '@/components/magicui/blur-in'

export default function HomePage() {
  const { isAuthenticated, user } = useSimpleAuth()

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatedGradientText className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Welcome back!
              </AnimatedGradientText>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Welcome to EKA Account
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Hello, {user?.profile.full_name || user?.email}!
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-4"
            >
              <Button asChild size="lg" className="min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedGradientText className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Wellness Platform
            </AnimatedGradientText>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <BlurIn className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Welcome to EKA Account
            </BlurIn>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The central hub for your EKA ecosystem. Track your wellness journey with AI-powered insights and personalized guidance.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Button asChild size="lg" className="min-w-[160px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[160px] border-purple-200 hover:bg-purple-50">
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
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Why Choose EKA?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple tools for meaningful growth
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Heart,
              title: 'Mood Tracking',
              description: 'Simple, quick mood logging that fits your daily routine.',
            },
            {
              icon: Sparkles,
              title: 'AI Insights',
              description: 'Personalized recommendations based on your patterns.',
            },
            {
              icon: Shield,
              title: 'Private & Secure',
              description: 'Your data stays yours with end-to-end encryption.',
            },
            {
              icon: Zap,
              title: 'Quick Actions',
              description: 'Fast access to tools that support your wellness.',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="border-muted hover:border-purple-300 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-100">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
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
    </div>
  )
}
