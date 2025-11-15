'use client';
;
;
;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from '@/components/keep';
import { Check, Target } from "lucide-react";
import { InView, TextEffect, AnimatedNumber, AnimatedGroup } from "@/components/motion-primitives";

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
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="text-primary" />
                    <TextEffect preset="fade" per="word">
                      Goal Roadmap
                    </TextEffect>
                </CardTitle>
                <CardDescription>
                    Your AI-powered forecast shows you are <span className="font-bold text-primary"><AnimatedNumber value={Math.round(progress)} />%</span> towards your goal of "{goal}".
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium"><AnimatedNumber value={Math.round(progress)} />%</span>
                    </div>
                    <Progress value={progress} />
                </div>
                <div className="relative">
                    <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-border -z-10" />
                    <AnimatedGroup preset="fade">
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
                    </AnimatedGroup>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline">View Full Roadmap</Button>
                </div>

            </CardContent>
          </Card>
        </InView>
    );
}
