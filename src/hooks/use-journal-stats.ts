import { useState, useEffect, useMemo } from 'react';
import { useData } from '@/context/unified-data-context';

export interface JournalStats {
  totalEntries: number;
  avgMood: number;
  moodTrend: 'up' | 'down' | 'stable';
  topThemes: string[];
  weeklyStreak: number;
}

export function useJournalStats(userId?: string) {
  const { journalEntries, currentUser, dataSource } = useData();
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateStats = async () => {
      setLoading(true);
      try {
        if (dataSource === 'firebase' && journalEntries.length > 0) {
          // Calculate from real journal entries - all entries are for the current user
          const userEntries = journalEntries;

          if (userEntries.length === 0) {
            setStats(getMockStats());
            setLoading(false);
            return;
          }

          // Map mood strings to numbers for calculations
          const moodMap: Record<string, number> = {
            'Terrible': 1,
            'Bad': 2,
            'Okay': 3,
            'Good': 4,
            'Great': 5
          };

          // Calculate average mood
          const moodsWithValues = userEntries
            .filter(entry => entry.mood !== undefined)
            .map(entry => moodMap[entry.mood] || 3);
          
          const avgMood = moodsWithValues.length > 0
            ? moodsWithValues.reduce((sum, mood) => sum + mood, 0) / moodsWithValues.length
            : 3.5;

          // Calculate mood trend (compare last 7 days to previous 7 days)
          const now = new Date();
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

          const recentMoods = userEntries
            .filter(entry => new Date(entry.date) > sevenDaysAgo && entry.mood !== undefined)
            .map(entry => moodMap[entry.mood] || 3);
          
          const previousMoods = userEntries
            .filter(entry => {
              const date = new Date(entry.date);
              return date > fourteenDaysAgo && date <= sevenDaysAgo && entry.mood !== undefined;
            })
            .map(entry => moodMap[entry.mood] || 3);

          const recentAvg = recentMoods.length > 0
            ? recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length
            : avgMood;
          
          const previousAvg = previousMoods.length > 0
            ? previousMoods.reduce((sum, mood) => sum + mood, 0) / previousMoods.length
            : avgMood;

          const moodTrend: 'up' | 'down' | 'stable' = 
            recentAvg > previousAvg + 0.2 ? 'up' :
            recentAvg < previousAvg - 0.2 ? 'down' : 'stable';

          // Extract top themes from activities
          const allActivities: string[] = [];
          userEntries.forEach(entry => {
            if (entry.activities) {
              allActivities.push(...entry.activities);
            }
          });
          
          const activityCounts = allActivities.reduce((acc, activity) => {
            acc[activity] = (acc[activity] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const topThemes = Object.entries(activityCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([activity]) => activity);

          // Calculate writing streak
          const sortedEntries = userEntries
            .map(entry => new Date(entry.date))
            .sort((a, b) => b.getTime() - a.getTime());

          let streak = 0;
          let currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);

          for (const entryDate of sortedEntries) {
            const date = new Date(entryDate);
            date.setHours(0, 0, 0, 0);
            
            const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays === streak) {
              streak++;
            } else if (diffDays > streak) {
              break;
            }
          }

          setStats({
            totalEntries: userEntries.length,
            avgMood: Math.round(avgMood * 10) / 10,
            moodTrend,
            topThemes: topThemes.length > 0 ? topThemes : ['Wellness', 'Growth', 'Reflection'],
            weeklyStreak: streak,
          });
        } else {
          // Use mock data
          setStats(getMockStats());
        }
      } catch (error) {
        console.error('Error calculating journal stats:', error);
        setStats(getMockStats());
      } finally {
        setLoading(false);
      }
    };

    calculateStats();
  }, [journalEntries, userId, currentUser, dataSource]);

  return { stats, loading };
}

function getMockStats(): JournalStats {
  return {
    totalEntries: 24,
    avgMood: 3.8,
    moodTrend: 'up',
    topThemes: ['Work Stress', 'Sleep Quality', 'Exercise'],
    weeklyStreak: 7,
  };
}
