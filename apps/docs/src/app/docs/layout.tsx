import Link from 'next/link';
import { RoleSelector } from '@/components/RoleSelector';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-50 dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Documentation</h2>
          <nav className="space-y-2">
            <div className="pb-2">
              <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">General</h3>
              <Link href="/docs/getting-started" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
                Getting Started
              </Link>
              <Link href="/docs/tutorials" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
                Tutorials
              </Link>
              <Link href="/docs/faq" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
                FAQ
              </Link>
            </div>

            <div className="pb-2">
              <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Features</h3>
              <Link href="/docs/features/web-app" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
                Web App
              </Link>
              <Link href="/docs/features/booking-app" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
                Booking App
              </Link>
            </div>

            <div className="pb-2">
              <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Architecture</h3>
              <Link href="/docs/architecture/api" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
                API Service
              </Link>
              <Link href="/docs/architecture/packages" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
                Shared Packages
              </Link>
              <Link href="/docs/api-reference" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
                API Reference
              </Link>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-zinc-800">
              <Link href="/" className="block px-4 py-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
                &larr; Back to Home
              </Link>
            </div>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <RoleSelector />
          <div className="prose dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
