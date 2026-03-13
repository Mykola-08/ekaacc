'use client';

import { useEffect } from 'react';

/**
 * Root-level global error boundary.
 * Catches unhandled errors at the top-most level of the entire application.
 * Must render its own <html> and <body> tags since it replaces the root layout.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root global error:', error);

    // Report to error logging endpoint
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message || error.toString(),
        stack: error.stack,
        digest: error.digest,
        level: 'fatal',
        context: { source: 'root.global-error' },
      }),
    }).catch(() => {
      // Silently fail — we're already in an error state
    });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'var(--font-geist-sans, system-ui, -apple-system, sans-serif)',
        }}
      >
        {/* Embed CSS variables so design tokens work even without the root layout */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          :root {
            --background: oklch(1 0 0);
            --foreground: oklch(0.145 0 0);
            --card: oklch(1 0 0);
            --card-foreground: oklch(0.145 0 0);
            --muted-foreground: oklch(0.556 0 0);
            --primary: oklch(0.205 0 0);
            --primary-foreground: oklch(0.985 0 0);
            --border: oklch(0.922 0 0);
            --radius: 0.625rem;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --background: oklch(0.145 0 0);
              --foreground: oklch(0.985 0 0);
              --card: oklch(0.205 0 0);
              --card-foreground: oklch(0.985 0 0);
              --muted-foreground: oklch(0.708 0 0);
              --primary: oklch(0.87 0 0);
              --primary-foreground: oklch(0.205 0 0);
              --border: oklch(1 0 0 / 10%);
            }
          }
        `,
          }}
        />
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
          }}
        >
          <div
            style={{
              maxWidth: '28rem',
              width: '100%',
              textAlign: 'center',
              padding: '3rem 2rem',
              backgroundColor: 'var(--card)',
              color: 'var(--card-foreground)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: 'var(--foreground)',
              }}
            >
              Application Error
            </h1>
            <p
              style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', lineHeight: 1.6 }}
            >
              Something went wrong. We apologize for the inconvenience.
            </p>
            {error.digest && (
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: '0.75rem',
                  marginBottom: '1.5rem',
                  opacity: 0.7,
                }}
              >
                Reference: {error.digest}
              </p>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  border: 'none',
                  borderRadius: 'calc(var(--radius) - 2px)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'calc(var(--radius) - 2px)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
