'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MinimalistNavProps {
  className?: string;
}

export function MinimalistNav({ className }: MinimalistNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/home' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Progress', href: '/progress' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <motion.nav
      className={cn(
        'bg-surface/80 border-border fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md',
        className
      )}
      initial={false}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ y: -2, opacity: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link href="/dashboard" className="text-foreground text-xl font-semibold">
              EKA
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <motion.div
              className="hidden items-center space-x-2 md:flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Mobile menu button */}
            <motion.button
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={cn('border-border border-t md:hidden', isMenuOpen ? 'block' : 'hidden')}
          initial={false}
          animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="space-y-1 py-4">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/30 block rounded-lg px-3 py-2 text-sm font-medium"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
            ))}
            <div className="border-border mt-4 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-foreground w-full justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-foreground w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-red-600 hover:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
