'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase-auth';
import { USE_MOCK_DATA } from '@/services/data-service';
import { supabase } from '@/lib/supabase';

export default function OnboardingForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState('office');
  const [goals, setGoals] = useState('');
  const [concerns, setConcerns] = useState('');
  const [tone, setTone] = useState('supportive');
  const [notifyTips, setNotifyTips] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to save preferences.');
      return;
    }
    setLoading(true);

    const preferences = {
      role,
      goals: goals.split(',').map(g => g.trim()).filter(Boolean),
      concerns: concerns.split(',').map(c => c.trim()).filter(Boolean),
      tone,
      notify_tips: notifyTips,
      user_id: user.id,
    };

    try {
      if (!USE_MOCK_DATA) {
        // 1. Persist preferences to Supabase
        const { error } = await supabase
          .from('user_preferences')
          .upsert(preferences);
        
        if (error) throw error;
      } else {
        // Mock mode: Just log the preferences
        console.log('Mock mode: Preferences saved', preferences);
      }

      // 3. Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
      alert('There was an error saving your preferences. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Tell Us About Yourself</h2>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">What is your primary role?</label>
        <select id="role" value={role} onChange={e => setRole(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
          <option value="student">Student</option>
          <option value="office">Office Worker</option>
          <option value="athlete">Athlete</option>
          <option value="artist">Artist</option>
          <option value="other">Other</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">Stored securely. You can change or delete this later.</p>
      </div>

      <div>
        <label htmlFor="goals" className="block text-sm font-medium text-gray-700">What are your wellness goals? (comma-separated)</label>
        <input type="text" id="goals" value={goals} onChange={e => setGoals(e.target.value)} placeholder="e.g., reduce neck tension, focus better" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        <p className="mt-1 text-xs text-gray-500">Stored securely. You can change or delete this later.</p>
      </div>

      <div>
        <label htmlFor="concerns" className="block text-sm font-medium text-gray-700">Any physical or lifestyle concerns? (comma-separated)</label>
        <input type="text" id="concerns" value={concerns} onChange={e => setConcerns(e.target.value)} placeholder="e.g., shoulders hurt after work" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        <p className="mt-1 text-xs text-gray-500">Stored securely. You can change or delete this later.</p>
      </div>

      <div>
        <label htmlFor="tone" className="block text-sm font-medium text-gray-700">Preferred communication style</label>
        <select id="tone" value={tone} onChange={e => setTone(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
          <option value="direct">Direct</option>
          <option value="supportive">Supportive</option>
          <option value="scientific">Scientific</option>
          <option value="motivational">Motivational</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">Stored securely. You can change or delete this later.</p>
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="notifyTips" checked={notifyTips} onChange={e => setNotifyTips(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
        <label htmlFor="notifyTips" className="ml-2 block text-sm text-gray-900">Receive occasional tips and reminders via push notifications?</label>
      </div>
       <p className="mt-1 text-xs text-gray-500">Stored securely. You can change or delete this later.</p>

      <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-400">
        {loading ? 'Saving...' : 'Complete Onboarding'}
      </button>
    </form>
  );
}
