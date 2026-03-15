import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, UsersIcon } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto py-8 w-full px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Forums</h1>
          <p className="text-muted-foreground">Connect with others, share experiences, and get support.</p>
        </div>
        <Button>New Topic</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl hover:underline cursor-pointer">Strategies for Managing Work Stress</CardTitle>
                  <CardDescription className="mt-1">Posted by User123 • 2 hours ago</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">I wanted to open a discussion about balancing work deadlines and personal well-being...</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MessageSquareIcon className="h-4 w-4"/> 14 Replies</span>
              </div>
              <Button variant="ghost" size="sm">Read More</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl hover:underline cursor-pointer">Weekly Check-in: How are you feeling?</CardTitle>
                  <CardDescription className="mt-1">Posted by Moderator • 1 day ago</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Welcome to our weekly check-in! Share your wins and struggles for the week...</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MessageSquareIcon className="h-4 w-4"/> 89 Replies</span>
              </div>
              <Button variant="ghost" size="sm">Read More</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
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
