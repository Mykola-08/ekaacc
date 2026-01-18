'use client'

import { ReactNode } from 'react'
import { AppSidebar } from '@/components/platform/navigation/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/platform/ui/sidebar'
import { AppHeader } from '@/components/platform/eka/app-header'
import { cn } from '@/lib/platform/utils/css-utils'
import { motion } from 'framer-motion'

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={{
        '--sidebar-width': '18rem',
        '--sidebar-width-mobile': '20rem',
      } as React.CSSProperties}
    >
      <div className='flex min-h-svh w-full bg-[#FBFBFD] p-2 md:p-3 gap-2 md:gap-3 overflow-hidden'>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className='h-[calc(100vh-1.5rem)] hidden md:block shrink-0'
        >
          <AppSidebar className='h-full rounded-[32px] border border-black/5 shadow-sm bg-white' />
        </motion.div>

        <SidebarInset className='h-[calc(100vh-1.5rem)] rounded-[32px] border border-black/5 shadow-sm bg-white overflow-hidden flex flex-col'>
          <AppHeader />
          <motion.main
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className={cn(
              'flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent',
              className
            )}
          >
            {children}
          </motion.main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

