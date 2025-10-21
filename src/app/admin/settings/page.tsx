"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeaderSkeleton, CardSkeleton } from '@/components/eka/loading-skeletons';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const [mockDataEnabled, setMockDataEnabled] = useState(
    process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'
  );
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300); // Simulate a quick load
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    toast({ 
      title: 'Settings Saved', 
      description: 'Admin settings have been updated successfully.' 
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <PageHeaderSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-background rounded-xl p-6 border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure system-wide preferences and integrations
            </p>
          </div>
          <Button 
            onClick={handleSave}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card className="shadow-lg border-border/50">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            General Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
              <div>
                <p className="font-medium">Mock Data Mode</p>
                <p className="text-sm text-muted-foreground">Use simulated data instead of Firebase</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${mockDataEnabled ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-gray-500/10 text-gray-700 dark:text-gray-400'}`}>
                  {mockDataEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">System-wide notification settings</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
              <div>
                <p className="font-medium">Email Service</p>
                <p className="text-sm text-muted-foreground">SMTP configuration for outbound emails</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Integration Settings */}
      <Card className="shadow-lg border-border/50">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Integrations
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Square Payments</p>
                  <p className="text-sm text-muted-foreground">Payment processing and booking</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0l3.708 7.512 8.292 1.204-6 5.848 1.416 8.256L12 18.512l-7.416 3.896L6 14.152l-6-5.848 8.292-1.204z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Firebase</p>
                  <p className="text-sm text-muted-foreground">Cloud database and authentication</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/10 text-green-700 dark:text-green-400">
                CONNECTED
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
