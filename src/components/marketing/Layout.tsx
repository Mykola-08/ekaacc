import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import Image from 'next/image';

import ToastContainer from './Toast';
import { OfflineIndicator } from './OfflineIndicator';
import { Language } from '@/context/LanguageTypes';
import { useLanguage } from '@/context/LanguageContext';
import LanguagePopup from '@/components/marketing/LanguagePopup';
import CookieBanner from './CookieBanner';
import { TDRPresentationMode } from '@/components/marketing/TDRPresentationMode';

import { useClickOutside } from '@/hooks/marketing/useClickOutside';
import { useAnalytics } from '@/hooks/marketing/useAnalytics';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { logPageView } = useAnalytics();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Log page views
  useEffect(() => {
    logPageView(location.pathname);
  }, [location.pathname, logPageView]);

  const [showPersonalServices, setShowPersonalServices] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const personalServicesRef = useClickOutside<HTMLDivElement>(() => setShowPersonalServices(false));

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
    /* {
      name: t('nav.vip'),
      href: '/vip',
      isGold: true
    } */
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-card min-h-screen">
      <OfflineIndicator />

      {/* Navigation with scroll effect */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300`}
        style={{
          backgroundColor: isScrolled ? 'rgba(245, 245, 247, 0.9)' : 'var(--background)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              isScrolled ? 'h-14' : 'h-16'
            }`}
          >
            {/* Logo Only - Left Side */}
            <Link to="/" className="group relative flex shrink-0 items-center">
              <Image
                src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png"
                alt="EKA Balance Logo"
                width={40}
                height={40}
                className={`transition-all duration-300 ${
                  isScrolled ? 'h-8 w-8' : 'h-10 w-10'
                } object-contain`}
              />
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
                          to={item.href}
                          className={`nav-trigger hover:bg-card/60 flex items-center rounded-xl px-5 py-3 font-medium transition-all duration-200 ${
                            isActivePath(item.href)
                              ? 'text-primary'
                              : 'text-primary-foreground hover:text-primary'
                          }`}
                          onMouseEnter={openDropdown}
                          onMouseLeave={scheduleHide}
                          onFocus={openDropdown}
                          onBlur={scheduleHide}
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
                          className={`nav-dropdown ${showPersonalServices ? 'is-open' : ''}`}
                          style={{
                            backgroundColor: isScrolled
                              ? 'rgba(245, 245, 247, 0.9)'
                              : 'var(--background)',
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
                              to={dropdownItem.href}
                              onClick={() => setShowPersonalServices(false)}
                              className="text-primary-foreground hover:text-primary flex h-12 items-center justify-center text-sm font-medium transition-colors duration-200"
                              style={{
                                marginBottom: index < item.dropdownItems!.length - 1 ? '8px' : '0',
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
                        className="hover:bg-card/60 text-primary-foreground hover:text-primary rounded-xl px-5 py-3 font-medium transition-all duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(item.href, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className={`hover:bg-card/60 rounded-xl px-5 py-3 font-medium transition-all duration-200 ${
                          item.isGold
                            ? 'gold-shimmer border border-yellow-200/50 bg-linear-to-r from-amber-50 via-yellow-50 to-amber-50 font-black hover:from-yellow-100 hover:via-amber-100 hover:to-yellow-100'
                            : isActivePath(item.href)
                              ? 'text-primary'
                              : 'text-primary-foreground hover:text-primary'
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
            <div className="flex shrink-0 items-center space-x-2 sm:space-x-4">
              {/* EKA Account Link - HIDDEN FOR NOW */}

              {/* Login / User Profile - HIDDEN FOR NOW
              {user ? (
                <div className="hidden sm:flex items-center space-x-3">
                  <Link to="/vip" className="flex items-center space-x-2 group">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <UserIcon className="w-4 h-4 text-yellow-700" />
                    </div>
                    <span className="text-sm font-medium text-primary-foreground group-hover:text-primary transition-colors">
                      {user.user_metadata.full_name || user.email?.split('@')[0]}
                    </span>
                  </Link>
                  <button
                    onClick={signOut}
                    className="text-xs text-muted-foreground hover:text-red-500 transition-colors border border-border px-2 py-1 rounded-md"
                  >
                    {t('footer.logout')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="hidden sm:inline-flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors duration-200 text-primary-foreground"
                  title="Login"
                >
                  <UserIcon className="w-5 h-5" />
                </button>
              )}
              */}

              {/* Reserva Button */}
              <Link
                to="/book"
                className="bg-primary hover:bg-primary/90 text-primary-foreground hidden rounded-full px-6 py-3 font-semibold transition-colors duration-200 sm:inline-flex"
              >
                {t('nav.bookNow')}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:bg-muted rounded-[20px] p-2 transition-colors duration-200 md:hidden"
              >
                {isMenuOpen ? (
                  <X className="text-foreground/90 h-5 w-5" />
                ) : (
                  <Menu className="text-foreground/90 h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="border-t border-gray-100 py-3 md:hidden">
              <div className="space-y-1">
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
                        className="text-foreground/90 hover:bg-muted/30 block rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200 ${
                          item.isGold
                            ? 'border border-amber-100 bg-amber-50 font-bold text-amber-600'
                            : isActivePath(item.href)
                              ? 'text-primary bg-primary/10'
                              : 'text-foreground/90 hover:bg-muted/30'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                    {item.hasDropdown && (
                      <div className="mt-2 ml-4 space-y-1">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-muted-foreground hover:bg-muted/30 block rounded-lg px-4 py-2 text-sm"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Mobile Reserva */}
                <div className="mt-2 space-y-2 border-t border-gray-100 pt-2">
                  {/* EKA Account Link - HIDDEN FOR NOW */}

                  {/* 
                  {user ? (
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-center py-2 text-muted-foreground hover:text-primary"
                    >
                      {t('footer.logout')} ({user.email?.split('@')[0]})
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        signInWithGoogle();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-center py-2 text-primary-foreground font-medium hover:text-primary"
                    >
                      {t('footer.login')}
                    </button>
                  )}
                  */}

                  <Link
                    to="/book"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground block w-full rounded-xl px-4 py-3 text-center font-semibold transition-colors duration-200"
                  >
                    {t('nav.bookNow')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Cookie Banner */}
      <CookieBanner />
      <LanguagePopup />
      <TDRPresentationMode />

      {/* Fixed Mobile Bottom CTA */}
      <div className="bg-card/80 border-border pb-safe fixed right-0 bottom-0 left-0 z-50 border-t p-4 backdrop-blur-md md:hidden">
        <Link
          to="/book"
          className="bg-primary hover:bg-primary/90 text-primary-foreground block w-full rounded-xl py-4 text-center font-bold shadow-lg transition-transform active:scale-[0.98]"
        >
          {t('nav.bookNow')}
        </Link>
      </div>

      {/* Footer */}
      <footer className="mb-24 bg-gray-900 py-12 text-white sm:py-16 md:mb-0">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="group mx-auto mb-8 flex w-fit items-center justify-center space-x-3"
          >
            <div className="relative h-10 w-10">
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
          <div className="mb-8 space-y-2 text-gray-100">
            <p>{t('footer.address')}</p>
            <p>{t('footer.email')}</p>
          </div>

          {/* Footer Links */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              <Link
                to="/discounts"
                className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
              >
                {t('footer.discounts')}
              </Link>
              <Link
                to="/privacy-policy"
                className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                to="/cookie-policy"
                className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
              >
                {t('footer.cookiePolicy')}
              </Link>
              <Link
                to="/terms-of-service"
                className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
              >
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-center space-x-2">
              <Globe className="text-muted-foreground/80 h-4 w-4" />
              <span className="text-muted-foreground/80 text-sm">{t('footer.selectLanguage')}</span>
            </div>
            <div className="flex justify-center space-x-4">
              {(['ca', 'en', 'es', 'ru'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    language === lang
                      ? 'bg-primary text-primary-foreground'
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
            <p className="text-muted-foreground/80 text-sm">{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
