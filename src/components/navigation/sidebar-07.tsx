'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useAuth } from '@/lib/supabase-auth'
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Target,
  MessageSquare,
  Settings,
  Users,
  FileText,
  TrendingUp,
  Heart,
  Gift,
  UserPlus,
  LogOut,
  ChevronRight,
  Sparkles,
  CreditCard,
} from 'lucide-react'

interface NavGroup {
  title: string
  items: NavItem[]
}

interface NavItem {
  title: string
  url: string
  icon: React.ElementType
  badge?: string
  items?: NavSubItem[]
}

interface NavSubItem {
  title: string
  url: string
}

const patientNavigation: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/home',
        icon: LayoutDashboard,
      },
      {
        title: 'AI Insights',
        url: '/ai-insights',
        icon: Sparkles,
        badge: 'New',
      },
    ],
  },
  {
    title: 'Wellness',
    items: [
      {
        title: 'Journal',
        url: '/journal',
        icon: BookOpen,
      },
      {
        title: 'Goals',
        url: '/goals',
        icon: Target,
      },
      {
        title: 'Progress',
        url: '/progress',
        icon: TrendingUp,
      },
      {
        title: 'Mood Tracking',
        url: '/forms',
        icon: Heart,
      },
    ],
  },
  {
    title: 'Sessions',
    items: [
      {
        title: 'Book Session',
        url: '/sessions/booking',
        icon: Calendar,
      },
      {
        title: 'My Sessions',
        url: '/sessions',
        icon: Calendar,
      },
      {
        title: 'Therapists',
        url: '/therapists',
        icon: Users,
      },
    ],
  },
  {
    title: 'Communication',
    items: [
      {
        title: 'Messages',
        url: '/messages',
        icon: MessageSquare,
      },
      {
        title: 'Reports',
        url: '/reports',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        title: 'Subscription',
        url: '/subscriptions',
        icon: CreditCard,
      },
      {
        title: 'Loyalty',
        url: '/loyalty',
        icon: Gift,
      },
      {
        title: 'Referrals',
        url: '/referrals',
        icon: UserPlus,
      },
    ],
  },
]

const therapistNavigation: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/therapist/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Practice',
    items: [
      {
        title: 'Clients',
        url: '/therapist/clients',
        icon: Users,
      },
      {
        title: 'Bookings',
        url: '/therapist/bookings',
        icon: Calendar,
      },
      {
        title: 'Templates',
        url: '/therapist/templates',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Business',
    items: [
      {
        title: 'Billing',
        url: '/therapist/billing',
        icon: CreditCard,
      },
    ],
  },
]

const adminNavigation: NavGroup[] = [
  {
    title: 'Administration',
    items: [
      {
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Users',
        url: '/admin/users',
        icon: Users,
      },
      {
        title: 'Subscriptions',
        url: '/admin/subscriptions',
        icon: CreditCard,
      },
      {
        title: 'Payments',
        url: '/admin/payments',
        icon: CreditCard,
      },
    ],
  },
]

export function AppSidebar07() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { isExpanded } = useSidebar()

  // Determine which navigation to show based on current path
  const getNavigationGroups = () => {
    if (pathname?.startsWith('/admin')) return adminNavigation
    if (pathname?.startsWith('/therapist')) return therapistNavigation
    return patientNavigation
  }

  const navigationGroups = getNavigationGroups()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const getUserInitials = () => {
    if (!user?.email) return 'U'
    return user.email
      .split('@')[0]
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <Sidebar>
      <SidebarHeader className="bg-gradient-to-br from-purple-50 to-blue-50 border-b border-purple-100">
        <div className="flex items-center gap-2 px-3 py-4">
          <div className={cn(
            "flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg",
            !isExpanded && "size-8"
          )}>
            <Heart className="size-4" />
          </div>
          {isExpanded && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                EKA Account
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Wellness Platform
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {navigationGroups.map((group) => (
          <div key={group.title} className="mb-6">
            {isExpanded && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.url
                const Icon = item.icon

                if (item.items) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={item.items.some((sub) => pathname === sub.url)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start gap-3 px-3 py-2 h-auto font-normal",
                              "hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all duration-200"
                            )}
                          >
                            <Icon className="size-4 shrink-0" />
                            {isExpanded && (
                              <>
                                <span className="flex-1 text-left">{item.title}</span>
                                <ChevronRight className="size-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                              </>
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        {isExpanded && (
                          <CollapsibleContent className="pl-7 space-y-1">
                            {item.items.map((subItem) => (
                              <Button
                                key={subItem.title}
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start gap-3 px-3 py-2 h-auto font-normal text-sm",
                                  pathname === subItem.url && "bg-accent text-accent-foreground"
                                )}
                                asChild
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </Button>
                            ))}
                          </CollapsibleContent>
                        )}
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 px-3 py-2 h-auto font-normal",
                        isActive && "bg-purple-100 text-purple-700 border border-purple-200",
                        "hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all duration-200"
                      )}
                      asChild
                    >
                      <Link href={item.url}>
                        <Icon className="size-4 shrink-0" />
                        {isExpanded && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
                            {item.badge && (
                              <span className="rounded-md bg-gradient-to-r from-purple-600 to-blue-600 px-1.5 py-0.5 text-xs text-white">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </Button>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2 h-auto",
                "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                <AvatarFallback className="rounded-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {isExpanded && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.user_metadata?.full_name || 'User'}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem asChild>
              <Link href="/myaccount" className="cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
