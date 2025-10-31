'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getProfileSummary, getPersonalizedAdvice, ProfileSummary } from '@/firebase/personalizationEngine';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from './ui/skeleton';

export default function PersonalBlock() {
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setSummaryLoading(true);
      getProfileSummary(user.uid)
        .then(setSummary)
        .finally(() => setSummaryLoading(false));
    } else if (!authLoading) {
      setSummaryLoading(false);
    }
  }, [user, authLoading]);

  const handleAsk = async () => {
    if (!user || !question) return;
    setLoading(true);
    setAdvice('');
    try {
      const result = await getPersonalizedAdvice(user.uid, question);
      setAdvice(result || 'Sorry, I could not fetch advice at this time.');
    } catch (error) {
      setAdvice('An error occurred while getting advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || summaryLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800/50 border-none shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Alert variant="default" className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/50">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertTitle className="text-yellow-700 dark:text-yellow-300">Onboarding Incomplete</AlertTitle>
        <AlertDescription className="text-yellow-600 dark:text-yellow-400">
          Please complete your profile to receive personalized AI-powered advice.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800/50 border-none shadow-sm">
      <CardHeader>
        <CardTitle>AI-Powered Guidance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guidance-question" className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Ask me anything about your wellness journey
          </Label>
          <div className="flex gap-2">
            <Input
              id="guidance-question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., How can I improve my sleep?"
              className="flex-grow"
              onKeyUp={(e) => e.key === 'Enter' && handleAsk()}
            />
            <Button 
              onClick={handleAsk} 
              disabled={loading || !question}
            >
              {loading ? 'Asking...' : 'Ask'}
            </Button>
          </div>
        </div>

        {advice && (
          <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50">
            <Lightbulb className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-700 dark:text-blue-300">Your Personalized Advice</AlertTitle>
            <AlertDescription className="text-blue-600 dark:text-blue-400 whitespace-pre-wrap">
              {advice}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
