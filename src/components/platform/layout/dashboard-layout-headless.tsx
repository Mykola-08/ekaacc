'use client';

import React, { Fragment, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Wallet,
  Brain,
  Settings,
  Menu,
  X,
  Bell,
  Search,
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

// Navigation Items
const navigation = [
  { name: 'Dashboard', href: '/home', icon: Home },
  { name: 'Progress', href: '/progress', icon: Brain },
  { name: 'Finances', href: '/finances', icon: Wallet },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function SidebarContent({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'flex grow flex-col gap-y-5 overflow-y-auto px-6 py-6',
        mobile ? 'bg-background h-full' : 'h-full'
      )}
    >
      <div className="flex shrink-0 items-center pl-2">
        <span className="text-foreground text-2xl font-bold tracking-tight">
          EKA<span className="text-primary">.</span>
        </span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? 'bg-secondary text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                        'group flex gap-x-3 rounded-[20px] p-3 text-sm leading-6 font-semibold transition-all duration-200'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5 shrink-0 stroke-[2.75px] transition-colors',
                          isActive
                            ? 'text-foreground'
                            : 'text-muted-foreground group-hover:text-foreground'
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
            <div className="from-primary group relative cursor-pointer overflow-hidden rounded-[20px] bg-linear-to-br to-blue-600 p-5 shadow-lg shadow-blue-900/10 transition-transform duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-colors group-hover:bg-white/20"></div>
              <div className="relative">
                <p className="mb-1 text-lg font-bold text-white">Premium Plan</p>
                <p className="mb-3 text-xs font-medium text-blue-50">Upgrade for full access</p>
                <button className="w-full cursor-pointer rounded-xl border border-white/10 bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-white/30">
                  Upgrade Now
                </button>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export function DashboardLayoutHeadless({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  // Header Pill Component
  const HeaderPill = () => (
    <header className="bg-card border-border animate-slide-in-top flex h-[72px] shrink-0 items-center justify-between rounded-xl border px-6 shadow-sm">
      {/* Mobile Menu Trigger */}
      <button
        type="button"
        className="text-foreground -ml-2 p-2 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Search / Title */}
      <div className="bg-secondary/50 border-border/50 hidden w-96 items-center gap-4 rounded-[20px] border px-4 py-2 md:flex">
        <Search className="text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search for patients, records, or settings..."
          className="placeholder:text-muted-foreground/70 w-full border-none bg-transparent text-sm outline-none"
        />
      </div>
      <span className="font-semibold md:hidden">Dashboard</span>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="hover:bg-secondary text-muted-foreground hover:text-foreground relative rounded-full p-2 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="border-card absolute top-2 right-2 h-2 w-2 rounded-full border bg-red-500"></span>
        </button>

        <HeadlessMenu as="div" className="relative">
          <MenuButton className="hover:bg-secondary hover:border-border flex items-center gap-2 rounded-full border border-transparent p-1 pr-1 pl-2 transition-colors">
            <span className="hidden text-sm font-semibold md:block">
              {user?.first_name || 'Mykola'}
            </span>
            <div className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 items-center justify-center rounded-full border font-bold">
              {user?.first_name?.[0] || 'M'}
            </div>
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
            <MenuItems className="bg-card border-border absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-[20px] border py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={cn(
                      active ? 'bg-secondary' : '',
                      'text-foreground block px-4 py-2 text-sm'
                    )}
                  >
                    Your Profile
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => signOut()}
                    className={cn(
                      active ? 'bg-secondary' : '',
                      'flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-red-500'
                    )}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </HeadlessMenu>
      </div>
    </header>
  );

  return (
    <div className="bg-secondary/50 flex h-screen w-full gap-4 overflow-hidden p-3 md:p-4">
      {/* Mobile Drawer */}
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
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
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
                <div className="bg-card border-border flex grow flex-col overflow-y-auto border-r pb-4">
                  <SidebarContent mobile={true} />
                </div>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop Sidebar Pill */}
      <aside className="bg-card border-border/60 animate-in slide-in-from-left-4 hidden w-[280px] shrink-0 flex-col rounded-[20px] border shadow-sm duration-300 lg:flex">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
        <HeaderPill />

        <main className="bg-card border-border/60 animate-in fade-in flex-1 overflow-auto rounded-[20px] border p-4 shadow-sm duration-300 md:p-6">
          <div className="mx-auto h-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
