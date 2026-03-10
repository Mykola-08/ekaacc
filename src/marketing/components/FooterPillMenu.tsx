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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <nav className="bg-white/90 backdrop-blur-lg border border-white/20  rounded-full px-1.5 py-1.5 sm:px-2 sm:py-2 flex justify-between items-center ring-1 ring-black/5 gap-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-auto min-w-[3.5rem] flex-1 py-1 rounded-full transition-all duration-300 relative group",
                 isActive ? "text-eka-dark font-medium" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <div className={cn(
                  "p-1.5 sm:p-2 rounded-full transition-all duration-300 relative",
                  isActive ? "bg-gold/20" : "bg-transparent group-hover:bg-gray-100"
              )}>
                <item.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", isActive && "fill-current")} />
              </div>
              
              <span className="text-[9px] sm:text-[10px] mt-0.5 text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[4rem] sm:max-w-none">{item.label}</span>

              {isActive && (
                <motion.span 
                    layoutId="pill-active"
                    className="absolute -bottom-1 w-1 h-1 bg-gold rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
