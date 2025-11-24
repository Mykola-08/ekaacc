'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageContainer } from '@/components/eka/page-container'
import { PageHeader } from '@/components/eka/page-header'
import { SurfacePanel } from '@/components/eka/surface-panel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageSquare, Target, TrendingUp, Heart, BookOpen } from 'lucide-react'

export default function SimplePatientDashboard() {
  const actions = [
    { label: 'Book Session', href: '/sessions/booking', icon: Calendar },
    { label: 'View Progress', href: '/progress', icon: TrendingUp },
    { label: 'Set Goals', href: '/goals', icon: Target },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Academy', href: '/academy', icon: BookOpen },
  ]

  const stats = [
    { label: 'Sessions', value: '12' },
    { label: 'Goals', value: '8' },
    { label: 'Progress', value: '85%' },
  ]

  const recent = [
    { id: 'r1', title: 'Session with Dr. Smith', meta: '2 days ago' },
    { id: 'r2', title: 'Completed weekly check-in', meta: '4 days ago' },
    { id: 'r3', title: 'New goal: Sleep routine', meta: '1 week ago' },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Your Dashboard"
        description="Track your wellness journey and stay on top of your goals"
        badge="Overview"
      />

        <SurfacePanel className="grid gap-6 sm:grid-cols-3 mb-8">
          {stats.map((s, index) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-muted hover:border-border transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{s.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </SurfacePanel>

        <SurfacePanel className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="border-muted hover:border-border transition-all duration-300">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recent.map((r, idx) => (
                    <motion.li
                      key={r.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                      className="flex items-center justify-between py-3 border-b border-muted last:border-0"
                    >
                      <span className="text-sm font-medium">{r.title}</span>
                      <Badge variant="secondary" className="text-xs">{r.meta}</Badge>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-muted hover:border-border transition-all duration-300">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {actions.map((a, idx) => (
                  <motion.div
                    key={a.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                  >
                    <Button asChild variant="outline" className="w-full justify-start hover:bg-muted transition-all duration-300">
                      <Link href={a.href}>
                        <a.icon className="h-4 w-4 mr-2" />
                        {a.label}
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </SurfacePanel>
    </PageContainer>
  )
}
