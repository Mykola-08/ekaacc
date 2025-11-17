'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings, 
  Plus,
  X,
  User,
  Heart,
  Brain,
  Activity
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/supabase-auth';

interface MobileNavItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  badge?: number;
  color?: string;
}

interface MobileNavProps {
  className?: string;
}

export default function MobileNavigation({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const patientNavItems: MobileNavItem[] = [
    { id: 'home', label: 'Home', icon: Home, href: '/dashboard', color: 'blue' },
    { id: 'sessions', label: 'Sessions', icon: Calendar, href: '/sessions', badge: 2, color: 'green' },
    { id: 'journal', label: 'Journal', icon: Heart, href: '/journal', color: 'purple' },
    { id: 'progress', label: 'Progress', icon: Activity, href: '/progress', color: 'orange' },
    { id: 'profile', label: 'Profile', icon: User, href: '/myaccount', color: 'gray' }
  ];

  const therapistNavItems: MobileNavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, href: '/therapist/dashboard', color: 'blue' },
    { id: 'clients', label: 'Clients', icon: Users, href: '/therapist/clients', badge: 3, color: 'green' },
    { id: 'sessions', label: 'Sessions', icon: Calendar, href: '/therapist/sessions', color: 'purple' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages', badge: 1, color: 'orange' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/therapist/settings', color: 'gray' }
  ];

  const navItems = user?.role === 'Therapist' || user?.role === 'Admin' ? therapistNavItems : patientNavItems;

  useEffect(() => {
    // Set active tab based on current pathname
    const currentItem = navItems.find(item => pathname.startsWith(item.href));
    if (currentItem) {
      setActiveTab(currentItem.id);
    }
  }, [pathname, navItems]);

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const FloatingActionButton = () => (
    <motion.div
      className="fixed bottom-20 right-4 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        size="lg"
        className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-primary to-purple-600 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 90 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: -90 }}
            >
              <Plus className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );

  const NavigationMenu = () => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Profile Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
                <p className="text-sm text-gray-600">{user?.role || 'Patient'}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Online
              </Badge>
            </div>

            {/* Navigation Items */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                      "border-2 hover:shadow-lg",
                      isActive 
                        ? "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300 text-blue-700" 
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <div className="relative">
                      <Icon className="w-6 h-6" />
                      {item.badge && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs p-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 text-sm">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="justify-start"
                  onClick={() => handleNavigation('/sessions/booking')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Session
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="justify-start"
                  onClick={() => handleNavigation('/journal')}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Quick Journal
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const BottomNavigation = () => (
    <motion.nav
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200",
        "px-4 py-2 z-30 safe-area-bottom",
        className
      )}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="flex justify-around items-center">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 relative",
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-xs p-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn("text-xs font-medium", isActive ? "font-semibold" : "")}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full"
                  layoutId="activeTab"
                />
              )}
            </motion.button>
          );
        })}
        
        {/* More Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <div className="relative">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">More</span>
        </motion.button>
      </div>
    </motion.nav>
  );

  return (
    <>
      <FloatingActionButton />
      <NavigationMenu />
      <BottomNavigation />
    </>
  );
}