'use client';

import { cn } from '@/lib/utils';
import { User, Lock, Bell, Globe, Save, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'booking', label: 'Booking Rules', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Lock },
  ];

  return (
    <div className="animate-fade-in h-full w-full space-y-8 p-6 md:p-12">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground font-serif text-3xl">System Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage global configurations and preferences.
          </p>
        </div>
        <Button className="rounded-full px-6 shadow-lg">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <div className="scrollbar-none border-border flex gap-2 overflow-x-auto border-b pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.id)}
            className="gap-2 rounded-full"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <Card className="min-h-100 p-6 md:p-8">
        {activeTab === 'general' && <GeneralSettings />}
        {activeTab === 'booking' && <BookingSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
        {activeTab === 'integrations' && <IntegrationSettings />}
      </Card>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-foreground mb-1 text-xl font-bold">Business Information</h2>
        <p className="text-muted-foreground text-sm">
          This information is displayed on emails and the booking page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Business Name</Label>
          <Input defaultValue="EKA Acc" />
        </div>
        <div className="space-y-2">
          <Label>Contact Email</Label>
          <Input defaultValue="contact@eka.com" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Address</Label>
          <Input defaultValue="123 Wellness Blvd, Health City" />
        </div>
      </div>

      <div className="border-border border-t pt-8">
        <h2 className="text-foreground mb-4 text-xl font-bold">Localization</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Input defaultValue="America/Los_Angeles" disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input defaultValue="USD" disabled className="bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingSettings() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-foreground mb-1 text-xl font-bold">Booking Configuration</h2>
        <p className="text-muted-foreground text-sm">Control how and when clients can book.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Booking Lead Time (Hours)</Label>
          <Input type="number" defaultValue="24" />
          <p className="text-muted-foreground text-xs">Minimum notice required before a session.</p>
        </div>
        <div className="space-y-2">
          <Label>Max Advance Booking (Days)</Label>
          <Input type="number" defaultValue="60" />
        </div>
      </div>

      <div className="border-border space-y-6 border-t pt-8">
        <div className="flex items-center space-x-3">
          <Checkbox id="require-approval" />
          <Label htmlFor="require-approval" className="font-medium">
            Require Manual Approval for New Clients
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <Checkbox id="allow-cancellation" defaultChecked />
          <Label htmlFor="allow-cancellation" className="font-medium">
            Allow Self-Service Cancellation
          </Label>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-foreground mb-1 text-xl font-bold">Email Notifications</h2>
        <p className="text-muted-foreground text-sm">Manage automated email triggers.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-muted/30 border-border flex items-center justify-between rounded-xl border p-4">
          <Label className="font-medium">Booking Confirmation</Label>
          <Checkbox defaultChecked />
        </div>
        <div className="bg-muted/30 border-border flex items-center justify-between rounded-xl border p-4">
          <Label className="font-medium">Reminder Emails (24h before)</Label>
          <Checkbox defaultChecked />
        </div>
        <div className="bg-muted/30 border-border flex items-center justify-between rounded-xl border p-4">
          <Label className="font-medium">Feedback Request (After session)</Label>
          <Checkbox />
        </div>
      </div>
    </div>
  );
}

function IntegrationSettings() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Lock className="text-muted-foreground/50 h-8 w-8" />
      </div>
      <h3 className="text-foreground text-lg font-bold">Coming Soon</h3>
      <p className="text-muted-foreground mt-2 max-w-sm">
        Integration settings (Stripe, etc.) will be available in the next update.
      </p>
    </div>
  );
}
