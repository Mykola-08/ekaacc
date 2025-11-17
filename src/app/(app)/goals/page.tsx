'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash } from 'lucide-react';
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
    <div>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-semibold">My Goals</h1>
            <p className="text-muted-foreground">Set and track your therapy goals.</p>
          </div>
          {!isCreating && (
            <Button 
              onClick={() => setIsCreating(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          )}
        </div>

        <div className="space-y-8">
          {isCreating && (
            <NewGoalCard
              onSave={handleSaveGoal}
              onCancel={() => setIsCreating(false)}
            />
          )}

          {isLoading ? (
            <GoalSkeleton />
          ) : goals.length > 0 ? (
            goals.map((goal) => <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} />)
          ) : (
            !isCreating && (
              <Card className="border-dashed flex flex-col items-center justify-center text-center p-12">
                <h3 className="font-semibold text-lg mb-2">No goals yet</h3>
                <p className="text-muted-foreground">
                  Create a new goal to start tracking your progress.
                </p>
              </Card>
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
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-lg">New Goal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you want to achieve?"
            className=""
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="targetDate" className="text-sm font-medium">Target Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className=""
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </CardFooter>
    </Card>
  );
}

function GoalCard({ goal, onDelete }: { goal: Goal; onDelete: (id: string) => void }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p>{goal.description}</p>
        <p className="text-sm text-muted-foreground">
          Target Date: {new Date(goal.targetDate).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => onDelete(goal.id)}>
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function GoalSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  );
}
