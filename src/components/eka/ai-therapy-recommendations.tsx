'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Clock,
  Target,
  Star
} from 'lucide-react';

type TherapyRecommendation = {
  id: string;
  name: string;
  matchScore: number;
  duration: number;
  price: number;
  reason: string;
  benefits: string[];
  aiReasoning: string;
};

export function AITherapyRecommendations() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const recommendations: TherapyRecommendation[] = [
    {
      id: '1',
      name: 'Deep Tissue Massage',
      matchScore: 95,
      duration: 60,
      price: 85,
      reason: 'Best match for chronic lower back pain',
      benefits: [
        'Reduces chronic pain by 40-60%',
        'Improves flexibility',
        'Enhances muscle recovery'
      ],
      aiReasoning: 'Based on your pain levels (avg 6/10) and mobility limitations, deep tissue work targets muscle adhesions most effectively. Your progress data shows 92% of users with similar profiles experienced significant improvement.'
    },
    {
      id: '2',
      name: 'Myofascial Release',
      matchScore: 88,
      duration: 45,
      price: 75,
      reason: 'Addresses fascial restrictions detected in your pattern',
      benefits: [
        'Releases fascial restrictions',
        'Improves range of motion',
        'Reduces trigger point pain'
      ],
      aiReasoning: 'Your journal entries mention morning stiffness and limited hip mobility. AI analysis correlates this with fascial restrictions, which this therapy specifically targets.'
    },
    {
      id: '3',
      name: 'Sports Recovery Session',
      matchScore: 82,
      duration: 75,
      price: 95,
      reason: 'Optimal for active lifestyle recovery',
      benefits: [
        'Accelerates muscle recovery',
        'Prevents injury',
        'Enhances performance'
      ],
      aiReasoning: 'Your exercise completion rate (85%) and activity level suggest an athletic profile. This comprehensive session combines multiple modalities for optimal recovery.'
    }
  ];

  const handleGenerateRecommendations = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowRecommendations(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!showRecommendations ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <Card className="border-0 shadow-subtle bg-gradient-to-br from-background to-muted/20">
              <CardHeader className="text-center space-y-4 pb-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl">AI Therapy Recommendations</CardTitle>
                  <CardDescription className="text-base max-w-md mx-auto">
                    Get personalized therapy suggestions based on your health data, progress, and goals
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6 pb-8">
                <div className="grid gap-3 w-full max-w-sm text-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <span>Analyzes your pain patterns & progress</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <span>Considers your goals & preferences</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <span>Matches you with optimal therapies</span>
                  </div>
                </div>
                <motion.div
                  className="w-full max-w-sm"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                >
                  <Button 
                    onClick={handleGenerateRecommendations}
                    disabled={isGenerating}
                    size="lg"
                    className="w-full h-11"
                  >
                    {isGenerating ? (
                      <>
                        <motion.span
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="inline-block"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                        </motion.span>
                        Analyzing Your Data...
                      </>
                    ) : (
                      <>
                        Generate Recommendations
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Your Personalized Recommendations</h3>
                <p className="text-sm text-muted-foreground">Based on AI analysis of your health data</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowRecommendations(false)}
              >
                Regenerate
              </Button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.08, duration: 0.35 }}
                  >
                    <Card 
                      className="border-0 shadow-subtle hover:shadow-md transition-all duration-200"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-lg">{rec.name}</CardTitle>
                              {index === 0 && (
                                <Badge className="bg-primary text-primary-foreground">
                                  <Star className="h-3 w-3 mr-1" />
                                  Best Match
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-sm">{rec.reason}</CardDescription>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-2xl font-bold">{rec.matchScore}%</div>
                            <p className="text-xs text-muted-foreground">Match Score</p>
                          </div>
                        </div>
                        <Progress value={rec.matchScore} className="h-1 mt-3" />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {rec.duration} min
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Target className="h-4 w-4" />
                            €{rec.price}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Key Benefits:</p>
                          <ul className="space-y-1">
                            {rec.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                          <p className="text-xs font-medium mb-1 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            AI Analysis
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {rec.aiReasoning}
                          </p>
                        </div>

                        <Button className="w-full" variant={index === 0 ? 'default' : 'outline'}>
                          Book {rec.name}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
