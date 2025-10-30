'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { firebaseServices } from '@/firebase/firebaseClient';
import { ref, onValue, off } from 'firebase/database';
import PersonalBlock from './PersonalBlock';
import { requestPushPermissionAndRegister } from '@/firebase/messagingClient';
import { loadPreferences } from '@/firebase/onboardingStore';
import AIGoalSuggestions from './AIGoalSuggestions';
import { USE_MOCK_DATA } from '@/services/data-service';

export default function DashboardView() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [presence, setPresence] = useState<{ state: string; last_changed: string } | null>(null);
  const [preferences, setPreferences] = useState<any>(null);

  useEffect(() => {
    // Skip Firebase Realtime Database operations in mock mode
    if (USE_MOCK_DATA) {
      // Set mock presence data
      setPresence({
        state: 'online',
        last_changed: new Date().toLocaleString(),
      });
      // Set mock preferences
      setPreferences({
        updatedAt: { seconds: Math.floor(Date.now() / 1000) }
      });
      return;
    }

    if (user) {
      // Listen for presence
      const { rtdb } = firebaseServices;
      const presenceRef = ref(rtdb, `status/${user.uid}`);
      onValue(presenceRef, (snap) => {
        if (snap.exists()) {
          const data = snap.val();
          setPresence({
            state: data.state,
            last_changed: new Date(data.last_changed).toLocaleString(),
          });
        }
      });

      // Load preferences to show last updated time
      loadPreferences(user.uid).then(setPreferences);

      return () => {
        off(presenceRef);
      };
    }
  }, [user]);

  const handleEnableNotifications = async () => {
    if (!user) return;
    await requestPushPermissionAndRegister(user.uid);
    alert('Notifications have been requested. Please approve in your browser.');
  };

  if (authLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (!user) {
    return <div>Please log in to see your dashboard.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.displayName || user.email}</h1>
          <p className="text-gray-500">Here is your personalized dashboard.</p>
        </div>
        <button onClick={signOut} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold">Your Status</h2>
        <p>Email: {user.email}</p>
        <p>Presence: {presence?.state || 'Unknown'} (Last seen: {presence?.last_changed || 'N/A'})</p>
        {preferences?.updatedAt && <p>Profile last updated: {new Date(preferences.updatedAt.seconds * 1000).toLocaleString()}</p>}
      </div>

      <PersonalBlock />

      <AIGoalSuggestions />

      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-bold">Settings</h3>
        <button onClick={handleEnableNotifications} className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Enable Push Notifications
        </button>
      </div>
    </div>
  );
}
