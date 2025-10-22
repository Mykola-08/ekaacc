import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/eka/dashboard/stat-card';
import { Target, TrendingUp } from 'lucide-react';
import { useFeatureData } from '@/hooks/use-feature-data';

const mockGoalData = async () => ({
  sessionsCompleted: 7,
  targetSessions: 10,
  goal: 'Complete initial therapy plan',
  progress: 70,
  stats: [
    { title: 'Sessions Completed', value: '7', change: '+2', changeType: 'increase', icon: TrendingUp },
    { title: 'Goal Progress', value: '70%', change: '+10%', changeType: 'increase', icon: Target },
  ],
});

const fetchGoalDataFirebase = async () => {
  // TODO: Implement Firebase fetch
  return mockGoalData();
};

export function GoalInsights({ source = 'mock' }: { source?: 'mock' | 'firebase' }) {
  const { data, loading } = useFeatureData(mockGoalData, fetchGoalDataFirebase, source);
  if (loading || !data) return <Card><CardContent>Loading...</CardContent></Card>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Insights</CardTitle>
        <CardDescription>Your progress towards your main therapy goal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={data.progress} />
        <div className="grid grid-cols-2 gap-4">
          {data.stats.map((stat, i) => (
            <StatCard key={i} {...stat} changeType={stat.changeType as 'increase' | 'decrease'} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
