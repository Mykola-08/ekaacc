import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Target01Icon, PlusSignIcon, CheckmarkCircle01Icon, FireIcon } from "@hugeicons/core-free-icons";
import { Progress } from "@/components/ui/progress";

export default function GoalsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Goals & Milestones</h1>
          <p className="text-sm text-muted-foreground">
            Track your progress, build habits, and reach your personal milestones.
          </p>
        </div>
        <Button className="gap-2">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          <span>New Goal</span>
        </Button>
      </div>

      <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">Daily Meditation</CardTitle>
                <CardDescription>Practice mindfulness for 10 minutes every day.</CardDescription>
              </div>
              <div className="p-2.5 bg-muted rounded-lg shrink-0">
                <HugeiconsIcon icon={FireIcon} className="size-5 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Streak</span>
              <span className="font-semibold flex items-center gap-1">
                <HugeiconsIcon icon={FireIcon} className="size-3.5 text-orange-500" /> 5 Days
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Weekly Target</span>
                <span className="font-medium tabular-nums">71%</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full gap-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" /> Check In Today
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">Journal Entries</CardTitle>
                <CardDescription>Write 3 journal entries this week about triggers.</CardDescription>
              </div>
              <div className="p-2.5 bg-muted rounded-lg shrink-0">
                <HugeiconsIcon icon={Target01Icon} className="size-5 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Entries Logged</span>
              <span className="font-semibold">2 / 3</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Weekly Target</span>
                <span className="font-medium tabular-nums">66%</span>
              </div>
              <Progress value={66} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full gap-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" /> Go to Journal
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center min-h-[250px]">
          <div className="p-4 rounded-lg bg-muted mb-4">
             <HugeiconsIcon icon={Target01Icon} className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold">Set a new milestone</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">What do you want to achieve next in your journey?</p>
          <Button variant="ghost" className="mt-4">Browse Templates</Button>
        </Card>
      </div>
    </div>
  );
}
