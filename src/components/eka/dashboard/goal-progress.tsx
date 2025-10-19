'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, Target } from "lucide-react";

interface GoalProgressProps {
    sessionsCompleted: number;
    goal?: string;
    targetSessions?: number;
}

export function GoalProgress({ sessionsCompleted, goal = "Complete initial therapy plan", targetSessions = 10 }: GoalProgressProps) {
    const progress = Math.min((sessionsCompleted / targetSessions) * 100, 100);
    
    const milestones = Array.from({ length: 5 }, (_, i) => {
        const sessionMark = Math.ceil(targetSessions * ((i + 1) / 5));
        return {
            name: `${sessionMark} Session${sessionMark > 1 ? 's' : ''}`,
            completed: sessionsCompleted >= sessionMark,
            milestoneNumber: i + 1,
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="text-primary" />
                    <span>Goal Roadmap</span>
                </CardTitle>
                <CardDescription>
                    Your AI-powered forecast shows you are <span className="font-bold text-primary">{Math.round(progress)}%</span> towards your goal of "{goal}".
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                </div>
                <div className="relative">
                    <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-border -z-10" />
                     <div className="space-y-4">
                        {milestones.map((milestone) => (
                             <div key={milestone.milestoneNumber} className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${milestone.completed ? 'bg-primary text-primary-foreground' : 'bg-muted border'}`}>
                                    {milestone.completed ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{milestone.milestoneNumber}</span>}
                                </div>
                                <span className={`text-sm font-medium transition-colors ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{milestone.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline">View Full Roadmap</Button>
                </div>

            </CardContent>
        </Card>
    );
}
