'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Users, RefreshCcw, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TelegramChat = {
    chat_id: number;
    title: string;
    type: string;
    is_active: boolean;
};

interface TelegramManagerProps {
    chats: TelegramChat[];
}

export function TelegramManager({ chats }: TelegramManagerProps) {
    const [selectedChat, setSelectedChat] = useState<TelegramChat | null>(null);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!selectedChat || !message.trim()) return;

        setIsSending(true);
        try {
            const res = await fetch('/api/admin/telegram/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId: selectedChat.chat_id,
                    message: message
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(`Message sent to ${selectedChat.title}`);
                setMessage('');
            } else {
                toast.error(data.error || "Failed to send message");
            }
        } catch (e) {
            toast.error("Network error");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <DashboardHeader title="Telegram Integration" subtitle="Manage bot connections and broadcast messages.">
                <Button className="rounded-full gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    Refresh Chats
                </Button>
            </DashboardHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chat List */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-lg font-bold text-foreground px-1">Active Channels & Groups</h3>
                    <div className="space-y-2">
                        {chats.map(chat => (
                            <div
                                key={chat.chat_id}
                                onClick={() => setSelectedChat(chat)}
                                className={cn(
                                    "p-4 rounded-2xl border cursor-pointer transition-all hover:bg-secondary/40",
                                    selectedChat?.chat_id === chat.chat_id
                                        ? "bg-primary/5 border-primary shadow-sm"
                                        : "bg-card border-border/60"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="font-semibold text-foreground truncate">{chat.title}</div>
                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{chat.type}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {chats.length === 0 && (
                            <div className="text-center p-8 text-muted-foreground bg-card rounded-2xl border border-dashed border-border">
                                No chats found. Add bot to a group first.
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Action Area */}
                <div className="lg:col-span-2">
                    {selectedChat ? (
                        <DashboardCard title={`Message: ${selectedChat.title}`} icon={Send}>
                            <div className="mt-4 space-y-6">
                                <div className="bg-secondary/30 p-4 rounded-xl border border-border/40 text-sm text-muted-foreground">
                                    Targeting Chat ID: <code className="bg-secondary px-1.5 py-0.5 rounded text-foreground font-mono">{selectedChat.chat_id}</code>
                                </div>
                                <Textarea
                                    placeholder="Type your broadcast message here... (supports HTML)"
                                    className="min-h-[150px] resize-none text-base p-4 rounded-2xl bg-background border-border"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <div className="flex justify-end gap-3">
                                    <Button variant="ghost" onClick={() => setSelectedChat(null)} className="rounded-full">Cancel</Button>
                                    <Button
                                        onClick={handleSend}
                                        disabled={isSending || !message.trim()}
                                        className="rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 px-8"
                                    >
                                        {isSending ? "Sending..." : "Send Message"}
                                    </Button>
                                </div>
                            </div>
                        </DashboardCard>
                    ) : (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-card rounded-2xl border border-border/60">
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                                <Send className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Select a Group</h3>
                            <p className="text-muted-foreground max-w-sm mt-2">
                                Choose a channel or group from the list to send a broadcast message or manage settings.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
