'use client';

import React, { Fragment, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Wallet, Brain, Heart, Users, Calendar, Settings, 
  Menu, X, Bell, Search, GraduationCap, LogOut, ChevronDown 
} from 'lucide-react';
import { Dialog, Transition, TransitionChild, Menu as HeadlessMenu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/platform/auth-context';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Navigation Items
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Progress', href: '/progress', icon: Brain },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'Academy', href: '/academy', icon: GraduationCap },
  { name: 'Community', href: '/community', icon: Heart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardLayoutHeadless({ children }: { children: React.ReactNode }) {
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
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                       <span className="text-2xl font-bold text-white tracking-widest">EKA<span className="text-blue-500">.</span></span>
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
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5',
                                        'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all'
                                    )}
                                    >
                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    {item.name}
                                    </Link>
                                </li>
                               )
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

        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black m-3 rounded-4xl px-6 pb-4 ring-1 ring-white/5 shadow-2xl">
            <div className="flex h-24 shrink-0 items-center">
                <span className="text-3xl font-extrabold text-white tracking-widest">EKA<span className="text-blue-500">.</span></span>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                        <li key={item.name}>
                            <Link
                            href={item.href}
                            className={cn(
                                isActive
                                ? 'bg-white text-black shadow-lg shadow-white/10'
                                : 'text-gray-400 hover:text-white hover:bg-white/10',
                                'group flex gap-x-3 rounded-2xl p-4 text-sm font-semibold leading-6 transition-all duration-300'
                            )}
                            >
                            <item.icon className={cn("h-6 w-6 shrink-0 transition-colors", isActive ? "text-blue-600" : "")} aria-hidden="true" />
                            {item.name}
                            </Link>
                        </li>
                        )
                    })}
                  </ul>
                </li>
                
                <li className="mt-auto">
                     <div className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 p-4 relative overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer">
                         <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                         <h4 className="font-bold text-white relative z-10">Premium Plan</h4>
                         <p className="text-xs text-blue-100 mt-1 relative z-10">Access exclusive content.</p>
                     </div>
                </li>

                <li className="-mx-2 min-h-16 flex items-center">
                    <HeadlessMenu as="div" className="relative w-full">
                        <MenuButton className="flex items-center gap-x-4 p-2.5 w-full rounded-2xl hover:bg-white/5 transition-colors text-left outline-none">
                            <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-white">
                                {user?.profile?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </div>
                            <span className="sr-only">Your profile</span>
                            <span aria-hidden="true" className="flex flex-col flex-1 min-w-0">
                                <span className="block truncate text-sm font-semibold text-white">{user?.profile?.firstName || user?.displayName || 'User'}</span>
                                <span className="block truncate text-xs text-gray-500">{user?.email || 'user@example.com'}</span>
                            </span>
                            <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
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
                            <MenuItems className="absolute bottom-full left-0 z-10 mb-2 w-full origin-bottom-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <MenuItem>
                                    {({ active }) => (
                                        <button
                                            onClick={() => signOut?.()}
                                            className={cn(
                                                active ? 'bg-gray-50' : '',
                                                'px-4 py-2 text-sm text-gray-700 w-full text-left flex items-center gap-2 font-medium'
                                            )}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </button>
                                    )}
                                </MenuItem>
                            </MenuItems>
                        </Transition>
                    </HeadlessMenu>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:pl-72 h-screen flex flex-col">
          <div className="sticky top-0 z-40 flex h-24 shrink-0 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8 bg-none">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Top Bar - Simplified / Transparent-ish */}
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center justify-end">
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button className="p-2.5 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100/50 transition-colors relative">
                        <span className="sr-only">View notifications</span>
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
                        <Bell className="h-6 w-6" aria-hidden="true" />
                    </button>
                    {/* <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" /> */}
                    {/* Profile Dropdown (Mobile?) */}
                </div>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-10 bg-white lg:bg-transparent lg:rounded-tl-[40px]">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
