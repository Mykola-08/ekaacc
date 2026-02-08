import { api } from './api';

export async function seedInitialData(
  userId: string,
  selectedGoals?: string[],
  useTemplates?: boolean
) {
  try {
    // Only seed upcoming appointment (no past appointments for new users)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await api.createAppointment({
      userId,
      sessionType: 'Integrated Therapy Session',
      practitioner: 'Emma Kowalski',
      date: tomorrow.toISOString().split('T')[0],
      time: '14:00',
      price: '€90',
      duration: '60',
      notes: 'Focus on shoulder tension and sleep improvement',
      status: 'upcoming',
    });

    // Seed goals based on user selection
    if (useTemplates && selectedGoals && selectedGoals.length > 0) {
      const templateGoalsMap = {
        'Reduce stress and anxiety': [
          {
            title: 'Daily Mindfulness Practice',
            description: '10 minutes of meditation each morning',
            category: 'Mindfulness',
            totalDays: 21,
            daysCompleted: 0,
          },
          {
            title: 'Breathing Exercises',
            description: '4-7-8 breathing when feeling stressed',
            category: 'Stress Relief',
            totalDays: 14,
            daysCompleted: 0,
          },
        ],
        'Manage physical pain': [
          {
            title: 'Gentle Movement',
            description: '15 minutes of stretching daily',
            category: 'Physical Wellness',
            totalDays: 21,
            daysCompleted: 0,
          },
          {
            title: 'Body Awareness',
            description: 'Notice and release tension throughout the day',
            category: 'Mindfulness',
            totalDays: 14,
            daysCompleted: 0,
          },
        ],
        'Improve emotional well-being': [
          {
            title: 'Gratitude Journaling',
            description: "Write 3 things you're grateful for each day",
            category: 'Emotional Health',
            totalDays: 21,
            daysCompleted: 0,
          },
          {
            title: 'Emotional Check-ins',
            description: 'Pause 3x daily to notice how you feel',
            category: 'Self-Awareness',
            totalDays: 14,
            daysCompleted: 0,
          },
        ],
        'Enhance sleep quality': [
          {
            title: 'Sleep Routine',
            description: 'Wind-down routine starting at 10 PM',
            category: 'Restoration',
            totalDays: 21,
            daysCompleted: 0,
          },
          {
            title: 'Digital Sunset',
            description: 'No screens 1 hour before bed',
            category: 'Sleep Hygiene',
            totalDays: 14,
            daysCompleted: 0,
          },
        ],
        'Increase energy and vitality': [
          {
            title: 'Hydration Habit',
            description: 'Drink 8 glasses of water daily',
            category: 'Physical Wellness',
            totalDays: 21,
            daysCompleted: 0,
          },
          {
            title: 'Movement Breaks',
            description: '5-minute movement every 2 hours',
            category: 'Energy',
            totalDays: 14,
            daysCompleted: 0,
          },
        ],
        'Better work-life balance': [
          {
            title: 'Boundary Setting',
            description: 'Leave work at work - no emails after 6 PM',
            category: 'Work-Life Balance',
            totalDays: 21,
            daysCompleted: 0,
          },
          {
            title: 'Self-care Time',
            description: '30 minutes daily for activities you enjoy',
            category: 'Self-Care',
            totalDays: 14,
            daysCompleted: 0,
          },
        ],
      };

      // Create template goals for each selected wellness goal
      for (const selectedGoal of selectedGoals) {
        const templates = templateGoalsMap[selectedGoal as keyof typeof templateGoalsMap];
        if (templates) {
          for (const template of templates) {
            await api.createGoal({
              userId,
              ...template,
            });
          }
        }
      }
    }

    console.log('Initial data seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding data:', error);
    return false;
  }
}
