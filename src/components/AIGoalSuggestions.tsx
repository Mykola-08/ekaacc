'use client';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/keep';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { PersonalizationEngine } from '@/lib/personalization-engine';
;
import { Check, Plus } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function AIGoalSuggestions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      // Convert Supabase user to App user format for personalization
      const appUser = {
        id: user.id,
        email: user.email || '',
        role: 'Patient' as const,
        initials: (user.email?.split('@')[0] || '').slice(0, 2).toUpperCase(),
        personalization: {}
      };
      
      try {
        // Generate AI goal suggestions based on user profile
        const generatedSuggestions = PersonalizationEngine.generateMotivationalMessages(appUser);
        setSuggestions(generatedSuggestions.slice(0, 5)); // Take first 5 suggestions
      } catch (e) {
        console.error("Failed to generate AI suggestions:", e);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  const handleToggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleAddGoals = async () => {
    if (!user || selectedGoals.length === 0) return;
    
    setSaving(true);
    
    try {
      // Get data service to update user goals
      const { getDataService } = await import('@/services/data-service');
      const dataService = await getDataService();
      
      // Update user with new goals
      await dataService.updateUser(user.id, {
        personalization: {
          therapeuticGoals: selectedGoals
        }
      });
      
      toast({
        title: 'Goals Updated',
        description: 'Your new goals have been added to your profile.',
      });
      setSelectedGoals([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update your goals. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-800/50 border-none shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white dark:bg-gray-800/50 border-none shadow-sm">
      <CardHeader>
        <CardTitle>Suggested Goals For You</CardTitle>
        <CardDescription>Based on your profile, you might like these goals. Select any to add them.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((goal, index) => (
            <Button
              key={index}
              variant={selectedGoals.includes(goal) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleToggleGoal(goal)}
              className="rounded-full"
            >
              {selectedGoals.includes(goal) && <Check className="mr-2 h-4 w-4" />}
              {goal}
            </Button>
          ))}
        </div>
        {selectedGoals.length > 0 && (
          <Button onClick={handleAddGoals} disabled={saving} className="w-full">
            {saving ? 'Saving...' : `Add ${selectedGoals.length} Goal(s)`}
            {!saving && <Plus className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
