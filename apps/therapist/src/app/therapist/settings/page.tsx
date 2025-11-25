'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/supabase-auth';
import {
  Settings,
  User,
  Calendar,
  Bell,
  Clock,
  Save,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

interface TherapistSettings {
  profile: {
    specializations: string[];
    bio: string;
    yearsExperience: number;
    languages: string[];
    hourlyRate: number;
    acceptingNewClients: boolean;
  };
  availability: AvailabilitySlot[];
  notifications: {
    emailNewBooking: boolean;
    emailCancellation: boolean;
    emailReminder: boolean;
    smsReminder: boolean;
    reminderHoursBefore: number;
  };
  preferences: {
    defaultSessionDuration: number;
    bufferTimeBetweenSessions: number;
    maxClientsPerDay: number;
    autoConfirmBookings: boolean;
  };
}

const defaultAvailability: AvailabilitySlot[] = [
  { day: 'Monday', startTime: '09:00', endTime: '17:00', enabled: true },
  { day: 'Tuesday', startTime: '09:00', endTime: '17:00', enabled: true },
  { day: 'Wednesday', startTime: '09:00', endTime: '17:00', enabled: true },
  { day: 'Thursday', startTime: '09:00', endTime: '17:00', enabled: true },
  { day: 'Friday', startTime: '09:00', endTime: '17:00', enabled: true },
  { day: 'Saturday', startTime: '10:00', endTime: '14:00', enabled: false },
  { day: 'Sunday', startTime: '10:00', endTime: '14:00', enabled: false },
];

const defaultSettings: TherapistSettings = {
  profile: {
    specializations: [],
    bio: '',
    yearsExperience: 0,
    languages: ['English'],
    hourlyRate: 80,
    acceptingNewClients: true,
  },
  availability: defaultAvailability,
  notifications: {
    emailNewBooking: true,
    emailCancellation: true,
    emailReminder: true,
    smsReminder: false,
    reminderHoursBefore: 24,
  },
  preferences: {
    defaultSessionDuration: 60,
    bufferTimeBetweenSessions: 15,
    maxClientsPerDay: 8,
    autoConfirmBookings: false,
  },
};

const specializationOptions = [
  'Anxiety', 'Depression', 'Trauma', 'PTSD', 'Relationship Issues',
  'Family Therapy', 'Grief Counseling', 'Stress Management', 'CBT',
  'Mindfulness', 'Addiction', 'ADHD', 'Anger Management', 'Self-Esteem'
];

export default function TherapistSettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [settings, setSettings] = useState<TherapistSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState('');

  useEffect(() => {
    // Load settings from storage/database
    const loadSettings = async () => {
      try {
        // In a real implementation, load from Supabase
        const savedSettings = localStorage.getItem(`therapist_settings_${user?.id}`);
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadSettings();
    }
  }, [user?.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage (in production, save to Supabase)
      localStorage.setItem(`therapist_settings_${user?.id}`, JSON.stringify(settings));
      toast({ title: 'Success', description: 'Settings saved successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addSpecialization = () => {
    if (newSpecialization && !settings.profile.specializations.includes(newSpecialization)) {
      setSettings({
        ...settings,
        profile: {
          ...settings.profile,
          specializations: [...settings.profile.specializations, newSpecialization]
        }
      });
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setSettings({
      ...settings,
      profile: {
        ...settings.profile,
        specializations: settings.profile.specializations.filter(s => s !== spec)
      }
    });
  };

  const updateAvailability = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const newAvailability = [...settings.availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setSettings({ ...settings, availability: newAvailability });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your profile, availability, and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="availability"><Calendar className="h-4 w-4 mr-2" />Availability</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
          <TabsTrigger value="preferences"><Settings className="h-4 w-4 mr-2" />Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Profile</CardTitle>
              <CardDescription>Information visible to clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={settings.profile.bio}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, bio: e.target.value }
                  })}
                  placeholder="Tell clients about yourself and your approach..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={settings.profile.yearsExperience}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, yearsExperience: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="rate">Hourly Rate (EUR)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={settings.profile.hourlyRate}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, hourlyRate: parseFloat(e.target.value) || 0 }
                    })}
                  />
                </div>
              </div>

              <div>
                <Label>Specializations</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {settings.profile.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                      {spec}
                      <button onClick={() => removeSpecialization(spec)} className="ml-1 hover:text-red-500">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Select value={newSpecialization} onValueChange={setNewSpecialization}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializationOptions.filter(s => !settings.profile.specializations.includes(s)).map((spec) => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addSpecialization} disabled={!newSpecialization}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.profile.acceptingNewClients}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, acceptingNewClients: checked }
                  })}
                />
                <Label>Accepting new clients</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
              <CardDescription>Set your available hours for each day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.availability.map((slot, index) => (
                  <div key={slot.day} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Switch
                      checked={slot.enabled}
                      onCheckedChange={(checked) => updateAvailability(index, 'enabled', checked)}
                    />
                    <span className="w-24 font-medium">{slot.day}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                        disabled={!slot.enabled}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                        disabled={!slot.enabled}
                        className="w-32"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">New Booking Email</p>
                  <p className="text-sm text-muted-foreground">Get notified when a client books a session</p>
                </div>
                <Switch
                  checked={settings.notifications.emailNewBooking}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailNewBooking: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Cancellation Email</p>
                  <p className="text-sm text-muted-foreground">Get notified when a session is cancelled</p>
                </div>
                <Switch
                  checked={settings.notifications.emailCancellation}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailCancellation: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Email Reminders</p>
                  <p className="text-sm text-muted-foreground">Receive reminders before scheduled sessions</p>
                </div>
                <Switch
                  checked={settings.notifications.emailReminder}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailReminder: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">SMS Reminders</p>
                  <p className="text-sm text-muted-foreground">Receive SMS reminders for sessions</p>
                </div>
                <Switch
                  checked={settings.notifications.smsReminder}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, smsReminder: checked }
                  })}
                />
              </div>

              <div className="p-3 border rounded-lg">
                <Label htmlFor="reminderHours">Reminder Time (hours before session)</Label>
                <Select
                  value={String(settings.notifications.reminderHoursBefore)}
                  onValueChange={(value) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, reminderHoursBefore: parseInt(value) }
                  })}
                >
                  <SelectTrigger className="mt-2 w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Preferences</CardTitle>
              <CardDescription>Configure default session settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Default Session Duration (minutes)</Label>
                  <Select
                    value={String(settings.preferences.defaultSessionDuration)}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, defaultSessionDuration: parseInt(value) }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="buffer">Buffer Between Sessions (minutes)</Label>
                  <Select
                    value={String(settings.preferences.bufferTimeBetweenSessions)}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, bufferTimeBetweenSessions: parseInt(value) }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No buffer</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="maxClients">Maximum Clients Per Day</Label>
                <Input
                  id="maxClients"
                  type="number"
                  value={settings.preferences.maxClientsPerDay}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, maxClientsPerDay: parseInt(e.target.value) || 0 }
                  })}
                  className="w-32"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Auto-confirm Bookings</p>
                  <p className="text-sm text-muted-foreground">Automatically confirm new booking requests</p>
                </div>
                <Switch
                  checked={settings.preferences.autoConfirmBookings}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, autoConfirmBookings: checked }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
