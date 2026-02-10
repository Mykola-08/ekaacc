'use client';

import { SettingsContentHeadless } from '@/components/platform/settings/settings-content-headless';
import { useAuth } from '@/context/platform/auth-context';

export default function AdminSettingsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8">Please log in to view settings.</div>;
  }

  const adaptedUser = {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.email?.split('@')[0],
    role: user.role?.name,
    initials: (user.email?.[0] || 'U').toUpperCase(),
    user_metadata: user.user_metadata,
    settings: {},
  };

  return <SettingsContentHeadless currentUser={adaptedUser} />;
}
