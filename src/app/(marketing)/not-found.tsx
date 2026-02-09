'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
        <div>
          <h2>404 - Page Not Found</h2>
          <p style={{ marginBottom: '1.5rem' }}>The page you are looking for does not exist.</p>
          <Link
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'hsl(var(--primary))',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              display: 'inline-block',
            }}
          >
            Go back home
          </Link>
        </div>
      </body>
    </html>
  );
}
