// Placeholder for exercises service
import { db } from '@/lib/db';

export async function getClientExerciseStats(clientId: string) {
  // In a real implementation this would query 'assigned_exercises' table
  // For now we return mock data based on the spec reqs for single therapist mode

  // Mock: "Anxiety clients like you complete breathing 78%"
  return {
    completed: 22,
    total: 25,
    streak: 5,
    most_frequent: 'Breathing Exercises',
    completion_rate: 0.78,
  };
}
