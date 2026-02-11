'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="font-sans p-8 text-center bg-background text-foreground">
        <div>
          <h2 className="text-2xl font-semibold mb-4">404 - Page Not Found</h2>
          <p className="mb-6 text-muted-foreground">The page you are looking for does not exist.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold no-underline hover:bg-primary/90 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </body>
    </html>
  );
}
