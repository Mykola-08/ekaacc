"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/unified-data-context';
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Briefcase,
  Settings as SettingsIcon,
  Save,
  Mail,
  Phone,
  Globe,
  Clock,
  Lock
} from 'lucide-react';

// Zod schema for settings
export const SettingsSchema = z.object({
  // Profile
  displayName: z.string().optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  
  // Notifications
  notifications: z.object({ 
    email: z.boolean().optional(), 
    sms: z.boolean().optional() 
  }).optional(),
  
  // Preferences  
  preferences: z.object({
    language: z.string().optional(),
    timezone: z.string().optional(),
    dateFormat: z.string().optional(),
    timeFormat: z.enum(['12h', '24h']).optional(),
  }).optional(),
  
  // Privacy
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'therapists-only']).optional(),
    showOnlineStatus: z.boolean().optional(),
    allowDirectMessages: z.boolean().optional(),
    shareProgressWithTherapist: z.boolean().optional(),
  }).optional(),
  
  // Accessibility
  accessibility: z.object({
    fontSize: z.enum(['small', 'medium', 'large']).optional(),
    highContrast: z.boolean().optional(),
    reducedMotion: z.boolean().optional(),
    screenReaderOptimized: z.boolean().optional(),
  }).optional(),
  
  billing: z.record(z.any()).optional(),
  admin: z.object({ 
    auditLogs: z.boolean().optional(), 
    impersonation: z.boolean().optional(), 
    ssoEnabled: z.boolean().optional(), 
    auditRetentionDays: z.number().optional(),
    twoFactorEnabled: z.boolean().optional(),
  }).optional(),
  therapist: z.object({ 
    allowSelfBooking: z.boolean().optional(), 
    publicAvailability: z.boolean().optional(), 
    defaultSessionLength: z.number().optional(), 
    bufferMinutes: z.number().optional(), 
    cancellationPolicyHours: z.number().optional(),
    licenseNumber: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    sessionRate: z.number().optional(),
    acceptingNewClients: z.boolean().optional(),
  }).optional(),
  patient: z.object({ 
    shareProgress: z.boolean().optional(), 
    reminders: z.boolean().optional(), 
    reminderMinutesBefore: z.number().optional(), 
    shareAnonymizedData: z.boolean().optional(),
    preferredSessionTime: z.string().optional(),
    therapyGoals: z.string().optional(),
  }).optional(),
});

type SettingsForm = z.infer<typeof SettingsSchema>;

