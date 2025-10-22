'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import {
  Home,
  Users,
  Calendar,
  FileText,
  Briefcase,
  TrendingUp,
  Settings,
  Clock,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const therapistNavItems = [
  { href: '/therapist', icon: Home, label: 'Dashboard', exact: true },
  { href: '/therapist/clients', icon: Users, label: 'Clients' },
  { href: '/therapist/bookings', icon: Calendar, label: 'Appointments' },
  { href: '/therapist/templates', icon: FileText, label: 'Templates' },
  { href: '/therapist/billing', icon: Briefcase, label: 'Billing' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
];

const TherapistSidebarLink = memo(({ 
  href, 
  icon: Icon, 
  label, 
  isActive,
  exact = false
}: { 
  href: string; 
  icon: React.ElementType; 
  label: string;
  isActive: boolean;
  exact?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 relative',
        isActive 
          ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
          : 'text-muted-foreground hover:bg-muted hover:text-primary'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="therapist-sidebar-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full"
          initial={false}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <Icon className="h-5 w-5 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
});
TherapistSidebarLink.displayName = 'TherapistSidebarLink';

export function TherapistSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 border-r bg-card/50 backdrop-blur-sm flex flex-col"
    >
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            T
          </div>
          <div>
            <h2 className="font-semibold text-sm">Therapist Portal</h2>
            <p className="text-xs text-muted-foreground">Professional Tools</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {therapistNavItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
          
          return (
            <TherapistSidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive}
              exact={item.exact}
            />
          );
        })}
      </nav>

      <div className="p-4 border-t bg-muted/30">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Active Sessions: 12</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3" />
            <span>This Month: 48 hours</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
