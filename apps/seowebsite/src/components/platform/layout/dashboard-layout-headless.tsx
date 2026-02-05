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
  { name: 'Dashboard', href: '/home', icon: Home },
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
      "flex grow flex-col gap-y-5 overflow-y-auto px-6 py-6", 
      mobile ? "bg-background h-full" : "h-full"
    )}>
      <div className="flex shrink-0 items-center pl-2">
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
                          ? 'bg-secondary text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
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
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors w-full border border-white/10 cursor-pointer">
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
    <header className="h-[72px] bg-card rounded-xl border border-border shadow-sm flex items-center justify-between px-6 shrink-0 animate-slide-in-top">
      {/* Mobile Menu Trigger */}
      <button type="button" className="lg:hidden p-2 -ml-2 text-foreground" onClick={() => setSidebarOpen(true)}>
        <Menu className="h-6 w-6" />
      </button>

      {/* Search / Title */}
      <div className="hidden md:flex items-center gap-4 bg-secondary/50 px-4 py-2 rounded-2xl border border-border/50 w-96">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search for patients, records, or settings..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
        />
      </div>
      <span className="md:hidden font-semibold">Dashboard</span>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
        </button>
        
        <HeadlessMenu as="div" className="relative">
          <MenuButton className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full hover:bg-secondary transition-colors border border-transparent hover:border-border">
            <span className="text-sm font-semibold hidden md:block">{user?.first_name || 'Mykola'}</span>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
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
            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-2xl bg-card py-1 shadow-lg ring-1 ring-black/5 focus:outline-none border border-border">
              <MenuItem>
                {({ active }) => (
                  <a href="#" className={cn(active ? 'bg-secondary' : '', 'block px-4 py-2 text-sm text-foreground')}>
                    Your Profile
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button onClick={() => signOut()} className={cn(active ? 'bg-secondary' : '', 'flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 font-medium')}>
                    <LogOut className="w-4 h-4" />
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
    <div className="h-screen w-full bg-secondary/50 p-3 md:p-4 flex gap-4 overflow-hidden">
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
                <div className="flex grow flex-col overflow-y-auto bg-card pb-4 border-r border-border">
                     <SidebarContent mobile={true} />
                </div>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop Sidebar Pill */}
      <aside className="hidden lg:flex w-[280px] flex-col bg-card rounded-2xl border border-border/60 shadow-sm shrink-0 animate-in slide-in-from-left-4 duration-300">
         <SidebarContent />
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden min-w-0">
        <HeaderPill />

        <main className="flex-1 bg-card rounded-2xl border border-border/60 shadow-sm overflow-auto md:p-6 p-4 animate-in fade-in duration-300">
           <div className="max-w-7xl mx-auto h-full">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
}
