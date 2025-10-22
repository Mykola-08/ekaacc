import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/eka/dashboard/stat-card';
import { Smile, Frown, TrendingUp, TrendingDown } from 'lucide-react';
import { useFeatureData } from '@/hooks/use-feature-data';

const mockJournalData = async () => ({
  entries: 24,
  avgMood: 3.8,
  bestDay: '2025-10-19',
  stats: [
    { title: 'Entries', value: '24', change: '+4', changeType: 'increase', icon: TrendingUp },
    { title: 'Avg. Mood', value: '3.8', change: '+0.2', changeType: 'increase', icon: Smile },
    { title: 'Best Day', value: '2025-10-19', change: '', changeType: undefined, icon: Smile },
  ],
});

const fetchJournalDataFirebase = async () => {
  // TODO: Implement Firebase fetch
  return mockJournalData();
};

export function JournalInsights({ source = 'mock' }: { source?: 'mock' | 'firebase' }) {
  const { data, loading } = useFeatureData(mockJournalData, fetchJournalDataFirebase, source);
  if (loading || !data) return <Card><CardContent>Loading...</CardContent></Card>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Insights</CardTitle>
        <CardDescription>Summary of your wellness journal activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {data.stats.map((stat, i) => (
            <StatCard key={i} {...stat} changeType={stat.changeType as 'increase' | 'decrease'} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
