import React from 'react';

export default function WebAppFeatures() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Web Application Features</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        The Web Application (`apps/web`) is the main SaaS platform built with Next.js 14 App Router.
        It provides a comprehensive suite of tools for mental health and wellness.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            title="Authentication"
            description="Secure login, signup, password reset, and onboarding flows using Supabase Auth."
          />
          <FeatureCard
            title="Dashboard"
            description="Central hub for users to view their progress, upcoming sessions, and quick actions."
          />
          <FeatureCard
            title="AI Insights"
            description="Personalized insights driven by AI analysis of user data and journal entries."
          />
          <FeatureCard
            title="Journaling"
            description="Digital journal for users to record thoughts, feelings, and experiences."
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Community & Social</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            title="Community"
            description="Forums and groups for users to connect and share experiences."
          />
          <FeatureCard
            title="Messages"
            description="Direct messaging system for communication between users and therapists."
          />
          <FeatureCard
            title="Blog"
            description="Content platform for articles and resources on mental health."
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Therapy & Professional Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            title="Therapist Finder"
            description="Directory to find and connect with licensed therapists."
          />
          <FeatureCard
            title="Sessions"
            description="Management of therapy sessions, including scheduling and history."
          />
          <FeatureCard
            title="Progress Reports"
            description="Detailed reports on user progress over time."
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Monetization & Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            title="Subscriptions"
            description="Management of user subscriptions and billing."
          />
          <FeatureCard
            title="Donations"
            description="Platform for donation plans and seekers."
          />
          <FeatureCard
            title="Wallet"
            description="Digital wallet for managing credits and payments."
          />
          <FeatureCard
            title="Loyalty"
            description="Rewards program for user engagement."
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Tools & Utilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            title="Goals"
            description="Goal setting and tracking features."
          />
          <FeatureCard
            title="Forms"
            description="Custom forms for assessments and feedback."
          />
          <FeatureCard
            title="Verificator"
            description="Identity and credential verification tools."
          />
          <FeatureCard
            title="Console"
            description="Admin or power-user console for management."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
