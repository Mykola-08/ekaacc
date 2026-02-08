'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Menu01Icon, 
  Cancel01Icon, 
  UserIcon, 
  ArrowRight01Icon, 
  Globe02Icon 
} from "@hugeicons/core-free-icons";
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
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
  const { t, language, setLanguage } = useLanguage();

  // Glass Effect Logic
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    setUser(null);
  };

  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'http://localhost:9002';

  const routes = [
    { href: `${mainSiteUrl}`, label: t('nav.home') },
    { href: `${mainSiteUrl}/services`, label: t('nav.services') },
    { href: `${mainSiteUrl}/about-elena`, label: t('nav.about') },
  ];

  const headerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.header
          className={cn(
            "pointer-events-auto w-[95%] max-w-5xl rounded-full transition-all duration-500 border border-border/50",
            scrolled
              ? "bg-background/95 backdrop-blur-xl py-2"
              : "bg-background/80 backdrop-blur-md py-3"
          )}
        >
        <div className='flex items-center justify-between px-6 max-w-5xl mx-auto'>
          {/* Logo */}
          <Link href={mainSiteUrl} className='flex items-center gap-2 group'>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-sans font-black text-xl backdrop-blur-md border border-primary/20 shadow-sm">E</div>
            <span className='font-sans font-bold tracking-tight text-lg text-foreground/90 group-hover:opacity-80 transition-opacity'>eka</span>
          </Link>

          {/* Desktop Nav - Porcelain Pill */}
          <nav className='hidden md:flex items-center space-x-1 bg-white/50 backdrop-blur-xl rounded-full p-1.5 px-2 border border-white/60 shadow-sm'>
            {routes.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'text-primary bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/40'
                  )}
                >
                  {route.label}
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-all border border-border/60 shadow-sm active:scale-95 group">
                  <HugeiconsIcon icon={Globe02Icon} size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-[24px] border-border/60 shadow-xl p-2 min-w-[140px]">
                <DropdownMenuItem className="rounded-full px-4 py-2 cursor-pointer" onClick={() => setLanguage('en')}>English {language === 'en' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem className="rounded-full px-4 py-2 cursor-pointer" onClick={() => setLanguage('es')}>Español {language === 'es' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem className="rounded-full px-4 py-2 cursor-pointer" onClick={() => setLanguage('ca')}>Català {language === 'ca' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem className="rounded-full px-4 py-2 cursor-pointer" onClick={() => setLanguage('ru')}>Русский {language === 'ru' && '✓'}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-card border border-border/80 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                    <span className="text-sm font-bold text-foreground/90 max-w-[120px] truncate hidden md:block">{user.email?.split('@')[0]}</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group transition-all">
                      <HugeiconsIcon icon={UserIcon} size={18} strokeWidth={2.5} />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-[28px] border-border/60 shadow-2xl p-3 mt-2">
                  <DropdownMenuLabel className="font-bold text-lg mb-1 px-3">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="mb-2" />
                  {user ? (
                    <>
                      <DropdownMenuItem className="rounded-xl h-12 px-4 cursor-pointer font-medium mb-1" onClick={() => router.push('/dashboard')}>
                         <div className="flex items-center justify-between w-full">
                            {t('nav.dashboard')}
                            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                         </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl h-12 px-4 cursor-pointer font-medium" onClick={() => router.push('/settings')}>
                         <div className="flex items-center justify-between w-full">
                            {t('nav.settings')}
                            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                         </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="rounded-xl h-12 px-4 cursor-pointer text-destructive font-bold focus:bg-destructive/5 focus:text-destructive"
                      >
                        {t('nav.signout')}
                      </DropdownMenuItem>
                    </>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={`${mainSiteUrl}/auth/login`} className="hidden md:inline-flex text-sm font-bold text-muted-foreground hover:text-foreground px-4 py-2 rounded-full hover:bg-primary/5 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link href="/book" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                  {t('nav.book')}
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/90 hover:bg-muted/40 active:scale-95 transition-all"
              onClick={() => setMobileMenuOpen(true)}
            >
              <HugeiconsIcon icon={Menu01Icon} size={20} />
            </button>
          </div>
        </div>
      </motion.header>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-primary/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card shadow-2xl p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-2xl text-foreground">Menu</span>
                <div className="flex items-center gap-4">
                  {/* Mobile Language Switcher */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors border border-border/60">
                        <HugeiconsIcon icon={Globe02Icon} size={24} className="text-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl shadow-xl p-2 border-border/60">
                      <DropdownMenuItem className="rounded-xl px-4 py-3" onClick={() => setLanguage('en')}>English {language === 'en' && '✓'}</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl px-4 py-3" onClick={() => setLanguage('es')}>Español {language === 'es' && '✓'}</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl px-4 py-3" onClick={() => setLanguage('ca')}>Català {language === 'ca' && '✓'}</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl px-4 py-3" onClick={() => setLanguage('ru')}>Русский {language === 'ru' && '✓'}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center active:scale-95 transition-all"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={28} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {routes.map(route => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="flex items-center justify-between p-5 rounded-[24px] bg-secondary/50 hover:bg-secondary transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-2xl font-bold text-foreground">{route.label}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="text-muted-foreground/50" />
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="space-y-3 mt-auto pt-6 border-t border-border/60">
                  <Link href={`${mainSiteUrl}/auth/login`} className="flex items-center justify-center w-full py-3.5 rounded-full border border-border text-foreground font-semibold">
                    {t('nav.login')}
                  </Link>
                  <Link href="/book" className="flex items-center justify-center w-full py-3.5 rounded-full bg-primary text-white font-semibold shadow-lg shadow-slate-900/20">
                    {t('nav.book')}
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

