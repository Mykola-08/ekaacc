'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/platform/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full'
}

export function PageContainer({ 
  children, 
  className = '', 
  maxWidth = '7xl' 
}: PageContainerProps) {
  return (
    <div className="min-h-screen eka-page">
      <div className={cn(
        maxWidthClasses[maxWidth],
        "mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8",
        className
      )}>
        {children}
      </div>
    </div>
  )
}
