'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Calendar, Briefcase, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { cn } from '@/marketing/shared/utils';

export default function FooterPillMenu() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/services', label: t('nav.services'), icon: Sparkles },
    { href: '/for-business', label: t('personalizedServices.business'), icon: Briefcase },
    { href: '/booking', label: t('nav.bookNow'), icon: Calendar },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4">
      <nav className="flex items-center justify-between gap-1 rounded-full border border-white/20 bg-white/90 px-1.5 py-1.5 ring-1 ring-black/5 backdrop-blur-lg sm:px-2 sm:py-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex w-auto min-w-[3.5rem] flex-1 flex-col items-center justify-center rounded-full py-1 transition-all duration-300',
                isActive ? '-primary font-medium' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              <div
                className={cn(
                  'relative rounded-full p-1.5 transition-all duration-300 sm:p-2',
                  isActive ? 'bg-gold/20' : 'bg-transparent group-hover:bg-gray-100'
                )}
              >
                <item.icon className={cn('h-4 w-4 sm:h-5 sm:w-5', isActive && 'fill-current')} />
              </div>

              <span className="mt-0.5 max-w-[4rem] overflow-hidden text-center text-[9px] leading-tight text-ellipsis whitespace-nowrap sm:max-w-none sm:text-[10px]">
                {item.label}
              </span>

              {isActive && (
                <motion.span
                  layoutId="pill-active"
                  className="bg-gold absolute -bottom-1 h-1 w-1 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
