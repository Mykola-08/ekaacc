import React from "react";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen02Icon, Video01Icon, Search01Icon, File01Icon } from "@hugeicons/core-free-icons";

export default function ResourcesPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resource Library</h1>
          <p className="text-sm text-muted-foreground">Self-guided materials, articles, and exercises.</p>
        </div>
        <div className="relative w-full md:w-72">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input type="search" placeholder="Search resources..." className="pl-8" />
        </div>
      </div>

      <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="mb-2 p-2 bg-muted w-fit rounded-lg">
              <HugeiconsIcon icon={BookOpen02Icon} className="size-6 text-muted-foreground" />
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
            <div className="mb-2 p-2 bg-muted w-fit rounded-lg">
              <HugeiconsIcon icon={Video01Icon} className="size-6 text-muted-foreground" />
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
            <div className="mb-2 p-2 bg-muted w-fit rounded-lg">
              <HugeiconsIcon icon={File01Icon} className="size-6 text-muted-foreground" />
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
