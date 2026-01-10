'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface ServiceMatcherProps {
  onMatch: (serviceId: string) => void;
}

export function ServiceMatcher({ onMatch }: ServiceMatcherProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ serviceId: string; reason: string } | null>(null);

  const handleMatch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/match-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (error) {
      console.error('Match error:', error);
      toast.error('Could not find a match right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-foreground mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Not sure what you need?
        </h3>
        <p className="text-muted-foreground text-sm">
          Tell us how you're feeling, and we'll recommend the right support.
        </p>
      </div>

      <div className="flex gap-2 relative">
        <Input
          placeholder="e.g., I'm feeling anxious about a big presentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleMatch()}
          className="pr-12 h-12 text-base bg-card"
        />
        <Button 
          onClick={handleMatch} 
          disabled={loading || !query.trim()}
          className="absolute right-1 top-1 bottom-1 h-auto px-4"
          size="sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </Button>
      </div>

      {result && (
        <Card className="mt-4 bg-secondary/50 border-primary/20 animate-in fade-in slide-in-from-top-2">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary mb-1">Recommendation</p>
              <p className="text-sm text-foreground">{result.reason}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onMatch(result.serviceId)}
              className="shrink-0"
            >
              View Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
