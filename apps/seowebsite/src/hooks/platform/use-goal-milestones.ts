import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/platform/supabase-auth';
import { useAppStore } from '@/store/platform/app-store';
import type { Session } from '@/lib/platform/types';

export interface Milestone {
  id: number;
  title: string;
  completed: boolean;
  dueDate: string;
  userId?: string;
}

export function useGoalMilestones(userId?: string) {
  const { user: currentUser } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMilestones = async () => {
      if (!currentUser || !dataService) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const targetUserId = userId || currentUser?.id;
        if (!targetUserId) {
          setMilestones(getMockMilestones());
          setIsLoading(false);
          return;
        }

        const sessions: Session[] = await dataService.getSessions(targetUserId);

        // Generate milestones from real sessions
        const completedSessions = sessions.filter(s => s.status === 'Completed');
        const totalSessionsNeeded = 10;

        const generatedMilestones: Milestone[] = [
          {
            id: 1,
            title: 'Complete initial assessment',
            completed: completedSessions.length >= 1,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '',
          },
          {
            id: 2,
            title: `Attend ${Math.min(5, totalSessionsNeeded)} therapy sessions`,
            completed: completedSessions.length >= 5,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '',
          },
          {
            id: 3,
            title: 'Practice mindfulness daily',
            completed: completedSessions.length >= 7,
            dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '',
          },
          {
            id: 4,
            title: `Complete ${totalSessionsNeeded} sessions`,
            completed: completedSessions.length >= totalSessionsNeeded,
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '',
          },
        ];

        setMilestones(generatedMilestones);
      } catch (error) {
        console.error('Error loading milestones:', error);
        setMilestones(getMockMilestones());
      } finally {
        setIsLoading(false);
      }
    };

    loadMilestones();
  }, [userId, currentUser, dataService]);

  // Calculate derived stats
  const completedCount = useMemo(
    () => milestones.filter(m => m.completed).length,
    [milestones]
  );

  const totalCount = milestones.length;

  const progressPercentage = useMemo(
    () => (totalCount > 0 ? (completedCount / totalCount) * 100 : 0),
    [completedCount, totalCount]
  );

  return { 
    milestones, 
    completedCount,
    totalCount,
    progressPercentage,
    isLoading, 
    setMilestones 
  };
}

function getMockMilestones(): Milestone[] {
  return [
    { id: 1, title: 'Complete initial assessment', completed: true, dueDate: '2025-01-15' },
    { id: 2, title: 'Attend 5 therapy sessions', completed: true, dueDate: '2025-02-28' },
    { id: 3, title: 'Practice mindfulness daily', completed: false, dueDate: '2025-03-15' },
    { id: 4, title: 'Reduce stress by 20%', completed: false, dueDate: '2025-04-01' },
  ];
}
