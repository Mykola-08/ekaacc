"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle, Home, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PaymentResultProps {
  status: 'success' | 'cancel';
}

export function PaymentResult({ status }: PaymentResultProps) {
  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg text-center p-12 shadow-xl border-border animate-fade-in">
        
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center shadow-sm",
            isSuccess ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          )}>
            {isSuccess ? (
              <CheckCircle2 className="w-12 h-12" />
            ) : (
              <AlertCircle className="w-12 h-12" />
            )}
          </div>
        </div>

        {/* Text */}
        <h1 className="text-4xl font-serif text-foreground mb-4">
          {isSuccess ? "Booking Confirmed" : "Booking Cancelled"}
        </h1>
        
        <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
          {isSuccess 
            ? "Thank you for your booking. You will receive a confirmation email shortly with all the details."
            : "Your payment was not processed and your booking has not been confirmed. No charges were made."
          }
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            {isSuccess && (
               <Link href="/bookings">
                <Button className="w-full sm:w-auto h-12 px-8 text-base shadow-lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    View My Bookings
                </Button>
               </Link>
            )}

            <Link href="/">
              <Button variant={isSuccess ? "outline" : "default"} className={cn("w-full sm:w-auto h-12 px-8 text-base", !isSuccess && "shadow-lg")}>
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
        </div>

      </Card>
    </div>
  );
}

