import { createClient } from '@/lib/supabase/server';
import { TelegramConnectButton } from '@/components/platform/telegram-connect-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', user?.id)
    .single();
  const { data: telegramLink } = await supabase
    .from('telegram_links')
    .select('*')
    .eq('user_id', user?.id)
    .single();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile, notifications, and security.</p>
      </div>

      <Tabs defaultValue="profile" className="">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your public profile and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>{profile?.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Avatar</Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="">
                  <Label>Full Name</Label>
                  <Input defaultValue={profile?.full_name} />
                </div>
                <div className="">
                  <Label>Email</Label>
                  <Input defaultValue={profile?.email} readOnly disabled />
                </div>
                <div className="">
                  <Label>Phone</Label>
                  <Input defaultValue={profile?.phone} />
                </div>
                <div className="">
                  <Label>City</Label>
                  <Input defaultValue={profile?.city} />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be contacted.</CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="">
                <h3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                  Channels
                </h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className=".5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive booking confirmations and invoices.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className=".5">
                    <div className="flex items-center gap-2">
                      <Label className="text-base">Telegram Integration</Label>
                      {telegramLink?.is_verified ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Connected</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {telegramLink?.is_verified
                        ? `Linked as @${telegramLink.telegram_username}`
                        : 'Link your Telegram account to receive instant alerts via our bot.'}
                    </p>
                  </div>
                  {!telegramLink?.is_verified && <TelegramConnectButton />}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-muted-foreground text-sm">
                    Add an extra layer of security to your account.
                  </div>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <div className="text-destructive font-medium">Delete Account</div>
                  <div className="text-muted-foreground text-sm">
                    Permanently remove your data and access.
                  </div>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
