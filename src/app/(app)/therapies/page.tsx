'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { therapies } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TherapiesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Therapies & Services</h1>
                <p className="text-muted-foreground">Explore our range of therapies designed to help you achieve your wellness goals.</p>
            </div>

            <Card className="bg-primary/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        <span>Not sure where to start?</span>
                    </CardTitle>
                    <CardDescription>Let our AI assistant guide you to the perfect therapy for your needs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/therapies/choose">
                        <Button>
                            Help Me Choose <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {therapies.map((therapy) => (
                    <Card key={therapy.id}>
                        <CardHeader>
                            <CardTitle>{therapy.name}</CardTitle>
                            <CardDescription>{therapy.shortDescription}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">€{therapy.priceEUR}</span>
                                <span className="text-sm text-muted-foreground">{therapy.duration} mins</span>
                            </div>
                            <Button variant="outline" className="w-full">View Details</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
