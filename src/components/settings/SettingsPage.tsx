'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserIcon,
  Notification02Icon,
  LockIcon,
  Tick02Icon,
  Logout02Icon,
  Camera01Icon,
} from '@hugeicons/core-free-icons';
import { IdentityVerificationForm } from '@/components/identity/IdentityVerificationForm';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { InlineFeedbackCompact } from '@/components/ui/inline-feedback';
import { DashboardHeader } from '../dashboard/layout/DashboardHeader';
import { motion } from 'motion/react';
import { Loader2, AlertTriangle, Trash2, Mail, Phone, Calendar, Shield, Users, Gift } from 'lucide-react';
import Link from 'next/link';
import { MFASettings } from '@/components/settings/mfa-settings';
import { ReferralDashboard } from '@/components/settings/referral-dashboard';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import {
  saveProfile,
  uploadAvatar,
  sendPasswordResetEmail,
  getNotificationPreferences,
  saveNotificationPreferences,
  getUserPreferences,
  saveUserPreferences,
  requestAccountDeletion,
  type NotificationPreferences,
  type UserPreferences,
} from '@/app/actions/settings';

export function SettingsPage({
  profile,
  identityStatus,
}: {
  profile: any;
  identityStatus: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  // Determine initial tab from URL
  const initialTab = searchParams.get('tab') || 'profile';

  // ─── Profile state ────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    date_of_birth: profile?.date_of_birth || '',
    bio: profile?.bio || '',
  });
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  // ─── Morphing feedback hooks ───────────────────────────────────────────
  const profileFeedback = useMorphingFeedback();
  const avatarFeedback = useMorphingFeedback();
  const passwordFeedback = useMorphingFeedback();
  const sessionFeedback = useMorphingFeedback();
  const notifFeedback = useMorphingFeedback();
  const prefFeedback = useMorphingFeedback();
  const deleteFeedback = useMorphingFeedback();

  // ─── Notification state ───────────────────────────────────────────
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email_updates: true,
    push_notifications: false,
    appointment_reminders: true,
    marketing_emails: false,
    sms_notifications: false,
    wellness_tips: true,
  });
  const [notifLoaded, setNotifLoaded] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);

  // ─── Preferences state ───────────────────────────────────────────
  const [preferences, setPreferences] = useState<UserPreferences>({
    public_profile: false,
    share_goals: false,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [prefsSaving, setPrefsSaving] = useState(false);

  // ─── Security state ──────────────────────────────────────────────
  const [passwordResetSending, setPasswordResetSending] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // ─── Load notification preferences ───────────────────────────────
  useEffect(() => {
    getNotificationPreferences().then((prefs) => {
      setNotifications(prefs);
      setNotifLoaded(true);
    });
    getUserPreferences().then((prefs) => {
      setPreferences(prefs);
      setPrefsLoaded(true);
    });
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    profileFeedback.setLoading('Saving profile...');
    const result = await saveProfile(profileForm);
    if (result.success) {
      profileFeedback.setSuccess('Profile updated');
    } else {
      profileFeedback.setError(typeof result.error === 'string' ? result.error : 'Failed to save profile');
    }
    setProfileSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    const result = await uploadAvatar(formData);
    if (result.success && result.avatarUrl) {
      setAvatarUrl(result.avatarUrl);
      avatarFeedback.setSuccess('Avatar updated');
    } else {
      avatarFeedback.setError(result.error || 'Failed to upload avatar');
    }
    setAvatarUploading(false);
  };

  const handlePasswordReset = async () => {
    setPasswordResetSending(true);
    passwordFeedback.setLoading('Sending...');
    const result = await sendPasswordResetEmail();
    if (result.success) {
      passwordFeedback.setSuccess('Reset email sent! Check your inbox.');
    } else {
      passwordFeedback.setError(result.error || 'Failed to send reset email');
    }
    setPasswordResetSending(false);
  };

  const handleNotificationChange = async (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    setNotifSaving(true);
    const result = await saveNotificationPreferences(updated);
    if (result.success) {
      notifFeedback.setSuccess('Saved');
    } else {
      // Revert on failure
      setNotifications(notifications);
      notifFeedback.setError('Failed to save preference');
    }
    setNotifSaving(false);
  };

  const handlePreferenceChange = async (
    key: keyof UserPreferences,
    value: string | boolean
  ) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    setPrefsSaving(true);
    const result = await saveUserPreferences(updated);
    if (result.success) {
      prefFeedback.setSuccess('Saved');
    } else {
      setPreferences(preferences);
      prefFeedback.setError('Failed to save preference');
    }
    setPrefsSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    const result = await requestAccountDeletion();
    if (result.success) {
      deleteFeedback.setSuccess('Account deletion requested. Check your email.');
      setDeleteDialogOpen(false);
      setTimeout(() => {
        handleSignOut();
      }, 2000);
    } else {
      deleteFeedback.setError(result.error || 'Failed to request deletion');
    }
  };

  const notificationLabels: Record<keyof NotificationPreferences, { label: string; desc: string }> = {
    email_updates: {
      label: 'Email Updates',
      desc: 'Receive important account and booking updates via email',
    },
    push_notifications: {
      label: 'Push Notifications',
      desc: 'Browser and mobile push notifications for real-time alerts',
    },
    appointment_reminders: {
      label: 'Appointment Reminders',
      desc: 'Get reminded before your upcoming sessions',
    },
    marketing_emails: {
      label: 'Marketing Emails',
      desc: 'Occasional news, offers, and wellness tips',
    },
    sms_notifications: {
      label: 'SMS Notifications',
      desc: 'Text message alerts for appointments and urgent updates',
    },
    wellness_tips: {
      label: 'Wellness Tips',
      desc: 'Weekly curated wellness insights and recommendations',
    },
  };

  return (
    <motion.div
      className="space-y-8 px-4 py-8 pb-20 md:px-8"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      <DashboardHeader
        title="Account"
        subtitle="Manage your profile, preferences, and security in one place."
      >
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive bg-destructive/5 hover:bg-destructive/10 group h-11 rounded-full px-5 font-semibold"
          onClick={handleSignOut}
        >
          <HugeiconsIcon
            icon={Logout02Icon}
            size={18}
            strokeWidth={2.5}
            className="mr-2 transition-transform group-hover:-translate-x-1"
          />
          Sign Out
        </Button>
      </DashboardHeader>

      {/* ─── Profile Overview Card ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-8 shadow-sm md:flex-row md:items-start"
      >
        <div
          className="group relative cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Avatar className="h-24 w-24 overflow-hidden rounded-lg border-4 border-secondary shadow-sm">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="rounded-lg bg-secondary text-2xl font-black text-foreground">
              {profileForm.full_name?.substring(0, 2)?.toUpperCase() || 'ME'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-foreground/40 opacity-0 transition-opacity group-hover:opacity-100">
            {avatarUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-background" />
            ) : (
              <HugeiconsIcon icon={Camera01Icon} size={24} className="text-background" />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>
        <div className="min-w-0 flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {profileForm.full_name || 'Your Name'}
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{profile?.email}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
              {profile?.role || 'Client'}
            </Badge>
            {profile?.phone && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" /> {profile.phone}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" /> Joined{' '}
              {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 rounded-full px-4 font-semibold"
          >
            <Link href="/settings/family">
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Family
            </Link>
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue={initialTab} className="space-y-8">
        <TabsList className="bg-secondary inline-flex h-auto w-auto rounded-full p-1.5">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full px-6 py-2.5 font-semibold transition-all data-[state=active]:shadow-sm"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full px-6 py-2.5 font-semibold transition-all data-[state=active]:shadow-sm"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full px-6 py-2.5 font-semibold transition-all data-[state=active]:shadow-sm"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="identity"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full px-6 py-2.5 font-semibold transition-all data-[state=active]:shadow-sm"
          >
            Identity
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full px-6 py-2.5 font-semibold transition-all data-[state=active]:shadow-sm"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="referral"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full px-6 py-2.5 font-semibold transition-all data-[state=active]:shadow-sm"
          >
            Referral
          </TabsTrigger>
        </TabsList>

        {/* ───────────────────── PROFILE TAB ───────────────────── */}
        <TabsContent value="profile">
          <div className="grid gap-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border-border/50 rounded-lg border p-10 shadow-sm"
            >
              <h2 className="text-foreground mb-10 flex items-center gap-4 text-2xl font-semibold">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={2.5} />
                </div>
                Personal Information
              </h2>
              <div className="flex flex-col items-start gap-12 md:flex-row">
                <div className="flex flex-col items-center gap-6">
                  <div
                    className="group relative cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Avatar className="border-secondary h-32 w-32 overflow-hidden rounded-lg border-4 shadow-sm">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="bg-secondary text-foreground rounded-lg text-3xl font-black">
                        {profileForm.full_name?.substring(0, 2)?.toUpperCase() || 'ME'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-foreground/40 opacity-0 transition-opacity group-hover:opacity-100">
                      {avatarUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-background" />
                      ) : (
                        <HugeiconsIcon icon={Camera01Icon} size={32} className="text-background" />
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-muted hover:bg-secondary h-10 rounded-full px-6 font-semibold"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? 'Uploading...' : 'Change Photo'}
                  </Button>
                </div>
                <div className="w-full flex-1 space-y-8">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label className="text-muted-foreground ml-1 font-semibold">Full Name</Label>
                      <Input
                        value={profileForm.full_name}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, full_name: e.target.value })
                        }
                        className="bg-secondary h-10 rounded-lg border-none px-4 text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-muted-foreground ml-1 font-semibold">Email</Label>
                      <Input
                        defaultValue={profile?.email}
                        disabled
                        className="bg-secondary/50 text-muted-foreground h-10 rounded-lg border-none px-4 text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-muted-foreground ml-1 font-semibold">Phone</Label>
                      <Input
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, phone: e.target.value })
                        }
                        placeholder="+353 1 234 5678"
                        className="bg-secondary h-10 rounded-lg border-none px-4 text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-muted-foreground ml-1 font-semibold">Date of Birth</Label>
                      <Input
                        type="date"
                        value={profileForm.date_of_birth}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, date_of_birth: e.target.value })
                        }
                        className="bg-secondary h-10 rounded-lg border-none px-4 text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-muted-foreground ml-1 font-semibold">Bio</Label>
                    <Textarea
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      placeholder="Tell us a bit about yourself..."
                      maxLength={500}
                      className="bg-secondary min-h-25 rounded-lg border-none px-4 py-3 text-sm font-medium"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {profileForm.bio.length}/500
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <InlineFeedbackCompact
                      status={profileFeedback.status}
                      message={profileFeedback.message}
                      onDismiss={profileFeedback.reset}
                    />
                    <Button
                      variant="outline"
                      className="h-10 rounded-lg px-6 font-semibold"
                      onClick={() =>
                        setProfileForm({
                          full_name: profile?.full_name || '',
                          phone: profile?.phone || '',
                          date_of_birth: profile?.date_of_birth || '',
                          bio: profile?.bio || '',
                        })
                      }
                    >
                      Reset
                    </Button>
                    <Button
                      className="bg-primary h-10 rounded-lg px-8 font-semibold text-primary-foreground shadow-sm"
                      onClick={handleProfileSave}
                      disabled={profileSaving}
                    >
                      {profileSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {profileSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Preferences Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border-border/50 rounded-lg border p-10 shadow-sm"
            >
              <h2 className="text-foreground mb-10 flex items-center gap-4 text-2xl font-semibold">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={Tick02Icon} size={24} strokeWidth={2.5} />
                </div>
                Preferences
                <InlineFeedbackCompact
                  status={prefFeedback.status}
                  message={prefFeedback.message}
                  onDismiss={prefFeedback.reset}
                />
              </h2>
              <div className="space-y-6">
                <div className="bg-secondary flex items-center justify-between rounded-lg p-6">
                  <div>
                    <Label className="text-foreground text-lg font-semibold">
                      Public Profile
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Allow others to see your profile in social features
                    </p>
                  </div>
                  <Switch
                    checked={preferences.public_profile}
                    onCheckedChange={(v) => handlePreferenceChange('public_profile', v)}
                  />
                </div>
                <div className="bg-secondary flex items-center justify-between rounded-lg p-6">
                  <div>
                    <Label className="text-foreground text-lg font-semibold">
                      Share Goals Progress
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share your wellness goals progress with your therapist
                    </p>
                  </div>
                  <Switch
                    checked={preferences.share_goals}
                    onCheckedChange={(v) => handlePreferenceChange('share_goals', v)}
                  />
                </div>
                <div className="bg-secondary flex items-center justify-between rounded-lg p-6">
                  <div>
                    <Label className="text-foreground text-lg font-semibold">
                      Language
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Preferred language for the interface
                    </p>
                  </div>
                  <Select
                    value={preferences.language}
                    onValueChange={(v) => handlePreferenceChange('language', v)}
                  >
                    <SelectTrigger className="w-40 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ga">Gaeilge</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="uk">Українська</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-secondary flex items-center justify-between rounded-lg p-6">
                  <div>
                    <Label className="text-foreground text-lg font-semibold">
                      Timezone
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Used for appointment scheduling
                    </p>
                  </div>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(v) => handlePreferenceChange('timezone', v)}
                  >
                    <SelectTrigger className="w-55 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Dublin">Dublin (GMT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
                      <SelectItem value="Europe/Kyiv">Kyiv (EET)</SelectItem>
                      <SelectItem value="America/New_York">New York (EST)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Los Angeles (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        {/* ───────────────────── IDENTITY TAB ───────────────────── */}
        <TabsContent value="identity">
          <IdentityVerificationForm currentStatus={identityStatus} />
        </TabsContent>

        {/* ───────────────────── SECURITY TAB ───────────────────── */}
        <TabsContent value="security">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border-border/50 rounded-lg border p-10 shadow-sm"
            >
              <h2 className="text-foreground mb-10 flex items-center gap-4 text-2xl font-semibold">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={LockIcon} size={24} strokeWidth={2.5} />
                </div>
                Password & Authentication
              </h2>
              <div className="space-y-6">
                <div className="bg-secondary flex flex-col gap-3 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-foreground text-lg font-semibold">Password</div>
                      <div className="text-muted-foreground mt-1 text-sm font-medium">
                        Send a password reset link to your email
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePasswordReset}
                      disabled={passwordResetSending}
                      className="border-muted h-10 rounded-full px-6 font-semibold"
                    >
                      {passwordResetSending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {passwordResetSending ? 'Sending...' : 'Reset Password'}
                    </Button>
                  </div>
                  <InlineFeedbackCompact
                    status={passwordFeedback.status}
                    message={passwordFeedback.message}
                    onDismiss={passwordFeedback.reset}
                  />
                </div>
                <div className="bg-secondary flex flex-col gap-3 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-foreground text-lg font-semibold">
                        Active Sessions
                      </div>
                      <div className="text-muted-foreground mt-1 text-sm font-medium">
                        This device is currently active
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-muted h-10 rounded-full px-6 font-semibold"
                      onClick={async () => {
                        await supabase.auth.signOut({ scope: 'others' });
                        sessionFeedback.setSuccess('All other sessions signed out');
                      }}
                    >
                      Sign Out Others
                    </Button>
                  </div>
                  <InlineFeedbackCompact
                    status={sessionFeedback.status}
                    message={sessionFeedback.message}
                    onDismiss={sessionFeedback.reset}
                  />
                </div>
              </div>
            </motion.div>

            {/* Two-Factor Authentication */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-card border-border/50 rounded-lg border p-10 shadow-sm"
            >
              <h2 className="text-foreground mb-6 flex items-center gap-4 text-2xl font-semibold">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                Two-Factor Authentication
              </h2>
              <MFASettings />
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-lg border border-destructive/20 bg-destructive/5 p-10 shadow-sm"
            >
              <h2 className="text-destructive mb-6 flex items-center gap-4 text-2xl font-semibold">
                <div className="bg-destructive/10 text-destructive flex h-12 w-12 items-center justify-center rounded-lg">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                Danger Zone
              </h2>
              <div className="bg-card flex items-center justify-between rounded-lg border border-destructive/10 p-6">
                <div>
                  <div className="text-foreground text-lg font-semibold">Delete Account</div>
                  <div className="text-muted-foreground mt-1 text-sm font-medium">
                    Permanently delete your account and all associated data. This action cannot be
                    undone.
                  </div>
                </div>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-10 rounded-full px-6 font-semibold"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-lg">
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This will permanently delete your account, cancel any active subscriptions,
                        and remove all your data. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                      <Label className="text-sm font-medium">
                        Type <span className="font-semibold text-destructive">DELETE</span> to confirm
                      </Label>
                      <Input
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="DELETE"
                        className="rounded-lg"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                        className="rounded-lg"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={deleteConfirmText !== 'DELETE'}
                        onClick={handleDeleteAccount}
                        className="rounded-lg"
                      >
                        Delete My Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        {/* ───────────────────── NOTIFICATIONS TAB ───────────────────── */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border-border/50 rounded-lg border p-10 shadow-sm"
          >
            <h2 className="text-foreground mb-10 flex items-center gap-4 text-2xl font-semibold">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={Notification02Icon} size={24} strokeWidth={2.5} />
              </div>
              Notification Preferences
              <InlineFeedbackCompact
                status={notifFeedback.status}
                message={notifFeedback.message}
                onDismiss={notifFeedback.reset}
              />
            </h2>
            <div className="space-y-6">
              {(Object.keys(notificationLabels) as Array<keyof NotificationPreferences>).map(
                (key) => (
                  <div
                    key={key}
                    className="bg-secondary flex items-center justify-between rounded-lg p-6"
                  >
                    <div>
                      <div className="text-foreground text-lg font-semibold">
                        {notificationLabels[key].label}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notificationLabels[key].desc}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[key]}
                      onCheckedChange={(c) => handleNotificationChange(key, c)}
                      disabled={notifSaving}
                    />
                  </div>
                )
              )}
            </div>
          </motion.div>
        </TabsContent>

        {/* ───────────────────── APPEARANCE TAB ───────────────────── */}
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>

        {/* ───────────────────── REFERRAL TAB ───────────────────── */}
        <TabsContent value="referral">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border-border/50 rounded-lg border p-10 shadow-sm"
          >
            <h2 className="text-foreground mb-8 flex items-center gap-4 text-2xl font-semibold">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                <Gift className="h-6 w-6" />
              </div>
              Referral Program
            </h2>
            <ReferralDashboard />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
