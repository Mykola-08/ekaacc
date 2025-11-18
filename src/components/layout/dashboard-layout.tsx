'use client'

import { ReactNode } from 'react'
import { AppSidebar } from '@/components/navigation/ShadcnSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppHeader } from '@/components/eka/app-header'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        {/* Shadc Sidebar - Only sidebar that remains */}
        <AppSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header with sidebar trigger */}
          <AppHeader />
          
          {/* Main Content */}
          <main className={cn(
            "flex-1 overflow-y-auto",
            className
          )}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}