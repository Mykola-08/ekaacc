'use client';

import { useMemo, useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Settings01Icon,
  UserIcon,
  Notification01Icon,
  SecurityCheckIcon,
  Upload01Icon,
  CheckmarkCircle01Icon,
  Loading03Icon,
  Key01Icon,
  Logout03Icon,
  Mail01Icon,
  GlobalIcon,
} from '@hugeicons/core-free-icons';
import { updateProfile } from '@/app/actions/profile-actions';
import { updateNotificationPreferences } from '@/app/actions/notification-preferences-actions';
import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/context/LanguageTypes';
import { cn } from '@/lib/utils';

type Profile = {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: string | null;
};

type NotifPrefs = {
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  telegram_enabled: boolean;
  booking_reminders: boolean;
  booking_changes: boolean;
  assignment_due: boolean;
  assignment_reviewed: boolean;
  ai_insights_weekly: boolean;
  goal_nudges: boolean;
  community_mentions: boolean;
  payment_receipts: boolean;
  system_updates: boolean;
  digest_frequency: string;
} | null;

function getInitials(name: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function SaveFeedback({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <span className="flex items-center gap-1 text-sm text-success">
      <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
      Saved
    </span>
  );
}

// ── Profile Tab ────────────────────────────────────────────────────

function ProfileTab({ profile, email }: { profile: Profile | null; email: string }) {
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const res = await updateProfile({
        full_name: fullName.trim() || undefined,
        bio: bio.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(res.error ?? 'Failed to save');
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Profile Picture</CardTitle>
          <CardDescription>
            Your photo is visible to your therapist and other users.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-5">
          <Avatar className="size-20 shrink-0">
            <AvatarImage src={profile?.avatar_url ?? ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 rounded-full" disabled>
                <HugeiconsIcon icon={Upload01Icon} className="size-3.5" />
                Upload Photo
              </Button>
              {profile?.avatar_url && (
                <Button variant="ghost" size="sm" className="rounded-full text-destructive hover:text-destructive">
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">JPG, PNG or GIF · Max 2 MB</p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>Update your name and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email Address</Label>
            <Input
              type="email"
              value={email}
              disabled
              className="h-10 rounded-xl bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here. Contact support to update.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Phone Number</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="h-10 rounded-xl"
              type="tel"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short description about yourself…"
              className="min-h-24 resize-none rounded-xl"
              maxLength={300}
            />
            <p className="text-right text-xs text-muted-foreground">{bio.length}/300</p>
          </div>
          {error && (
            <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
          )}
        </CardContent>
        <CardFooter className="justify-between border-t px-6 py-4">
          <SaveFeedback saved={saved} />
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="gap-2 rounded-full"
            size="sm"
          >
            {isPending && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
            {isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>

      {/* Role */}
      {profile?.role && (
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Account Role</CardTitle>
                <CardDescription>Your role determines what features you can access.</CardDescription>
              </div>
              <Badge className="capitalize">{profile.role}</Badge>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

// ── Notifications Tab ──────────────────────────────────────────────

type ToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onToggle: (v: boolean) => void;
  disabled?: boolean;
};

function ToggleRow({ label, description, checked, onToggle, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-none">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onToggle}
        disabled={disabled}
        className="shrink-0"
      />
    </div>
  );
}

function NotificationsTab({ prefs: initialPrefs }: { prefs: NotifPrefs }) {
  const defaultPrefs = {
    email_enabled: true,
    push_enabled: true,
    in_app_enabled: true,
    telegram_enabled: false,
    booking_reminders: true,
    booking_changes: true,
    assignment_due: true,
    assignment_reviewed: true,
    ai_insights_weekly: true,
    goal_nudges: true,
    community_mentions: true,
    payment_receipts: true,
    system_updates: false,
    digest_frequency: 'daily',
  };

  const [prefs, setPrefs] = useState({ ...defaultPrefs, ...(initialPrefs ?? {}) });
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const set = (key: keyof typeof prefs) => (val: boolean | string) =>
    setPrefs((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    setSaved(false);
    startTransition(async () => {
      await updateNotificationPreferences(prefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  return (
    <div className="space-y-4">
      {/* Channels */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Delivery Channels</CardTitle>
          <CardDescription>Choose how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/50 pt-0">
          <ToggleRow
            label="Email Notifications"
            description="Receive notifications via your registered email."
            checked={prefs.email_enabled}
            onToggle={set('email_enabled')}
          />
          <ToggleRow
            label="Push Notifications"
            description="Browser or mobile push alerts."
            checked={prefs.push_enabled}
            onToggle={set('push_enabled')}
          />
          <ToggleRow
            label="In-App Notifications"
            description="Notifications shown inside the platform."
            checked={prefs.in_app_enabled}
            onToggle={set('in_app_enabled')}
          />
          <ToggleRow
            label="Telegram Notifications"
            description="Receive updates through your linked Telegram account."
            checked={prefs.telegram_enabled}
            onToggle={set('telegram_enabled')}
          />
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Notification Types</CardTitle>
          <CardDescription>Control which events trigger a notification.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/50 pt-0">
          <ToggleRow
            label="Booking Reminders"
            description="Get reminded before your upcoming sessions."
            checked={prefs.booking_reminders}
            onToggle={set('booking_reminders')}
          />
          <ToggleRow
            label="Booking Changes"
            description="Alerts when a session is rescheduled or cancelled."
            checked={prefs.booking_changes}
            onToggle={set('booking_changes')}
          />
          <ToggleRow
            label="Assignment Due"
            description="Reminders when your therapist's assignments are due."
            checked={prefs.assignment_due}
            onToggle={set('assignment_due')}
          />
          <ToggleRow
            label="Assignment Reviewed"
            description="Notified when your therapist reviews a submission."
            checked={prefs.assignment_reviewed}
            onToggle={set('assignment_reviewed')}
          />
          <ToggleRow
            label="AI Insights (Weekly)"
            description="Receive your weekly AI-generated wellness recap."
            checked={prefs.ai_insights_weekly}
            onToggle={set('ai_insights_weekly')}
          />
          <ToggleRow
            label="Goal Nudges"
            description="Encouragement to update your goals regularly."
            checked={prefs.goal_nudges}
            onToggle={set('goal_nudges')}
          />
          <ToggleRow
            label="Community Mentions"
            description="Alerts when someone mentions you in the community."
            checked={prefs.community_mentions}
            onToggle={set('community_mentions')}
          />
          <ToggleRow
            label="Payment Receipts"
            description="Email confirmation for every payment."
            checked={prefs.payment_receipts}
            onToggle={set('payment_receipts')}
          />
          <ToggleRow
            label="System Updates"
            description="Platform maintenance and feature announcements."
            checked={prefs.system_updates}
            onToggle={set('system_updates')}
          />
        </CardContent>
        <CardFooter className="justify-between border-t px-6 py-4">
          <SaveFeedback saved={saved} />
          <Button
            onClick={handleSave}
            disabled={isPending}
            size="sm"
            className="gap-2 rounded-full"
          >
            {isPending && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
            {isPending ? 'Saving…' : 'Save Preferences'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// ── Security Tab ───────────────────────────────────────────────────

function SecurityTab({ email }: { email: string }) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [isPending, startTransition] = useTransition();
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaved, setPwSaved] = useState(false);

  const handlePasswordChange = () => {
    setPwError(null);
    if (!newPw || newPw.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('Passwords do not match.');
      return;
    }
    startTransition(async () => {
      // Password update via Supabase auth
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) {
        setPwError(error.message);
      } else {
        setPwSaved(true);
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
        setTimeout(() => setPwSaved(false), 3000);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Password */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Key01Icon} className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Change Password</CardTitle>
          </div>
          <CardDescription>
            Update the password for <span className="font-medium">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="At least 8 characters"
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat the new password"
              className="h-10 rounded-xl"
            />
          </div>
          {pwError && (
            <Alert variant="destructive"><AlertDescription>{pwError}</AlertDescription></Alert>
          )}
          {pwSaved && (
            <span className="flex items-center gap-1.5 text-sm text-success">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
              Password updated successfully.
            </span>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4 justify-end">
          <Button
            onClick={handlePasswordChange}
            disabled={isPending || !newPw || !confirmPw}
            size="sm"
            className="gap-2 rounded-full"
          >
            {isPending && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
            {isPending ? 'Updating…' : 'Update Password'}
          </Button>
        </CardFooter>
      </Card>

      {/* MFA */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={SecurityCheckIcon} className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
            <HugeiconsIcon icon={Mail01Icon} className="mt-0.5 size-5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Authenticator App</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Use an authenticator app (e.g., Google Authenticator) to generate one-time codes.
              </p>
            </div>
            <Badge variant="secondary" className="shrink-0 text-xs">
              Coming soon
            </Badge>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
            <HugeiconsIcon icon={Mail01Icon} className="mt-0.5 size-5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Email Verification</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Receive a one-time code via email when logging in from a new device.
              </p>
            </div>
            <Badge variant="secondary" className="shrink-0 text-xs">
              Coming soon
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card className="rounded-2xl border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Logout03Icon} className="size-4 text-destructive" />
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <div>
              <p className="text-sm font-medium">Sign out all sessions</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Log out from all devices and browsers.
              </p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10">
              Sign Out All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Language Tab ───────────────────────────────────────────────────

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ca', label: 'Catalan', nativeLabel: 'Català' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский' },
] as const;

function LanguageTab() {
  const { language, setLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language>(language);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLanguage(selected);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Display Language</CardTitle>
          <CardDescription>
            Choose the language used throughout the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {LANGUAGE_OPTIONS.map(({ code, nativeLabel, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => setSelected(code)}
              className={cn(
                'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors',
                selected === code
                  ? 'border-primary bg-primary/5 font-medium text-primary'
                  : 'border-border/60 hover:border-border hover:bg-muted/50'
              )}
            >
              <span>{nativeLabel}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </button>
          ))}
        </CardContent>
        <CardFooter className="justify-between border-t px-6 py-4">
          {saved ? (
            <span className="flex items-center gap-1 text-sm text-success">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
              Language updated
            </span>
          ) : (
            <span />
          )}
          <Button
            onClick={handleSave}
            disabled={selected === language}
            size="sm"
            className="gap-2 rounded-full"
          >
            Apply Language
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────

export function SettingsClient({
  profile,
  email,
  notifPrefs,
}: {
  profile: Profile | null;
  email: string;
  notifPrefs: NotifPrefs;
}) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const tabItems = useMemo(
    () => [
      { value: 'profile', label: 'Profile', icon: UserIcon },
      { value: 'notifications', label: 'Notifications', icon: Notification01Icon },
      { value: 'security', label: 'Security', icon: SecurityCheckIcon },
      { value: 'language', label: 'Language', icon: GlobalIcon },
    ],
    []
  );

  const filteredTabs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tabItems;
    return tabItems.filter((tab) => tab.label.toLowerCase().includes(normalized));
  }, [query, tabItems]);

  const visibleTabValues = new Set(filteredTabs.map((tab) => tab.value));
  const resolvedTab = visibleTabValues.has(activeTab)
    ? activeTab
    : (filteredTabs[0]?.value ?? 'profile');

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <HugeiconsIcon icon={Settings01Icon} className="size-5 text-muted-foreground" />
          Settings
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your profile, notifications, and security preferences.
        </p>
      </div>

      <div className="px-4 lg:px-6">
        <div className="mb-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search settings sections…"
            className="h-10 rounded-xl"
            aria-label="Search settings sections"
          />
        </div>

        <Tabs value={resolvedTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 h-auto min-h-10 flex-wrap rounded-xl">
            {filteredTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 rounded-lg text-xs">
                <HugeiconsIcon icon={tab.icon} className="size-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredTabs.length === 0 && (
            <div className="mb-6 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              No matching settings sections. Try terms like <span className="font-medium">profile</span>,{' '}
              <span className="font-medium">notifications</span>, or <span className="font-medium">security</span>.
            </div>
          )}

          <TabsContent value="profile" className={cn('mt-0', !visibleTabValues.has('profile') && 'hidden')}>
            <ProfileTab profile={profile} email={email} />
          </TabsContent>

          <TabsContent value="notifications" className={cn('mt-0', !visibleTabValues.has('notifications') && 'hidden')}>
            <NotificationsTab prefs={notifPrefs} />
          </TabsContent>

          <TabsContent value="security" className={cn('mt-0', !visibleTabValues.has('security') && 'hidden')}>
            <SecurityTab email={email} />
          </TabsContent>

          <TabsContent value="language" className={cn('mt-0', !visibleTabValues.has('language') && 'hidden')}>
            <LanguageTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
