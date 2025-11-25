"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Mail, 
  CreditCard, 
  Database, 
  Users, 
  Shield, 
  Key, 
  Globe, 
  Palette,
  FileText,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, canAccessResource } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    toast({ title: 'Settings Saved', description: 'Admin settings have been updated successfully.' });
  };

  if (loading) {
    return (
      <SettingsShell>
        <SettingsHeader title="System Settings" description="Configure system-wide preferences and integrations." />
        <div className="space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </SettingsShell>
    );
  }

  return (
    <SettingsShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <SettingsHeader title="System Settings" description="Configure system-wide preferences and integrations." />
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <Tabs defaultValue="general" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="roles">Roles & Access</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><SettingsIcon className="h-5 w-5" /> General Settings</CardTitle>
              <CardDescription>Core system preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Application Name</p>
                  <p className="text-sm text-muted-foreground">EKA Account</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">System-wide notification settings</p>
                </div>
                <Button variant="outline" size="sm"><Bell className="mr-2 h-4 w-4" /> Configure</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Email Service</p>
                  <p className="text-sm text-muted-foreground">SMTP configuration for outbound emails</p>
                </div>
                <Button variant="outline" size="sm"><Mail className="mr-2 h-4 w-4" /> Configure</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Timezone</p>
                  <p className="text-sm text-muted-foreground">Europe/Amsterdam (UTC+1)</p>
                </div>
                <Button variant="outline" size="sm"><Globe className="mr-2 h-4 w-4" /> Change</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Appearance</CardTitle>
              <CardDescription>Customize the look and feel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Light/Dark mode preferences</p>
                </div>
                <Badge variant="secondary">System Default</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Branding</p>
                  <p className="text-sm text-muted-foreground">Logo, colors, and brand assets</p>
                </div>
                <Button variant="outline" size="sm">Customize</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Role Management</CardTitle>
              <CardDescription>Configure user roles and permissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Link href="/admin/users">
                  <div className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">User Management</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Manage users, assign roles, and control account status
                    </p>
                  </div>
                </Link>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Key className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Permissions</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure granular permissions for each role
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Available Roles</h4>
                <div className="space-y-2">
                  {['Admin', 'Therapist', 'Content Manager', 'Marketing', 'Accountant', 'Reception', 'Patient', 'VIP Patient'].map((role) => (
                    <div key={role} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{role}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {role === 'Admin' && '• Full system access'}
                          {role === 'Therapist' && '• Patient management, sessions'}
                          {role === 'Content Manager' && '• CMS access, content publishing'}
                          {role === 'Marketing' && '• Analytics, campaigns'}
                          {role === 'Accountant' && '• Financial data access'}
                          {role === 'Reception' && '• Booking management'}
                          {role === 'Patient' && '• Basic user access'}
                          {role === 'VIP Patient' && '• Premium features access'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Security Settings</CardTitle>
              <CardDescription>Authentication and security configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin users</p>
                </div>
                <Badge variant="secondary">Recommended</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                </div>
                <span className="text-sm">30 minutes</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Password Policy</p>
                  <p className="text-sm text-muted-foreground">Minimum requirements for passwords</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Payment Integrations</CardTitle>
              <CardDescription>Payment processing services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-muted-foreground">Online payment processing</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Square</p>
                    <p className="text-sm text-muted-foreground">Payment processing and booking</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Backend Services</CardTitle>
              <CardDescription>Database and authentication services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-950 rounded-lg flex items-center justify-center">
                    <Database className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Supabase</p>
                    <p className="text-sm text-muted-foreground">Database and authentication</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950 rounded-lg flex items-center justify-center">
                    <Key className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Auth0</p>
                    <p className="text-sm text-muted-foreground">Identity management</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Content Management</CardTitle>
              <CardDescription>Manage website content and media.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Link href="/admin/cms/pages">
                  <div className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Pages</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Manage website pages and landing content
                    </p>
                  </div>
                </Link>
                <Link href="/admin/cms/posts">
                  <div className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Blog Posts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Create and manage blog articles
                    </p>
                  </div>
                </Link>
                <Link href="/admin/cms/media">
                  <div className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Palette className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Media Library</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload and manage images and files
                    </p>
                  </div>
                </Link>
                <Link href="/admin/services">
                  <div className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Services</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Manage therapy services and offerings
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> SEO & Analytics</CardTitle>
              <CardDescription>Search engine optimization and tracking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Meta Tags</p>
                  <p className="text-sm text-muted-foreground">Default SEO meta tags</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-muted-foreground">Vercel Analytics enabled</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SettingsShell>
  );
}
