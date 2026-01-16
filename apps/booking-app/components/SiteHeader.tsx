'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, ChevronRight, Globe } from 'lucide-react';
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
            "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-[36px] transition-all duration-500 border border-border/50",
            scrolled 
                ? "bg-background/95 backdrop-blur-xl py-2" 
                : "bg-background/80 backdrop-blur-md py-3"
        )}
      >
        <div className='flex items-center justify-between px-6'>
          {/* Logo */}
          <Link href={mainSiteUrl} className='flex items-center gap-2 group'>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-sans font-bold text-sm">E</div>
            <span className='font-sans font-bold tracking-tight text-base text-foreground/90 group-hover:opacity-80 transition-opacity'>EKA BALANCE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden md:flex items-center space-x-1 bg-muted/40 rounded-full p-1 px-2 border border-border/60'>
            {routes.map((route) => {
                const isActive = pathname === route.href;
                return (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                        'relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                        isActive 
                            ? 'text-foreground bg-card shadow-sm ring-1 ring-slate-200' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-slate-200/50'
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
                <button className="w-8 h-8 rounded-full bg-muted/40 flex items-center justify-center hover:bg-muted transition-colors border border-border/60">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>English {language === 'en' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('es')}>Español {language === 'es' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ca')}>Català {language === 'ca' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ru')}>Русский {language === 'ru' && '✓'}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-muted/40 border border-border/60 hover:bg-muted transition-colors">
                            <span className="text-sm font-medium text-foreground/90 max-w-[100px] truncate hidden md:block">{user.email}</span>
                            <div className="w-8 h-8 rounded-full bg-card shadow-sm flex items-center justify-center border border-border/60">
                                <User className="w-4 h-4 text-foreground/90" />
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border/60 shadow-xl p-2">
                         <DropdownMenuLabel className="font-serif">My Account</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                        {user ? (
                           <>
                             <DropdownMenuItem onClick={() => router.push('/')}>{t('nav.dashboard')}</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => router.push('/settings')}>{t('nav.settings')}</DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleSignOut}>
                                {t('nav.signout')}
                             </DropdownMenuItem>
                           </>
                        ) : null}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center gap-2">
                    <Link href={`${mainSiteUrl}/auth/login`} className="hidden md:inline-flex text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2">
                        {t('nav.login')}
                    </Link>
                    <Link href="/book" className="inline-flex items-center gap-1 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/20">
                        {t('nav.book')}
                    </Link>
                </div>
            )}

            {/* Mobile Toggle */}
            <button 
                className="md:hidden w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/90 hover:bg-muted/40"
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
                        <span className="font-serif font-bold text-xl text-foreground">Menu</span>
                        <div className="flex items-center gap-4">
                            {/* Mobile Language Switcher */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center hover:bg-muted transition-colors border border-border/60">
                                        <Globe className="w-5 h-5 text-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setLanguage('en')}>English {language === 'en' && '✓'}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setLanguage('es')}>Español {language === 'es' && '✓'}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setLanguage('ca')}>Català {language === 'ca' && '✓'}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setLanguage('ru')}>Русский {language === 'ru' && '✓'}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button 
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-10 h-10 rounded-full bg-muted/40 text-foreground flex items-center justify-center"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 flex-1">
                        {routes.map(route => (
                            <Link 
                                key={route.href} 
                                href={route.href}
                                className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/40 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="text-xl font-medium text-foreground">{route.label}</span>
                                <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
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
