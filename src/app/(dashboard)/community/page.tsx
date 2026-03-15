import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Comment01Icon } from "@hugeicons/core-free-icons";

export default function CommunityPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Community Forums</h1>
          <p className="text-sm text-muted-foreground">Connect with others, share experiences, and get support.</p>
        </div>
        <Button>New Topic</Button>
      </div>

      <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-3">
        <div className="space-y-4 @xl/main:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Strategies for Managing Work Stress</CardTitle>
              <CardDescription>Posted by User123 • 2 hours ago</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">I wanted to open a discussion about balancing work deadlines and personal well-being...</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><HugeiconsIcon icon={Comment01Icon} className="size-4"/> 14 Replies</span>
              </div>
              <Button variant="ghost" size="sm">Read More</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Check-in: How are you feeling?</CardTitle>
              <CardDescription>Posted by Moderator • 1 day ago</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Welcome to our weekly check-in! Share your wins and struggles for the week...</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><HugeiconsIcon icon={Comment01Icon} className="size-4"/> 89 Replies</span>
              </div>
              <Button variant="ghost" size="sm">Read More</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <span className="text-primary font-bold">#</span> Anxiety Relief
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <span className="text-primary font-bold">#</span> Sleep Habits
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <span className="text-primary font-bold">#</span> Mindfulness
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
