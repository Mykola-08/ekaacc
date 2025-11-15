'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase-auth';
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
      // Persist preferences to Supabase
      const { error } = await supabase
        .from('user_preferences')
        .upsert(preferences);
      
      if (error) throw error;

      // Redirect to dashboard
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
      </div>

      <div>
        <label htmlFor="goals" className="block text-sm font-medium text-gray-700">What are your therapy goals? (comma-separated)</label>
        <textarea id="goals" value={goals} onChange={e => setGoals(e.target.value)} placeholder="e.g., reduce anxiety, improve sleep, build confidence" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>

      <div>
        <label htmlFor="concerns" className="block text-sm font-medium text-gray-700">Any specific concerns? (comma-separated)</label>
        <textarea id="concerns" value={concerns} onChange={e => setConcerns(e.target.value)} placeholder="e.g., work stress, relationship issues, self-esteem" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>

      <div>
        <label htmlFor="tone" className="block text-sm font-medium text-gray-700">Preferred communication style</label>
        <select id="tone" value={tone} onChange={e => setTone(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
          <option value="supportive">Supportive and gentle</option>
          <option value="direct">Direct and solution-focused</option>
          <option value="analytical">Analytical and evidence-based</option>
        </select>
      </div>

      <div className="flex items-center">
        <input id="notifyTips" type="checkbox" checked={notifyTips} onChange={e => setNotifyTips(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
        <label htmlFor="notifyTips" className="ml-2 block text-sm text-gray-700">Send me daily wellness tips</label>
      </div>

      <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
        {loading ? 'Saving...' : 'Continue to Dashboard'}
      </button>
    </form>
  );
}
