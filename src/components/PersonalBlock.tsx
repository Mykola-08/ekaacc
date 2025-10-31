'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getProfileSummary, getPersonalizedAdvice, ProfileSummary } from '@/firebase/personalizationEngine';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PersonalBlock() {
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getProfileSummary(user.uid)
        .then(setSummary)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleAsk = async () => {
    if (!user || !question) return;
    setLoading(true);
    setAdvice('');
    const result = await getPersonalizedAdvice(user.uid, question);
    setAdvice(result || 'Sorry, I could not fetch advice at this time.');
    setLoading(false);
  };

  if (authLoading) {
    return <div className="p-4 bg-gray-100 rounded-lg animate-pulse">Loading your profile...</div>;
  }

  if (!summary) {
    return (
      <Alert className="border-warning/20 bg-warning/5">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertDescription>Please complete onboarding to get personalized advice.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="glass border-border/50">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-bold">For You</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><span className="font-semibold text-foreground">Role:</span> {summary.role}</p>
          <p><span className="font-semibold text-foreground">Main Goal:</span> {summary.mainGoals[0] || 'Not set'}</p>
          <p><span className="font-semibold text-foreground">Tone:</span> {summary.tone}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="guidance">Ask for guidance:</Label>
          <Input
            id="guidance"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What's a good 5-minute stretch?"
          />
          <Button 
            onClick={handleAsk} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Thinking...' : 'Get Advice'}
          </Button>
        </div>

        {advice && (
          <Alert className="border-info/20 bg-info/5">
            <AlertDescription>
              <h4 className="font-semibold mb-2">Personalized Advice:</h4>
              <p className="whitespace-pre-wrap">{advice}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
