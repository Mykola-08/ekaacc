'use client';

import { Button } from '@/components/platform/ui/button';
import Image from 'next/image';
import { Input } from '@/components/platform/ui/input';
import { Search, Menu, X } from 'lucide-react';
import { UserNav } from './user-nav';
import { NotificationCenter } from './notification-center';
import { useAuth } from '@/lib/platform/supabase-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useSidebar, SidebarTrigger } from '@/components/platform/ui/sidebar';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/platform/utils';

export function AppHeader() {
  const { setOpenMobile } = useSidebar();
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/sessions', label: 'Sessions' },
    { href: '/progress', label: 'Progress' },
    { href: '/goals', label: 'Goals' },
    { href: '/messages', label: 'Messages' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/home' || pathname.startsWith('/home/');
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
        isScrolled && "shadow-md"
      )}>
        <div className="mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          {/* Left: Menu + Brand */}
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 transition-transform duration-200" />
                ) : (
                  <Menu className="h-5 w-5 transition-transform duration-200" />
                )}
              </Button>
            </div>
            <div className="hidden md:flex">
              <SidebarTrigger />
            </div>
            <button 
              onClick={() => router.push('/dashboard')} 
              className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="EKA Home"
            >
              <Image src="/eka_logo.png" alt="EKA" width={32} height={32} className="rounded" priority />
              <span className="font-semibold tracking-tight text-lg">EKA</span>
            </button>
          </div>

          {/* Center: Navigation (desktop) */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {currentUser && navigationItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "default" : "ghost"}
                size="sm"
                onClick={() => router.push(item.href)}
                className={cn(
                  "transition-colors duration-200",
                  isActive(item.href) && "bg-primary text-primary-foreground"
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Center: Search (desktop) */}
          <div className="hidden md:flex flex-1 justify-center max-w-md">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors duration-200" 
                type="search"
                aria-label="Search"
              />
            </div>
          </div>

          {/* Right: Auth / User */}
          <div className="flex items-center gap-2">
            {!currentUser ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/login')}
                  className="hidden sm:inline-flex"
                >
                  Sign In
                </Button>
                <Button onClick={() => router.push('/onboarding')}>
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <NotificationCenter />
                <UserNav />
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <nav className="px-4 py-3 space-y-1" role="navigation" aria-label="Mobile navigation">
              {currentUser && navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "w-full justify-start transition-colors duration-200",
                    isActive(item.href) && "bg-primary text-primary-foreground"
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Button>
              ))}
              <div className="pt-2 border-t">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors duration-200" 
                    type="search"
                    aria-label="Search"
                  />
                </div>
              </div>
              {!currentUser && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => router.push('/login')}
                    className="flex-1"
                  >
                    Sign In
                  </Button>
                  <Button onClick={() => router.push('/onboarding')} className="flex-1">
                    Get Started
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
