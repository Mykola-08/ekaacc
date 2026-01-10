'use client';

import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Sparkles, ArrowRight } from "lucide-react";

interface PersonalizationReminderProps {
    onOpen: () => void;
}

export function PersonalizationReminder({ onOpen }: PersonalizationReminderProps) {
    return (
        <Card className="bg-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        <span>Personalize Your Dashboard</span>
                    </CardTitle>
                    <CardDescription>
                        Answer two quick questions to tailor your experience and train your AI.
                    </CardDescription>
                </div>
                 <Button onClick={onOpen}>
                    Start Personalization <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardHeader>
        </Card>
    );
}

    