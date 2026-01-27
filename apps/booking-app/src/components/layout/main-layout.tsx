'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export function MainLayout({ children, header, footer }: MainLayoutProps) {
  const pathname = usePathname();
  const isMinimal = pathname?.startsWith('/telegram');

  // Routes that use the internal DashboardLayout (Sidebar) and shouldn't show the global SiteHeader/Footer
  const appRoutes = ['/', '/settings', '/wallet', '/bookings', '/profile'];
  const isAppRoute = appRoutes.includes(pathname) || pathname?.startsWith('/dashboard');

  if (isMinimal) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isAppRoute && header}
      <main className={cn(
        "flex-1 relative z-0",
        !isAppRoute && "pt-24 md:pt-32" // Only add padding if header is present
      )}>
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
