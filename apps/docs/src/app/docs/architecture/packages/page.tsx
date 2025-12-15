import React from 'react';

export default function PackagesArchitecture() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shared Packages</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        The monorepo utilizes a set of shared packages to promote code reuse, consistency, and modularity across applications.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">packages/shared-ui</h2>
        <div className="p-4 border rounded-lg bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Contains the shared UI component library, built with <strong>shadcn/ui</strong> and <strong>Tailwind CSS</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
            <li>Ensures design consistency across `apps/web` and `apps/booking-app`.</li>
            <li>Exports accessible, composable components (e.g., Button, Dialog, Form).</li>
            <li>Manages shared Tailwind configuration and design tokens.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">packages/ai-services</h2>
        <div className="p-4 border rounded-lg bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Encapsulates logic for interacting with AI providers like OpenAI, Anthropic, and Google.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
            <li>Provides a unified interface for AI operations (e.g., text generation, analysis).</li>
            <li>Manages API keys and model configurations centrally.</li>
            <li>Used by `apps/web` for features like AI Insights and Journal analysis.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">packages/shared</h2>
        <div className="p-4 border rounded-lg bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Houses common utilities, types, and constants used throughout the monorepo.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
            <li>Shared TypeScript interfaces and Zod schemas.</li>
            <li>Utility functions for date formatting, string manipulation, etc.</li>
            <li>Common constants and configuration values.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">packages/performance-utils</h2>
        <div className="p-4 border rounded-lg bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Tools for monitoring and optimizing application performance.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
            <li>Utilities for logging and metrics collection.</li>
            <li>Helpers for performance testing and benchmarking.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
