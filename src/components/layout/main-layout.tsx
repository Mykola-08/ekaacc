'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface MainLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export function MainLayout({ children, header, footer }: MainLayoutProps) {
  const pathname = usePathname();
  const isMinimal = pathname?.startsWith('/telegram');

  // Routes that use the internal DashboardLayout (Sidebar) and shouldn't show the global SiteHeader/Footer
  const appRoutes = ['/dashboard', '/settings', '/finances', '/bookings', '/profile', '/resources', '/wellness'];
  const isAppRoute =
    appRoutes.includes(pathname) ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/settings') ||
    pathname?.startsWith('/bookings') ||
    pathname?.startsWith('/finances') ||
    pathname?.startsWith('/wellness') ||
    pathname?.startsWith('/profile') ||
    pathname?.startsWith('/resources');

  if (isMinimal) {
    return <main className="bg-background min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!isAppRoute && header}
      <main
        className={cn(
          'relative z-0 flex-1',
          !isAppRoute && 'pt-24 md:pt-32' // Only add padding if header is present
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
      {!isAppRoute && footer}
    </div>
  );
}
