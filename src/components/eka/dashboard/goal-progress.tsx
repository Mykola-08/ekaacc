'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, Target } from "lucide-react";

interface GoalProgressProps {
    sessionsCompleted: number;
}

export function GoalProgress({ sessionsCompleted }: GoalProgressProps) {
    const totalSessions = 10;
    const progress = Math.min((sessionsCompleted / totalSessions) * 100, 100);
    const goal = `Complete ${totalSessions} sessions`;
    
    const milestones = [
        { name: "First Session", completed: sessionsCompleted >= 1 },
        { name: "3 Sessions", completed: sessionsCompleted >= 3 },
        { name: "5 Sessions", completed: sessionsCompleted >= 5 },
        { name: "8 Sessions", completed: sessionsCompleted >= 8 },
        { name: "10 Sessions", completed: sessionsCompleted >= 10 },
    ]

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
                        {milestones.map((milestone, index) => (
                             <div key={index} className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${milestone.completed ? 'bg-primary text-primary-foreground' : 'bg-muted border'}`}>
                                    {milestone.completed ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
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
