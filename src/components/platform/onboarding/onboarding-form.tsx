'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/platform/supabase/auth';
import { supabase } from '@/lib/platform/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
      goals: goals
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean),
      concerns: concerns
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      tone,
      notify_tips: notifyTips,
      user_id: user.id,
    };

    try {
      // Persist preferences to Supabase
      const { error } = await supabase.from('user_preferences').upsert(preferences);

      if (error) throw error;

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      alert('There was an error saving your preferences. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-border mx-auto max-w-lg space-y-6 rounded-lg border p-8 shadow-md"
    >
      <h2 className="text-foreground text-2xl font-bold">Tell Us About Yourself</h2>

      <div className="space-y-2">
        <Label htmlFor="role">What is your primary role?</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="office">Office Worker</SelectItem>
            <SelectItem value="athlete">Athlete</SelectItem>
            <SelectItem value="artist">Artist</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals">What are your therapy goals? (comma-separated)</Label>
        <Textarea
          id="goals"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="e.g., reduce anxiety, improve sleep, build confidence"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="concerns">Any specific concerns? (comma-separated)</Label>
        <Textarea
          id="concerns"
          value={concerns}
          onChange={(e) => setConcerns(e.target.value)}
          placeholder="e.g., work stress, relationship issues, self-esteem"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Preferred communication style</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger id="tone">
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supportive">Supportive and gentle</SelectItem>
            <SelectItem value="direct">Direct and solution-focused</SelectItem>
            <SelectItem value="analytical">Analytical and evidence-based</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="notifyTips"
          checked={notifyTips}
          onCheckedChange={(checked) => setNotifyTips(checked as boolean)}
        />
        <Label htmlFor="notifyTips" className="text-muted-foreground text-sm font-normal">
          Send me daily wellness tips
        </Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Continue to Dashboard'}
      </Button>
    </form>
  );
}
