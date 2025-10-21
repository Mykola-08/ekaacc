"use client";

import React from 'react';
import { Card } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Settings</h1>
      <Card>
        <div className="p-4">Admin configuration and integrations go here.</div>
      </Card>
    </div>
  );
}
