'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronRight, 
  Lock, 
  Shield, 
  AlertTriangle,
  RefreshCw,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Bell,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { 
  NavigationItem, 
  NavigationCategory, 
  NAVIGATION_CONFIG,
  getNavigationItemsByCategory 
} from '@/lib/navigation-config';
import { 
  getAccessibleNavigationItems, 
  checkNavigationPermission,
  invalidateUserPermissionCache,
  getSecurityAlerts
} from '@/lib/permission-service';
import { Button, Badge, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/keep';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface DynamicSidebarProps {
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  className?: string;
  showRoleIndicator?: boolean;
  showSecurityAlerts?: boolean;
  enableRealTimeUpdates?: boolean;
}

interface NavigationCategoryGroup {
  category: NavigationCategory;
  items: NavigationItem[];
  isExpanded: boolean;
}

interface SecurityAlert {
  id: string;
  type: 'unauthorized_access' | 'permission_error' | 'system_failure';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export function DynamicSidebar({
  isCollapsed = false,
  onCollapseChange,
  className,
  showRoleIndicator = true,
  showSecurityAlerts = true,
  enableRealTimeUpdates = true
}: DynamicSidebarProps) {
  const { user, hasPermission, refreshUser } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [accessibleItems, setAccessibleItems] = useState<NavigationItem[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<NavigationCategoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load accessible navigation items
  const loadAccessibleItems = useCallback(async () => {
    if (!user?.id || !user?.role) {
      setAccessibleItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const items = getAccessibleNavigationItems(user.id, user.role, {
        userId: user.id,
        assigned: user.role === 'Therapist' // Add therapist-specific context
      });
      
      setAccessibleItems(items);
      setLastRefresh(new Date());
      
      // Load security alerts if enabled
      if (showSecurityAlerts && hasPermission('system_settings', 'read')) {
        const alerts = getSecurityAlerts();
        setSecurityAlerts(alerts.map(alert => ({
          id: alert.id,
          type: 'unauthorized_access',
          message: `${alert.userRole} user attempted to access ${alert.resource}: ${alert.reason}`,
          timestamp: alert.timestamp,
          severity: alert.result ? 'low' : 'medium'
        })));
      }
    } catch (error) {
      console.error('Error loading navigation items:', error);
      toast({
        title: 'Navigation Error',
        description: 'Failed to load navigation items. Please refresh the page.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, showSecurityAlerts, hasPermission, toast]);

  // Group items by category
  const groupItemsByCategory = useCallback((items: NavigationItem[]) => {
    const groups: NavigationCategoryGroup[] = [];
    
    Object.entries(NAVIGATION_CONFIG.categories)
      .sort(([, a], [, b]) => a.order - b.order)
      .forEach(([categoryKey, categoryConfig]) => {
        const categoryItems = items
          .filter(item => item.category === categoryKey)
          .sort((a, b) => a.order - b.order);
        
        if (categoryItems.length > 0) {
          groups.push({
            category: categoryKey as NavigationCategory,
            items: categoryItems,
            isExpanded: true // Default to expanded
          });
        }
      });
    
    return groups;
  }, []);

  // Initialize data
  useEffect(() => {
    loadAccessibleItems();
  }, [loadAccessibleItems]);

  // Update category groups when accessible items change
  useEffect(() => {
    if (accessibleItems.length > 0) {
      setCategoryGroups(groupItemsByCategory(accessibleItems));
    }
  }, [accessibleItems, groupItemsByCategory]);

  // Real-time updates
  useEffect(() => {
    if (!enableRealTimeUpdates || !user?.id) return;

    const interval = setInterval(() => {
      // Check for permission updates every 30 seconds
      refreshUser().then(() => {
        loadAccessibleItems();
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [enableRealTimeUpdates, user?.id, refreshUser, loadAccessibleItems]);

  // Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refreshUser();
      invalidateUserPermissionCache(user!.id);
      await loadAccessibleItems();
      
      toast({
        title: 'Navigation Updated',
        description: 'Your navigation has been refreshed with latest permissions.'
      });
    } catch (error) {
      toast({
        title: 'Refresh Failed',
        description: 'Failed to refresh navigation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle category expansion
  const toggleCategory = (category: NavigationCategory) => {
    setCategoryGroups(prev => 
      prev.map(group => 
        group.category === category 
          ? { ...group, isExpanded: !group.isExpanded }
          : group
      )
    );
  };

  // Check if current path matches navigation item
  const isActiveRoute = (item: NavigationItem): boolean => {
    if (item.href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(item.href);
  };

  // Get role indicator color
  const getRoleIndicatorColor = (role: string): string => {
    const colors: Record<string, string> = {
      'Admin': 'bg-red-500',
      'Therapist': 'bg-blue-500',
      'Patient': 'bg-green-500',
      'VIP Patient': 'bg-purple-500',
      'Reception': 'bg-orange-500',
      'Content Manager': 'bg-indigo-500',
      'Marketing': 'bg-pink-500',
      'Accountant': 'bg-yellow-500',
      'Corporate Client': 'bg-teal-500',
      'Custom': 'bg-gray-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className={cn("w-64 bg-card border-r animate-pulse", className)}>
        <div className="p-4 space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("w-64 bg-card border-r p-4", className)}>
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Please sign in to access navigation.</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "flex flex-col h-full bg-card border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">Navigation</h2>
              {showRoleIndicator && (
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", getRoleIndicatorColor(user.role))}
                >
                  {user.role}
                </Badge>
              )}
            </div>
          )}
          <div className="flex items-center space-x-1">
            {showSecurityAlerts && securityAlerts.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 relative"
                    onClick={() => setShowAlerts(!showAlerts)}
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{securityAlerts.length} security alerts</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh navigation</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onCollapseChange?.(!isCollapsed)}
                >
                  {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isCollapsed ? "Expand" : "Collapse"} sidebar</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Security Alerts */}
        <AnimatePresence>
          {showAlerts && securityAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b bg-destructive/10"
            >
              <div className="p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Security Alerts</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {securityAlerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className="text-xs text-muted-foreground">
                      {alert.message}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {categoryGroups.map(group => (
              <div key={group.category} className="space-y-2">
                {/* Category Header */}
                {!isCollapsed && (
                  <button
                    onClick={() => toggleCategory(group.category)}
                    className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>{NAVIGATION_CONFIG.categories[group.category].label}</span>
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform",
                        group.isExpanded && "rotate-90"
                      )} 
                    />
                  </button>
                )}

                {/* Category Items */}
                <AnimatePresence>
                  {(group.isExpanded || isCollapsed) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1"
                    >
                      {group.items.map(item => (
                        <NavigationItemComponent
                          key={item.id}
                          item={item}
                          isActive={isActiveRoute(item)}
                          isCollapsed={isCollapsed}
                          userRole={user.role}
                          userId={user.id}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Activity className="h-3 w-3" />
            {!isCollapsed && (
              <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            )}
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/myaccount">
                <User className="h-4 w-4 mr-2" />
                {!isCollapsed && <span>Profile</span>}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface NavigationItemComponentProps {
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  userRole: string;
  userId: string;
}

function NavigationItemComponent({
  item,
  isActive,
  isCollapsed,
  userRole,
  userId
}: NavigationItemComponentProps) {
  const permissionCheck = checkNavigationPermission(userRole as any, item, { userId });
  
  const itemContent = (
    <div className={cn(
      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-all",
      "hover:bg-accent hover:text-accent-foreground",
      isActive && "bg-accent text-accent-foreground font-medium",
      !permissionCheck.hasAccess && "opacity-50 cursor-not-allowed"
    )}>
      {!permissionCheck.hasAccess && (
        <Lock className="h-4 w-4 text-destructive" />
      )}
      <span className={cn("flex-1", isCollapsed && "hidden")}>
        {item.label}
      </span>
      {item.isBeta && !isCollapsed && (
        <Badge variant="secondary" className="text-xs">Beta</Badge>
      )}
      {item.requiresSubscription && !isCollapsed && (
        <Badge variant="outline" className="text-xs">Pro</Badge>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            {permissionCheck.hasAccess ? (
              <Link href={item.href} className="block">
                {itemContent}
              </Link>
            ) : (
              <div className="block cursor-not-allowed">
                {itemContent}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="space-y-1">
            <p className="font-medium">{item.label}</p>
            {!permissionCheck.hasAccess && (
              <p className="text-xs text-destructive">{permissionCheck.reason}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div>
      {permissionCheck.hasAccess ? (
        <Link href={item.href} className="block">
          {itemContent}
        </Link>
      ) : (
        <div 
          className="block cursor-not-allowed" 
          title={permissionCheck.reason}
        >
          {itemContent}
        </div>
      )}
    </div>
  );
}