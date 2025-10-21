"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { useData } from '@/context/unified-data-context';

export default function AdminUsersPage() {
  const { allUsers } = useData();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
      <Card>
        <div className="p-4">
          <ul>
            {(allUsers || []).map(u => (
              <li key={u.id} className="py-2 border-b">{u.name} — {u.email} — {u.role}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
