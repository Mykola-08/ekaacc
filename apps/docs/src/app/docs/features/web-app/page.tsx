import React from 'react';
import { RoleProtected } from '@/components/RoleProtected';

export default function WebAppFeatures() {
  return (
    <div className="space-y-6">
      <RoleProtected allowedRoles={['guest', 'user', 'staff', 'admin', 'developer']}>
        <div>
          <h1 className="text-3xl font-bold">Web Application Features</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The Web Application is the main SaaS platform, providing tools for mental health and wellness.
          </p>
        </div>
      </RoleProtected>

      <RoleProtected allowedRoles={['user', 'staff', 'admin', 'developer']}>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              title="Authentication"
              description="Secure login, signup, password reset, and onboarding flows."
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
      </RoleProtected>

      <RoleProtected allowedRoles={['user', 'staff', 'admin', 'developer']}>
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
      </RoleProtected>

      <RoleProtected allowedRoles={['developer', 'admin']}>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Technical Architecture</h2>
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
            <h3 className="text-xl font-medium mb-2">Next.js App Router</h3>
            <p className="mb-2">Built with Next.js 14, utilizing Server Components for performance and SEO.</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li><strong>State Management:</strong> Zustand for global client state.</li>
              <li><strong>Styling:</strong> Tailwind CSS with shadcn/ui components.</li>
              <li><strong>Data Fetching:</strong> Server Actions and Supabase Client.</li>
            </ul>
          </div>
        </section>
      </RoleProtected>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow dark:border-zinc-700">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
