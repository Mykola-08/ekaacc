import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, MicIcon, PaperclipIcon, UserIcon } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-4 py-4">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
               <UserIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">AI Assistant</h2>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Clear Chat</Button>
        </div>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="flex flex-col gap-2 max-w-[80%] mr-auto">
            <div className="bg-muted p-3 rounded-2xl rounded-tl-sm text-sm">
              Hello! I'm your AI mental health assistant. How are you feeling today?
            </div>
            <span className="text-xs text-muted-foreground ml-1">10:00 AM</span>
          </div>

          <div className="flex flex-col gap-2 max-w-[80%] ml-auto items-end">
             <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm text-sm">
                I'm feeling a bit anxious about my upcoming presentation.
             </div>
             <span className="text-xs text-muted-foreground mr-1">10:02 AM</span>
          </div>
        </CardContent>

        <div className="p-4 border-t bg-background">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10">
              <PaperclipIcon className="h-5 w-5" />
            </Button>
            <Input 
              placeholder="Type your message..." 
              className="flex-1"
            />
            <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10">
              <MicIcon className="h-5 w-5" />
            </Button>
            <Button size="icon" className="shrink-0 h-10 w-10">
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
