'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { 
  Menu,
  Home, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  Target, 
  Settings, 
  LogOut,
  BarChart3,
  CreditCard,
  Bell,
  User,
  Heart
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  roles?: string[]
}

const navigationItems = [
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
    roles: ['user', 'patient', 'therapist']
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
    roles: ['user', 'patient', 'therapist']
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

interface MobileNavigationProps {
  className?: string
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
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
    setIsOpen(false)
  }

  return (
    <div className={cn("md:hidden", className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              EKA Wellness
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full py-4">
            {/* User Info */}
            {user && (
              <div className="flex items-center gap-3 p-4 mb-4 bg-muted rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user.profile.full_name || user.email}</p>
                  <p className="text-sm text-muted-foreground capitalize">{user.role.name}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="border-t pt-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}