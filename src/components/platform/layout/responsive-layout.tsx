'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/platform/utils/css-utils';
import { MobileNavigation } from '@/components/platform/navigation/mobile-navigation';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
  showMobileNav?: boolean;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function ResponsiveLayout({
  children,
  className,
  showMobileNav = true,
  breakpoint = 'md',
}: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkMobile = () => {
      const breakpoints = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      };
      setIsMobile(window.innerWidth < breakpoints[breakpoint]);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto p-4">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn('min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50', className)}
    >
      {/* Desktop/Tablet Layout */}
      <div className="hidden md:block">
        <div className="p-responsive container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key="desktop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div
          className={cn(
            'min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50',
            'pb-20' // Space for bottom navigation
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key="mobile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className="w-full"
            >
              <div className="px-4 py-6">{children}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {showMobileNav && <MobileNavigation />}
      </div>
    </div>
  );
}

// Responsive Container Component
export function ResponsiveContainer({
  children,
  className,
  maxWidth = '7xl',
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        {
          'max-w-sm': maxWidth === 'sm',
          'max-w-md': maxWidth === 'md',
          'max-w-lg': maxWidth === 'lg',
          'max-w-xl': maxWidth === 'xl',
          'max-w-2xl': maxWidth === '2xl',
          'max-w-3xl': maxWidth === '3xl',
          'max-w-4xl': maxWidth === '4xl',
          'max-w-5xl': maxWidth === '5xl',
          'max-w-6xl': maxWidth === '6xl',
          'max-w-7xl': maxWidth === '7xl',
        },
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive Grid Component
export function ResponsiveGrid({
  children,
  className,
  cols = { base: 1, sm: 2, md: 3, lg: 4 },
  gap = '4',
}: {
  children: ReactNode;
  className?: string;
  cols?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: string;
}) {
  return (
    <div
      className={cn(
        'grid',
        {
          'gap-2': gap === '2',
          'gap-3': gap === '3',
          'gap-4': gap === '4',
          'gap-6': gap === '6',
          'gap-8': gap === '8',
        },
        {
          'grid-cols-1': cols.base === 1,
          'grid-cols-2': cols.base === 2,
          'grid-cols-3': cols.base === 3,
          'grid-cols-4': cols.base === 4,
          'sm:grid-cols-1': cols.sm === 1,
          'sm:grid-cols-2': cols.sm === 2,
          'sm:grid-cols-3': cols.sm === 3,
          'sm:grid-cols-4': cols.sm === 4,
          'md:grid-cols-1': cols.md === 1,
          'md:grid-cols-2': cols.md === 2,
          'md:grid-cols-3': cols.md === 3,
          'md:grid-cols-4': cols.md === 4,
          'lg:grid-cols-1': cols.lg === 1,
          'lg:grid-cols-2': cols.lg === 2,
          'lg:grid-cols-3': cols.lg === 3,
          'lg:grid-cols-4': cols.lg === 4,
          'xl:grid-cols-1': cols.xl === 1,
          'xl:grid-cols-2': cols.xl === 2,
          'xl:grid-cols-3': cols.xl === 3,
          'xl:grid-cols-4': cols.xl === 4,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive Card Component
export function ResponsiveCard({
  children,
  className,
  padding = 'responsive',
  variant = 'default',
}: {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'responsive' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    responsive: 'p-4 sm:p-6 md:p-8',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-card shadow-lg rounded-xl border border-border',
    elevated: 'bg-card shadow-2xl rounded-2xl border border-gray-100',
    outlined: 'bg-transparent border-2 border-gray-300 rounded-xl',
    ghost: 'bg-transparent border-none rounded-xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(variantClasses[variant], paddingClasses[padding], className)}
    >
      {children}
    </motion.div>
  );
}

// Responsive Button Component
export function ResponsiveButton({
  children,
  className,
  size = 'responsive',
  variant = 'default',
  fullWidth = false,
  ...props
}: {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'responsive' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'elevated';
  fullWidth?: boolean;
  [key: string]: any;
}) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    responsive: 'px-4 py-3 text-sm sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-4 md:text-lg',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    default:
      'bg-linear-to-r from-primary to-purple-600 text-white hover:shadow-lg transition-all duration-200',
    outline:
      'border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200',
    ghost: 'bg-transparent text-primary hover:bg-primary/10 transition-all duration-200',
    elevated:
      'bg-card text-foreground shadow-lg hover:shadow-xl border border-border transition-all duration-200',
  };

  return (
    <motion.button
      whileHover={{ y: -2, opacity: 0.95 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'focus:ring-primary rounded-lg font-semibold focus:ring-2 focus:ring-offset-2 focus:outline-none',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth ? 'w-full' : 'inline-flex items-center justify-center',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
