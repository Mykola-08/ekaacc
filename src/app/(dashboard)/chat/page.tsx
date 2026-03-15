import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon, Mic01Icon, Attachment01Icon, UserIcon } from "@hugeicons/core-free-icons";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height))] px-4 lg:px-6 py-4">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
               <HugeiconsIcon icon={UserIcon} className="size-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">AI Assistant</h2>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Clear Chat</Button>
        </div>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="flex flex-col gap-2 max-w-[80%] mr-auto">
            <div className="bg-muted p-3 rounded-lg text-sm">
              Hello! I'm your AI mental health assistant. How are you feeling today?
            </div>
            <span className="text-xs text-muted-foreground ml-1">10:00 AM</span>
          </div>

          <div className="flex flex-col gap-2 max-w-[80%] ml-auto items-end">
             <div className="bg-primary text-primary-foreground p-3 rounded-lg text-sm">
                I'm feeling a bit anxious about my upcoming presentation.
             </div>
             <span className="text-xs text-muted-foreground mr-1">10:02 AM</span>
          </div>
        </CardContent>

        <div className="p-4 border-t">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" className="shrink-0 size-10">
              <HugeiconsIcon icon={Attachment01Icon} className="size-5" />
            </Button>
            <Input 
              placeholder="Type your message..." 
              className="flex-1"
            />
            <Button variant="ghost" size="icon" className="shrink-0 size-10">
              <HugeiconsIcon icon={Mic01Icon} className="size-5" />
            </Button>
            <Button size="icon" className="shrink-0 size-10">
              <HugeiconsIcon icon={SentIcon} className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
