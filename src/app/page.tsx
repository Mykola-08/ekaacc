'use client'

import Link from 'next/link'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Heart, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated, user } = useSimpleAuth()

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Welcome back!
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Welcome to EKA Account
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hello, {user?.profile.full_name || user?.email}!
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Wellness Platform
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Welcome to EKA Account
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The central hub for your EKA ecosystem. Track your wellness journey with AI-powered insights and personalized guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button asChild size="lg" className="min-w-[160px]">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[160px]">
              <Link href="/signup">
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose EKA?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple tools for meaningful growth
          </p>
        </div>
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
          ].map((feature) => (
            <Card key={feature.title} className="border-muted hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
