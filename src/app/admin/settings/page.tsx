"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Mail, CreditCard, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';

export default function AdminSettingsPage() {
  // Mock data has been removed - always disabled
  const [mockDataEnabled, setMockDataEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

      <div className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><SettingsIcon className="h-5 w-5" /> General Settings</CardTitle>
            <CardDescription>Core system preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Mock Data Mode</p>
                <p className="text-sm text-muted-foreground">Use simulated data instead of Firebase</p>
              </div>
              <Badge variant={mockDataEnabled ? 'background' : 'border'} className={mockDataEnabled ? 'text-success border-success/20 bg-success/5' : 'text-muted-foreground border-muted/30 bg-muted/10'}>{mockDataEnabled ? 'ENABLED' : 'DISABLED'}</Badge>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Integrations</CardTitle>
            <CardDescription>Third-party services and APIs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Square Payments</p>
                  <p className="text-sm text-muted-foreground">Payment processing and booking</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Firebase</p>
                  <p className="text-sm text-muted-foreground">Cloud database and authentication</p>
                </div>
              </div>
              <Badge variant="background" className="text-primary border-primary/20 bg-primary/5">CONNECTED</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsShell>
  );
}
