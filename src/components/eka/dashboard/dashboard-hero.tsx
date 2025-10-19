'use client';

import { useUserContext } from "@/context/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHero() {
    const { currentUser } = useUserContext();

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
        </div>
    );
}