export default function AccountSettingsPage() {
  const router = useRouter();
  const { currentUser } = useData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState<SettingsForm>({} as SettingsForm);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const form = useForm<SettingsForm>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {} as SettingsForm,
  });

  const roleDefaults = (role: string) => {
    const base: SettingsForm = { 
      displayName: currentUser?.name || '',
      bio: '',
      phone: '',
      notifications: { email: true, sms: false }, 
      preferences: {
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
      },
      privacy: {
        profileVisibility: 'therapists-only',
        showOnlineStatus: true,
        allowDirectMessages: true,
        shareProgressWithTherapist: true,
      },
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false,
        screenReaderOptimized: false,
      },
      billing: {},
    };
    
    if (role === 'Admin') {
      return { 
        ...base, 
        admin: { 
          auditLogs: true, 
          impersonation: false, 
          ssoEnabled: false, 
          auditRetentionDays: 365,
          twoFactorEnabled: false,
        } 
      };
    }
    
    if (role === 'Therapist') {
      return { 
        ...base, 
        therapist: { 
          allowSelfBooking: true, 
          publicAvailability: false, 
          defaultSessionLength: 50, 
          bufferMinutes: 10, 
          cancellationPolicyHours: 24,
          licenseNumber: '',
          yearsOfExperience: 0,
          sessionRate: 150,
          acceptingNewClients: true,
        } 
      };
    }
    
    // Patient
    return { 
      ...base, 
      patient: { 
        shareProgress: false, 
        reminders: true, 
        reminderMinutesBefore: 60, 
        shareAnonymizedData: false,
        preferredSessionTime: '',
        therapyGoals: '',
      } 
    };
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const s = await fxService.getSettings(currentUser?.id || currentUser?.uid || 'guest');
        if (!mounted) return;
        // Merge sensible role-specific defaults so first-time users see reasonable values
        const merged = { ...(roleDefaults(currentUser?.role || 'Patient')), ...(s || {}) } as SettingsForm;
        // Deep-merge nested sections conservatively
        merged.notifications = { ...(roleDefaults(currentUser?.role || 'Patient')).notifications, ...(s?.notifications || {}) };
        merged.preferences = { ...(roleDefaults(currentUser?.role || 'Patient')).preferences, ...(s?.preferences || {}) };
        merged.privacy = { ...(roleDefaults(currentUser?.role || 'Patient')).privacy, ...(s?.privacy || {}) };
        merged.accessibility = { ...(roleDefaults(currentUser?.role || 'Patient')).accessibility, ...(s?.accessibility || {}) };
        if (currentUser?.role === 'Admin') (merged as any).admin = { ...(roleDefaults('Admin') as any).admin, ...(s?.admin || {}) };
        if (currentUser?.role === 'Therapist') (merged as any).therapist = { ...(roleDefaults('Therapist') as any).therapist, ...(s?.therapist || {}) };
        if (currentUser?.role === 'Patient') (merged as any).patient = { ...(roleDefaults('Patient') as any).patient, ...(s?.patient || {}) };
        setSettings(merged || ({} as SettingsForm));
        form.reset(merged as SettingsForm);
      } catch (e) { console.error(e); }
      finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, [currentUser]);

  const save = async () => {
    try {
      // Validate before saving
      const validated = SettingsSchema.parse(settings || {});
      setErrors({});
      const res = await fxService.updateSettings(currentUser?.id || currentUser?.uid || 'guest', validated as any);
      setSettings(res);
      form.reset(res as SettingsForm);
      setHasChanges(false);
      toast({ title: 'Saved', description: 'Settings updated successfully' });
    } catch (e: any) {
      console.error(e);
      if (e?.issues) {
        const map: Record<string,string> = {};
        for (const issue of e.issues) {
          const path = issue.path.join('.') || 'settings';
          map[path] = issue.message;
        }
        setErrors(map);
        toast({ title: 'Validation error', description: 'Please fix highlighted fields', variant: 'destructive' });
        return;
      }
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    }
  };

  const updateSetting = (path: string[], value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newSettings;
    });
    setHasChanges(true);
  };

  const resetDefaults = async () => {
    const defaults = roleDefaults(currentUser?.role || 'Patient');
    setSettings(defaults);
    setHasChanges(true);
    try {
      const res = await fxService.updateSettings(currentUser?.id || currentUser?.uid || 'guest', defaults);
      setSettings(res);
      setHasChanges(false);
      toast({ title: 'Defaults Restored', description: 'Role defaults applied' });
    } catch (e) { 
      console.error(e); 
      toast({ title: 'Error', description: 'Failed to apply defaults', variant: 'destructive' }); 
    }
  };

  if (!currentUser) return <div className="p-4">Please log in</div>;

  const role = currentUser.role || 'Patient';

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <Badge variant="secondary">{role}</Badge>
      </div>

      {/* Insights Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goal Insights */}
        <React.Suspense fallback={<div>Loading...</div>}>
          {/* @ts-ignore */}
          {typeof window !== 'undefined' && require('@/components/eka/insights/goal-insights').GoalInsights ? (
            require('@/components/eka/insights/goal-insights').GoalInsights({ source: 'mock' })
          ) : null}
        </React.Suspense>
        {/* Journal Insights */}
        <React.Suspense fallback={<div>Loading...</div>}>
          {/* @ts-ignore */}
          {typeof window !== 'undefined' && require('@/components/eka/insights/journal-insights').JournalInsights ? (
            require('@/components/eka/insights/journal-insights').JournalInsights({ source: 'mock' })
          ) : null}
        </React.Suspense>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="accessibility">
            <Palette className="h-4 w-4 mr-2" />
            Accessibility
          </TabsTrigger>
          <TabsTrigger value="role">
            <Briefcase className="h-4 w-4 mr-2" />
            {role}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={settings.displayName || ''}
                  onChange={(e) => updateSetting(['displayName'], e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-3" />
                  <Input
                    id="email"
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-3" />
                  <Input
                    id="phone"
                    type="tel"
                    value={settings.phone || ''}
                    onChange={(e) => updateSetting(['phone'], e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={settings.bio || ''}
                  onChange={(e) => updateSetting(['bio'], e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground">
                  {(settings.bio || '').length} / 500 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure language, timezone, and format preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <div className="flex gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground mt-3" />
                  <Select 
                    value={settings.preferences?.language || 'en'} 
                    onValueChange={(value) => updateSetting(['preferences', 'language'], value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <div className="flex gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-3" />
                  <Select 
                    value={settings.preferences?.timezone || 'America/New_York'} 
                    onValueChange={(value) => updateSetting(['preferences', 'timezone'], value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select 
                  value={settings.preferences?.dateFormat || 'MM/DD/YYYY'} 
                  onValueChange={(value) => updateSetting(['preferences', 'dateFormat'], value)}
                >
                  <SelectTrigger id="dateFormat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeFormat">Time Format</Label>
                <Select 
                  value={settings.preferences?.timeFormat || '12h'} 
                  onValueChange={(value) => updateSetting(['preferences', 'timeFormat'], value as '12h' | '24h')}
                >
                  <SelectTrigger id="timeFormat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (14:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hidden until external services are configured
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates by email</p>
                </div>
                <Switch
                  checked={!!settings.notifications?.email}
                  onCheckedChange={(checked) => updateSetting(['notifications', 'email'], checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive SMS alerts</p>
                </div>
                <Switch
                  checked={!!settings.notifications?.sms}
                  onCheckedChange={(checked) => updateSetting(['notifications', 'sms'], checked)}
                />
              </div>

              <Separator /> */}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/account/notifications')}
              >
                <Bell className="h-4 w-4 mr-2" />
                Advanced Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control who can see your information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select 
                  value={settings.privacy?.profileVisibility || 'therapists-only'} 
                  onValueChange={(value) => updateSetting(['privacy', 'profileVisibility'], value)}
                >
                  <SelectTrigger id="profileVisibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can see</SelectItem>
                    <SelectItem value="therapists-only">Therapists Only</SelectItem>
                    <SelectItem value="private">Private - Only me</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Online Status</Label>
                  <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                </div>
                <Switch
                  checked={!!settings.privacy?.showOnlineStatus}
                  onCheckedChange={(checked) => updateSetting(['privacy', 'showOnlineStatus'], checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Direct Messages</Label>
                  <p className="text-sm text-muted-foreground">Receive messages from other users</p>
                </div>
                <Switch
                  checked={!!settings.privacy?.allowDirectMessages}
                  onCheckedChange={(checked) => updateSetting(['privacy', 'allowDirectMessages'], checked)}
                />
              </div>

              {role === 'Patient' && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Share Progress with Therapist</Label>
                      <p className="text-sm text-muted-foreground">Allow your therapist to view your progress</p>
                    </div>
                    <Switch
                      checked={!!settings.privacy?.shareProgressWithTherapist}
                      onCheckedChange={(checked) => updateSetting(['privacy', 'shareProgressWithTherapist'], checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {role === 'Admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Additional security settings for administrators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Switch
                    checked={!!settings.admin?.twoFactorEnabled}
                    onCheckedChange={(checked) => updateSetting(['admin', 'twoFactorEnabled'], checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all admin actions</p>
                  </div>
                  <Switch
                    checked={!!settings.admin?.auditLogs}
                    onCheckedChange={(checked) => updateSetting(['admin', 'auditLogs'], checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Options</CardTitle>
              <CardDescription>Customize the interface for better accessibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select 
                  value={settings.accessibility?.fontSize || 'medium'} 
                  onValueChange={(value) => updateSetting(['accessibility', 'fontSize'], value)}
                >
                  <SelectTrigger id="fontSize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium (Default)</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch
                  checked={!!settings.accessibility?.highContrast}
                  onCheckedChange={(checked) => updateSetting(['accessibility', 'highContrast'], checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch
                  checked={!!settings.accessibility?.reducedMotion}
                  onCheckedChange={(checked) => updateSetting(['accessibility', 'reducedMotion'], checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Screen Reader Optimized</Label>
                  <p className="text-sm text-muted-foreground">Optimize for screen reader usage</p>
                </div>
                <Switch
                  checked={!!settings.accessibility?.screenReaderOptimized}
                  onCheckedChange={(checked) => updateSetting(['accessibility', 'screenReaderOptimized'], checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role-Specific Tab */}
        <TabsContent value="role" className="space-y-4">{role === 'Patient' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Therapy Preferences</CardTitle>
                  <CardDescription>Set your therapy goals and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Session Time</Label>
                    <Select 
                      value={settings.patient?.preferredSessionTime || ''} 
                      onValueChange={(value) => updateSetting(['patient', 'preferredSessionTime'], value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                        <SelectItem value="evening">Evening (5 PM - 9 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Therapy Goals</Label>
                    <Textarea
                      value={settings.patient?.therapyGoals || ''}
                      onChange={(e) => updateSetting(['patient', 'therapyGoals'], e.target.value)}
                      placeholder="Describe what you hope to achieve through therapy..."
                      rows={4}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive reminders before appointments</p>
                    </div>
                    <Switch
                      checked={!!settings.patient?.reminders}
                      onCheckedChange={(checked) => updateSetting(['patient', 'reminders'], checked)}
                    />
                  </div>

                  {settings.patient?.reminders && (
                    <div className="space-y-2 ml-6">
                      <Label>Reminder Time (minutes before)</Label>
                      <Input
                        type="number"
                        value={settings.patient?.reminderMinutesBefore || 60}
                        onChange={(e) => updateSetting(['patient', 'reminderMinutesBefore'], parseInt(e.target.value))}
                        min={5}
                        max={1440}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Sharing</CardTitle>
                  <CardDescription>Control how your data is used</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Share Progress with Caregiver</Label>
                      <p className="text-sm text-muted-foreground">Allow linked accounts to view your progress</p>
                    </div>
                    <Switch
                      checked={!!settings.patient?.shareProgress}
                      onCheckedChange={(checked) => updateSetting(['patient', 'shareProgress'], checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Share Anonymized Data</Label>
                      <p className="text-sm text-muted-foreground">Help improve our services with anonymous data</p>
                    </div>
                    <Switch
                      checked={!!settings.patient?.shareAnonymizedData}
                      onCheckedChange={(checked) => updateSetting(['patient', 'shareAnonymizedData'], checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {role === 'Therapist' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Update your professional credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>License Number</Label>
                    <Input
                      value={settings.therapist?.licenseNumber || ''}
                      onChange={(e) => updateSetting(['therapist', 'licenseNumber'], e.target.value)}
                      placeholder="e.g., LPC-12345"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input
                      type="number"
                      value={settings.therapist?.yearsOfExperience || ''}
                      onChange={(e) => updateSetting(['therapist', 'yearsOfExperience'], parseInt(e.target.value))}
                      placeholder="5"
                      min={0}
                      max={50}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Session Rate (per hour)</Label>
                    <div className="flex gap-2">
                      <span className="mt-2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={settings.therapist?.sessionRate || ''}
                        onChange={(e) => updateSetting(['therapist', 'sessionRate'], parseInt(e.target.value))}
                        placeholder="150"
                        min={0}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Availability Settings</CardTitle>
                  <CardDescription>Configure your availability for sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Accepting New Clients</Label>
                      <p className="text-sm text-muted-foreground">Allow new clients to book with you</p>
                    </div>
                    <Switch
                      checked={!!settings.therapist?.acceptingNewClients}
                      onCheckedChange={(checked) => updateSetting(['therapist', 'acceptingNewClients'], checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Client Self-Booking</Label>
                      <p className="text-sm text-muted-foreground">Clients can book directly with your calendar</p>
                    </div>
                    <Switch
                      checked={!!settings.therapist?.allowSelfBooking}
                      onCheckedChange={(checked) => updateSetting(['therapist', 'allowSelfBooking'], checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Public Availability</Label>
                      <p className="text-sm text-muted-foreground">Show your schedule on public profile</p>
                    </div>
                    <Switch
                      checked={!!settings.therapist?.publicAvailability}
                      onCheckedChange={(checked) => updateSetting(['therapist', 'publicAvailability'], checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Default Session Length (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.therapist?.defaultSessionLength || 50}
                      onChange={(e) => updateSetting(['therapist', 'defaultSessionLength'], parseInt(e.target.value))}
                      min={15}
                      max={180}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Buffer Between Sessions (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.therapist?.bufferMinutes || 10}
                      onChange={(e) => updateSetting(['therapist', 'bufferMinutes'], parseInt(e.target.value))}
                      min={0}
                      max={60}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cancellation Policy (hours notice)</Label>
                    <Input
                      type="number"
                      value={settings.therapist?.cancellationPolicyHours || 24}
                      onChange={(e) => updateSetting(['therapist', 'cancellationPolicyHours'], parseInt(e.target.value))}
                      min={1}
                      max={168}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {role === 'Admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Configuration</CardTitle>
                <CardDescription>Administrative settings and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Audit Logs</Label>
                    <p className="text-sm text-muted-foreground">Keep detailed logs for admin actions</p>
                  </div>
                  <Switch
                    checked={!!settings.admin?.auditLogs}
                    onCheckedChange={(checked) => updateSetting(['admin', 'auditLogs'], checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow User Impersonation</Label>
                    <p className="text-sm text-muted-foreground">Admins can impersonate users for support</p>
                  </div>
                  <Switch
                    checked={!!settings.admin?.impersonation}
                    onCheckedChange={(checked) => updateSetting(['admin', 'impersonation'], checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable SSO</Label>
                    <p className="text-sm text-muted-foreground">Single Sign-On for enterprise users</p>
                  </div>
                  <Switch
                    checked={!!settings.admin?.ssoEnabled}
                    onCheckedChange={(checked) => updateSetting(['admin', 'ssoEnabled'], checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Audit Log Retention (days)</Label>
                  <Input
                    type="number"
                    value={settings.admin?.auditRetentionDays || 365}
                    onChange={(e) => updateSetting(['admin', 'auditRetentionDays'], parseInt(e.target.value))}
                    min={30}
                    max={3650}
                  />
                </div>

                <Separator />

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Users</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Sessions</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pending Reports</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-2 sticky bottom-4">
        <Button variant="outline" onClick={resetDefaults}>
          Reset to Defaults
        </Button>
        <Button onClick={save} disabled={!hasChanges}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
