'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, User, Settings, Shield, LogOut, Home, BarChart3, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const { user, isAuthenticated, signOut, isAdmin } = useSimpleAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/');
    }
  };

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3, requiresAuth: true },
    { href: '/settings', label: 'Settings', icon: Settings, requiresAuth: true },
  ];

  const adminItems = [
    { href: '/admin/dashboard', label: 'Admin Panel', icon: Shield, requiresAdmin: true },
  ];

  const allItems = isAdmin ? [...navigationItems, ...adminItems] : navigationItems;

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profile?.avatar_url || undefined} />
            <AvatarFallback>
              {user?.profile?.full_name?.charAt(0) || user?.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user?.profile?.full_name || 'User'}</p>
            <p className="text-muted-foreground text-xs leading-none">{user?.email}</p>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-muted-foreground text-xs">Role:</span>
              <span className="text-xs font-medium capitalize">{user?.role?.name}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const MobileMenu = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Access your account features</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {allItems.map((item) => {
            const Icon = item.icon;
            const isVisible = !(item as any).requiresAuth || isAuthenticated;
            const isAdminVisible = !(item as any).requiresAdmin || isAdmin;

            if (!isVisible || !isAdminVisible) return null;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          {isAuthenticated && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile?.avatar_url || undefined} />
                  <AvatarFallback>
                    {user?.profile?.full_name?.charAt(0) || user?.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.profile?.full_name || 'User'}</p>
                  <p className="text-muted-foreground text-xs">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className={cn('bg-background border-b', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <div className="shrink-0">
              <Link href="/" className="text-foreground text-xl font-bold">
                EKA Account
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {allItems.map((item) => {
                const isVisible = !(item as any).requiresAuth || isAuthenticated;
                const isAdminVisible = !(item as any).requiresAdmin || isAdmin;

                if (!isVisible || !isAdminVisible) return null;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-foreground hover:text-muted-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <MobileMenu />
            </div>

            {/* Mobile Auth Button */}
            <div className="md:hidden">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <Link href="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
