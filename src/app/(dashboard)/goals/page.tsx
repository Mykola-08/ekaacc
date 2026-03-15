import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TargetIcon, PlusIcon, CheckCircle2Icon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function GoalsPage() {
  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto py-8 w-full px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">Track your progress and personal milestones.</p>
        </div>
        <Button className="gap-2"><PlusIcon className="h-4 w-4" /> Add Goal</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle>Daily Meditation</CardTitle>
                <CardDescription>Practice mindfulness for 10 minutes every day.</CardDescription>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <TargetIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: 5/7 days</span>
                <span className="font-medium text-primary">71%</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full gap-2">
              <CheckCircle2Icon className="h-4 w-4" /> Check In Today
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
