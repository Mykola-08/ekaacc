'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import FooterUncover from '@/marketing/components/FooterUncover';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Globe,
  Hand,
  Brain,
  Apple,
  Pill,
  Network,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Language } from '@/marketing/contexts/LanguageTypes';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { useClickAway } from '@/hooks/use-click-away';
import { useAnalytics } from '@/marketing/hooks/useAnalytics';
import { Button } from '@/marketing/components/ui/button';
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ToastContainer = dynamic(() => import('@/marketing/components/Toast'), { ssr: false });
const LanguagePopup = dynamic(() => import('@/marketing/components/LanguagePopup'), { ssr: false });
const CookieBanner = dynamic(() => import('./CookieBanner'), { ssr: false });
const FooterPillMenu = dynamic(() => import('@/marketing/components/FooterPillMenu'), {
  ssr: false,
});

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { logPageView } = useAnalytics();
  const { isAuthenticated, user, signOut } = useSimpleAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Log page views
  useEffect(() => {
    if (pathname) {
      logPageView(pathname);
    }
  }, [pathname, logPageView]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileCTA, setShowMobileCTA] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  useClickAway(() => setActiveDropdown(null), navRef);

  // Hover intent management for dropdown
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navBarRef = useRef<HTMLDivElement>(null);
  const activeTriggerRef = useRef<HTMLElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    left: number;
    top: number;
    originX: number;
    triggerBottom: number;
    width: number;
  } | null>(null);

  // Calculate where the dropdown should appear relative to the nav bar container
  const computeDropdownPosition = useCallback((triggerElement: HTMLElement) => {
    if (!triggerElement) return;
    const triggerRect = triggerElement.getBoundingClientRect();
    const dropdownWidth = 280; // width of the dropdown panel

    // Center the dropdown under the trigger
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    const idealLeft = triggerCenter - dropdownWidth / 2;

    // Viewport constraints
    const pad = 16;
    const minLeft = pad;
    const maxLeft = document.documentElement.clientWidth - dropdownWidth - pad;

    const clampedLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));

    // Make it attach completely flush with the main header
    const navRect = triggerElement.closest('nav')?.getBoundingClientRect();
    const top = navRect ? navRect.bottom : triggerRect.bottom + 8;

    // Compute transform-origin X percentage based on where the trigger center falls inside the dropdown
    const originX = ((triggerCenter - clampedLeft) / dropdownWidth) * 100;

    setDropdownPosition({
      left: clampedLeft,
      top: top,
      triggerBottom: triggerRect.bottom,
      originX: Math.max(10, Math.min(90, originX)),
      width: dropdownWidth,
    });
  }, []);

  const openDropdown = (e: React.MouseEvent | React.FocusEvent | undefined, id: string) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Check if triggered from an event
    if (e && e.currentTarget) {
      activeTriggerRef.current = e.currentTarget as HTMLElement;
    }

    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    // If a dropdown is already active, skip the delay for swift sequential navigation
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
    }, 200); // Short delay to prevent accidental activation
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
    }, 220); // Short delay before disappearing
  };

  // Close dropdown on scroll or resize to prevent floating incorrectly
  useEffect(() => {
    const handleScrollOrResize = () => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => window.removeEventListener('resize', handleScrollOrResize);
  }, [activeDropdown]);

  // Handle scroll effect for header and mobile CTA
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);

        setIsScrolled((prev) => {
          const next = scrollTop > 20;
          return prev === next ? prev : next;
        });
        setShowMobileCTA((prev) => {
          const next = scrollPercent > 0.7;
          return prev === next ? prev : next;
        });
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
    };
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

  const headerSurfaceClass = isScrolled
    ? 'bg-white/70 backdrop-blur-2xl border-gray-200/50 '
    : 'bg-transparent';

  // Icon map for dropdown items
  const serviceIcons: Record<string, React.ReactNode> = {
    '/services/massage': <Hand className="h-4 w-4" />,
    '/services/kinesiology': <Brain className="h-4 w-4" />,
    '/services/nutrition': <Apple className="h-4 w-4" />,
    '/services/supplements': <Pill className="h-4 w-4" />,
  };

  const navigation: NavItem[] = [
    {
      name: t('nav.services'),
      href: '/services',
      hasDropdown: true,
      dropdownItems: [
        { name: t('services.massage.title'), href: '/services/massage' },
        { name: t('services.kinesiology.title'), href: '/services/kinesiology' },
        { name: t('services.nutrition.title'), href: '/services/nutrition' },
        { name: t('service.supplements.title'), href: '/services/supplements' },
      ],
    },
    {
      name: 'Agenyz',
      href: '/agenyz',
    },
    {
      name: t('nav.revision360'),
      href: '/360-revision',
    },
    {
      name: t('personalizedServices.business'),
      href: '/for-business',
    },
  ];

  return (
    <>
      <FooterUncover
        footer={
          <>
            {/* Footer */}
            <footer className="bg-secondary border-t border-gray-200 py-12 text-gray-900 sm:py-16">
              <div className="mx-auto max-w-[1024px] px-6 text-center">
                {/* Logo */}
                <Link
                  href="/"
                  className="group mx-auto mb-8 flex w-fit items-center justify-center opacity-80 hover:opacity-100"
                >
                  <div className="relative h-8 w-8">
                    <Image
                      src="/images/eka_logo.png"
                      alt="EKA Balance Logo"
                      fill
                      className="object-contain"
                      sizes="32px"
                    />
                  </div>
                  <span className="text-lg font-medium tracking-tight">EKA Balance</span>
                </Link>

                {/* Contact Info */}
                <div className="mb-8 text-xs text-gray-500">
                  <p>Carrer Pelai, 12, 08001 Barcelona</p>
                  <p>contact@ekabalance.com</p>
                </div>

                {/* Footer Links */}
                <div className="mx-auto mb-10 w-full max-w-4xl">
                  <div className="mb-8 grid grid-cols-2 gap-8 px-4 text-left md:grid-cols-4">
                    {/* Column 1: Core Services */}
                    <div className="flex flex-col">
                      <h4 className="mb-2 font-semibold text-gray-900">{t('nav.services')}</h4>
                      <Link
                        href="/services"
                        className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('nav.services')}
                      </Link>
                      <Link
                        href="/personalized-services"
                        className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('nav.personalizedServices')}
                      </Link>
                      <Link
                        href="/for-business"
                        className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('personalizedServices.business')}
                      </Link>
                      <Link
                        href="/vip"
                        className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('nav.vip')}
                      </Link>
                    </div>

                    {/* Column 2: Specific Modalities */}
                    <div className="flex flex-col">
                      <h4 className="mb-2 font-semibold text-gray-900">EKA Balance</h4>
                      <Link
                        href="/360-revision"
                        className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('nav.revision360')}
                      </Link>
                      <Link
                        href="/first-time"
                        className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('hero.firstTime')}
                      </Link>
                    </div>

                    {/* Column 3: Company */}
                    <div className="flex flex-col">
                      <h4 className="mb-2 font-semibold text-gray-900">{t('nav.aboutElena')}</h4>
                      <Link
                        href="/about-elena"
                        className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('nav.aboutElena')}
                      </Link>
                      <Link
                        href="/booking"
                        className="text-primary text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('nav.bookNow')}
                      </Link>
                    </div>

                    {/* Column 4: Resources */}
                    <div className="flex flex-col">
                      <h4 className="mb-2 font-semibold text-gray-900">Legal</h4>
                      <Link
                        href="/discounts"
                        className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('footer.discounts')}
                      </Link>
                      <Link
                        href="/privacy-policy"
                        className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('footer.privacyPolicy')}
                      </Link>
                      <Link
                        href="/cookie-policy"
                        className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('footer.cookiePolicy')}
                      </Link>
                      <Link
                        href="/terms-of-service"
                        className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
                      >
                        {t('footer.termsOfService')}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Language Selector */}
                <div className="mb-8">
                  <div className="mb-4 flex items-center justify-center">
                    <Globe className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{t('footer.selectLanguage')}</span>
                  </div>
                  <div className="flex justify-center">
                    {(['ca', 'en', 'es', 'ru'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`rounded px-2 py-1 text-xs transition-colors duration-200 ${
                          language === lang
                            ? 'bg-gray-200 font-medium text-black'
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
          </>
        }
      >
        {/* Main Content Container inside Uncover */}

        {/* Navigation with scroll effect - Liquid Glass Style */}
        <nav
          className={`fixed top-0 left-0 z-[100] w-full border-b border-transparent transition duration-500 ${headerSurfaceClass}`}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              {/* Logo Only - Left Side - INCREASED SIZE */}
              <Link
                href="/"
                className="group relative flex flex-shrink-0 items-center opacity-90 transition-opacity hover:opacity-100"
              >
                <div className="relative h-8 w-8">
                  {' '}
                  {/* Increased from w-5 h-5 */}
                  <Image
                    src="/images/eka_logo.png"
                    alt="EKA Balance Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Desktop Navigation - Centered - Apple Style */}
              <div
                ref={navBarRef}
                className="relative hidden items-center justify-center gap-6 md:flex"
              >
                {navigation.map((item) => (
                  <div
                    key={item.name}
                    className={`nav-item ${item.hasDropdown ? 'relative flex h-full items-center' : 'flex h-full items-center'}`}
                    ref={item.hasDropdown ? navRef : undefined}
                  >
                    {item.hasDropdown ? (
                      <>
                        <Link
                          href={item.href}
                          className="nav-trigger group/trigger flex items-center gap-1 py-4 text-[13px] font-medium tracking-tight text-gray-800 transition-colors duration-200 hover:text-black"
                          onMouseEnter={(e) => openDropdown(e, item.name)}
                          onMouseLeave={scheduleHide}
                          onFocus={(e) => openDropdown(e, item.name)}
                          onBlur={scheduleHide}
                          suppressHydrationWarning
                        >
                          {item.name}
                          <ChevronDown
                            className={`h-3 w-3 text-gray-400 transition-transform duration-300 ${activeDropdown === item.name ? 'rotate-180 text-gray-700' : 'group-hover/trigger:translate-y-[1px]'}`}
                          />
                        </Link>

                        {/* Hover bridge & Dropdown Container via CSS */}
                          <AnimatePresence>
                            {activeDropdown === item.name && (
                              <motion.div
                                initial={{ opacity: 0, scaleY: 0.95, y: -4 }}
                                animate={{ opacity: 1, scaleY: 1, y: 0 }}
                                exit={{ opacity: 0, scaleY: 0.95, y: -4 }}
                                transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
                                className="absolute top-full left-1/2 z-40 w-[280px] -translate-x-1/2 pt-4"
                                style={{ transformOrigin: 'top center' }}
                                onMouseEnter={() => keepMenuOpen(item.name)}
                                onMouseLeave={scheduleHide}
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') {
                                    setActiveDropdown(null);
                                  }
                                }}
                                role="menu"
                                aria-label={`${item.name} submenu`}
                              >
                                {/* Invisible padding zone for hover target bridge */}
                                <div className="absolute inset-x-[-40px] top-0 h-8" aria-hidden="true" />
                                {/* Inner content wrapper with the actual visual styling */}
                              <div className="relative mx-auto w-[280px] overflow-hidden rounded-b-2xl border border-t-0 border-white/60 bg-white/95 ring-1 ring-black/[0.04] drop-shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
                                {/* Subtle blend line at the top connection point */}
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-white/40" />

                                <div className="relative z-20 px-1.5 py-2">
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
                                        className="group/item mx-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] tracking-tight text-gray-600 transition-all duration-150 hover:bg-black/[0.04] hover:text-gray-900 active:bg-black/[0.07]"
                                        role="menuitem"
                                        suppressHydrationWarning
                                      >
                                        <span className="group-hover/item:bg-primary/10 group-hover/item:text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100/80 text-gray-500 transition-colors duration-150">
                                          {serviceIcons[dropdownItem.href] || (
                                            <Hand className="h-4 w-4" />
                                          )}
                                        </span>
                                        <span className="font-medium">{dropdownItem.name}</span>
                                      </Link>
                                    </motion.div>
                                  ))}
                                </div>

                                {/* View all services link at the bottom */}
                                <div className="relative z-20 border-t border-gray-200/50 px-3 py-2.5">
                                  <Link
                                    href={item.href}
                                    onClick={() => setActiveDropdown(null)}
                                    className="hover:text-primary flex items-center justify-between px-1.5 text-[12px] font-medium text-gray-400 transition-colors duration-150"
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
                        className="-mx-4 px-4 py-4 text-[13px] font-medium tracking-tight text-gray-800 transition-colors duration-200 hover:text-black"
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
                        className="py-4 text-[13px] font-medium tracking-tight text-gray-800 transition-colors duration-200 hover:text-black"
                        suppressHydrationWarning
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Right side actions - Search/Bag style icons usually, here just Booking CTA but simpler */}
              <div className="flex flex-shrink-0 items-center gap-3">
                {/* Auth UI */}
                <div className="hidden items-center tracking-tight sm:flex">
                  {isAuthenticated ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-200 focus:outline-none">
                          {user?.user_metadata?.avatar_url ? (
                            <img
                              src={user.user_metadata.avatar_url}
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 p-2">
                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer gap-2 rounded-md p-2 text-sm"
                        >
                          <Link href="/dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            {t('nav.dashboard')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => signOut()}
                          className="cursor-pointer gap-2 rounded-md p-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-700"
                        >
                          <LogOut className="h-4 w-4" />
                          {t('auth.signOut')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full px-4 text-[12px] font-medium transition-colors hover:bg-gray-100/50"
                    >
                      <Link href="/login" suppressHydrationWarning>
                        {t('auth.signIn')}
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Reserva Button - Visible on mobile now */}
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="inline-flex h-7 rounded-full px-3 text-[11px] font-medium sm:h-8 sm:px-4 sm:text-[12px]"
                >
                  <Link href="/booking" suppressHydrationWarning>
                    {t('nav.bookNow')}
                  </Link>
                </Button>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="ml-1 p-1 text-gray-800 transition-colors hover:text-black md:hidden"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                  className="fixed inset-0 z-[110] h-[100dvh] w-full overflow-y-auto bg-[#f5f5f7] pt-[80px] md:hidden"
                >
                  {/* Close button inside mobile menu to ensure it can be closed if overlapping the header */}
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-4 right-6 p-2 text-gray-800 transition-colors hover:text-black"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <div className="p-6 pb-24">
                    {/* Home */}
                    <div className="border-b border-gray-200/50 pb-4">
                      <Link
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-2xl font-semibold tracking-tight text-gray-900"
                      >
                        {t('nav.home')}
                      </Link>
                    </div>

                    {/* Services */}
                    <div className="border-b border-gray-200/50 pb-4">
                      <Link
                        href="/services"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-2xl font-semibold tracking-tight text-gray-900"
                      >
                        {t('nav.services')}
                      </Link>
                      <div className="mt-2 ml-4">
                        {navigation
                          .find((n) => n.name === t('nav.services'))
                          ?.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-2 pl-4 text-lg font-medium text-gray-500"
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
                        className="block py-3 text-2xl font-semibold tracking-tight text-gray-900"
                      >
                        {t('personalizedServices.business')}
                      </Link>
                    </div>

                    {/* Mobile Reserva */}
                    <div className="pt-4">
                      <Button
                        asChild
                        variant="default"
                        size="lg"
                        className="w-full rounded-xl text-base font-semibold"
                      >
                        <Link href="/booking" onClick={() => setIsMenuOpen(false)}>
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
        <main id="main-content" className="w-full flex-1 overflow-x-hidden pt-14 pb-20 md:pb-0">
          {children}
        </main>

        {/* Toast Notifications */}
        <ToastContainer />

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
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="md:hidden"
          >
            <FooterPillMenu />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
