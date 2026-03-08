'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import FooterUncover from '@/components/marketing/FooterUncover';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Hand, Brain, Apple, Pill, Network, RotateCcw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Language } from '@/context/marketing/LanguageTypes';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { useClickOutside } from '@/hooks/marketing/useClickOutside';
import { useAnalytics } from '@/hooks/marketing/useAnalytics';
import { Button } from '@/components/ui/button';

const LanguagePopup = dynamic(() => import('@/components/marketing/LanguagePopup'), { ssr: false });
const CookieBanner = dynamic(() => import('./CookieBanner'), { ssr: false });
const FooterPillMenu = dynamic(() => import('@/components/marketing/FooterPillMenu'), { ssr: false });

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

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useClickOutside<HTMLDivElement>(() => setActiveDropdown(null));

  // Hover intent management for dropdown
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navBarRef = useRef<HTMLDivElement>(null);
  const activeTriggerRef = useRef<HTMLElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number; originX: number; triggerBottom: number; width: number } | null>(null);

  // Calculate where the dropdown should appear relative to the nav bar container
  const computeDropdownPosition = useCallback((triggerElement: HTMLElement) => {
    if (!triggerElement) return;
    const triggerRect = triggerElement.getBoundingClientRect();
    const dropdownWidth = 280;

    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    const idealLeft = triggerCenter - dropdownWidth / 2;

    const pad = 16;
    const minLeft = pad;
    const maxLeft = document.documentElement.clientWidth - dropdownWidth - pad;
    const clampedLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));

    const navRect = triggerElement.closest('nav')?.getBoundingClientRect();
    const top = navRect ? navRect.bottom : triggerRect.bottom + 8;

    const originX = ((triggerCenter - clampedLeft) / dropdownWidth) * 100;

    setDropdownPosition({
      left: clampedLeft,
      top: top,
      triggerBottom: triggerRect.bottom,
      originX: Math.max(10, Math.min(90, originX)),
      width: dropdownWidth
    });
  }, []);

  const openDropdown = (e: React.MouseEvent | React.FocusEvent | undefined, id: string) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (e && e.currentTarget) {
      activeTriggerRef.current = e.currentTarget as HTMLElement;
    }

    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    if (activeDropdown) {
      setActiveDropdown(id);
      if (activeTriggerRef.current) {
        computeDropdownPosition(activeTriggerRef.current);
      }
      return;
    }

    showTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(id);
      if (activeTriggerRef.current) {
        computeDropdownPosition(activeTriggerRef.current);
      }
    }, 200);
  };

  const keepMenuOpen = (id: string) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    setActiveDropdown(id);
  };

  const scheduleHide = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  // Close dropdown on resize
  useEffect(() => {
    const handleResize = () => {
      if (activeDropdown) setActiveDropdown(null);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [activeDropdown]);

  // Handle scroll effect for header
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        setIsScrolled((prev) => {
          const next = window.scrollY > 20;
          return prev === next ? prev : next;
        });
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    };
  }, []);

  // Navigation items
  interface NavItem {
    name: string;
    href: string;
    hasDropdown?: boolean;
    dropdownItems?: { name: string; href: string }[];
    isExternal?: boolean;
  }

  const headerSurfaceClass = isScrolled
    ? 'bg-white/70 backdrop-blur-2xl border-gray-200/50'
    : 'bg-transparent';

  // Icon map for dropdown items
  const serviceIcons: Record<string, React.ReactNode> = {
    '/services/massage': <Hand className="w-4 h-4" />,
    '/services/kinesiology': <Brain className="w-4 h-4" />,
    '/services/nutrition': <Apple className="w-4 h-4" />,
    '/services/supplements': <Pill className="w-4 h-4" />,
    '/services/systemic': <Network className="w-4 h-4" />,
    '/360-revision': <RotateCcw className="w-4 h-4" />,
  };

  const navigation: NavItem[] = [
    {
      name: t('nav.services'),
      href: '/services',
      hasDropdown: true,
      dropdownItems: [
        { name: t('services.massage.title') || 'Massage', href: '/services/massage' },
        { name: t('services.kinesiology.title') || 'Kinesiology', href: '/services/kinesiology' },
        { name: t('services.nutrition.title') || 'Nutrition', href: '/services/nutrition' },
        { name: t('service.supplements.title') || 'Supplements', href: '/services/supplements' },
        { name: t('service.systemic.title') || 'Systemic', href: '/services/systemic' },
        { name: t('services.revision360.title') || '360° Revision', href: '/360-revision' },
      ]
    },
    {
      name: 'Agenyz',
      href: '/agenyz'
    },
    {
      name: t('nav.revision360'),
      href: '/360-revision'
    },
    {
      name: t('personalizedServices.business') || 'For Business',
      href: '/for-business'
    },
  ];

  return (
    <>
      <FooterUncover
        footer={
          <footer className="py-12 sm:py-16 bg-secondary text-gray-900 border-t border-gray-200">
            <div className="max-w-5xl mx-auto px-6 text-center">
              {/* Logo */}
              <Link href="/" className="flex items-center justify-center space-x-2 mb-8 group w-fit mx-auto opacity-80 hover:opacity-100">
                <div className="relative w-8 h-8">
                  <Image
                    src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png"
                    alt="EKA Balance Logo"
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
                <span className="text-lg font-medium tracking-tight">EKA Balance</span>
              </Link>

              {/* Contact Info */}
              <div className="space-y-1 mb-8 text-gray-500 text-xs">
                <p>Carrer Pelai, 12, 08001 Barcelona</p>
                <p>contact@ekabalance.com</p>
              </div>

              {/* Footer Links */}
              <div className="mb-10 w-full max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left mb-8 px-4">
                  {/* Column 1: Core Services */}
                  <div className="flex flex-col space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('nav.services')}</h4>
                    <Link href="/services" className="text-gray-500 hover:text-black transition-colors duration-200 text-sm">
                      {t('nav.services')}
                    </Link>
                    <Link href="/personalized-services" className="text-gray-500 hover:text-black transition-colors duration-200 text-sm">
                      {t('nav.personalizedServices')}
                    </Link>
                    <Link href="/for-business" className="text-gray-500 hover:text-black transition-colors duration-200 text-sm">
                      {t('personalizedServices.business')}
                    </Link>
                  </div>

                  {/* Column 2: EKA Balance */}
                  <div className="flex flex-col space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-2">EKA Balance</h4>
                    <Link href="/360-revision" className="text-gray-500 hover:text-black transition-colors duration-200 text-sm">
                      {t('nav.revision360')}
                    </Link>
                    <Link href="/first-time" className="text-gray-500 hover:text-black transition-colors duration-200 text-sm">
                      {t('hero.firstTime')}
                    </Link>
                  </div>

                  {/* Column 3: About & Booking */}
                  <div className="flex flex-col space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('nav.aboutElena')}</h4>
                    <Link href="/about-elena" className="text-gray-500 hover:text-black transition-colors duration-200 text-sm">
                      {t('nav.aboutElena')}
                    </Link>
                    <Link href="/reservar" className="hover:text-black transition-colors duration-200 text-sm font-medium text-primary">
                      {t('nav.bookNow')}
                    </Link>
                    <Link href="/login" className="text-gray-500 hover:text-black transition-colors duration-200 text-sm">
                      {t('nav.login')}
                    </Link>
                  </div>

                  {/* Column 4: Legal */}
                  <div className="flex flex-col space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Legal</h4>
                    <Link href="/discounts" className="text-gray-500 hover:text-black transition-colors duration-200 text-sm">
                      {t('footer.discounts')}
                    </Link>
                    <Link href="/legal/privacy" className="text-gray-500 hover:text-black transition-colors duration-200 text-sm">
                      {t('footer.privacyPolicy')}
                    </Link>
                    <Link href="/legal/cookie-policy" className="text-gray-500 hover:text-black transition-colors duration-200 text-sm">
                      {t('footer.cookiePolicy')}
                    </Link>
                    <Link href="/legal/terms" className="text-gray-500 hover:text-black transition-colors duration-200 text-sm">
                      {t('footer.termsOfService')}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Language Selector */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Globe className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{t('footer.selectLanguage')}</span>
                </div>
                <div className="flex justify-center space-x-2">
                  {(['ca', 'en', 'es', 'ru'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-2 py-1 rounded text-xs transition-colors duration-200 ${
                        language === lang
                          ? 'bg-gray-200 text-black font-medium'
                          : 'text-gray-500 hover:bg-gray-100'
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
              <div className="border-t border-gray-200 pt-8">
                <p className="text-xs text-gray-400">{t('footer.copyright')}</p>
              </div>
            </div>
          </footer>
        }
      >
        {/* Navigation - Liquid Glass Style */}
        <nav className={`sticky top-0 z-100 transition duration-500 border-b border-transparent ${headerSurfaceClass}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <Link href="/" className="flex items-center shrink-0 group relative opacity-90 hover:opacity-100 transition-opacity">
                <div className="relative w-8 h-8">
                  <Image
                    src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png"
                    alt="EKA Balance Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Desktop Navigation - Centered */}
              <div ref={navBarRef} className="hidden md:flex items-center justify-center space-x-8 relative">
                {navigation.map(item => (
                  <div key={item.name} className={`nav-item ${item.hasDropdown ? 'relative flex items-center h-full' : 'flex items-center h-full'}`}
                    ref={item.hasDropdown ? navRef : undefined}>
                    {item.hasDropdown ? (
                      <>
                        <Link
                          href={item.href}
                          className="nav-trigger py-4 px-4 -mx-4 text-[13px] font-medium text-gray-800 hover:text-black transition-colors duration-200 flex items-center gap-1 tracking-tight group/trigger"
                          onMouseEnter={(e) => openDropdown(e, item.name)}
                          onMouseLeave={scheduleHide}
                          onFocus={(e) => openDropdown(e, item.name)}
                          onBlur={scheduleHide}
                          suppressHydrationWarning
                        >
                          {item.name}
                          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${activeDropdown === item.name ? 'rotate-180 text-gray-700' : 'group-hover/trigger:translate-y-px'}`} />
                        </Link>

                        {/* Hover bridge */}
                        {activeDropdown === item.name && dropdownPosition && (
                          <div
                            className="fixed z-49"
                            style={{
                              top: dropdownPosition.triggerBottom - 15,
                              left: dropdownPosition.left - 30,
                              width: dropdownPosition.width + 60,
                              height: dropdownPosition.top - dropdownPosition.triggerBottom + 30,
                            }}
                            onMouseEnter={() => keepMenuOpen(item.name)}
                            onMouseLeave={scheduleHide}
                            aria-hidden="true"
                          />
                        )}

                        {/* Dropdown */}
                        <AnimatePresence>
                          {activeDropdown === item.name && dropdownPosition && (
                            <motion.div
                              initial={{ opacity: 0, scaleY: 0.95, y: -4 }}
                              animate={{ opacity: 1, scaleY: 1, y: 0 }}
                              exit={{ opacity: 0, scaleY: 0.95, y: -4 }}
                              transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
                              className="fixed z-40"
                              style={{
                                top: dropdownPosition.triggerBottom,
                                left: dropdownPosition.left - 40,
                                width: dropdownPosition.width + 80,
                                transformOrigin: `${40 + (dropdownPosition.originX / 100 * dropdownPosition.width)}px top`,
                                paddingTop: Math.max(0, dropdownPosition.top - dropdownPosition.triggerBottom),
                                paddingLeft: 40,
                                paddingRight: 40,
                                paddingBottom: 40,
                              }}
                              onMouseEnter={() => keepMenuOpen(item.name)}
                              onMouseLeave={scheduleHide}
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') setActiveDropdown(null);
                              }}
                              role="menu"
                              aria-label={`${item.name} submenu`}
                            >
                              <div className="w-70 mx-auto overflow-hidden drop-shadow-[0_12px_40px_rgba(0,0,0,0.08)] relative bg-white/95 backdrop-blur-2xl rounded-b-2xl border border-t-0 border-white/60 ring-1 ring-black/4">
                                <div className="absolute inset-x-0 top-0 h-px bg-white/40" />

                                <div className="py-2 px-1.5 relative z-20">
                                  {item.dropdownItems?.map((dropdownItem, idx) => (
                                    <motion.div
                                      key={dropdownItem.name}
                                      initial={{ opacity: 0, y: 4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.18, delay: idx * 0.035 }}
                                    >
                                      <Link
                                        href={dropdownItem.href}
                                        onClick={() => setActiveDropdown(null)}
                                        className="group/item flex items-center gap-3 px-3 py-2.5 mx-0.5 rounded-xl text-[13px] text-gray-600 hover:text-gray-900 hover:bg-black/4 active:bg-black/[0.07] transition-all duration-150 tracking-tight"
                                        role="menuitem"
                                        suppressHydrationWarning
                                      >
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100/80 text-gray-500 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors duration-150 shrink-0">
                                          {serviceIcons[dropdownItem.href] || <Hand className="w-4 h-4" />}
                                        </span>
                                        <span className="font-medium">{dropdownItem.name}</span>
                                      </Link>
                                    </motion.div>
                                  ))}
                                </div>

                                {/* View all services link */}
                                <div className="border-t border-gray-200/50 px-3 py-2.5 relative z-20">
                                  <Link
                                    href={item.href}
                                    onClick={() => setActiveDropdown(null)}
                                    className="flex items-center justify-between text-[12px] text-gray-400 hover:text-primary font-medium transition-colors duration-150 px-1.5"
                                  >
                                    <span>{t('nav.services')} →</span>
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : item.isExternal ? (
                      <a
                        href={item.href}
                        rel="noopener noreferrer"
                        className="py-4 px-4 -mx-4 text-[13px] font-medium text-gray-800 hover:text-black transition-colors duration-200 tracking-tight"
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
                        className="py-4 px-4 -mx-4 text-[13px] font-medium text-gray-800 hover:text-black transition-colors duration-200 tracking-tight"
                        suppressHydrationWarning
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-[12px] font-medium text-gray-600 hover:text-black transition-colors px-3 py-1.5"
                >
                  {t('nav.login')}
                </Link>

                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="inline-flex text-[11px] sm:text-[12px] font-medium rounded-full h-7 sm:h-8 px-3 sm:px-4"
                >
                  <Link href="/reservar" suppressHydrationWarning>
                    {t('nav.bookNow')}
                  </Link>
                </Button>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-1 text-gray-800 hover:text-black transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="md:hidden fixed inset-0 w-full h-dvh bg-[#f5f5f7] z-110 overflow-y-auto pt-20"
                >
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-4 right-6 p-2 text-gray-800 hover:text-black transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="p-6 pb-24 space-y-6">
                    {/* Home */}
                    <div className="border-b border-gray-200/50 pb-4">
                      <Link
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-2xl font-semibold text-gray-900 tracking-tight"
                      >
                        {t('nav.home') || 'Home'}
                      </Link>
                    </div>

                    {/* Services */}
                    <div className="border-b border-gray-200/50 pb-4">
                      <Link
                        href="/services"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-2xl font-semibold text-gray-900 tracking-tight"
                      >
                        {t('nav.services')}
                      </Link>
                      <div className="ml-4 space-y-2 mt-2">
                        {navigation.find(n => n.name === t('nav.services'))?.dropdownItems?.map(dropdownItem => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 text-lg text-gray-500 font-medium pl-4"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* For Business */}
                    <div className="border-b border-gray-200/50 pb-4">
                      <Link
                        href="/for-business"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-2xl font-semibold text-gray-900 tracking-tight"
                      >
                        {t('personalizedServices.business') || 'For Business'}
                      </Link>
                    </div>

                    {/* Dashboard */}
                    <div className="border-b border-gray-200/50 pb-4">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-2xl font-semibold text-gray-900 tracking-tight"
                      >
                        Dashboard
                      </Link>
                    </div>

                    {/* Mobile Booking CTA */}
                    <div className="pt-4">
                      <Button asChild variant="default" size="lg" className="w-full text-base font-semibold rounded-xl">
                        <Link href="/reservar" onClick={() => setIsMenuOpen(false)}>
                          {t('nav.bookNow')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Main Content */}
        <main id="main-content" className="flex-1 w-full pb-20 md:pb-0 overflow-x-hidden">
          {children}
        </main>

        {/* Cookie Banner */}
        <CookieBanner />
        <LanguagePopup />
      </FooterUncover>

      <AnimatePresence>
        {!isMenuOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="md:hidden"
          >
            <FooterPillMenu />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
