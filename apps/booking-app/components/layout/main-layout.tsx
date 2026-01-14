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

  if (isMinimal) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {header}
      <main className="flex-1 pt-24 md:pt-32 relative z-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      {footer}
    </div>
  );
}
