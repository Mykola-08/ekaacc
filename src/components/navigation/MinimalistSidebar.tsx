'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  Home, 
  LayoutDashboard, 
  TrendingUp, 
  Settings, 
  User, 
  LogOut,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Heart,
  Target,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/supabase-auth';
import { Button, Avatar } from '@/components/keep';

interface SidebarNavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  children?: SidebarNavItem[];
}

interface MinimalistSidebarProps {
  className?: string;
}

export function MinimalistSidebar({ className }: MinimalistSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleItem = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const navigationItems: SidebarNavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Sessions',
      href: '/sessions',
      icon: Calendar,
      children: [
        { name: 'Book Session', href: '/sessions/booking', icon: Calendar },
        { name: 'My Sessions', href: '/sessions', icon: Calendar },
      ]
    },
    {
      name: 'Progress',
      href: '/progress',
      icon: TrendingUp,
      children: [
        { name: 'Goals', href: '/progress', icon: Target },
        { name: 'Reports', href: '/progress-reports', icon: FileText },
      ]
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
    },
    {
      name: 'Wellness',
      href: '/wellness',
      icon: Heart,
      children: [
        { name: 'Journal', href: '/journal', icon: Heart },
        { name: 'Mood Tracker', href: '/mood', icon: Heart },
      ]
    },
  ];

  const therapistItems: SidebarNavItem[] = [
    {
      name: 'Clients',
      href: '/therapists',
      icon: Users,
    },
    {
      name: 'Templates',
      href: '/therapist/templates',
      icon: FileText,
    },
  ];

  const allItems = user?.user_type === 'therapist' 
    ? [...navigationItems, ...therapistItems]
    : navigationItems;

  const filteredItems = allItems.filter(item => 
    !item.roles || item.roles.includes(user?.user_type || '')
  );

  const NavItem = ({ item, depth = 0 }: { item: SidebarNavItem; depth?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isActive = false; // You can implement active route detection here

    return (
      <div className="w-full">
        <Button
          href={item.href}
          variant={isActive ? "default" : "outline"}
          size="md"
          className={cn(
            "w-full justify-start",
            depth > 0 && "pl-12"
          )}
          onClick={hasChildren ? (e) => { e.preventDefault(); toggleItem(item.name); } : undefined}
          leftIcon={
            <item.icon className={cn(
              "h-5 w-5",
              isActive && "text-white"
            )} />
          }
          rightIcon={hasChildren && !isCollapsed ? (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          ) : undefined}
        >
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className="ml-2 truncate"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        {hasChildren && !isCollapsed && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-1 space-y-1">
                  {item.children?.map((child) => (
                    <NavItem key={child.name} item={child} depth={depth + 1} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-minimal-border shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed left-0 top-0 h-full bg-white/80 backdrop-blur-sm border-r border-minimal-border z-50",
          "flex flex-col transition-all duration-300 ease-in-out",
          "lg:translate-x-0 lg:w-64",
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 lg:translate-x-0",
          className
        )}
        initial={false}
        animate={{ 
          x: isMobileOpen ? 0 : -256,
          width: 256
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-minimal-border">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h5 className="text-lg text-primary-600 font-semibold">EKA</h5>
          </motion.div>
          
          <div className="flex items-center gap-2">
            {/* Desktop Collapse Button */}
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            {/* Mobile Close Button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-minimal-border space-y-2">
          {/* User Profile */}
          <motion.div
            className={cn(
              "flex items-center space-x-3 p-2 rounded-lg hover:bg-minimal-surface-hover transition-colors cursor-pointer",
              isCollapsed && "justify-center"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Avatar size="sm" color="primary" className="flex-shrink-0">
              <User className="h-4 w-4" />
            </Avatar>
            
            <AnimatePresence>
              {!isCollapsed && user && (
                <motion.div
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-medium truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {user.user_type}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Settings & Logout */}
          <div className="space-y-1">
            <Button
              href="/settings"
              variant="outline"
              size="sm"
              className="w-full justify-start"
              leftIcon={<Settings className="h-4 w-4" />}
            >
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    className="ml-2"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              color="error"
              className="w-full justify-start"
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    className="ml-2"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.aside>

      
    </>
  );
}