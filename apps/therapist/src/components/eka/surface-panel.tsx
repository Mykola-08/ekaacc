import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SurfacePanelProps {
  children: ReactNode
  className?: string
  padding?: boolean
}

export function SurfacePanel({ children, className = '', padding = true }: SurfacePanelProps) {
  return (
    <div className={cn('surface-panel', padding && 'p-6 sm:p-8', className)}>
      {children}
    </div>
  )
}
