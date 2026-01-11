'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
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
      <div className="min-h-screen bg-white">
      <OfflineIndicator />

      {/* Navigation with scroll effect */}
      {!isAuthPage && (
      <nav className={`sticky top-0 z-50 transition-all duration-300`} style={{
        backgroundColor: isScrolled ? 'rgba(245, 245, 247, 0.9)' : '#F5F5F7'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'
            }`}>
            {/* Logo Only - Left Side */}
            <Link href="/" className="flex items-center flex-shrink-0 group relative">
              <img
                src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png"
                alt="EKA Balance Logo"
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
                          className={`nav-trigger font-medium transition-all duration-200 flex items-center px-5 py-3 rounded-[20px] hover:bg-white/60 ${isActivePath(item.href) ? 'text-[#FFB405]' : 'text-[#000035] hover:text-[#FFB405]'
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
                          style={{
                            backgroundColor: isScrolled ? 'rgba(245, 245, 247, 0.9)' : '#F5F5F7',
                            backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                            WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
                          }}
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
                              className="flex items-center justify-center h-12 text-sm font-medium transition-colors duration-200 text-[#000035] hover:text-[#FFB405]"
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
                        className="font-medium transition-all duration-200 px-5 py-3 rounded-[20px] hover:bg-white/60 text-[#000035] hover:text-[#FFB405]"
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
                        className={`font-medium transition-all duration-200 px-5 py-3 rounded-[20px] hover:bg-white/60 ${item.isGold
                            ? 'gold-shimmer font-black bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-yellow-200/50 hover:from-yellow-100 hover:via-amber-100 hover:to-yellow-100'
                            : isActivePath(item.href) ? 'text-[#FFB405]' : 'text-[#000035] hover:text-[#FFB405]'
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
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              
              {/* User Profile / Login */}
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-[#000035] hover:text-[#FFB405] transition-colors duration-200"
                  >
                    {user.profile?.avatar_url ? (
                      <img 
                        src={user.profile.avatar_url} 
                        alt={user.profile.full_name || 'User'} 
                        className="w-10 h-10 rounded-full border-2 border-[#FFB405] object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#FFB405]/20 flex items-center justify-center border-2 border-[#FFB405]">
                         <UserCircle className="w-6 h-6 text-[#000035]" />
                      </div>
                    )}
                    <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                      {user.profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
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
                        href="/login"
                        className="text-[#000035] hover:text-[#FFB405] font-medium transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-semibold px-5 py-2.5 rounded-full transition-colors duration-200"
                    >
                         Sign up
                    </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
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
                        className="block px-4 py-3 rounded-xl font-medium text-base transition-colors duration-200 text-gray-700 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl font-medium text-base transition-colors duration-200 ${item.isGold
                            ? 'text-amber-600 bg-amber-50 border border-amber-100 font-bold'
                            : isActivePath(item.href) ? 'text-[#FFB405] bg-[#FFB405]/10' : 'text-gray-700 hover:bg-gray-50'
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
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
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
                          <img 
                            src={user.profile.avatar_url} 
                            alt={user.profile.full_name || 'User'} 
                            className="w-10 h-10 rounded-full border border-gray-200"
                          />
                        ) : (
                           <UserCircle className="w-10 h-10 text-gray-400" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{user.profile?.full_name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl font-medium text-base text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left block px-4 py-3 rounded-xl font-medium text-base text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 px-4">
                      <Link
                        href="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex justify-center items-center py-3 rounded-xl font-medium text-base text-[#000035] bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        Log in
                      </Link>
                      <Link
                        href="/signup"
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
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 md:hidden z-50 pb-safe">
        <Link
          href="/booking"
          className="block w-full bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-bold text-center py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
        >
          {t('nav.bookNow')}
        </Link>
      </div>
      */}

      {/* Footer */}
      {!isAuthPage && (
      <footer className="py-12 sm:py-16 bg-gray-900 text-white mb-24 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center space-x-3 mb-8 group w-fit mx-auto">
            <div className="relative w-10 h-10">
              <img
                src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png"
                alt="EKA Balance Logo"
                className="w-10 h-10 object-contain absolute inset-0 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-xl font-medium">EKA Balance</span>
          </Link>

          {/* Contact Info */}
          <div className="space-y-2 mb-8 text-gray-100">
            <p>{t('footer.address')}</p>
            <p>{t('footer.email')}</p>
          </div>

          {/* Footer Links */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              <Link
                href="/discounts"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {t('footer.discounts')}
              </Link>
              <Link
                href="/privacy-policy"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                href="/cookie-policy"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {t('footer.cookiePolicy')}
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">{t('footer.selectLanguage')}</span>
            </div>
            <div className="flex justify-center space-x-4">
              {(['ca', 'en', 'es', 'ru'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${language === lang
                    ? 'bg-[#FFB405] text-[#000035]'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
            <p className="text-sm text-gray-400">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}

