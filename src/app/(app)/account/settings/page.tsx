"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useData } from '@/context/unified-data-context';
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';

export default function AccountSettingsPage() {
  const { currentUser } = useData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const s = await fxService.getSettings(currentUser?.id || currentUser?.uid || 'guest');
        if (!mounted) return;
        setSettings(s || {});
      } catch (e) { console.error(e); }
      finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, [currentUser]);

  const save = async () => {
    try {
      const res = await fxService.updateSettings(currentUser?.id || currentUser?.uid || 'guest', settings || {});
      setSettings(res);
      toast({ title: 'Saved', description: 'Settings updated' });
    } catch (e) { console.error(e); toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' }); }
  };

  if (!currentUser) return <div className="p-4">Please log in</div>;

  const role = currentUser.role || 'Patient';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold">Notifications</h3>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <div className="font-medium">Email notifications</div>
                <div className="text-sm text-muted-foreground">Receive updates by email</div>
              </div>
              <Switch checked={!!settings?.notifications?.email} onCheckedChange={(v) => setSettings((s:any)=>({ ...s, notifications: { ...(s.notifications||{}), email: v } }))} />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <div className="font-medium">SMS notifications</div>
                <div className="text-sm text-muted-foreground">Receive SMS alerts</div>
              </div>
              <Switch checked={!!settings?.notifications?.sms} onCheckedChange={(v) => setSettings((s:any)=>({ ...s, notifications: { ...(s.notifications||{}), sms: v } }))} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold">Preferences</h3>
          <div className="mt-3 space-y-2">
            <div>
              <label className="text-sm">Preferred language</label>
              <Input value={settings?.preferences?.language || ''} onChange={(e)=> setSettings((s:any)=>({ ...s, preferences: { ...(s.preferences||{}), language: e.target.value } }))} className="mt-2" />
            </div>
            <div>
              <label className="text-sm">Time zone</label>
              <Input value={settings?.preferences?.timezone || ''} onChange={(e)=> setSettings((s:any)=>({ ...s, preferences: { ...(s.preferences||{}), timezone: e.target.value } }))} className="mt-2" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold">Role Settings</h3>
          <div className="mt-3 space-y-2">
            {role === 'Admin' && (
              <>
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium">Enable audit logs</div>
                  <div className="text-sm text-muted-foreground">Keep detailed logs for admin actions</div>
                  <div className="mt-2"><Switch checked={!!settings?.admin?.auditLogs} onCheckedChange={(v)=> setSettings((s:any)=>({ ...s, admin: { ...(s.admin||{}), auditLogs: v } }))} /></div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium">Allow user impersonation</div>
                  <div className="text-sm text-muted-foreground">Admins can impersonate users for support</div>
                  <div className="mt-2"><Switch checked={!!settings?.admin?.impersonation} onCheckedChange={(v)=> setSettings((s:any)=>({ ...s, admin: { ...(s.admin||{}), impersonation: v } }))} /></div>
                </div>
              </>
            )}

            {role === 'Therapist' && (
              <>
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium">Allow clients to book directly</div>
                  <div className="text-sm text-muted-foreground">Control whether clients can self-book with your calendar</div>
                  <div className="mt-2"><Switch checked={!!settings?.therapist?.allowSelfBooking} onCheckedChange={(v)=> setSettings((s:any)=>({ ...s, therapist: { ...(s.therapist||{}), allowSelfBooking: v } }))} /></div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium">Show availability publicly</div>
                  <div className="text-sm text-muted-foreground">Expose your free slots on your public profile</div>
                  <div className="mt-2"><Switch checked={!!settings?.therapist?.publicAvailability} onCheckedChange={(v)=> setSettings((s:any)=>({ ...s, therapist: { ...(s.therapist||{}), publicAvailability: v } }))} /></div>
                </div>
              </>
            )}

            {role === 'Patient' && (
              <>
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium">Share progress with caregiver</div>
                  <div className="text-sm text-muted-foreground">Allow linked accounts to view your progress</div>
                  <div className="mt-2"><Switch checked={!!settings?.patient?.shareProgress} onCheckedChange={(v)=> setSettings((s:any)=>({ ...s, patient: { ...(s.patient||{}), shareProgress: v } }))} /></div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium">Enable session reminders</div>
                  <div className="text-sm text-muted-foreground">Receive reminders before appointments</div>
                  <div className="mt-2"><Switch checked={!!settings?.patient?.reminders} onCheckedChange={(v)=> setSettings((s:any)=>({ ...s, patient: { ...(s.patient||{}), reminders: v } }))} /></div>
                </div>
              </>
            )}

          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={save}>Save Settings</Button>
      </div>
    </div>
  );
}
