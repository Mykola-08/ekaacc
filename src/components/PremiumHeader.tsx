'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Button, Avatar, AvatarFallback, AvatarImage } from '@/components/keep';
import { useAuth } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PremiumHeaderProps {
  user?: any;
  onMenuClick?: () => void;
}

export default function PremiumHeader({ user, onMenuClick }: PremiumHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  const navItems = [
    { name: 'Dashboard', href: '/home' },
    { name: 'AI Demo', href: '/ai-demo' },
    { name: 'Sessions', href: '/sessions' },
    { name: 'Journal', href: '/journal' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">EKA</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200"
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
                  onClick={() => router.push('/login')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/login?tab=signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Button
              variant="outline"
              size="sm"
              onClick={onMenuClick}
              className="md:hidden rounded-full hover:bg-gray-100/50 transition-all duration-200"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {userMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200"
                  onClick={() => setUserMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}