import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLineIcon, CalendarIcon, PlusIcon } from "lucide-react";

export default function JournalPage() {
  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto py-8 w-full px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Journal</h1>
          <p className="text-muted-foreground">Private space for self-reflection.</p>
        </div>
        <Button className="gap-2"><PlusIcon className="h-4 w-4" /> New Entry</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <Input placeholder="Entry Title (Optional)" className="text-lg font-medium bg-transparent border-none px-0 focus-visible:ring-0" />
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" /> Today, {new Date().toLocaleDateString()}
                </p>
              </div>
              <textarea 
                className="w-full min-h-[300px] resize-none border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:outline-none text-base leading-relaxed" 
                placeholder="How are you feeling today? (Write your thoughts here...)"
              />
              <div className="mt-4 flex justify-end gap-2 border-t pt-4">
                <Button variant="ghost">Draft</Button>
                <Button>Save Entry</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <h4 className="font-medium text-sm">Feeling overwhelmed</h4>
                <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <h4 className="font-medium text-sm">A good morning</h4>
                <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
