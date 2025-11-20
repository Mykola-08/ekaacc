'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageSquare, Target, TrendingUp } from 'lucide-react'

export default function SimplePatientDashboard() {
  const actions = [
    { label: 'Book Session', href: '/sessions/booking', icon: Calendar },
    { label: 'View Progress', href: '/progress', icon: TrendingUp },
    { label: 'Set Goals', href: '/goals', icon: Target },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
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
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recent.map((r) => (
                  <li key={r.id} className="flex items-center justify-between">
                    <span className="text-sm">{r.title}</span>
                    <Badge variant="outline" className="text-xs">{r.meta}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {actions.map((a) => (
                <Button key={a.label} asChild variant="outline" className="justify-start">
                  <Link href={a.href}>
                    <a.icon className="h-4 w-4 mr-2" />
                    {a.label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
