'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore, collection, useMemoFirebase } from "@/firebase";
import type { Service } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function TherapiesPage() {
    const firestore = useFirestore();
    const servicesRef = useMemoFirebase(() => firestore ? collection(firestore, 'services') : null, [firestore]);
    const { data: services, isLoading: isLoadingServices } = useCollection<Service>(servicesRef);

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
                {isLoadingServices && (
                    [...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-4 w-full mt-2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-7 w-1/4" />
                                    <Skeleton className="h-5 w-1/4" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))
                )}
                {services?.map((service) => (
                    <Card key={service.id}>
                        <CardHeader>
                            <CardTitle>{service.name}</CardTitle>
                            <CardDescription>{service.descriptionShort}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">€{service.priceEUR}</span>
                                <span className="text-sm text-muted-foreground">{service.durationMinutes} mins</span>
                            </div>
                            <Button variant="outline" className="w-full">View Details</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
