import { MorphingToaster } from '@/components/ui/morphing-toaster';
import { ThemeProvider } from '@/components/platform/providers/theme-provider';
import { LanguageProvider } from '@/context/LanguageContext';

/**
 * Platform Layout — Minimal wrapper
 *
 * This route group now only handles infrastructure & standalone pages:
 *   - Auth callbacks (callback, success, cancel)
 *   - API routes, webhooks, cron jobs
 *   - Legal / policy pages
 *   - Email routes, uploads, push
 *
 * All dashboard/admin/console pages live in `(dashboard)` with the
 * unified sidebar and permission-based navigation.
 */
export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <MorphingToaster />
      </ThemeProvider>
    </LanguageProvider>
  );
}
