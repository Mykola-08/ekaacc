'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { OfflineIndicator } from '@/components/marketing/OfflineIndicator';
import { Language } from '@/context/marketing/LanguageTypes';
import { useLanguage } from '@/context/marketing/LanguageContext';
import LanguagePopup from '@/components/marketing/LanguagePopup';
import CookieBanner from './CookieBanner';

import { useClickOutside } from '@/hooks/marketing/useClickOutside';
import { useAnalytics } from '@/hooks/marketing/useAnalytics';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { logPageView } = useAnalytics();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Log page views
  useEffect(() => {
    if (pathname) {
      logPageView(pathname);
    }
  }, [pathname, logPageView]);

  const [showPersonalServices, setShowPersonalServices] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const personalServicesRef = useClickOutside<HTMLDivElement>(() => setShowPersonalServices(false));

  // Hover intent management for dropdown
  const [hideTimeout, setHideTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setShowPersonalServices(true);
  };

  const scheduleHide = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    const timeout = setTimeout(() => {
      setShowPersonalServices(false);
    }, 220);
    setHideTimeout(timeout);
  };

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  // Navigation items
  interface NavItem {
    name: string;
    href: string;
    hasDropdown?: boolean;
    dropdownItems?: { name: string; href: string }[];
    isGold?: boolean;
    isExternal?: boolean;
  }

  const navigation: NavItem[] = [
    {
      name: t('nav.services'),
      href: '/services',
    },
    {
      name: 'Agenyz',
      href: '/agenyz',
    },
    {
      name: t('nav.personalizedServices'),
      href: '/personalized-services',
      hasDropdown: true,
      dropdownItems: [
        { name: t('nav.officeWorkers'), href: '/services/office-workers' },
        { name: t('nav.athletes'), href: '/services/athletes' },
        { name: t('nav.artists'), href: '/services/artists' },
        { name: t('nav.musicians'), href: '/services/musicians' },
        { name: t('nav.students'), href: '/services/students' },
      ],
    },
    {
      name: t('nav.casos'),
      href: '/cases',
    },
    {
      name: t('nav.revision360'),
      href: '/360-revision',
    },
  ];

  const isActivePath = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen">
      <OfflineIndicator />

      {/* Navigation with scroll effect */}
      <nav
        className={`ease-in-out-quart sticky top-0 z-50 border-b border-border/50 transition-all duration-500 ${isScrolled ? 'bg-background/85 shadow-sm backdrop-blur-xl' : 'bg-background/70 backdrop-blur-md'}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div
            className={`ease-in-out-quart flex items-center justify-between transition-all duration-500 ${
              isScrolled ? 'h-14' : 'h-16'
            }`}
          >
            {/* Logo Only - Left Side */}
            <Link href="/" className="group relative flex shrink-0 items-center">
              <div
                className={`ease-in-out-quart relative transition-all duration-500 ${isScrolled ? 'h-8 w-8' : 'h-10 w-10'}`}
              >
                <Image
                  src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png"
                  alt="EKA Balance Logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="mx-8 hidden flex-1 items-center justify-center md:flex">
              <div className="flex items-center space-x-2">
                {navigation.map((item) => (
                  <div
                    key={item.name}
                    className={`nav-item ${item.hasDropdown ? 'relative' : ''}`}
                    ref={item.hasDropdown ? personalServicesRef : undefined}
                  >
                    {item.hasDropdown ? (
                      <>
                        <Link
                          href={item.href}
                          className={`nav-trigger ease-out-quart rounded-apple flex items-center px-5 py-3 font-medium transition-all duration-200 hover:bg-card/60 ${
                            isActivePath(item.href)
                              ? 'text-accent'
                              : 'text-eka-dark hover:text-accent'
                          }`}
                          onMouseEnter={openDropdown}
                          onMouseLeave={scheduleHide}
                          onFocus={openDropdown}
                          onBlur={scheduleHide}
                          suppressHydrationWarning
                        >
                          {item.name}
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Link>

                        {/* Hover bridge for seamless navigation */}
                        <div
                          className="hover-bridge"
                          onMouseEnter={openDropdown}
                          onMouseLeave={scheduleHide}
                          aria-hidden="true"
                        />

                        {/* Dropdown menu with CSS-first positioning */}
                        <div
                          className={`nav-dropdown ${showPersonalServices ? 'is-open' : ''} ${isScrolled ? 'bg-muted/90 backdrop-blur-xl' : 'bg-muted'}`}
                          onMouseEnter={openDropdown}
                          onMouseLeave={scheduleHide}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setShowPersonalServices(false);
                            }
                          }}
                          role="menu"
                          aria-label={`${item.name} submenu`}
                        >
                          {item.dropdownItems?.map((dropdownItem, index) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              onClick={() => setShowPersonalServices(false)}
                              className="ease-out-quart text-eka-dark hover:text-accent flex h-12 items-center justify-center rounded-xl text-sm font-medium transition-colors duration-200 hover:bg-muted"
                              style={{
                                marginBottom: index < item.dropdownItems!.length - 1 ? '8px' : '0',
                              }}
                              role="menuitem"
                              suppressHydrationWarning
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : item.isExternal ? (
                      <a
                        href={item.href}
                        rel="noopener noreferrer"
                        className="rounded-apple text-eka-dark hover:text-accent px-5 py-3 font-medium transition-all duration-200 hover:bg-card/60"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(item.href, '_blank', 'noopener,noreferrer');
                        }}
                        suppressHydrationWarning
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className={`ease-out-quart rounded-apple px-5 py-3 font-medium transition-all duration-200 hover:bg-card/60 ${
                          item.isGold
                            ? 'gold-shimmer border border-warning/20 bg-linear-to-r from-warning/10 via-warning/10 to-warning/10 font-black hover:from-warning/20 hover:via-warning/20 hover:to-warning/20'
                            : isActivePath(item.href)
                              ? 'text-accent'
                              : 'text-eka-dark hover:text-accent'
                        }`}
                        suppressHydrationWarning
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex shrink-0 items-center space-x-2 sm:space-x-4">
              {/* Integrated Actions */}
              <div className="hidden items-center gap-1 sm:flex">
                <Link
                  href="/login"
                  className="text-eka-dark hover:text-accent ease-out-quart inline-flex rounded-full px-5 py-2.5 font-medium transition-colors duration-200"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/book"
                  className="bg-accent hover:bg-accent-dark text-eka-dark ease-out-quart inline-flex rounded-full px-6 py-2.5 font-semibold shadow-sm transition-transform duration-200 hover:shadow-md hover:scale-105"
                >
                  {t('nav.bookNow')}
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-2xl p-2 transition-colors duration-200 hover:bg-muted md:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-foreground" />
                ) : (
                  <Menu className="h-5 w-5 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute top-full left-0 w-full overflow-hidden border-b border-border bg-background/95 shadow-xl backdrop-blur-xl md:hidden"
              >
                <div className="max-h-[80vh] space-y-2 overflow-y-auto px-4 py-4">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      {item.isExternal ? (
                        <a
                          href={item.href}
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsMenuOpen(false);
                            window.open(item.href, '_blank', 'noopener,noreferrer');
                          }}
                          className="block rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors duration-200 hover:bg-muted"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200 ${
                            item.isGold
                              ? 'border border-border bg-muted font-bold text-foreground ring-1 ring-border'
                              : isActivePath(item.href)
                                ? 'bg-primary/5 text-primary'
                                : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          {item.name}
                        </Link>
                      )}
                      {item.hasDropdown && (
                        <div className="mt-2 ml-4 space-y-1 border-l-2 border-border pl-2">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="hover:text-primary block rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Mobile Integrated Actions */}
                  <div className="mt-2 space-y-2 border-t border-border pt-2">
                    <Link
                      href="/login"
                      data-ux-action="true"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-eka-dark rounded-apple block w-full border border-border bg-card px-4 py-3 text-center font-semibold transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/dashboard"
                      data-ux-action="true"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-eka-dark rounded-apple block w-full border border-border bg-card px-4 py-3 text-center font-semibold transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/book"
                      data-ux-action="true"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-accent hover:bg-accent-dark text-eka-dark rounded-apple block w-full px-4 py-3 text-center font-semibold transition-colors duration-200"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
        {children}
      </main>

      {/* Cookie Banner */}
      <CookieBanner />
      <LanguagePopup />

      {/* Fixed Mobile Bottom CTA */}
      <div className="pb-safe fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-card/80 p-4 backdrop-blur-md md:hidden">
        <Link
          href="/book"
          data-ux-action="true"
          className="bg-accent hover:bg-accent-dark text-eka-dark rounded-apple block w-full py-4 text-center font-bold shadow-lg transition-transform active:scale-[0.98]"
        >
          Book
        </Link>
      </div>

      {/* Footer */}
      <footer className="mb-24 border-t border-border bg-background py-12 text-foreground sm:py-16 md:mb-0">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="group mx-auto mb-8 flex w-fit items-center justify-center space-x-3"
          >
            <div className="relative h-10 w-10">
              <Image
                src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png"
                alt="EKA Balance Logo"
                fill
                className="ease-out-quart object-contain transition-transform duration-300 group-hover:scale-105"
                sizes="40px"
              />
            </div>
            <span className="text-xl font-medium">EKA Balance</span>
          </Link>

          {/* Contact Info */}
          <div className="mb-8 space-y-2 text-foreground">
            <p>{t('footer.address')}</p>
            <p>{t('footer.email')}</p>
          </div>

          {/* Footer Links */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              <Link
                href="/discounts"
                className="text-sm font-medium text-muted-foreground/40 transition-colors duration-200 hover:text-foreground"
              >
                {t('footer.discounts')}
              </Link>
              <Link
                href="/privacy-policy"
                className="text-sm font-medium text-muted-foreground/40 transition-colors duration-200 hover:text-foreground"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                href="/cookie-policy"
                className="text-sm font-medium text-muted-foreground/40 transition-colors duration-200 hover:text-foreground"
              >
                {t('footer.cookiePolicy')}
              </Link>
              <Link
                href="/terms-of-service"
                className="text-sm font-medium text-muted-foreground/40 transition-colors duration-200 hover:text-foreground"
              >
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground/60" />
              <span className="text-sm text-muted-foreground/60">{t('footer.selectLanguage')}</span>
            </div>
            <div className="flex justify-center space-x-4">
              {(['ca', 'en', 'es', 'ru'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`rounded-apple px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    language === lang
                      ? 'bg-accent text-eka-dark'
                      : 'bg-card text-muted-foreground/40 hover:bg-accent'
                  }`}
                >
                  {lang === 'ca' && 'Catalan'}
                  {lang === 'en' && 'English'}
                  {lang === 'es' && 'Spanish'}
                  {lang === 'ru' && 'Russian'}
                </button>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center gap-4 border-t border-border pt-8">
            <p className="text-sm text-muted-foreground/60">{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

