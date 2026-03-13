'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { RichTextEditor } from '@/components/platform/editor/rich-text-editor';
import { useParams, useRouter } from 'next/navigation';

export default function ActiveSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [sessionTime, setSessionTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [scratchpadInfo, setScratchpadInfo] = useState('');

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const endSession = async () => {
    setIsRunning(false);
    // Real implementation would save the scratchpad state to draft SOAP notes
    // and redirect to the post-session notes editor
    router.push('/therapist/session-notes?draft=true');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header className="flex flex-col justify-between gap-4 border-b pb-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Active Session Console</h1>
          <p className="text-muted-foreground">Booking ID: {params.bookingId}</p>
        </div>

        <div className="bg-muted/30 flex items-center gap-4 rounded-xl border p-4">
          <Clock
            className={`h-6 w-6 ${isRunning ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}
          />
          <span className="font-mono text-3xl font-semibold tracking-wider tabular-nums">
            {formatTime(sessionTime)}
          </span>
          <Button
            variant={isRunning ? 'outline' : 'default'}
            onClick={() => setIsRunning(!isRunning)}
            className="w-24"
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
        </div>
      </header>

      <div className="line-clamp-1 grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Client Medical/History Context */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="text-accent h-5 w-5" />
                Client Context Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground font-semibold">Primary Diagnosis:</span>
                <p className="mt-1">Generalized Anxiety Disorder (F41.1)</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Current Medications:</span>
                <p className="mt-1">Sertraline 50mg</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Previous Session Goals:</span>
                <ul className="text-muted-foreground mt-1 list-disc space-y-1 pl-5">
                  <li>Practice 4-7-8 breathing</li>
                  <li>Identify anxiety triggers at work</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Notetaking & Tools */}
        <div className="flex h-full flex-col space-y-6 lg:col-span-2">
          <Card className="flex h-full flex-1 flex-col">
            <CardHeader className="pb-3">
              <CardTitle>Clinical Scratchpad</CardTitle>
              <CardDescription>
                Raw notes taken here will be automatically formatted into your SOAP note draft
                post-session via AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex min-h-[300px] flex-1 flex-col">
              <Textarea
                placeholder="Jot down quick observations, quotes from the patient, or key topics here..."
                className="bg-background focus:ring-primary/20 flex-1 resize-none text-base leading-relaxed focus:ring-1"
                value={scratchpadInfo}
                onChange={(e) => setScratchpadInfo(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="mt-auto flex justify-end gap-4 pt-4">
            <Button variant="outline" size="lg" onClick={() => router.push('/therapist/patients')}>
              Leave Console
            </Button>
            <Button variant="default" size="lg" className="bg-primary" onClick={endSession}>
              <CheckCircle className="mr-2 h-5 w-5" />
              End Session & Draft Notes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
