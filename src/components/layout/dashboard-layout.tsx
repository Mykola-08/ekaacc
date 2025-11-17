'use client'

import { ReactNode } from 'react'
import { CollapsibleSidebar } from '@/components/navigation/collapsible-sidebar'
import { MobileNavigation } from '@/components/navigation/mobile-navigation'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Desktop Sidebar */}
      <CollapsibleSidebar className="hidden md:flex" />
      
      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto",
        "md:ml-0", // Remove margin since sidebar is fixed
        "pt-16 md:pt-0", // Add padding for mobile nav
        className
      )}>
        {children}
      </main>
    </div>
  )
}