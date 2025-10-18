'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Paperclip, Send } from "lucide-react";
import { useUser } from "@/context/user-context";
import { allUsers } from "@/lib/data";

const messages = [
    { id: 1, sender: 'therapist', content: 'Hello! How are you feeling today?', timestamp: '10:00 AM' },
    { id: 2, sender: 'user', content: 'A bit better, thanks for asking!', timestamp: '10:01 AM' },
    { id: 3, sender: 'therapist', content: 'That\'s great to hear. Have you been doing the exercises we discussed?', timestamp: '10:02 AM' },
    { id: 4, sender: 'user', content: 'Yes, I have. They seem to be helping with the stiffness.', timestamp: '10:03 AM' },
    { id: 5, sender: 'user', content: 'I had a question about one of them though.', timestamp: '10:03 AM' },
    { id: 6, sender: 'therapist', content: 'Of course, ask away. I\'m here to help.', timestamp: '10:04 AM' },
];

export function MessagingPanel() {
    const { currentUser } = useUser();
    const therapist = allUsers.find(u => u.role === 'Therapist');

    if (!currentUser || !therapist) return null;

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 p-4 border-b">
                <Avatar>
                    <AvatarImage src={therapist.avatarUrl} />
                    <AvatarFallback>{therapist.initials}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{therapist.name}</p>
                    <p className="text-sm text-muted-foreground">Your Therapist</p>
                </div>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={cn("flex items-end gap-2", message.sender === 'user' ? "justify-end" : "justify-start")}>
                           {message.sender === 'therapist' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={therapist.avatarUrl} />
                                    <AvatarFallback>{therapist.initials}</AvatarFallback>
                                </Avatar>
                           )}
                           <div className={cn("max-w-xs rounded-lg p-3", message.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                <p className="text-sm">{message.content}</p>
                                <p className={cn("text-xs mt-1", message.sender === 'user' ? "text-primary-foreground/70" : "text-muted-foreground")}>{message.timestamp}</p>
                           </div>
                           {message.sender === 'user' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={currentUser.avatarUrl} />
                                    <AvatarFallback>{currentUser.initials}</AvatarFallback>
                                </Avatar>
                           )}
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t">
                <div className="relative">
                    <Input placeholder="Type a message..." className="pr-20" />
                    <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex gap-1">
                        <Button variant="ghost" size="icon">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button size="icon">
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
