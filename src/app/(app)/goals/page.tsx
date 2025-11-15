'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Goal } from '@/lib/types';

export default function GoalsPage() {
  const { user } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchGoals = useCallback(async () => {
    if (dataService && user?.uid) {
      setIsLoading(true);
      const userGoals = await dataService.getGoals(user.uid);
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
    <SettingsShell>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SettingsHeader
          title="My Goals"
          description="Set and track your therapy goals."
        />
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Goal
          </Button>
        )}
      </div>

      <div className="space-y-6">
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
            <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
              <h3 className="mt-4 text-lg font-semibold">No goals yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a new goal to start tracking your progress.
              </p>
            </Card>
          )
        )}
      </div>
    </SettingsShell>
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
        userId: user.uid,
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
        <CardTitle>New Goal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you want to achieve?"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetDate">Target Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
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
        <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}>
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function GoalSkeleton() {
  return (
    <div className="space-y-6">
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
