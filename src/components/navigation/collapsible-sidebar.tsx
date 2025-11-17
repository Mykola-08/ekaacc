'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  Heart, 
  Target, 
  Settings, 
  LogOut,
  BarChart3,
  CreditCard,
  Bell,
  User,
  BookOpen,
  ClipboardList,
  Clock,
  Award,
  HelpCircle
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  roles?: string[]
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    name: 'Home',
    href: '/home',
    icon: Home,
    roles: ['user', 'patient', 'therapist', 'admin']
  },
  {
    name: 'Sessions',
    href: '/sessions',
    icon: Calendar,
    roles: ['user', 'patient', 'therapist'],
    children: [
      { name: 'Book Session', href: '/sessions/booking', icon: Calendar, roles: ['user', 'patient'] },
      { name: 'My Sessions', href: '/sessions', icon: Clock, roles: ['user', 'patient', 'therapist'] },
      { name: 'Session History', href: '/sessions/history', icon: FileText, roles: ['user', 'patient', 'therapist'] }
    ]
  },
  {
    name: 'Clients',
    href: '/therapist/clients',
    icon: Users,
    roles: ['therapist']
  },
  {
    name: 'Progress',
    href: '/progress',
    icon: Target,
    roles: ['user', 'patient', 'therapist'],
    children: [
      { name: 'Goals', href: '/goals', icon: Target, roles: ['user', 'patient'] },
      { name: 'Reports', href: '/progress-reports', icon: BarChart3, roles: ['user', 'patient', 'therapist'] },
      { name: 'Journals', href: '/journal', icon: BookOpen, roles: ['user', 'patient'] }
    ]
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    roles: ['user', 'patient', 'therapist']
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCard,
    roles: ['user', 'patient', 'therapist'],
    children: [
      { name: 'Subscriptions', href: '/subscriptions', icon: Award, roles: ['user', 'patient'] },
      { name: 'Payment History', href: '/billing/history', icon: FileText, roles: ['user', 'patient', 'therapist'] }
    ]
  },
  {
    name: 'Resources',
    href: '/tools',
    icon: BookOpen,
    roles: ['user', 'patient', 'therapist']
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    roles: ['user', 'patient', 'therapist']
  },
  {
    name: 'Profile',
    href: '/myaccount',
    icon: User,
    roles: ['user', 'patient', 'therapist', 'admin']
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['user', 'patient', 'therapist', 'admin']
  }
]

interface CollapsibleSidebarProps {
  className?: string
}

export function CollapsibleSidebar({ className }: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useSimpleAuth()

  const userRole = user?.role.name || 'user'

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  )

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">EKA Wellness</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
                
                {/* Submenu items */}
                {item.children && !isCollapsed && active && (
                  <ul className="ml-6 mt-2 space-y-1">
                    {item.children
                      .filter(child => !child.roles || child.roles.includes(userRole))
                      .map((child) => {
                        const ChildIcon = child.icon
                        const childActive = isActive(child.href)
                        
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                childActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                              )}
                            >
                              <ChildIcon className="h-3 w-3 flex-shrink-0" />
                              <span>{child.name}</span>
                            </Link>
                          </li>
                        )
                      })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="space-y-2">
          {/* User info */}
          {!isCollapsed && user && (
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{user.profile.full_name || user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role.name}</p>
              </div>
            </div>
          )}
          
          {/* Sign out button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}