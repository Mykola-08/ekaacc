'use client';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/keep';
import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
;
;
import { Sparkles, Lightbulb, RefreshCw } from 'lucide-react';
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';
import { TherapyRecommendation } from '@/lib/types';
import { cn } from '@/lib/utils';

export function AITherapyRecommendations() {
  // Context-aware: fallback to static recommendations if AI is toggled off or fails
  const [recommendations, setRecommendations] = useState<TherapyRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(false); // default: use static, not AI
  const { toast } = useToast();

  // Static fallback recommendations for booking context
  const staticRecommendations: TherapyRecommendation[] = [
    {
      id: 'static-1',
      title: 'Try Mindfulness Meditation',
      reasoning: 'A daily mindfulness practice can help reduce stress and improve focus.',
      type: 'meditation',
    },
    {
      id: 'static-2',
      title: 'Explore Cognitive Behavioral Therapy',
      reasoning: 'CBT is effective for managing negative thought patterns and anxiety.',
      type: 'article',
    },
    {
      id: 'static-3',
      title: 'Join a Group Session',
      reasoning: 'Group therapy can provide support and new perspectives.',
      type: 'article',
    },
  ];

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    if (!useAI) {
      setRecommendations(staticRecommendations);
      setIsLoading(false);
      return;
    }
    try {
      const data = await fxService.getAIRecommendations();
      const normalized = (data as any[]).map((d) => ({
        id: d.id,
        title: d.title,
        reasoning: d.reasoning,
        type: (['exercise', 'article', 'meditation', 'group'].includes(d.type) ? d.type : 'article') as TherapyRecommendation['type'],
      })) as TherapyRecommendation[];
      setRecommendations(normalized);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Failed to load AI Recommendations',
        description: errorMessage,
      });
      setRecommendations(staticRecommendations);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useAI]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as any,
        stiffness: 100,
        damping: 16,
      } as any,
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {useAI ? 'AI-Powered Recommendations' : 'Recommended Therapies'}
        </CardTitle>
        <div className="flex gap-2 items-center">
          <Button variant={useAI ? 'default' : 'outline'} size="small" onClick={() => setUseAI(!useAI)}>
            {useAI ? 'Use Less AI' : 'Use More AI'}
          </Button>
          <Button variant="outline" size="small" onClick={fetchRecommendations} disabled={isLoading}>
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && !recommendations.length ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive text-center py-8">
            <p>Could not load recommendations.</p>
            <Button variant="link" onClick={fetchRecommendations}>Try again</Button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {recommendations.map((rec) => (
              <motion.div
                key={rec.id}
                variants={itemVariants}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-full">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                  <Button variant="link" size="sm" className="px-0 h-auto mt-1">
                    Learn More
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
