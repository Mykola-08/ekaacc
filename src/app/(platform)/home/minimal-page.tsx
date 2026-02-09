'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/platform/auth-context';
import { ArrowRight } from 'lucide-react';

export default function MinimalHomePage() {
  const { user } = useAuth();

  const features = [
    {
      title: 'Therapy Sessions',
      description: 'Book and manage your therapy sessions with qualified professionals.',
      href: '/sessions',
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your mental health journey with comprehensive progress reports.',
      href: '/progress',
    },
    {
      title: 'Personal Journal',
      description: 'Document your thoughts and feelings in a secure, private space.',
      href: '/journal',
    },
    {
      title: 'AI Insights',
      description: 'Get personalized insights and recommendations based on your data.',
      href: '/ai-insights',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Therapists', value: '500+' },
    { label: 'Sessions Completed', value: '50,000+' },
    { label: 'Success Rate', value: '94%' },
  ];

  return (
    <div className="bg-muted/30 min-h-screen dark:bg-foreground">
      {/* Hero Section */}
      <div className="mb-16 space-y-8 text-center">
        <h1 className="text-foreground text-4xl font-bold md:text-5xl">
          Professional Therapy Platform
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Connect with licensed therapists, track your progress, and improve your mental health with
          evidence-based tools and support.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button size="lg">Get Started</Button>
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
        <h2 className="text-foreground mb-8 text-center text-2xl font-bold">Platform Features</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card className="cursor-pointer p-6 transition-shadow hover:shadow-lg">
                <h3 className="text-foreground mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-16">
        <h2 className="text-foreground mb-8 text-center text-2xl font-bold">Platform Statistics</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border p-6 text-center">
              <div className="text-foreground mb-1 text-2xl font-bold">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted space-y-6 rounded-2xl p-8 text-center">
        <h2 className="text-foreground text-2xl font-bold">Ready to Start Your Journey?</h2>
        <p className="text-muted-foreground">
          Take the first step towards better mental health today.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg">Access Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg">Sign Up Now</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
