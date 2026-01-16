"use client";

import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function JournalPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-12 md:p-20 shadow-xl border-border text-center animate-fade-in">
         <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
            <BookOpen className="w-10 h-10" />
         </div>

         <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Journal</h1>
         <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto leading-relaxed">
            Reflections on structural integration, somatic awareness, and the journey to balance.
         </p>

         <div className="p-8 rounded-2xl bg-muted/30 border border-dashed border-muted mb-10">
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
                Articles Coming Soon
            </p>
         </div>

         <Link href="/">
            <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return Home
            </Button>
         </Link>
      </Card>
    </div>
  );
}
