'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserCircleIcon,
  Loading03Icon,
  PlusSignIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { updateProfile } from '@/app/actions/profile-actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type Profile = {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  specialties: string[] | null;
  created_at: string;
};

type AuthUser = {
  email: string;
  created_at: string;
};

export function ProfilePageClient({ profile, user }: { profile: Profile | null; user: AuthUser }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [specialties, setSpecialties] = useState<string[]>(profile?.specialties ?? []);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const res = await updateProfile({
      full_name: fullName || undefined,
      bio: bio || undefined,
      phone: phone || undefined,
      specialties: specialties.length > 0 ? specialties : undefined,
    });
    setSaving(false);
    if (!res.success) { setError(res.error ?? 'Failed to save'); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    router.refresh();
  };

  const addSpecialty = () => {
    const val = newSpecialty.trim();
    if (!val || specialties.includes(val)) return;
    setSpecialties((prev) => [...prev, val]);
    setNewSpecialty('');
  };

  const removeSpecialty = (s: string) => {
    setSpecialties((prev) => prev.filter((x) => x !== s));
  };

  const memberSince = new Date(user.created_at).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col gap-4 py-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <HugeiconsIcon icon={UserCircleIcon} className="size-5 text-muted-foreground" />
          My Profile
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-3">
        {/* Main form */}
        <div className="space-y-4 @xl/main:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>Update your name, bio, and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="h-10 rounded-xl bg-muted/40 text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief introduction about yourself…"
                  className="min-h-24 resize-none rounded-xl"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className={cn('gap-2 rounded-full', saved && 'bg-success text-success-foreground')}
                >
                  {saving && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
                  {saved && <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />}
                  {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Specialties & Interests</CardTitle>
              <CardDescription>Add topics you're working on or interested in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {specialties.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1.5 rounded-full pr-1">
                    {s}
                    <button
                      onClick={() => removeSpecialty(s)}
                      className="rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                    </button>
                  </Badge>
                ))}
                {specialties.length === 0 && (
                  <p className="text-sm text-muted-foreground">No specialties added yet.</p>
                )}
              </div>
              <Separator />
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                  placeholder="Add a specialty (e.g. Anxiety)"
                  className="h-10 flex-1 rounded-xl"
                />
                <Button variant="outline" onClick={addSpecialty} className="h-10 gap-1.5 rounded-xl">
                  <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className={cn(
                  'size-24 rounded-2xl bg-muted flex items-center justify-center overflow-hidden',
                  profile?.avatar_url && 'p-0'
                )}>
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt={fullName} className="size-full object-cover" />
                  ) : (
                    <HugeiconsIcon icon={UserIcon} className="size-12 text-muted-foreground/50" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{fullName || 'Your Name'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Member since {memberSince}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full rounded-xl" disabled>
                  Change Avatar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-muted/40">
            <CardContent className="p-4 space-y-2 text-sm">
              <p className="font-medium">Account</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Email verified</span>
                <span className="text-success font-medium">Yes</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Member since</span>
                <span>{memberSince}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
