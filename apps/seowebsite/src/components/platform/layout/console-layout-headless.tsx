'use client';

import React, { Fragment, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutGrid, Wallet, Users, Package, Settings, 
  Menu, X, Bell, Search, DollarSign, CreditCard, 
  FileText, MessageSquare, Database, LogOut, ChevronDown 
} from 'lucide-react';
import { Dialog, Transition, TransitionChild, Menu as HeadlessMenu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
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
              <div className="fixed inset-0 bg-gray-900/80" />
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
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <X className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </TransitionChild>
                  {/* Mobile Sidebar Content */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                       <span className="text-2xl font-bold text-white tracking-widest">CONSOLE<span className="text-emerald-500">.</span></span>
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
                                        : 'text-muted-foreground/80 hover:text-white hover:bg-card/5',
                                        'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all'
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
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-4 shadow-xl">
            <div className="flex h-16 shrink-0 items-center">
              <span className="text-2xl font-bold text-white tracking-widest">CONSOLE<span className="text-emerald-500">.</span></span>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-2">
                    {navigation.map((item) => {
                       const isActive = item.exact 
                        ? pathname === item.href
                        : pathname.startsWith(item.href) && (item.href !== '/console' || pathname === '/console');

                       return (
                        <li key={item.name}>
                            <Link
                            href={item.href}
                            className={cn(
                                isActive
                                ? 'bg-gradient-to-r from-emerald-500/20 to-transparent text-emerald-400 ring-1 ring-emerald-500/50'
                                : 'text-muted-foreground/80 hover:text-white hover:bg-card/5',
                                'group flex gap-x-3 rounded-2xl p-3 text-sm font-medium leading-6 transition-all duration-200'
                            )}
                            >
                            <item.icon className={cn(
                                isActive ? 'text-emerald-400' : 'text-muted-foreground group-hover:text-white',
                                "h-5 w-5 shrink-0 transition-colors"
                            )} aria-hidden="true" />
                            {item.name}
                            </Link>
                        </li>
                       );
                    })}
                  </ul>
                </li>
                
                <li className="mt-auto">
                    <div className="rounded-2xl bg-card/5 p-4 ring-1 ring-white/10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/50">
                                <span className="text-emerald-400 font-bold text-xs">SU</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-white">Super Admin</span>
                                <span className="text-[10px] text-muted-foreground/80">System Access</span>
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
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-gray-100 bg-card/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-foreground/90 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                 <div className="w-full max-w-md relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/80" />
                    <input 
                        type="text" 
                        placeholder="Search system resources..."
                        className="w-full pl-10 pr-4 py-2 border-none bg-muted/30 rounded-full text-sm text-foreground focus:ring-2 focus:ring-emerald-500/20 placeholder:text-muted-foreground/80" 
                    />
                 </div>
              </div>
              
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" className="-m-2.5 p-2.5 text-muted-foreground/80 hover:text-muted-foreground">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="h-6 w-px bg-gray-200" aria-hidden="true" />
                
                <HeadlessMenu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center ring-1 ring-emerald-200">
                         <span className="text-emerald-700 font-bold text-sm">
                             {user?.user_metadata?.full_name?.[0] || 'A'}
                         </span>
                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm font-semibold leading-6 text-foreground" aria-hidden="true">
                        {user?.user_metadata?.full_name || 'Admin'}
                      </span>
                      <ChevronDown className="ml-2 h-5 w-5 text-muted-foreground/80" aria-hidden="true" />
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
                    <MenuItems className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-2xl bg-card. py-2 shadow-2xl shadow-slate-200 ring-1 ring-gray-900/5 focus:outline-none p-1">
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                          <p className="text-xs text-muted-foreground font-medium">Signed in as</p>
                          <p className="text-sm font-bold text-foreground truncate">
                              {user?.email || 'admin@example.com'}
                          </p>
                      </div>
                      <MenuItem>
                        {({ active }) => (
                          <Link href="/console/settings" className={cn(active ? 'bg-muted/30' : '', 'flex items-center gap-2 px-3 py-2 text-sm leading-6 text-foreground rounded-xl')}>
                            <Settings className="w-4 h-4 text-muted-foreground/80" />
                            Settings
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button onClick={() => signOut()} className={cn(active ? 'bg-red-50 text-red-700' : 'text-foreground', 'flex w-full items-center gap-2 px-3 py-2 text-sm leading-6 rounded-xl')}>
                            <LogOut className={cn(active ? 'text-red-500' : 'text-muted-foreground/80', "w-4 h-4")} />
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
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
