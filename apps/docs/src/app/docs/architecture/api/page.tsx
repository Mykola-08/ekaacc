import React from 'react';

export default function ApiArchitecture() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">API Architecture</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        The API Application (`apps/api`) serves as a backend service for specific integrations and general API needs.
        It is built with Next.js and deployed as serverless functions.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Core Responsibilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            title="Telegram Bot Integration"
            description="Handles webhooks from Telegram, processing user messages and commands."
          />
          <FeatureCard
            title="Health Checks"
            description="Provides endpoints for monitoring the health and status of the service."
          />
          <FeatureCard
            title="OpenAPI Specification"
            description="Exposes API documentation and schemas."
          />
          <FeatureCard
            title="User Context"
            description="Endpoints like `/me` for retrieving authenticated user information."
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Setup & Configuration</h2>
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <h3 className="text-xl font-medium mb-2">Environment Variables</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            The API requires specific environment variables for operation, particularly for Telegram and Supabase integration.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
            <li>`TELEGRAM_BOT_TOKEN`: Token for the Telegram Bot API.</li>
            <li>`SUPABASE_URL`: URL for the Supabase instance.</li>
            <li>`SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin access to Supabase.</li>
            <li>`WEBAPP_BASE_URL`: Base URL of the main web application.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Development</h2>
        <p className="text-gray-600 dark:text-gray-400">
          For local development, tools like `ngrok` are recommended to expose the local server for webhook testing.
          The API routes are designed to be stateless and scalable, fitting the serverless model of Vercel.
        </p>
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
