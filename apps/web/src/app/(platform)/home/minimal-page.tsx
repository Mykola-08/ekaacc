'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/platform/ui/button'
import { Card } from '@/components/platform/ui/card'
import { useAuth } from '@/context/platform/auth-context'
import { ArrowRight } from 'lucide-react'

export default function MinimalHomePage() {
 const { user } = useAuth()
 
 const features = [
  {
   title: 'Therapy Sessions',
   description: 'Book and manage your therapy sessions with qualified professionals.',
   href: '/sessions'
  },
  {
   title: 'Progress Tracking',
   description: 'Monitor your mental health journey with comprehensive progress reports.',
   href: '/progress'
  },
  {
   title: 'Personal Journal',
   description: 'Document your thoughts and feelings in a secure, private space.',
   href: '/journal'
  },
  {
   title: 'AI Insights',
   description: 'Get personalized insights and recommendations based on your data.',
   href: '/ai-insights'
  }
 ]
 
 const stats = [
  { label: 'Active Users', value: '10,000+' },
  { label: 'Therapists', value: '500+' },
  { label: 'Sessions Completed', value: '50,000+' },
  { label: 'Success Rate', value: '94%' }
 ]
 
 return (
  <div className="min-h-screen bg-muted/30 dark:bg-gray-900">
   {/* Hero Section */}
   <div className="text-center space-y-8 mb-16">
    <h1 className="text-4xl md:text-5xl font-bold text-foreground">
     Professional Therapy Platform
    </h1>
    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
     Connect with licensed therapists, track your progress, and improve your mental health with evidence-based tools and support.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
     {user ? (
      <Link href="/dashboard">
       <Button size="lg">
        Go to Dashboard
       </Button>
      </Link>
     ) : (
      <>
       <Link href="/login">
        <Button size="lg">
         Get Started
        </Button>
       </Link>
       <Link href="/therapists">
        <Button size="lg" variant="outline">
         Find a Therapist
        </Button>
       </Link>
      </>
     )}
    </div>
   </div>
   
   {/* Features Section */}
   <div className="mb-16">
    <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Platform Features</h2>
    <div className="grid gap-6 md:grid-cols-2">
     {features.map((feature, index) => (
      <Link key={index} href={feature.href}>
       <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
       </Card>
      </Link>
     ))}
    </div>
   </div>
   
   {/* Stats Section */}
   <div className="mb-16">
    <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Platform Statistics</h2>
    <div className="grid gap-4 md:grid-cols-4">
     {stats.map((stat, index) => (
      <Card key={index} className="p-6 text-center border">
       <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
       <div className="text-sm text-muted-foreground">{stat.label}</div>
      </Card>
     ))}
    </div>
   </div>
   
   {/* CTA Section */}
   <div className="text-center space-y-6 bg-muted rounded-2xl p-8">
    <h2 className="text-2xl font-bold text-foreground">
     Ready to Start Your Journey?
    </h2>
    <p className="text-muted-foreground">
     Take the first step towards better mental health today.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
     {user ? (
      <Link href="/dashboard">
       <Button size="lg">
        Access Dashboard
       </Button>
      </Link>
     ) : (
      <Link href="/login">
       <Button size="lg">
        Sign Up Now
       </Button>
      </Link>
     )}
    </div>
   </div>
  </div>
 )
}