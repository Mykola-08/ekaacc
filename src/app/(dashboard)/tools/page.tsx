'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useAuth } from '@/lib/platform/supabase/auth';
import fxService from '@/lib/platform/services/platform-service';
import { fxBilling } from '@/lib/platform/services/billing-service';
import { usePermissions } from '@/components/dashboard/auth/PermissionGate';

export default function ToolsPage() {
  const { user: currentUser } = useAuth();
  const can = usePermissions();
  const role: string =
    currentUser?.role?.name ||
    (typeof window !== 'undefined' ? localStorage.getItem('eka_persona') || 'Patient' : 'Patient');
  const [log, setLog] = useState<string[]>([]);
  const append = (msg: string) => setLog((l) => [msg, ...l].slice(0, 50));

  const createMockSession = async () => {
    try {
      append('Creating mock session...');
      const therapistId = currentUser?.role?.name === 'Therapist' ? currentUser.id : undefined;
      let therapist = therapistId;
      if (!therapist) {
        const users: any[] = await fxService.getUsers();
        const t = users.find((u) => u.role === 'Therapist');
        therapist = t?.id || currentUser?.id;
      }
      const userId = currentUser?.id || 'test-user';
      const date = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const res: any = await fxService.createBooking({
        userId,
        therapistId: therapist as string,
        date,
        notes: 'Test session from Tools',
      });
      append(`Created booking ${res?.id || JSON.stringify(res)}`);
    } catch (e: any) {
      append(`Error creating booking: ${e?.message || e}`);
    }
  };

  const sendTestNotification = async () => {
    try {
      append('Sending notification...');
      const userId = currentUser?.id || 'test-user';
      const res = await fxService.createNotification({
        userId,
        title: 'Test notification',
        body: `Test from ${currentUser?.displayName || 'tools'}`,
      });
      append('Notification created');
    } catch (e: any) {
      append(`Error creating notification: ${e?.message || e}`);
    }
  };

  const generateAI = async () => {
    try {
      append('Generating AI report...');
      const res = await fxService.generateAIReport(
        currentUser?.id || 'test-user',
        'Generate a short progress summary'
      );
      const s = typeof res === 'string' ? res : JSON.stringify(res);
      append(`AI: ${s.slice(0, 200)}`);
    } catch (e: any) {
      append(`AI error: ${e?.message || e}. Ensure AI is configured in production.`);
    }
  };

  const bookDemoSession = async () => {
    try {
      append('Booking demo session...');
      const users: any[] = await fxService.getUsers();
      const t = users.find((u) => u.role === 'Therapist');
      const therapist = t?.id || currentUser?.id || 'therapist-1';
      const userId = currentUser?.id || 'demo-user';
      const date = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const res: any = await fxService.createBooking({
        userId,
        therapistId: therapist,
        date,
        notes: 'Demo booking',
      });
      append(`Demo booking: ${res?.id || JSON.stringify(res)}`);
    } catch (e: any) {
      append(`Error booking demo: ${e?.message || e}`);
    }
  };

  const submitDemoForm = async () => {
    try {
      append('Submitting demo form...');
      const res = await fxService.createAssessment({
        sessionId: 'tools-demo-session',
        data: { note: 'Demo form submission', userId: currentUser?.id },
      });
      append('Demo form saved');
    } catch (e: any) {
      append(`Error saving form: ${e?.message || e}`);
    }
  };

  const runBillingMigration = async () => {
    try {
      append('Running billing migration (test)...');
      const users: any[] = await fxService.getUsers();
      const client = users.find((u) => u.role !== 'Therapist') ||
        users[0] || { id: currentUser?.id };
      const res = await fxBilling.createChargeForSession(
        client.id,
        'demo-session',
        10,
        'Test migration invoice'
      );
      append(`Invoice created: ${res?.id || JSON.stringify(res)}`);
    } catch (e: any) {
      append(`Billing error: ${e?.message || e}`);
    }
  };

  const purgeMockData = async () => {
    try {
      append('Purging mock bookings and templates...');
      const bookings: any[] = await fxService.getBookings();
      for (const b of bookings) {
        try {
          await fxService.cancelBooking(b.id);
        } catch {}
      }
      const templates: any[] = await fxService.getTemplates();
      for (const t of templates) {
        try {
          await fxService.deleteTemplate(t.id);
        } catch {}
      }
      append('Purge complete');
    } catch (e: any) {
      append(`Purge error: ${e?.message || e}`);
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Test Tools</h1>
      <p className="text-muted-foreground mb-4 text-sm">
        Role: <strong>{role}</strong>
      </p>

      {/* Permission-based tool visibility */}
      {can('therapist_tools', 'create') && (
        <div className="">
          <Button onClick={createMockSession}>Create mock session</Button>
          <Button onClick={sendTestNotification}>Send test notification</Button>
          <Button onClick={generateAI}>Generate AI report</Button>
        </div>
      )}

      {can('appointment_management', 'create') && !can('therapist_tools', 'create') && (
        <div className="">
          <Button onClick={bookDemoSession}>Book demo session</Button>
          <Button onClick={submitDemoForm}>Submit demo form</Button>
        </div>
      )}

      {can('system_settings', 'manage') && (
        <div className="mt-4">
          <Button onClick={runBillingMigration}>Run billing migration</Button>
          <Button onClick={purgeMockData}>Purge mock data</Button>
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-2 text-lg font-medium">Activity</h2>
        <div className="bg-muted max-h-64 overflow-auto rounded p-3">
          {log.length === 0 && <p className="text-muted-foreground text-sm">No actions yet</p>}
          <ul className="text-sm">
            {log.map((l, i) => (
              <li key={i} className="wrap-break-word">
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
