'use client';

import { useUserContext } from "@/context/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateDailyQuote } from "@/app/(app)/home/actions";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

export function DashboardHero() {
    const { currentUser } = useUserContext();
    const [quote, setQuote] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            setIsLoading(true);
            try {
                const result = await generateDailyQuote();
                setQuote(result.quote);
            } catch (error) {
                console.error("Failed to fetch daily quote:", error);
                // Set a graceful fallback quote in case of an error
                setQuote("The journey of a thousand miles begins with a single step.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuote();
    }, []);

    if (!currentUser) {
        return null;
    }

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 text-2xl">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.initials}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground">Here's your wellness snapshot for today.</p>
                </div>
            </div>
            <div className="hidden md:flex flex-col items-end">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI Suggestion of the Day</p>
                {isLoading ? (
                    <Skeleton className="h-5 w-80 mt-1" />
                ) : (
                    <p className="text-sm italic">"{quote}"</p>
                )}
            </div>
        </div>
    );
}
