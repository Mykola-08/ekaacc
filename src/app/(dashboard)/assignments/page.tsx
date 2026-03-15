import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, CircleIcon, ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AssignmentsPage() {
  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto py-8 w-full px-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">Tasks and exercises assigned by your therapist.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/50 shadow-md">
          <CardHeader>
            <div className="flex justify-between items-start">
              <Badge>To Do</Badge>
              <CircleIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">Mood Tracking Log</CardTitle>
            <CardDescription>Log your mood patterns for the next 3 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <ClockIcon className="h-4 w-4" /> Due Tomorrow
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Start Exercise</Button>
          </CardFooter>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <div className="flex justify-between items-start">
              <Badge variant="secondary">Completed</Badge>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
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
            <Button variant="outline" className="w-full">Review Submission</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
