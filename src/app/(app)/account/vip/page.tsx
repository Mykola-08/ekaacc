'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserContext } from "@/context/user-context";
import { vipData, vipPlans } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Check, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";

export default function VipPage() {
    const { currentUser } = useUserContext();
    const [currentPlanId, setCurrentPlanId] = useState('diamond');

    if (!currentUser) return null;

    return (
        <div className="space-y-8 lg:space-y-12">
             <div className="text-center">
                <h1 className="text-3xl font-bold">EKA VIP</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Unlock exclusive benefits and accelerate your wellness journey.</p>
            </div>

            {/* Plan Selector */}
            <Card>
                <CardHeader>
                    <CardTitle>Choose Your Plan</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                    {vipPlans.map(plan => (
                        <Card 
                            key={plan.id} 
                            className={cn(
                                "flex flex-col cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1",
                                plan.id === currentPlanId && "border-2 border-primary shadow-lg"
                            )}
                            onClick={() => setCurrentPlanId(plan.id)}
                        >
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>{plan.name}</span>
                                    {plan.id === currentPlanId && <CheckCircle className="text-primary"/>}
                                </CardTitle>
                                <CardDescription>
                                    <span className="text-2xl font-bold">€{plan.priceEUR}</span>
                                    <span className="text-muted-foreground">/month</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between">
                                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                                    {plan.benefits.map(benefit => (
                                        <li key={benefit} className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button 
                                    className="w-full mt-4"
                                    variant={plan.id === currentPlanId ? 'default' : 'outline'}
                                >
                                    {plan.id === currentPlanId ? 'Current Plan' : 'Select Plan'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Benefits Panel */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Diamond Benefits</CardTitle>
                            <CardDescription>
                                Active since {vipData.since}. Renews on {vipData.renewal}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            {vipData.benefits.map(benefit => (
                                <Card key={benefit.id} className="flex flex-col">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">{benefit.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <p className="text-2xl font-bold">{benefit.used} / {benefit.limit}</p>
                                            <Progress value={(benefit.used / (typeof benefit.limit === 'number' ? benefit.limit : 1)) * 100} className="h-2 my-2"/>
                                        </div>
                                        <Button variant="secondary" size="sm" className="mt-4" disabled={benefit.status !== 'available'}>
                                            {benefit.status === 'used' ? 'Redeemed' : 'Redeem Now'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Benefit Usage History</CardTitle>
                            <CardDescription>A log of your redeemed VIP benefits.</CardDescription>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Benefit</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vipData.history.map((item, index) => {
                                        const benefit = vipData.benefits.find(b => b.id === item.benefitId);
                                        return (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{benefit?.name}</TableCell>
                                                <TableCell>{item.at}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Savings & Insights */}
                <div className="space-y-8">
                    <Card className="bg-primary/10 border-primary/20">
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="text-primary"/>
                                <span>AI Suggestions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm">To maximize your plan, book a Guest Pass before it expires next month.</p>
                            <Button variant="outline" size="sm">Book Guest Pass</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Lifetime Savings</CardTitle>
                            <CardDescription>Total value saved through your VIP membership.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-5xl font-bold text-green-600">€{vipData.insights.savingsEUR}</p>
                            <p className="text-sm text-muted-foreground mt-2">with {vipData.insights.monthUses} benefits used this month.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
