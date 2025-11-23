'use client'

import { ReactNode } from 'react'
import { AppSidebar } from '@/components/navigation/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppHeader } from '@/components/eka/app-header'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className={cn(
          "flex-1 overflow-y-auto p-6",
          className
        )}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}