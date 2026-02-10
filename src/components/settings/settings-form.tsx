'use client';

import { useActionState, useEffect } from 'react'; // or useFormState pending React version
import { updateProfile } from '@/server/settings/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/morphing-toaster';
// import { useFormState } from "react-dom" // Use if available, else standard approach

const initialState = {
  success: false,
  message: '',
  errors: {} as Record<string, string[]>,
};

export function SettingsForm({ profile }: { profile: any }) {
  // Check React version compatibility. Next.js 14 uses useFormState (from react-dom) usually
  // or simple onSubmit if server actions are direct.
  // Let's use a simple wrapper for now to be safe with actions.

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await updateProfile(null, formData);

    if (result.success) {
      toast.success('Profile Updated');
    } else {
      toast.error(result.message || 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={profile?.full_name || ''}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              defaultValue={profile?.email || 'Managed by Auth Provider'}
              disabled
              className="bg-muted"
            />
            <p className="text-muted-foreground text-[0.8rem]">
              Email cannot be changed here. Contact support.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={profile?.metadata?.phone || profile?.phone || ''}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Notes</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile?.metadata?.bio || profile?.bio || ''}
              placeholder="Tell us a bit about yourself or any medical notes..."
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
