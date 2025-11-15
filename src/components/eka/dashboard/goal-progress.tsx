'use client';
<<<<<<< HEAD
;
;
;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from '@/components/keep';
import { Check, Target } from "lucide-react";
import { InView, TextEffect, AnimatedNumber, AnimatedGroup } from "@/components/motion-primitives";
=======

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
>>>>>>> bbef2937e86dbdff133c47e33ad42e2cfa65c958

interface GoalProgressProps {
  sessionsCompleted: number;
  targetSessions: number;
  goal: string;
}

export function GoalProgress({ sessionsCompleted, targetSessions, goal }: GoalProgressProps) {
  const progress = (sessionsCompleted / targetSessions) * 100;

  return (
    <Card className="bg-white dark:bg-gray-800/50 border-none shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-3" />
          Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{goal}</p>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {sessionsCompleted} / {targetSessions} sessions completed
        </p>
      </CardContent>
    </Card>
  );
}
