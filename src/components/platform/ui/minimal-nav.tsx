import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/platform/utils/css-utils';
import { Button } from '@/components/platform/ui/button';

export interface MinimalNavProps {
  logo?: React.ReactNode;
  logoText?: string;
  items?: NavItem[];
  userMenu?: boolean;
  className?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

const MinimalNav = React.forwardRef<HTMLElement, MinimalNavProps>(
  ({ className, logo, logoText = 'App', items = [], userMenu = false, ...props }, ref) => {
    return (
      <nav className={cn('bg-card border-border border-b', className)} ref={ref} {...props}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              {logo || <span className="text-foreground text-xl font-semibold">{logoText}</span>}
            </Link>

            {/* Navigation Items */}
            <div className="hidden items-center space-x-8 md:flex">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href || '#'}
                  onClick={item.onClick}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    item.active
                      ? 'text-primary border-primary border-b-2 pb-1'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            {userMenu && (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium"
                >
                  Sign In
                </Button>
                <Link
                  href="/login?tab=signup"
                  className="rounded-base bg-primary hover:bg-primary-hover inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }
);

MinimalNav.displayName = 'MinimalNav';

export { MinimalNav };
