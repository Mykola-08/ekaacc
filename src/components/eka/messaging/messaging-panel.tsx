'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Paperclip, Send, Sparkles, Loader2 } from "lucide-react";
import { useUser, useFirestore, useCollection, collection, addDocumentNonBlocking, serverTimestamp, query, where, or, orderBy } from "@/firebase";
import { allUsers } from "@/lib/data";
import type { Message } from '@/lib/types';
import { useMemo, useRef, useEffect, useState } from "react";
import { suggestChatReply } from "@/ai/flows/suggest-chat-reply";
import { useToast } from "@/hooks/use-toast";

export function MessagingPanel() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const messagesRef = collection(firestore, 'messages');
    
    const messagesQuery = useMemo(() => {
        if (!user) return null;
        // In a real app, the therapist ID would be dynamically determined
        const therapistId = 'therapist-1';
        return query(messagesRef, 
            or(
                where('senderId', '==', user.uid),
                where('receiverId', '==', user.uid),
            ),
            orderBy('createdAt', 'asc')
        );
    }, [user, messagesRef]);

    const { data: messages, isLoading } = useCollection<Message>(messagesQuery);
    
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    
    // Find the current user and therapist from allUsers for avatar display
    const currentUserProfile = allUsers.find(u => u.role !== 'Therapist');
    const therapistProfile = allUsers.find(u => u.role === 'Therapist');

    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!user || !content.trim() || !therapistProfile) return;
        setIsSending(true);

        const messageData = {
            senderId: user.uid,
            receiverId: therapistProfile.id, // This should be the therapist's actual ID
            content: content.trim(),
            createdAt: serverTimestamp(),
        };

        await addDocumentNonBlocking(messagesRef, messageData);
        
        setNewMessage('');
        setSuggestions([]);
        setIsSending(false);
    };

    const handleGenerateSuggestions = async () => {
        if (!messages || messages.length === 0) return;
        setIsSuggesting(true);
        try {
            const conversationHistory = messages.map(m => `${m.senderId === user?.uid ? 'User' : 'Therapist'}: ${m.content}`).join('\n');
            const result = await suggestChatReply({ conversation: conversationHistory });
            setSuggestions(result.suggestions);
        } catch (error) {
            console.error("Failed to get suggestions:", error);
            toast({
                variant: 'destructive',
                title: 'AI Suggestion Failed',
                description: 'Could not generate suggestions at this time.',
            });
        } finally {
            setIsSuggesting(false);
        }
    };


    if (!currentUserProfile || !therapistProfile) {
        // Handle case where profiles are not found
        return <div>Loading user data...</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 p-4 border-b">
                <Avatar>
                    <AvatarImage src={therapistProfile.avatarUrl} />
                    <AvatarFallback>{therapistProfile.initials}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{therapistProfile.name}</p>
                    <p className="text-sm text-muted-foreground">Your Therapist</p>
                </div>
            </div>
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {isLoading && <div className="text-center text-muted-foreground">Loading messages...</div>}
                    {!isLoading && messages && messages.map((message) => {
                       const isUserSender = message.senderId === user?.uid;
                       const senderProfile = isUserSender ? currentUserProfile : therapistProfile;
                       return (
                        <div key={message.id} className={cn("flex items-end gap-2", isUserSender ? "justify-end" : "justify-start")}>
                           {!isUserSender && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={senderProfile.avatarUrl} />
                                    <AvatarFallback>{senderProfile.initials}</AvatarFallback>
                                </Avatar>
                           )}
                           <div className={cn("max-w-xs rounded-lg p-3", isUserSender ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                <p className="text-sm">{message.content}</p>
                           </div>
                           {isUserSender && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={senderProfile.avatarUrl} />
                                    <AvatarFallback>{senderProfile.initials}</AvatarFallback>
                                </Avatar>
                           )}
                        </div>
                       )
                    })}
                </div>
            </ScrollArea>
             {suggestions.length > 0 && (
                <div className="p-2 border-t flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                        <Button key={index} variant="outline" size="sm" onClick={() => handleSendMessage(suggestion)}>
                            {suggestion}
                        </Button>
                    ))}
                </div>
            )}
            <div className="p-4 border-t">
                <div className="relative">
                    <Input 
                        placeholder="Type a message..." 
                        className="pr-28" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(newMessage);
                            }
                        }}
                    />
                    <div className="absolute top-1/2 right-1 transform -translate-y-1/2 flex gap-1">
                        <Button variant="ghost" size="icon" onClick={handleGenerateSuggestions} disabled={isSuggesting}>
                            {isSuggesting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                        </Button>
                        <Button size="icon" onClick={() => handleSendMessage(newMessage)} disabled={isSending}>
                           {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
