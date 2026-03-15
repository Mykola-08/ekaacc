import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpenIcon, VideoIcon, SearchIcon, FileTextIcon } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto py-8 w-full px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Library</h1>
          <p className="text-muted-foreground">Self-guided materials, articles, and exercises.</p>
        </div>
        <div className="relative w-full md:w-72">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search resources..." className="pl-8" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="mb-2 p-2 bg-primary/10 w-fit rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>CBT Foundations</CardTitle>
            <CardDescription>A complete guide to understanding cognitive behavioral therapy.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">Read Guide</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 p-2 bg-primary/10 w-fit rounded-lg">
              <VideoIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Mindfulness Series</CardTitle>
            <CardDescription>10-minute guided meditations for beginners.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">Watch Series</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 p-2 bg-primary/10 w-fit rounded-lg">
              <FileTextIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Anxiety Worksheet</CardTitle>
            <CardDescription>Printable PDF to help track and analyze triggers.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">Download PDF</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
