'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Goal } from '@/lib/types';

export default function GoalsPage() {
  const { user } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchGoals = useCallback(async () => {
    if (dataService && user?.id) {
      setIsLoading(true);
      const userGoals = await dataService.getGoals(user.id);
      setGoals(userGoals || []);
      setIsLoading(false);
    }
  }, [dataService, user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSaveGoal = (newGoal: Goal) => {
    setGoals([newGoal, ...goals]);
    setIsCreating(false);
    toast({
      title: 'Goal saved',
      description: 'Your new goal has been saved.',
    });
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (dataService) {
      await dataService.deleteGoal(goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
      toast({
        title: 'Goal deleted',
        description: 'Your goal has been deleted.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight text-foreground">My Goals</h1>
            </div>
            <p className="text-xl text-muted-foreground">Set and track your therapy goals.</p>
          </div>
          {!isCreating && (
            <Button 
              onClick={() => setIsCreating(true)}
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          )}
        </motion.div>

        <div className="space-y-6">
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <NewGoalCard
                onSave={handleSaveGoal}
                onCancel={() => setIsCreating(false)}
              />
            </motion.div>
          )}

          {isLoading ? (
            <GoalSkeleton />
          ) : goals.length > 0 ? (
            goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GoalCard goal={goal} onDelete={handleDeleteGoal} />
              </motion.div>
            ))
          ) : (
            !isCreating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-dashed border-2 border-muted hover:border-border transition-all duration-300">
                  <CardContent className="flex flex-col items-center justify-center text-center p-12">
                    <Target className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-xl mb-2">No goals yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create a new goal to start tracking your progress and achieving your wellness objectives.
                    </p>
                    <Button onClick={() => setIsCreating(true)} size="lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Goal
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function NewGoalCard({
  onSave,
  onCancel,
}: {
  onSave: (goal: Goal) => void;
  onCancel: () => void;
}) {
  const { user } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSave = async () => {
    if (dataService && user) {
      const newGoal = await dataService.createGoal({
        userId: user.id,
        description,
        targetDate,
        isCompleted: false,
      });
      onSave(newGoal);
    }
  };

  return (
    <Card className="border-muted hover:border-border transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">New Goal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you want to achieve?"
            rows={4}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="targetDate">Target Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Goal</Button>
      </CardFooter>
    </Card>
  );
}

function GoalCard({ goal, onDelete }: { goal: Goal; onDelete: (id: string) => void }) {
  return (
    <Card className="border-muted hover:border-border transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-lg font-medium mb-2">{goal.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Target: {new Date(goal.targetDate).toLocaleDateString()}
              </Badge>
              {goal.isCompleted && (
                <Badge variant="default">Completed</Badge>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(goal.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function GoalSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-muted">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
