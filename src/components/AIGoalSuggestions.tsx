'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getAIGoalSuggestions } from '@/firebase/personalizationEngine';
import { savePreferences, UserPreferences } from '@/firebase/onboardingStore';
import { Button } from '@/components/ui/button';

export default function AIGoalSuggestions() {
  const { user, appUser } = useAuth();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  useEffect(() => {
    if (user && appUser?.personalization) {
      setLoading(true);
      getAIGoalSuggestions(user.uid)
        .then((s) => {
          // Assuming the AI returns a JSON string array
          try {
            const parsedSuggestions = JSON.parse(s || '[]');
            setSuggestions(parsedSuggestions);
          } catch (e) {
            console.error("Failed to parse AI suggestions:", e);
            setSuggestions([]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, appUser]);

  const handleToggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleAddGoals = async () => {
    if (!user || !appUser?.personalization || selectedGoals.length === 0) return;
    
    const currentGoals = appUser.personalization.goals || [];
    const newGoals = [...new Set([...currentGoals, ...selectedGoals])];

    const updatedPrefs: Partial<UserPreferences> = {
      ...appUser.personalization,
      goals: newGoals,
    };

    await savePreferences(user.uid, updatedPrefs as UserPreferences);
    alert('Goals updated!');
    setSelectedGoals([]);
    // Optionally, refresh user data here
  };

  if (loading) {
    return <div className="p-4 bg-background rounded-lg animate-pulse">Loading goal suggestions...</div>;
  }

  if (suggestions.length === 0) {
    return null; // Don't show if no suggestions
  }

  return (
    <div className="p-6 bg-card rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-bold text-card-foreground">Suggested Goals For You</h3>
      <p className="text-sm text-muted-foreground">Based on your profile, you might be interested in these goals:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((goal, index) => (
          <Button
            key={index}
            variant={selectedGoals.includes(goal) ? 'default' : 'secondary'}
            onClick={() => handleToggleGoal(goal)}
          >
            {goal}
          </Button>
        ))}
      </div>
      {selectedGoals.length > 0 && (
        <Button onClick={handleAddGoals} className="w-full">
          Add {selectedGoals.length} Goal(s) to Your Profile
        </Button>
      )}
    </div>
  );
}
