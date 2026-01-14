'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [scrolled, setScrolled] = React.useState(false);
  const supabase = createClient();

  React.useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    setUser(null);
  };

  const routes = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
  ];

  const headerVariants = {
    hidden: { y: -100, opacity: 0, x: '-50%' },
    visible: { 
      y: 0, 
      opacity: 1, 
      x: '-50%',
      transition: { 
        type: 'spring' as const, 
        stiffness: 100, 
        damping: 20, 
        mass: 1 
      }
    }
  };

  return (
    <>
      <motion.header 
        variants={headerVariants}
        initial='hidden'
        animate='visible'
        className={cn(
            "fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-[32px] transition-all duration-300",
            scrolled 
                ? "bg-white/90 border border-slate-200 shadow-xl shadow-slate-200/40 backdrop-blur-md py-2" 
                : "bg-white border border-slate-100 shadow-lg shadow-slate-100/50 py-3"
        )}
      >
        <div className='flex items-center justify-between px-6'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2 group'>
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-serif font-bold text-sm">E</div>
            <span className='font-serif font-bold tracking-tight text-lg text-slate-900 group-hover:opacity-80 transition-opacity'>EKA BALANCE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden md:flex items-center space-x-1 bg-slate-50 rounded-full p-1 px-2 border border-slate-100'>
            {routes.map((route) => {
                const isActive = pathname === route.href;
                return (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                        'relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                        isActive 
                            ? 'text-slate-900 bg-white shadow-sm ring-1 ring-slate-200' 
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                        )}
                    >
                        {route.label}
                    </Link>
                );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                            <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate hidden md:block">{user.email}</span>
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
                                <User className="w-4 h-4 text-slate-700" />
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-100 shadow-xl p-2">
                         <DropdownMenuLabel className="font-serif">My Account</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                        {user ? (
                           <>
                             <DropdownMenuItem onClick={() => router.push('/')}>Dashboard</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleSignOut}>
                                Sign out
                             </DropdownMenuItem>
                           </>
                        ) : null}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center gap-2">
                    <Link href="/auth/login" className="hidden md:inline-flex text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2">
                        Log in
                    </Link>
                    <Link href="/book" className="inline-flex items-center gap-1 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/20">
                        Book Now
                    </Link>
                </div>
            )}

            {/* Mobile Toggle */}
            <button 
                className="md:hidden w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(true)}
            >
                <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm md:hidden"
                onClick={() => setMobileMenuOpen(false)}
            >
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl p-6 flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-8">
                        <span className="font-serif font-bold text-xl text-slate-900">Menu</span>
                        <button 
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-10 h-10 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-2 flex-1">
                        {routes.map(route => (
                            <Link 
                                key={route.href} 
                                href={route.href}
                                className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="text-xl font-medium text-slate-900">{route.label}</span>
                                <ChevronRight className="w-5 h-5 text-slate-300" />
                            </Link>
                        ))}
                    </div>

                    {!user && (
                         <div className="space-y-3 mt-auto pt-6 border-t border-slate-100">
                             <Link href="/auth/login" className="flex items-center justify-center w-full py-3.5 rounded-full border border-slate-200 text-slate-900 font-semibold">
                                 Log in
                             </Link>
                             <Link href="/book" className="flex items-center justify-center w-full py-3.5 rounded-full bg-slate-900 text-white font-semibold shadow-lg shadow-slate-900/20">
                                 Book Appointment
                             </Link>
                         </div>
                    )}
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
