'use client';

export async function getAIGoalSuggestions(userId: string): Promise<string> {
  const suggestions = [
    'Daily stretching',
    'Mindfulness practice',
    'Hydration tracking',
    'Light cardio 3x/week'
  ];
  console.log('Stub getAIGoalSuggestions', { userId });
  return JSON.stringify(suggestions);
}