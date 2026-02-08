'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Menu01Icon,
  Cancel01Icon,
  UserIcon,
  ArrowRight01Icon,
  Globe02Icon,
} from '@hugeicons/core-free-icons';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
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
        ease: 'easeOut',
      },
    },
  };

  return (
    <>
      <div className="pointer-events-none fixed top-4 right-0 left-0 z-50 flex justify-center">
        <motion.header
          className={cn(
            'border-border/50 pointer-events-auto w-[95%] max-w-5xl rounded-full border transition-all duration-500',
            scrolled
              ? 'bg-background/95 py-2 backdrop-blur-xl'
              : 'bg-background/80 py-3 backdrop-blur-md'
          )}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
            {/* Logo */}
            <Link href={mainSiteUrl} className="group flex items-center gap-2">
              <div className="bg-primary/10 text-primary border-primary/20 flex h-10 w-10 items-center justify-center rounded-lg border font-sans text-xl font-black shadow-sm backdrop-blur-md">
                E
              </div>
              <span className="text-foreground/90 font-sans text-lg font-bold tracking-tight transition-opacity group-hover:opacity-80">
                eka
              </span>
            </Link>

            {/* Desktop Nav - Porcelain Pill */}
            <nav className="hidden items-center space-x-1 rounded-full border border-white/60 bg-white/50 p-1.5 px-2 shadow-sm backdrop-blur-xl md:flex">
              {routes.map((route) => {
                const isActive = pathname === route.href;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      'relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
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
                  <button className="bg-card hover:bg-muted border-border/60 group flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all active:scale-95">
                    <HugeiconsIcon
                      icon={Globe02Icon}
                      size={20}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-border/60 min-w-[140px] rounded-[24px] p-2 shadow-xl"
                >
                  <DropdownMenuItem
                    className="cursor-pointer rounded-full px-4 py-2"
                    onClick={() => setLanguage('en')}
                  >
                    English {language === 'en' && '✓'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer rounded-full px-4 py-2"
                    onClick={() => setLanguage('es')}
                  >
                    Español {language === 'es' && '✓'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer rounded-full px-4 py-2"
                    onClick={() => setLanguage('ca')}
                  >
                    Català {language === 'ca' && '✓'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer rounded-full px-4 py-2"
                    onClick={() => setLanguage('ru')}
                  >
                    Русский {language === 'ru' && '✓'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="bg-card border-border/80 flex items-center gap-2 rounded-full border py-1.5 pr-1.5 pl-4 shadow-sm transition-all hover:bg-slate-50 active:scale-95">
                      <span className="text-foreground/90 hidden max-w-[120px] truncate text-sm font-bold md:block">
                        {user.email?.split('@')[0]}
                      </span>
                      <div className="bg-primary/10 text-primary group flex h-8 w-8 items-center justify-center rounded-full transition-all">
                        <HugeiconsIcon icon={UserIcon} size={18} strokeWidth={2.5} />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="border-border/60 mt-2 w-64 rounded-[28px] p-3 shadow-2xl"
                  >
                    <DropdownMenuLabel className="mb-1 px-3 text-lg font-bold">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="mb-2" />
                    {user ? (
                      <>
                        <DropdownMenuItem
                          className="mb-1 h-12 cursor-pointer rounded-xl px-4 font-medium"
                          onClick={() => router.push('/dashboard')}
                        >
                          <div className="flex w-full items-center justify-between">
                            {t('nav.dashboard')}
                            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="h-12 cursor-pointer rounded-xl px-4 font-medium"
                          onClick={() => router.push('/settings')}
                        >
                          <div className="flex w-full items-center justify-between">
                            {t('nav.settings')}
                            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem
                          onClick={handleSignOut}
                          className="text-destructive focus:bg-destructive/5 focus:text-destructive h-12 cursor-pointer rounded-xl px-4 font-bold"
                        >
                          {t('nav.signout')}
                        </DropdownMenuItem>
                      </>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-foreground hover:bg-primary/5 hidden rounded-full px-4 py-2 text-sm font-bold transition-colors md:inline-flex"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/book"
                    className="bg-primary hover:bg-primary/90 shadow-primary/20 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    Book
                  </Link>
                </div>
              )}

              {/* Mobile Toggle */}
              <button
                className="border-border text-foreground/90 hover:bg-muted/40 flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95 md:hidden"
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
            className="bg-primary/40 fixed inset-0 z-[60] backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-card absolute top-0 right-0 bottom-0 flex w-full max-w-sm flex-col p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-foreground text-2xl font-bold">Menu</span>
                <div className="flex items-center gap-4">
                  {/* Mobile Language Switcher */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="bg-secondary hover:bg-muted border-border/60 flex h-12 w-12 items-center justify-center rounded-full border transition-colors">
                        <HugeiconsIcon icon={Globe02Icon} size={24} className="text-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-border/60 rounded-2xl p-2 shadow-xl"
                    >
                      <DropdownMenuItem
                        className="rounded-xl px-4 py-3"
                        onClick={() => setLanguage('en')}
                      >
                        English {language === 'en' && '✓'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="rounded-xl px-4 py-3"
                        onClick={() => setLanguage('es')}
                      >
                        Español {language === 'es' && '✓'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="rounded-xl px-4 py-3"
                        onClick={() => setLanguage('ca')}
                      >
                        Català {language === 'ca' && '✓'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="rounded-xl px-4 py-3"
                        onClick={() => setLanguage('ru')}
                      >
                        Русский {language === 'ru' && '✓'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-secondary text-foreground flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-95"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={28} />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="bg-secondary/50 hover:bg-secondary flex items-center justify-between rounded-[24px] p-5 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-foreground text-2xl font-bold">{route.label}</span>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={24}
                      className="text-muted-foreground/50"
                    />
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="border-border/60 mt-auto space-y-3 border-t pt-6">
                  <Link
                    href="/login"
                    className="border-border text-foreground flex w-full items-center justify-center rounded-full border py-3.5 font-semibold"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/book"
                    className="bg-primary flex w-full items-center justify-center rounded-full py-3.5 font-semibold text-white shadow-lg shadow-slate-900/20"
                  >
                    Book
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
