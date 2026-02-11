'use client';

import React, { Fragment, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutGrid,
  Wallet,
  Users,
  Package,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  DollarSign,
  CreditCard,
  FileText,
  MessageSquare,
  Database,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import {
  Dialog,
  Transition,
  TransitionChild,
  Menu as HeadlessMenu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/platform/auth-context';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Admin Navigation Items
const navigation = [
  { name: 'Overview', href: '/console', icon: LayoutGrid, exact: true },
  { name: 'Users', href: '/console/users', icon: Users },
  { name: 'Services', href: '/console/services', icon: Package },
  { name: 'Subscriptions', href: '/console/subscriptions', icon: DollarSign },
  { name: 'Payments', href: '/console/payments', icon: CreditCard },
  { name: 'Content', href: '/console/cms', icon: FileText },
  { name: 'Community', href: '/console/community', icon: MessageSquare },
  { name: 'Database', href: '/console/database', icon: Database },
  { name: 'Settings', href: '/console/settings', icon: Settings },
];

export function ConsoleLayoutHeadless({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <>
      <div>
        <Transition show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <TransitionChild
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-foreground/80" />
            </TransitionChild>

            <div className="fixed inset-0 flex">
              <TransitionChild
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <TransitionChild
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <X className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </TransitionChild>
                  {/* Mobile Sidebar Content */}
                  <div className="bg-primary flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 ring-1 ring-border/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <span className="text-2xl font-semibold tracking-widest text-white">
                        CONSOLE<span className="text-success">.</span>
                      </span>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => {
                              const isActive = item.exact
                                ? pathname === item.href
                                : pathname.startsWith(item.href);
                              return (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className={cn(
                                      isActive
                                        ? 'bg-card/10 text-white'
                                        : 'text-muted-foreground/80 hover:bg-card/5 hover:text-foreground',
                                      'group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all'
                                    )}
                                  >
                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    {item.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="bg-primary flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 shadow-sm">
            <div className="flex h-16 shrink-0 items-center">
              <span className="text-2xl font-semibold tracking-widest text-white">
                CONSOLE<span className="text-success">.</span>
              </span>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-2">
                    {navigation.map((item) => {
                      const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href) &&
                          (item.href !== '/console' || pathname === '/console');

                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              isActive
                                ? 'bg-linear-to-r from-success/20 to-transparent text-success ring-1 ring-success/50'
                                : 'text-muted-foreground/80 hover:bg-card/5 hover:text-foreground',
                              'group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200'
                            )}
                          >
                            <item.icon
                              className={cn(
                                isActive
                                  ? 'text-success'
                                  : 'text-muted-foreground group-hover:text-foreground',
                                'h-5 w-5 shrink-0 transition-colors'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>

                <li className="mt-auto">
                  <div className="bg-card/5 rounded-lg p-4 ring-1 ring-border/10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20 ring-1 ring-success/50">
                        <span className="text-xs font-semibold text-success">SU</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-white">Super Admin</span>
                        <span className="text-muted-foreground/80 text-xs">System Access</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          {/* Top Header */}
          <div className="bg-card/80 sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-border px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="text-foreground/90 -m-2.5 p-2.5 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                <div className="relative hidden w-full max-w-md md:block">
                  <Search className="text-muted-foreground/80 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search system resources..."
                    className="bg-muted/30 text-foreground placeholder:text-muted-foreground/80 w-full rounded-full border-none py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-success/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="text-muted-foreground/80 hover:text-muted-foreground -m-2.5 p-2.5"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="h-6 w-px bg-muted" aria-hidden="true" />

                <HeadlessMenu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20 ring-1 ring-success/30">
                      <span className="text-sm font-semibold text-success">
                        {user?.user_metadata?.full_name?.[0] || 'A'}
                      </span>
                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        className="text-foreground ml-4 text-sm leading-6 font-semibold"
                        aria-hidden="true"
                      >
                        {user?.user_metadata?.full_name || 'Admin'}
                      </span>
                      <ChevronDown
                        className="text-muted-foreground/80 ml-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </MenuButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="bg-card. absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-lg p-1 py-2 shadow-sm ring-1 ring-border/20 focus:outline-none">
                      <div className="mb-1 border-b border-border px-3 py-2">
                        <p className="text-muted-foreground text-xs font-medium">Signed in as</p>
                        <p className="text-foreground truncate text-sm font-semibold">
                          {user?.email || 'admin@example.com'}
                        </p>
                      </div>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            href="/console/settings"
                            className={cn(
                              active ? 'bg-muted/30' : '',
                              'text-foreground flex items-center gap-2 rounded-xl px-3 py-2 text-sm leading-6'
                            )}
                          >
                            <Settings className="text-muted-foreground/80 h-4 w-4" />
                            Settings
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={cn(
                              active ? 'bg-destructive/10 text-destructive' : 'text-foreground',
                              'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm leading-6'
                            )}
                          >
                            <LogOut
                              className={cn(
                                active ? 'text-destructive' : 'text-muted-foreground/80',
                                'h-4 w-4'
                              )}
                            />
                            Sign out
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </HeadlessMenu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
