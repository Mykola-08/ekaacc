'use client'

import * as React from 'react'
import Link from 'next/link'
import { MinimalButton, MinimalCard, MinimalLayout } from '@/components/ui/minimal-index'
import { useAuth } from '@/lib/supabase-auth'
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
    <MinimalLayout centered={false}>
      {/* Hero Section */}
      <div className="text-center space-y-8 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Professional Therapy Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with licensed therapists, track your progress, and improve your mental health with evidence-based tools and support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link href="/dashboard">
              <MinimalButton size="lg">
                Go to Dashboard
              </MinimalButton>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <MinimalButton size="lg" variant="primary">
                  Get Started
                </MinimalButton>
              </Link>
              <Link href="/therapists">
                <MinimalButton size="lg" variant="outline">
                  Find a Therapist
                </MinimalButton>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Platform Features</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <MinimalCard interactive={true} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </MinimalCard>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Platform Statistics</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <MinimalCard key={index} variant="outline" className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </MinimalCard>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="text-center space-y-6 bg-gray-100 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Ready to Start Your Journey?
        </h2>
        <p className="text-gray-600">
          Take the first step towards better mental health today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link href="/dashboard">
              <MinimalButton size="lg">
                Access Dashboard
              </MinimalButton>
            </Link>
          ) : (
            <Link href="/login">
              <MinimalButton size="lg" variant="primary">
                Sign Up Now
              </MinimalButton>
            </Link>
          )}
        </div>
      </div>
    </MinimalLayout>
  )
}