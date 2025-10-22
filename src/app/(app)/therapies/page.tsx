'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from '@/context/unified-data-context';
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TherapiesPage() {
    const { services: dataServices } = useData();
    const services = dataServices || [];
    const isLoadingServices = !dataServices;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Therapies & Services</h1>
                <p className="text-muted-foreground mt-1">Explore our range of therapies designed to help you achieve your wellness goals.</p>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-1 max-w-md">
                    <TabsTrigger value="all">All Services</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6 mt-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {isLoadingServices && (
                            [...Array(4)].map((_, i) => (
                                <Card key={i} className="border-0 shadow-subtle">
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
                            <Card key={service.id} className="border-0 shadow-subtle hover:shadow-md transition-shadow">
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
                </TabsContent>

                {/* AI recommendations tab removed */}
            </Tabs>
        </div>
    )
}
