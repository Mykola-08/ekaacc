import { ReactNode } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PolicyPageShellProps {
  title: string
  description: string
  badgeText?: string
  lastUpdated?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function PolicyPageShell({
  title,
  description,
  badgeText,
  lastUpdated,
  actions,
  children,
  className,
}: PolicyPageShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className={cn('max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-10', className)}>
        <div className="text-center space-y-6">
          {badgeText && (
            <Badge variant="secondary" className="text-sm">
              {badgeText}
            </Badge>
          )}

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground/80">Last updated: {lastUpdated}</p>
            )}
          </div>

          {actions && <div className="flex flex-wrap justify-center gap-3">{actions}</div>}
        </div>

        <Card className="border-muted shadow-sm">
          <CardContent className="prose prose-slate dark:prose-invert max-w-none py-8">
            {children}
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
