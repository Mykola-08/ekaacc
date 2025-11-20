import React from 'react';
import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cookies Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit a website. They help us remember your preferences, keep you signed in, and improve the performance and security of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
          <ul>
            <li><strong>Strictly Necessary:</strong> required for core functionality (session management, security, load balancing).</li>
            <li><strong>Preferences:</strong> remember your settings (theme, language, privacy choices).</li>
            <li><strong>Analytics:</strong> help us understand how the Service is used to improve features and performance.</li>
            <li><strong>Functional:</strong> enhance features like chat, media, or personalization.</li>
            <li><strong>Marketing (if applicable):</strong> measure campaigns and show relevant content. We minimize marketing cookies by default.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
          <p>
            We may use third-party service providers (e.g., analytics, performance monitoring, customer support tools). These providers may set cookies to deliver their services. Please review their privacy and cookies policies for details.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Your Choices</h2>
          <p>
            You can manage your cookie preferences in your browser settings or via our <Link className="underline" href="/privacy-controls">Privacy Controls</Link>. Disabling certain cookies may impact functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Do Not Track</h2>
          <p>
            Some browsers offer a “Do Not Track” (DNT) setting. Because no common industry standard is adopted, we may not respond to DNT signals. We continue to review updates in this area.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Changes to this Policy</h2>
          <p>
            We may update this Cookies Policy from time to time. We will post updates on this page with a revised “Last updated” date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
          <p>
            Questions about this policy? Contact <a className="underline" href="mailto:support@ekabalance.com">support@ekabalance.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
