'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function SettingsBody({ profile, telegramLink, familyMembers }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-5xl space-y-6 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, preferences, and notifications.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="general"
            className="data-[state=active]:border-primary rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:border-primary rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:border-primary rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="family"
            className="data-[state=active]:border-primary rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
          >
            Family
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue={profile?.full_name || 'User'} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={profile?.email || 'user@example.com'} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={profile?.phone || '+123456789'} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input defaultValue={profile?.city || 'New York'} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Telegram & Push</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {telegramLink ? 'Linked' : 'Not linked to Telegram'}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">{telegramLink ? 'Manage' : 'Link Telegram'}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="secondary">Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Family Members</CardTitle>
              <CardDescription>Manage family members linked to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm">
                You have {familyMembers?.length || 0} family members.
              </div>
            </CardContent>
            <CardFooter>
              <Button>Add Family Member</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
