'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Globe, User as UserIcon, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/platform/auth-context';

import ToastContainer from '@/react-app/components/Toast';
import { OfflineIndicator } from '@/react-app/components/OfflineIndicator';
import { Language } from '@/react-app/contexts/LanguageTypes';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import LanguagePopup from '@/react-app/components/LanguagePopup';
import CookieBanner from './CookieBanner';
import { TDRPresentationMode } from '@/react-app/components/TDRPresentationMode';

import { useClickOutside } from '@/react-app/hooks/useClickOutside';
import { useAnalytics } from '@/react-app/hooks/useAnalytics';

import { BOOKING_APP_URL } from '@/lib/config';

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const { logPageView } = useAnalytics();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Log page views
  useEffect(() => {
    if (pathname) {
      logPageView(pathname);
    }
  }, [pathname, logPageView]);

  const [showPersonalServices, setShowPersonalServices] = useState(false);
  const personalServicesRef = useClickOutside<HTMLDivElement>(() => setShowPersonalServices(false));
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuthPage = pathname?.startsWith('/login') ||
    pathname?.startsWith('/signup') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password') ||
    pathname?.startsWith('/auth');

  // Hover intent management for dropdown
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      href: '/services'
    },
    {
      name: 'Agenyz',
      href: '/agenyz'
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
      ]
    },
    {
      name: t('nav.casos'),
      href: '/cases'
    },
    {
      name: t('nav.revision360'),
      href: '/360-revision'
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
    <div className="min-h-screen bg-card">
      <OfflineIndicator />

      {/* Navigation with scroll effect */}
      {!isAuthPage && !pathname?.includes('360-revision') && (
        <nav className={`plain-nav`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'
              }`}>
              {/* Logo Only - Left Side */}
              <Link href="/" className="flex items-center shrink-0 group relative">
                <Image
                  src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png"
                  alt="EKA Balance Logo"
                  width={40}
                  height={40}
                  className={`transition-all duration-300 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                    } object-contain`}
                />
              </Link>

              {/* Desktop Navigation - Centered */}
              <div className="hidden md:flex items-center justify-center flex-1 mx-8">
                <div className="flex items-center space-x-2">
                  {navigation.map(item => (
                    <div key={item.name} className={`nav-item ${item.hasDropdown ? 'relative' : ''}`}
                      ref={item.hasDropdown ? personalServicesRef : undefined}>
                      {item.hasDropdown ? (
                        <>
                          <Link
                            href={item.href}
                            className={`nav-trigger font-medium transition-all duration-200 flex items-center px-4 py-2 rounded-full hover:bg-black/5 ${isActivePath(item.href) ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                              }`}
                            onMouseEnter={openDropdown}
                            onMouseLeave={scheduleHide}
                            onFocus={openDropdown}
                            onBlur={scheduleHide}
                          >
                            {item.name}
                            <ChevronDown className="ml-1 w-4 h-4" />
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
                            className={`nav-dropdown ${showPersonalServices ? 'is-open' : ''}`}
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
                                className="flex items-center justify-center h-12 text-sm font-medium transition-colors duration-200 text-foreground hover:text-primary"
                                style={{
                                  marginBottom: index < item.dropdownItems!.length - 1 ? '8px' : '0'
                                }}
                                role="menuitem"
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
                          className="font-medium transition-all duration-200 px-5 py-3 rounded-lg hover:bg-white/60 text-foreground hover:text-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(item.href, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className={`font-medium transition-all duration-200 px-4 py-2 rounded-full hover:bg-black/5 ${item.isGold
                            ? 'gold-shimmer font-bold text-amber-600'
                            : isActivePath(item.href) ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                            }`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">

                {/* User Profile / Login */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
                    >
                      {user.profile?.avatar_url ? (
                        <Image
                          src={user.profile.avatar_url}
                          alt={user.profile.full_name || 'User'}
                          width={40}
                          height={40}
                          unoptimized
                          className="rounded-full border-2 border-primary object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                          <UserCircle className="w-6 h-6 text-foreground" />
                        </div>
                      )}
                      <span className="hidden sm:inline font-medium max-w-25 truncate">
                        {user.profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg py-1 border border-border ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.profile?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-foreground/90 hover:bg-muted/30"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center space-x-3">
                    <Link
                      href={`${BOOKING_APP_URL}/login`}
                      className="text-foreground hover:text-primary font-medium transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href={`${BOOKING_APP_URL}/signup`}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                    >
                      Sign up
                    </Link>
                  </div>
                )}

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-2xl hover:bg-muted transition-colors duration-200"
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5 text-foreground/90" />
                  ) : (
                    <Menu className="w-5 h-5 text-foreground/90" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden border-t border-gray-100 py-3">
                <div className="space-y-1">
                  {navigation.map(item => (
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
                          className="block px-4 py-3 rounded-xl font-medium text-base transition-colors duration-200 text-foreground/90 hover:bg-muted/30"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block px-4 py-3 rounded-xl font-medium text-base transition-colors duration-200 ${item.isGold
                            ? 'text-amber-600 bg-amber-50 border border-amber-100 font-bold'
                            : isActivePath(item.href) ? 'text-primary bg-primary/10' : 'text-foreground/90 hover:bg-muted/30'
                            }`}
                        >
                          {item.name}
                        </Link>
                      )}
                      {item.hasDropdown && (
                        <div className="ml-4 space-y-1 mt-2">
                          {item.dropdownItems?.map(dropdownItem => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted/30 rounded-xl"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Mobile Auth / Profile */}
                  <div className="pt-2 border-t border-gray-100 mt-2 space-y-2">
                    {user ? (
                      <>
                        <div className="flex items-center px-4 py-2 space-x-3">
                          {user.profile?.avatar_url ? (
                            <Image
                              src={user.profile.avatar_url}
                              alt={user.profile.full_name || 'User'}
                              width={40}
                              height={40}
                              unoptimized
                              className="rounded-full border border-border"
                            />
                          ) : (
                            <UserCircle className="w-10 h-10 text-muted-foreground/80" />
                          )}
                          <div>
                            <p className="font-medium text-foreground">{user.profile?.full_name || 'User'}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-50">{user.email}</p>
                          </div>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-3 rounded-xl font-medium text-base text-foreground/90 hover:bg-muted/30"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl font-medium text-base text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <LogOut className="w-5 h-5 mr-2" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 px-4">
                        <Link
                          href={`${BOOKING_APP_URL}/login`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex justify-center items-center py-3 rounded-xl font-medium text-base text-[#000035] bg-muted hover:bg-gray-200 transition-colors"
                        >
                          Log in
                        </Link>
                        <Link
                          href={`${BOOKING_APP_URL}/signup`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex justify-center items-center py-3 rounded-xl font-medium text-[#000035] bg-[#FFB405] hover:bg-[#e8a204] transition-colors"
                        >
                          Sign up
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Cookie Banner */}
      <CookieBanner />
      <LanguagePopup />
      <Suspense fallback={null}>
        <TDRPresentationMode />
      </Suspense>

      {/* Fixed Mobile Bottom CTA - Removed as per integration request */}
      {/* 
   <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/80 backdrop-blur-md border-t border-border md:hidden z-50 pb-safe">
    <Link
     href={BOOKING_APP_URL}
     className="block w-full bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-bold text-center py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
    >
     {t('nav.bookNow')}
    </Link>
   </div>
   */}

      {/* Footer */}
      {!isAuthPage && !pathname?.includes('360-revision') && (
        <footer className="py-16 sm:py-24 bg-white text-foreground border-t border-black/5 mb-24 md:mb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center space-x-3 mb-8 group w-fit mx-auto">
              <div className="relative w-10 h-10">
                <Image
                  src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png"
                  alt="EKA Balance Logo"
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="40px"
                />
              </div>
              <span className="text-xl font-medium">EKA Balance</span>
            </Link>

            {/* Contact Info */}
            <div className="space-y-2 mb-10 text-muted-foreground">
              <p className="text-lg">{t('footer.address')}</p>
              <p className="text-lg">{t('footer.email')}</p>
            </div>

            {/* Footer Links */}
            <div className="mb-10">
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                <Link
                  href="/discounts"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  {t('footer.discounts')}
                </Link>
                <Link
                  href="/legal/privacy-policy"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  {t('footer.privacyPolicy')}
                </Link>
                <Link
                  href="/legal/cookie-policy"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  {t('footer.cookiePolicy')}
                </Link>
                <Link
                  href="/legal/terms-of-service"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  {t('footer.termsOfService')}
                </Link>
              </div>
            </div>

            {/* Language Selector */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Globe className="w-4 h-4 text-muted-foreground/80" />
                <span className="text-sm text-muted-foreground/80">{t('footer.selectLanguage')}</span>
              </div>
              <div className="flex justify-center space-x-3">
                {(['ca', 'en', 'es', 'ru'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${language === lang
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                      : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                  >
                    {lang === 'ca' && 'Català'}
                    {lang === 'en' && 'English'}
                    {lang === 'es' && 'Español'}
                    {lang === 'ru' && 'Русский'}
                  </button>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 pt-8">
              <p className="text-sm text-muted-foreground/80">
                {t('footer.copyright')}
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

