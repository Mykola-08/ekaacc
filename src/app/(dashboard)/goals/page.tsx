import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Target01Icon, PlusSignIcon, CheckmarkCircle01Icon, FireIcon } from "@hugeicons/core-free-icons";
import { Progress } from "@/components/ui/progress";
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader";

export default function GoalsPage() {
  return (
    <div className="flex-1 space-y-6">
      <DashboardHeader 
        title="Goals & Milestones" 
        subtitle="Track your progress, build habits, and reach your personal milestones."
      >
        <Button className="rounded-full gap-2">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          <span>New Goal</span>
        </Button>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-3xl border-border/50 shadow-sm relative overflow-hidden group">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">Daily Meditation</CardTitle>
                <CardDescription>Practice mindfulness for 10 minutes every day.</CardDescription>
              </div>
              <div className="p-2.5 bg-emerald-500/10 rounded-xl shrink-0">
                <HugeiconsIcon icon={FireIcon} className="size-5 text-emerald-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Streak</span>
              <span className="font-semibold text-foreground flex items-center gap-1">
                <HugeiconsIcon icon={FireIcon} className="size-3.5 text-orange-500" /> 5 Days
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Weekly Target</span>
                <span className="font-medium text-emerald-600 tabular-nums">71%</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full rounded-full gap-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" /> Check In Today
            </Button>
          </CardFooter>
        </Card>

        <Card className="rounded-3xl border-border/50 shadow-sm relative overflow-hidden group">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">Journal Entries</CardTitle>
                <CardDescription>Write 3 journal entries this week about triggers.</CardDescription>
              </div>
              <div className="p-2.5 bg-blue-500/10 rounded-xl shrink-0">
                <HugeiconsIcon icon={Target01Icon} className="size-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Entries Logged</span>
              <span className="font-semibold text-foreground">2 / 3</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Weekly Target</span>
                <span className="font-medium text-blue-600 tabular-nums">66%</span>
              </div>
              <Progress value={66} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full rounded-full gap-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" /> Go to Journal
            </Button>
          </CardFooter>
        </Card>

        <Card className="rounded-3xl border-dashed border-2 border-border/40 bg-muted/10 shadow-none flex flex-col items-center justify-center p-6 text-center h-full min-h-[250px]">
          <div className="p-4 rounded-full bg-primary/5 mb-4">
             <HugeiconsIcon icon={Target01Icon} className="size-6 text-primary/40" />
          </div>
          <h3 className="text-base font-semibold">Set a new milestone</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">What do you want to achieve next in your journey?</p>
          <Button variant="ghost" className="mt-4 rounded-full text-primary">Browse Templates</Button>
        </Card>
      </div>
    </div>
  );
}
