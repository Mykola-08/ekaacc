import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, CircleIcon, Clock01Icon } from "@hugeicons/core-free-icons";

export default function AssignmentsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Assignments</h1>
        <p className="text-sm text-muted-foreground">Tasks and exercises assigned by your therapist.</p>
      </div>

      <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <Badge>To Do</Badge>
              <HugeiconsIcon icon={CircleIcon} className="size-5 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">Mood Tracking Log</CardTitle>
            <CardDescription>Log your mood patterns for the next 3 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HugeiconsIcon icon={Clock01Icon} className="size-4" /> Due Tomorrow
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="sm">Start Exercise</Button>
          </CardFooter>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <div className="flex justify-between items-start">
              <Badge variant="secondary">Completed</Badge>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">Values Clarification</CardTitle>
            <CardDescription>Identify your core personal values.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Submitted on Oct 12
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="sm">Review Submission</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
