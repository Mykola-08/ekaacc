'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import Link from 'next/link';
import Image from 'next/image';

interface PremiumHeaderProps {
  user?: any;
  onMenuClick?: () => void;
}

export default function PremiumHeader({ user, onMenuClick }: PremiumHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const isTherapist = user?.role?.name === 'therapist';
  const dashboardItem = isTherapist
    ? { name: 'Therapist Dashboard', href: ROUTES.therapistDashboard }
    : { name: 'Dashboard', href: ROUTES.dashboard };

  const navItems = [
    dashboardItem,
    { name: 'AI Insights', href: ROUTES.aiInsights },
    { name: 'Sessions', href: ROUTES.sessions },
    { name: 'Journal', href: ROUTES.journal },
    { name: 'Subscriptions', href: ROUTES.subscriptions },
    { name: 'Privacy Controls', href: ROUTES.privacyControls },
    { name: 'Settings', href: ROUTES.settings },
  ];

  // Mobile keeps a simpler, touch-friendly subset
  const mobileNavItems = [
    isTherapist ? { name: 'Therapist Dashboard', href: ROUTES.therapistDashboard } : { name: 'Dashboard', href: ROUTES.dashboard },
    { name: 'Sessions', href: ROUTES.sessions },
    { name: 'AI Insights', href: ROUTES.aiInsights },
    { name: 'Settings', href: ROUTES.settings },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-background/95 backdrop-blur-lg shadow-lg border-b border-border/50' 
        : 'bg-background/80 backdrop-blur-sm'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={ROUTES.home} className="flex items-center">
              <Image src="/eka_logo.png" alt="EKA" width={120} height={32} priority />
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="outline"
              size="sm"
              className="relative rounded-full hover:bg-gray-100/50 transition-all duration-200"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-medium text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 rounded-full hover:bg-gray-100/50 transition-all duration-200"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-medium">
                      {user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.name || 'User'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-50"
                    >
                      <div className="p-2">
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(ROUTES.login)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push(ROUTES.signupParam)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden rounded-full hover:bg-gray-100/50 transition-all duration-200"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur"
          >
            <div className="px-4 py-3 space-y-2">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-foreground/90 hover:bg-muted/60"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-border/60 text-sm text-muted-foreground flex flex-wrap gap-4">
                <Link href={ROUTES.terms} onClick={() => setMobileOpen(false)} className="hover:text-foreground">Terms</Link>
                <Link href={ROUTES.privacy} onClick={() => setMobileOpen(false)} className="hover:text-foreground">Privacy</Link>
                <Link href={ROUTES.cookies} onClick={() => setMobileOpen(false)} className="hover:text-foreground">Cookies</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}