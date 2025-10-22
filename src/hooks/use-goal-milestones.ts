import { useState, useEffect, useMemo } from 'react';
import { useData } from '@/context/unified-data-context';

export interface Milestone {
  id: number;
  title: string;
  completed: boolean;
  dueDate: string;
  userId?: string;
}

export function useGoalMilestones(userId?: string) {
  const { sessions, currentUser, dataSource } = useData();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMilestones = async () => {
      setIsLoading(true);
      try {
        if (dataSource === 'firebase' && sessions.length > 0) {
          // Generate milestones from real sessions
          const userSessions = sessions.filter(
            session => session.userId === (userId || currentUser?.id)
          );

          const completedSessions = userSessions.filter(s => s.status === 'Completed');
          const totalSessionsNeeded = 10;

          const generatedMilestones: Milestone[] = [
            {
              id: 1,
              title: 'Complete initial assessment',
              completed: completedSessions.length >= 1,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            },
            {
              id: 2,
              title: `Attend ${Math.min(5, totalSessionsNeeded)} therapy sessions`,
              completed: completedSessions.length >= 5,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            },
            {
              id: 3,
              title: 'Practice mindfulness daily',
              completed: completedSessions.length >= 7,
              dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            },
            {
              id: 4,
              title: `Complete ${totalSessionsNeeded} sessions`,
              completed: completedSessions.length >= totalSessionsNeeded,
              dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            },
          ];

          setMilestones(generatedMilestones);
        } else {
          // Use mock data
          setMilestones(getMockMilestones());
        }
      } catch (error) {
        console.error('Error loading milestones:', error);
        setMilestones(getMockMilestones());
      } finally {
        setIsLoading(false);
      }
    };

    loadMilestones();
  }, [sessions, userId, currentUser, dataSource]);

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
