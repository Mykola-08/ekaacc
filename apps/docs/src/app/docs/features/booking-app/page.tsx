import React from 'react';
import { RoleProtected } from '@/components/RoleProtected';

export default function BookingAppFeatures() {
  return (
    <div className="space-y-6">
      <RoleProtected allowedRoles={['guest', 'user', 'staff', 'admin', 'developer']}>
        <div>
          <h1 className="text-3xl font-bold">Booking Application Features</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The Booking Application is designed to handle scheduling, payments, and service management efficiently.
          </p>
        </div>
      </RoleProtected>

      <RoleProtected allowedRoles={['developer', 'admin']}>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Architecture (Technical)</h2>
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
            <h3 className="text-xl font-medium mb-2">Layered Design</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li><strong>API Routes (`app/api/*`)</strong>: Minimal request parsing and response shaping.</li>
              <li><strong>Service Layer (`server/booking/*`)</strong>: Core business logic and database interactions.</li>
              <li><strong>Infrastructure (`lib/*`)</strong>: Clients, token management, and configuration.</li>
              <li><strong>Data Schema</strong>: Supabase SQL schema as the source of truth.</li>
            </ul>
          </div>
        </section>
      </RoleProtected>

      <RoleProtected allowedRoles={['user', 'staff', 'admin', 'developer']}>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              title="Booking Management"
              description="Full lifecycle management: Pending -> Captured -> Managed -> Completed/Canceled."
            />
            <FeatureCard
              title="Availability Engine"
              description="Dynamic slot generation based on staff schedules, buffers, and blackout windows."
            />
            <FeatureCard
              title="Payments"
              description="Integrated checkout flows with Stripe and Square, including refund handling."
            />
            <FeatureCard
              title="Service Catalog"
              description="Management of services, pricing, and variants."
            />
          </div>
        </section>
      </RoleProtected>

      <RoleProtected allowedRoles={['developer', 'admin']}>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              title="Stripe"
              description="Payment processing, webhooks, and refund management."
            />
            <FeatureCard
              title="Supabase"
              description="Database, Authentication, and Real-time subscriptions."
            />
            <FeatureCard
              title="Resend"
              description="Transactional emails for booking confirmations and updates."
            />
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
