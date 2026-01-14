"use client";

import { format } from "date-fns";
import { CheckCircle, DollarSign, ShieldCheck } from "lucide-react";
import { VerifyButton } from "@/components/admin/verify-button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface FinanceVerificationsProps {
    items: any[];
}

export function FinanceVerifications({ items }: FinanceVerificationsProps) {
    return (
        <div className="w-full bg-background min-h-screen p-6 md:p-12 animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif text-foreground">Finance & Verification</h1>
                    <p className="text-muted-foreground mt-1">Manage payments and identity verification requests.</p>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold text-foreground">Pending Verifications</h2>
                        <Badge variant="secondary">
                            {items.length}
                        </Badge>
                    </div>

                    {items.length === 0 ? (
                         <div className="py-20 text-center bg-card rounded-[32px] border border-dashed border-border">
                             <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-6 h-6 text-primary" />
                             </div>
                             <h3 className="text-lg font-medium text-foreground">All Clear!</h3>
                             <p className="text-muted-foreground mt-1">No pending verifications found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {items.map((item) => (
                                <VerificationCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function VerificationCard({ item }: { item: any }) {
    const trustScore = item.profiles?.trust_score || 0;
    const isLowTrust = trustScore < 70;

    return (
        <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <DollarSign className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-foreground text-lg">
                                ${((item.amount || 0) / 100).toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm font-medium text-muted-foreground">
                            {item.service?.name}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{item.profiles?.full_name || 'Guest'}</span>
                            <span>{item.profiles?.email}</span>
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                            Requested {format(new Date(item.start_time), 'MMM d, h:mm a')}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <Badge variant={isLowTrust ? "destructive" : "default"} className="flex gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Score: {trustScore}
                    </Badge>
                    
                    <VerifyButton bookingId={item.id} />
                </div>
            </CardContent>
        </Card>
    );
}
