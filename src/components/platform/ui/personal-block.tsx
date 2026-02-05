'use client';

import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Input } from '@/components/platform/ui/input';
import { Label } from '@/components/platform/ui/label';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/platform/supabase/auth';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui';

export default function PersonalBlock() {
  const { user, loading: authLoading } = useAuth();
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!user || !question) return;
    setLoading(true);
    setAdvice('');
    try {
      // TODO: Implement AI advice functionality with Supabase
      setAdvice('AI advice feature coming soon! This functionality is being migrated from Firebase to Supabase.');
    } catch (error) {
      setAdvice('An error occurred while getting advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Card className="bg-card dark:bg-gray-800/50 border-none shadow-sm">
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

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Please Login</h4>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
              Please login to access personalized AI-powered advice.
        </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-card dark:bg-gray-800/50 border-none shadow-sm">
      <CardHeader>
        <CardTitle>AI-Powered Guidance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guidance-question" className="text-sm font-medium text-muted-foreground dark:text-gray-300">
            Ask me anything about your wellness journey
          </Label>
          <div className="flex gap-2">
            <Input
              id="guidance-question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., How can I improve my sleep?"
              className="grow"
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
          <div className="bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">Your Personalized Advice</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400 whitespace-pre-wrap mt-1">
                  {advice}
            </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
