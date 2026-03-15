'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { FloppyDiskIcon, GlobeIcon, LockIcon, Notification01Icon, UserIcon } from '@hugeicons/core-free-icons';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  initials?: string;
  user_metadata?: any;
  settings?: any;
}

interface SettingsContentProps {
  currentUser: User;
}

export function SettingsContentHeadless({ currentUser }: SettingsContentProps) {
  const [formData, setFormData] = useState({
    fullName: currentUser.name || '',
    email: currentUser.email || '',
    bio: currentUser.user_metadata?.bio || '',
    language: 'en',
    timezone: 'UTC',
    marketingEmails: true,
    securityEmails: true,
    activityEmails: false,
    publicProfile: false,
    darkMode: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-4xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your account preferences and settings.
          </p>
        </div>
        <Button size="lg">
          <HugeiconsIcon icon={FloppyDiskIcon} className="size-5" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="grid grid-cols-12 gap-6">
        {/* Sidebar / Tab List */}
        <div className="col-span-12 md:col-span-3">
          <TabsList className="flex h-auto flex-col bg-transparent p-0">
            <TabsTrigger value="profile" className="w-full justify-start gap-3 px-4 py-3">
              <HugeiconsIcon icon={UserIcon} className="size-5" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="w-full justify-start gap-3 px-4 py-3">
              <HugeiconsIcon icon={Notification01Icon} className="size-5" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="w-full justify-start gap-3 px-4 py-3">
              <HugeiconsIcon icon={LockIcon} className="size-5" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="w-full justify-start gap-3 px-4 py-3">
              <HugeiconsIcon icon={GlobeIcon} className="size-5" />
              Preferences
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content / Tab Panels */}
        <div className="col-span-12 md:col-span-9">
          {/* Profile Panel */}
          <TabsContent value="profile" className="bg-card ring-border rounded-lg p-8 ring-1">
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-xl font-semibold">Personal Information</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Update your photo and personal details.
                </p>
              </div>

              <div className="border-border flex items-center gap-6 border-b pb-6">
                <div className="bg-primary/10 text-primary flex size-20 items-center justify-center rounded-full text-2xl font-semibold">
                  {currentUser.initials || 'U'}
                </div>
                <div className="space-y-1">
                  <Button variant="outline" size="sm">
                    Change photo
                  </Button>
                  <p className="text-muted-foreground text-xs">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Write a few sentences about yourself."
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Panel */}
          <TabsContent value="notifications" className="bg-card ring-border rounded-lg p-8 ring-1">
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-xl font-semibold">Notifications</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Manage how you want to be notified.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing emails</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive emails about new products, features, and more.
                    </p>
                  </div>
                  <Switch
                    checked={formData.marketingEmails}
                    onCheckedChange={() => handleToggle('marketingEmails')}
                  />
                </div>
                <div className="border-border border-t" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security emails</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive emails about your account security.
                    </p>
                  </div>
                  <Switch
                    checked={formData.securityEmails}
                    onCheckedChange={() => handleToggle('securityEmails')}
                  />
                </div>
                <div className="border-border border-t" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Activity emails</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive emails about your activity on the platform.
                    </p>
                  </div>
                  <Switch
                    checked={formData.activityEmails}
                    onCheckedChange={() => handleToggle('activityEmails')}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Panel */}
          <TabsContent value="security" className="bg-card ring-border rounded-lg p-8 ring-1">
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-xl font-semibold">Security</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Update your password and security settings.
                </p>
              </div>

              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" />
                </div>
                <Button>Update Password</Button>
              </div>
            </div>
          </TabsContent>

          {/* Preferences Panel */}
          <TabsContent value="preferences" className="bg-card ring-border rounded-lg p-8 ring-1">
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-xl font-semibold">Preferences</h2>
                <p className="text-muted-foreground mt-1 text-sm">Customize your experience.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData((prev) => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={formData.timezone} onValueChange={(value) => setFormData((prev) => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border-border col-span-full border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-muted-foreground text-sm">
                        Switch between light and dark themes.
                      </p>
                    </div>
                    <Switch
                      checked={formData.darkMode}
                      onCheckedChange={() => handleToggle('darkMode')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
