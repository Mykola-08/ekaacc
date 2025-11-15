'use client';

import { Avatar, AvatarFallback, AvatarImage, Skeleton } from '@/components/keep';
import { useAuth } from "@/lib/supabase-auth";
;
import { useEffect, useState } from "react";

export function DashboardHero() {
    const { user: currentUser } = useAuth();
    const [quote, setQuote] = useState({ quote: '', author: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            setIsLoading(true);
            try {
                // Dynamically import the flow only when needed on the client-side
                const { generateDailyQuote } = await import('@/ai/flows/generate-daily-quote');
                const dailyQuote = await generateDailyQuote();
                setQuote(dailyQuote);
            } catch (error) {
                console.error("Failed to fetch daily quote:", error);
                // Set a default quote on error
                setQuote({ quote: "The best way to predict the future is to create it.", author: "Peter Drucker" });
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
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 text-2xl hidden sm:flex">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.initials}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back, {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}!</h1>
                    <p className="text-muted-foreground">Here's your wellness snapshot for today.</p>
                </div>
            </div>
             <div className="w-full md:w-auto md:max-w-xs text-left md:text-right">
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2 ml-auto" />
                    </div>
                ) : (
                    <blockquote className="text-sm italic text-muted-foreground">
                        "{quote.quote}"
                        <footer className="mt-1 text-xs not-italic font-semibold">— {quote.author}</footer>
                    </blockquote>
                )}
            </div>
        </div>
    );
}
