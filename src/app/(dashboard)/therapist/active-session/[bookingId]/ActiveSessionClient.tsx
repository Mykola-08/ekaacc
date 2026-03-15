'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  Activity,
  BrainCircuit,
  Users,
  BookOpen,
  Video,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useFeature } from '@/context/FeaturesContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveKinesiologyTest } from '@/server/therapist/kinesiology-actions';
import { toast } from 'sonner';

import { ProtocolRunner } from '@/components/dashboard/therapist/active-session/ProtocolRunner';
import { ConstellationManager } from '@/components/dashboard/therapist/active-session/ConstellationManager';
import dynamic from 'next/dynamic';

const VideoCallPanel = dynamic(
  () =>
    import('@/components/dashboard/therapist/active-session/VideoCallPanel').then(
      (m) => m.VideoCallPanel
    ),
  {
    ssr: false,
    loading: () => <div className="bg-muted h-full min-h-100 w-full animate-pulse rounded-xl" />,
  }
);

interface Props {
  bookingId: string;
  protocols: any[];
}

export default function ActiveSessionClient({ bookingId, protocols }: Props) {
  const router = useRouter();
  const [sessionTime, setSessionTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [scratchpadInfo, setScratchpadInfo] = useState('');

  const hasKinesiology = useFeature('kinesiology');

  // Kinesiology mock state
  const [muscleTests, setMuscleTests] = useState('');
  const [structural, setStructural] = useState('');
  const [chemical, setChemical] = useState('');
  const [emotional, setEmotional] = useState('');

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

    try {
      if (hasKinesiology) {
        await saveKinesiologyTest({
          bookingId: Array.isArray(bookingId) ? bookingId[0] : bookingId,
          muscleTests,
          structuralCorrections: structural,
          chemicalCorrections: chemical,
          emotionalCorrections: emotional,
          notes: scratchpadInfo,
        });
        toast.success('Kinesiology session data saved.');
      }
      // Continue to session notes drafting flow
      router.push('/therapist/session-notes?draft=true');
    } catch (e) {
      toast.error('Failed to save session data');
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col space-y-4 overflow-hidden p-4 md:p-6">
      <header className="flex shrink-0 flex-col justify-between gap-4 border-b py-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Workspace</h1>
          <p className="text-muted-foreground text-sm">Patient Session: {bookingId}</p>
        </div>

        <div className="bg-muted/30 flex items-center gap-4 rounded-xl border px-4 py-2">
          <Clock
            className={`h-5 w-5 ${isRunning ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}
          />
          <span className="font-mono text-2xl font-semibold tracking-wider tabular-nums">
            {formatTime(sessionTime)}
          </span>
          <Button
            variant={isRunning ? 'outline' : 'default'}
            onClick={() => setIsRunning(!isRunning)}
            className="w-24 font-medium transition-all"
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button variant="default" size="sm" className="bg-primary" onClick={endSession}>
            <CheckCircle className="mr-2 h-4 w-4" />
            End Session
          </Button>
        </div>
      </header>

      <div className="bg-background flex-1 overflow-hidden rounded-xl border">
        <ResizablePanelGroup orientation="horizontal" className="h-full items-stretch">
          {/* LEFT PANEL: Client Context & Anamnesis */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40} className="bg-muted/10">
            <div className="flex h-full flex-col">
              <div className="bg-card border-b p-4">
                <h2 className="flex items-center gap-2 font-semibold tracking-tight">
                  <Activity className="text-primary h-4 w-4" />
                  Client Context Snapshot
                </h2>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Demographics
                    </h3>
                    <div className="bg-card flex flex-col gap-2 rounded-2xl border p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age:</span>
                        <span className="font-medium">34</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Occupation:</span>
                        <span className="font-medium">Software Engineer</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-muted-foreground pr-2 text-sm font-medium tracking-wider uppercase">
                      Medical History
                    </h3>
                    <div className="bg-card space-y-3 rounded-2xl border p-3 text-sm">
                      <div>
                        <span className="mb-1 inline-block font-medium">Primary Diagnosis</span>
                        <p className="text-muted-foreground">
                          Generalized Anxiety Disorder (F41.1), Chronic lower back pain
                        </p>
                      </div>
                      <div>
                        <span className="mb-1 inline-block font-medium">Medications</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <Badge variant="secondary">Sertraline 50mg</Badge>
                          <Badge variant="outline">Ibuprofen PRN</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Recent Notes & Goals
                    </h3>
                    <div className="bg-card text-muted-foreground rounded-2xl border p-3 text-sm">
                      <ul className="list-disc space-y-1 pl-4">
                        <li>Practice 4-7-8 breathing</li>
                        <li>Identify anxiety triggers at work</li>
                        <li>Check hip alignment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* RIGHT PANEL: Workspace (Notes + Optional Features) */}
          <ResizablePanel defaultSize={70}>
            <div className="bg-card flex h-full flex-col p-4">
              <Tabs defaultValue="notes" className="flex h-full flex-col">
                <TabsList className="mb-4 grid w-fit auto-cols-max grid-flow-col">
                  <TabsTrigger value="notes" className="flex gap-2">
                    <FileText className="h-4 w-4" />
                    Clinical Scratchpad
                  </TabsTrigger>
                  <TabsTrigger value="protocols" className="flex gap-2">
                    <BookOpen className="h-4 w-4" />
                    Protocols
                  </TabsTrigger>
                  {hasKinesiology && (
                    <TabsTrigger value="kinesiology" className="flex gap-2">
                      <BrainCircuit className="h-4 w-4" />
                      Applied Kinesiology
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="constellations" className="flex gap-2">
                    <Users className="h-4 w-4" />
                    Systemic Tracking
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex gap-2">
                    <Video className="h-4 w-4" />
                    Telehealth
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="notes"
                  className="mt-0 flex-1 flex-col data-[state=active]:flex"
                >
                  <div className="bg-background flex flex-1 flex-col overflow-hidden rounded-2xl border">
                    <div className="bg-muted/40 text-muted-foreground flex items-center justify-between border-b p-2 text-xs">
                      <span>Raw notes are formatted via AI post-session</span>
                      <Badge variant="outline" className="bg-background font-mono">
                        Auto-saving...
                      </Badge>
                    </div>
                    <Textarea
                      placeholder="Jot down observations, insights, and key topics..."
                      className="flex-1 resize-none rounded-none border-0 p-4 text-base leading-relaxed focus-visible:ring-0"
                      value={scratchpadInfo}
                      onChange={(e) => setScratchpadInfo(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent
                  value="protocols"
                  className="mt-0 flex-1 flex-col overflow-hidden data-[state=active]:flex"
                >
                  <ProtocolRunner protocols={protocols} />
                </TabsContent>

                <TabsContent
                  value="constellations"
                  className="mt-0 flex-1 flex-col overflow-hidden data-[state=active]:flex"
                >
                  <ConstellationManager />
                </TabsContent>

                <TabsContent
                  value="video"
                  className="mt-0 flex-1 flex-col overflow-hidden data-[state=active]:flex"
                >
                  {/* Provide a dummy daily.co URL for the demo environment so it actually opens for testing if requested */}
                  <VideoCallPanel roomUrl="https://ekaacc.daily.co/session-demo" />
                </TabsContent>

                {hasKinesiology && (
                  <TabsContent
                    value="kinesiology"
                    className="mt-0 flex-1 flex-col overflow-hidden data-[state=active]:flex"
                  >
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-6 pb-8">
                        <div>
                          <h3 className="mb-1 text-lg font-medium">Kinesiological Assessment</h3>
                          <p className="text-muted-foreground mb-4 text-sm">
                            Record muscle testing responses and corrections.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Indicator Muscle Tested (e.g. Deltoid)</Label>
                            <Input
                              placeholder="e.g. Anterior Deltoid - Strong/Weak"
                              value={muscleTests}
                              onChange={(e) => setMuscleTests(e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-3">
                            <div className="bg-muted/20 space-y-3 rounded-2xl border p-4">
                              <h4 className="font-medium text-blue-600 dark:text-blue-400">
                                Structural Corrections
                              </h4>
                              <Textarea
                                placeholder="Cranial faults, spinal fixations, muscle spindle..."
                                className="bg-background h-24 resize-none"
                                value={structural}
                                onChange={(e) => setStructural(e.target.value)}
                              />
                            </div>

                            <div className="bg-muted/20 space-y-3 rounded-2xl border p-4">
                              <h4 className="font-medium text-green-600 dark:text-green-400">
                                Chemical / Nutritional
                              </h4>
                              <Textarea
                                placeholder="Testing vials, supplements indicated..."
                                className="bg-background h-24 resize-none"
                                value={chemical}
                                onChange={(e) => setChemical(e.target.value)}
                              />
                            </div>

                            <div className="bg-muted/20 space-y-3 rounded-2xl border p-4">
                              <h4 className="font-medium text-purple-600 dark:text-purple-400">
                                Emotional
                              </h4>
                              <Textarea
                                placeholder="Neurovascular holding points, affirmations..."
                                className="bg-background h-24 resize-none"
                                value={emotional}
                                onChange={(e) => setEmotional(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
