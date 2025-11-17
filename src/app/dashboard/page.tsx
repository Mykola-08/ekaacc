'use client'

import React from 'react'
import { useSimpleAuth, usePermissions, useUserPreferences } from '@/hooks/use-simple-auth'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user, signOut } = useSimpleAuth()
  const permissions = usePermissions()
  const preferences = useUserPreferences()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back, {user?.profile.full_name || user?.email}!
                </h1>
                <p className="text-muted-foreground mt-2">
                  Here's what's happening with your account
                </p>
              </div>
              <Button variant="destructive" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    User Information
                    <Badge variant="secondary">{user?.role.name}</Badge>
                  </CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                    <span className="col-span-2 text-sm">{user?.email}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Username:</span>
                    <span className="col-span-2 text-sm">{user?.profile.username || 'Not set'}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Role:</span>
                    <span className="col-span-2 text-sm">{user?.role.name}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Member since:</span>
                    <span className="col-span-2 text-sm">
                      {new Date(user?.profile.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Your personalized settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Theme:</span>
                    <span className="col-span-2 text-sm capitalize">{preferences.theme}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Language:</span>
                    <span className="col-span-2 text-sm uppercase">{preferences.language}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Timezone:</span>
                    <span className="col-span-2 text-sm">{preferences.timezone}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Notifications:</span>
                    <span className="col-span-2 text-sm">
                      {preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Your Permissions</CardTitle>
                  <CardDescription>Access control settings for your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(permissions).map(([key, hasPermission]) => (
                      <div 
                        key={key} 
                        className="flex items-center gap-2 p-3 rounded-lg border bg-card text-card-foreground"
                      >
                        {hasPermission ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                        <span className={`text-sm ${hasPermission ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
