import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Textarea } from '@/components/platform/ui/textarea';
"use client";

;
;
;

export function GoalJournalSection({ userId, toast }: { userId?: string, toast: any }) {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Goal Roadmap</CardTitle>
                    <CardDescription>Client's long-term recovery goals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                            <span className="mr-2">✅</span> Return to running 5k
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">⚪️</span> Improve posture at desk
                        </li>
                    </ul>
                    <Button variant="outline" size="sm" className="mt-4">
                        Update Goals
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Therapist Journal</CardTitle>
                    <CardDescription>Private notes and observations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea placeholder="Jot down your thoughts on the client's progress..." />
                    <Button size="sm" className="mt-2">Save Note</Button>
                </CardContent>
            </Card>
        </>
    );
}

export default GoalJournalSection;
