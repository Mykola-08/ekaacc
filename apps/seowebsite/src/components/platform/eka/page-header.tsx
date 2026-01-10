'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/platform/ui/badge'
import { ReactNode } from 'react'

interface PageHeaderProps {
  icon?: LucideIcon
  title: string
  description?: string
  // Allow badge to be any renderable ReactNode (tests sometimes pass elements/objects)
  badge?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({ 
  icon: Icon, 
  title, 
  description, 
  badge, 
  actions,
  className = '' 
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`mb-8 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          {badge && (
            <Badge variant="secondary" className="mb-2">
              {badge}
            </Badge>
          )}
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-8 h-8 text-primary" />}
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-base text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </motion.div>
  )
}
