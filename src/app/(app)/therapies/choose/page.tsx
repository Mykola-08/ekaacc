'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, Edit } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TriageInput, triageTherapy } from "@/ai/flows/triage-therapy";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


const problemTags = ["Neck", "Lower back", "Headache", "Stress", "Sleep", "Posture", "Sports Injury"];

export default function ChooseTherapyPage() {
    const [mode, setMode] = useState<'freeText' | 'form' | null>(null);
    const [problemText, setProblemText] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleTagClick = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        toast({
            title: "Finding your match...",
            description: "Our AI is analyzing your problem to find the best therapy for you.",
        });

        const input: TriageInput = {
            mode: 'freeText',
            text: problemText,
            tags: selectedTags,
        };

        try {
            const result = await triageTherapy(input);
            const params = new URLSearchParams();
            params.set('result', JSON.stringify(result));
            router.push(`/therapies/recommendation?${params.toString()}`);
        } catch (error) {
            console.error("Triage failed", error);
            toast({
                variant: 'destructive',
                title: "Uh oh! Something went wrong.",
                description: "We couldn't generate a recommendation. Please try again.",
            })
            setIsLoading(false);
        }
    };


    if (!mode) {
        return (
            <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-3xl font-bold mb-4">Help Me Choose</h1>
                <p className="text-muted-foreground mb-8">Tell us about your problem, and our AI will recommend the best therapy for you.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="text-left">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Edit /> Describe my problem</CardTitle>
                            <CardDescription>Write a few sentences about what's bothering you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={() => setMode('freeText')}>
                                Get Started <ArrowRight className="ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="text-left">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bot /> Answer a quick form</CardTitle>
                            <CardDescription>Answer a few multiple-choice questions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" variant="outline" onClick={() => setMode('form')}>
                                Coming Soon
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (mode === 'freeText') {
        return (
             <div className="mx-auto max-w-2xl">
                <h1 className="text-3xl font-bold mb-2">Describe your problem</h1>
                <p className="text-muted-foreground mb-6">What brings you here? Describe any pain, goals, or context. The more detail, the better the recommendation.</p>

                <div className="space-y-6">
                    <Textarea 
                        placeholder="e.g., I have a stiff neck and headaches after working at my desk all day. I've tried stretching but it's not helping."
                        rows={6}
                        value={problemText}
                        onChange={(e) => setProblemText(e.target.value)}
                    />

                    <div>
                        <p className="font-medium mb-3">Optional: Add tags for more precision</p>
                        <div className="flex flex-wrap gap-2">
                            {problemTags.map(tag => (
                                <Badge 
                                    key={tag}
                                    variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                                    onClick={() => handleTagClick(tag)}
                                    className="cursor-pointer"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    
                    <Button onClick={handleSubmit} disabled={isLoading || !problemText} className="w-full">
                        {isLoading ? 'Analyzing...' : 'Get My Recommendation'}
                    </Button>
                </div>
             </div>
        )
    }

    // Placeholder for the form path
     if (mode === 'form') {
        return (
             <div className="mx-auto max-w-2xl text-center">
                 <h1 className="text-3xl font-bold mb-4">Guided Form</h1>
                 <p  className="text-muted-foreground mb-8">This feature is coming soon. Please go back and use the "Describe my problem" option.</p>
                 <Button onClick={() => setMode(null)}>Go Back</Button>
            </div>
        )
    }

    return null;
}
