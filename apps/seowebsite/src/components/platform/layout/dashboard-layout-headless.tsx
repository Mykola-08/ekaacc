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
import { useAuth } from '@/contexts/platform/auth-context';

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

function SidebarContent({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  
  return (
    <div className={cn(
      "flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4", 
      mobile ? "bg-background" : "bg-sidebar m-4 rounded-[36px] border border-border shadow-sm h-[calc(100vh-2rem)]"
    )}>
      <div className="flex h-20 shrink-0 items-center pl-2">
         <span className="text-2xl font-bold tracking-tight text-foreground">EKA<span className="text-primary">.</span></span>
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
                          ? 'bg-secondary text-foreground shadow-none'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                          'group flex gap-x-3 rounded-2xl p-3 text-sm font-semibold leading-6 transition-all duration-200'
                      )}
                      >
                      <item.icon className={cn("h-5 w-5 shrink-0 stroke-[2.75px] transition-colors", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} aria-hidden="true" />
                      {item.name}
                      </Link>
                  </li>
                  )
              })}
            </ul>
          </li>
          
          <li className="mt-auto">
                <div className="rounded-3xl bg-linear-to-br from-primary to-blue-600 p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer shadow-lg shadow-blue-900/10">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors"></div>
                  <div className="relative">
                    <p className="text-white font-bold text-lg mb-1">Premium Plan</p>
                    <p className="text-blue-50 text-xs mb-3 font-medium">Upgrade for full access</p>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors w-full border border-white/10">
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
  
  // Mobile Header
  const MobileHeader = () => (
     <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-background/80 backdrop-blur-xl px-4 py-4 shadow-sm sm:px-6 lg:hidden border-b border-border">
        <button type="button" className="-m-2.5 p-2.5 text-foreground lg:hidden" onClick={() => setSidebarOpen(true)}>
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-foreground">Dashboard</div>
        <a href="#">
          <span className="sr-only">Your profile</span>
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold border border-border">
             {user?.first_name?.[0] || 'U'}
          </div>
        </a>
      </div>
  );

  return (
    <div className="min-h-screen bg-background">
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
            <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm" />
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
                
                {/* Mobile Sidebar */}
                <div className="flex grow flex-col overflow-y-auto bg-white pb-4">
                     <SidebarContent mobile={true} />
                </div>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
         <SidebarContent />
      </div>
      
      {/* Main Content */}
      <div className="lg:pl-80 min-h-screen transition-all duration-300 ease-in-out">
        <MobileHeader />

        <main className="p-4 h-full">
           <div className="bg-card rounded-[36px] border border-border shadow-sm p-8 min-h-[calc(100vh-2rem)] overflow-y-auto">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
}
