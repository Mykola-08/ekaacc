import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLineIcon, CalendarIcon, PlusIcon, Search, MoreVertical, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function JournalPage() {
  return (
    <div className="flex-1 space-y-8 p-8 animate-fade-in max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 text-balance">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary/60" />
            My Journal
          </h1>
          <p className="text-sm text-muted-foreground">
            A private space for self-reflection and personal growth.
          </p>
        </div>
        <Button className="shrink-0 gap-2 h-10 px-5 shadow-sm transition-all duration-300 hover:shadow-md active:scale-95">
          <PlusIcon className="h-4 w-4" />
          <span>New Entry</span>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-12 items-start">
        {/* Editor Area */}
        <div className="md:col-span-8 space-y-6">
          <Card className="group overflow-hidden bg-card/60 backdrop-blur-sm border-border/60 shadow-sm transition-all duration-300 hover:shadow-card-hover relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 to-transparent opacity-50" />
            <CardContent className="pt-8 px-8 pb-6">
              <div className="mb-4 space-y-1">
                <input 
                  placeholder="Entry Title (Optional)" 
                  className="w-full text-2xl font-semibold bg-transparent border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 focus:outline-none transition-colors text-foreground" 
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums opacity-80">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>Today, {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <textarea 
                className="w-full min-h-[350px] resize-none border-0 bg-transparent p-0 placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-none text-base leading-relaxed text-foreground mt-4" 
                placeholder="How are you feeling today? Take a deep breath and start writing..."
              />
              <div className="mt-8 flex justify-between items-center border-t border-border/40 pt-4">
                <p className="text-xs text-muted-foreground">Auto-saving drafted...</p>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" className="hover:bg-muted/50 transition-colors">Discard</Button>
                  <Button className="shadow-xs transition-transform active:scale-95">Publish Entry</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Recent Entries */}
        <div className="md:col-span-4 space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-70" />
            <Input 
              placeholder="Search past entries..." 
              className="pl-9 bg-card/60 backdrop-blur-sm border-border/60 shadow-sm transition-colors hover:border-primary/20 focus-visible:border-primary/40"
            />
          </div>

          <Card className="bg-card/40 border-border/40 shadow-none">
            <CardHeader className="pb-3 border-b border-border/20 px-5">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              
              {/* Entry Item 1 */}
              <button className="w-full text-left p-3 rounded-lg border border-transparent hover:bg-primary/5 hover:border-primary/10 transition-all duration-200 group">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    Feeling overwhelmed
                  </h4>
                  <MoreVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">Yesterday at 8:45 PM</p>
                <p className="text-xs text-muted-foreground/80 mt-2 line-clamp-2 leading-relaxed">
                  Work has been incredibly busy lately. Need to remember the breathing exercises we discussed in therapy...
                </p>
              </button>

              {/* Entry Item 2 */}
              <button className="w-full text-left p-3 rounded-lg border border-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/10 transition-all duration-200 group">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    A good morning
                  </h4>
                  <MoreVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs mt-1 tabular-nums">3 days ago</p>
                <p className="text-xs text-muted-foreground/80 mt-2 line-clamp-2 leading-relaxed">
                  Woke up feeling surprisingly refreshed today. The new morning routine is definitely helping set the tone...
                </p>
              </button>
              
              {/* Entry Item 3 */}
              <button className="w-full text-left p-3 rounded-lg border border-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/10 transition-all duration-200 group">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    Anxiety trigger: Meeting
                  </h4>
                  <MoreVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs mt-1 tabular-nums">Last week</p>
              </button>

            </CardContent>
            
            <div className="p-3 pt-0 border-t border-border/10 mt-2">
              <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-foreground">
                View All Entries
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
