import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, Calendar03Icon, PlusSignIcon, Search01Icon, MoreVerticalIcon, BookOpen02Icon } from "@hugeicons/core-free-icons";

export default function JournalPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <HugeiconsIcon icon={BookOpen02Icon} className="size-6 text-muted-foreground" />
            My Journal
          </h1>
          <p className="text-sm text-muted-foreground">
            A private space for self-reflection and personal growth.
          </p>
        </div>
        <Button className="shrink-0 gap-2">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          <span>New Entry</span>
        </Button>
      </div>

      <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-12 items-start">
        {/* Editor Area */}
        <div className="@xl/main:col-span-8 space-y-4">
          <Card>
            <CardContent className="pt-6 px-6 pb-6">
              <div className="mb-4 space-y-1">
                <input 
                  placeholder="Entry Title (Optional)" 
                  className="w-full text-2xl font-semibold bg-transparent border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 focus:outline-none" 
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
                  <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                  <span>Today, {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <textarea 
                className="w-full min-h-[350px] resize-none border-0 bg-transparent p-0 placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:outline-none text-base leading-relaxed mt-4" 
                placeholder="How are you feeling today? Take a deep breath and start writing..."
              />
              <div className="mt-6 flex justify-between items-center border-t pt-4">
                <p className="text-xs text-muted-foreground">Auto-saving drafted...</p>
                <div className="flex items-center gap-3">
                  <Button variant="ghost">Discard</Button>
                  <Button>Publish Entry</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Recent Entries */}
        <div className="@xl/main:col-span-4 space-y-4">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search past entries..." 
              className="pl-9"
            />
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              
              {/* Entry Item 1 */}
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-medium text-sm line-clamp-1">
                    Feeling overwhelmed
                  </h4>
                  <HugeiconsIcon icon={MoreVerticalIcon} className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">Yesterday at 8:45 PM</p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  Work has been incredibly busy lately. Need to remember the breathing exercises we discussed in therapy...
                </p>
              </button>

              {/* Entry Item 2 */}
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-medium text-sm line-clamp-1">
                    A good morning
                  </h4>
                  <HugeiconsIcon icon={MoreVerticalIcon} className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">3 days ago</p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  Woke up feeling surprisingly refreshed today. The new morning routine is definitely helping set the tone...
                </p>
              </button>
              
              {/* Entry Item 3 */}
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-medium text-sm line-clamp-1">
                    Anxiety trigger: Meeting
                  </h4>
                  <HugeiconsIcon icon={MoreVerticalIcon} className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">Last week</p>
              </button>

            </CardContent>
            
            <div className="p-3 pt-0 border-t mt-2">
              <Button variant="ghost" className="w-full text-xs text-muted-foreground">
                View All Entries
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
