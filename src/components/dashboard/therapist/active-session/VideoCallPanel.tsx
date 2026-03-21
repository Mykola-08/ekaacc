'use client';

import { useState, useEffect, useRef } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HugeiconsIcon } from '@hugeicons/react';
import { Video01Icon, Mic01Icon, MicOff01Icon, VideoOffIcon } from '@hugeicons/core-free-icons';

interface VideoCallPanelProps {
  roomUrl?: string; // e.g. "https://yourdomain.daily.co/hello"
}

export function VideoCallPanel({ roomUrl }: VideoCallPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState('');

  // Daily JS state bindings using the frame directly for simplicity,
  // but if needed `@daily-co/daily-react` could be used contextually.

  useEffect(() => {
    if (!containerRef.current || !roomUrl) return;

    let newCallObject = DailyIframe.getCallInstance();
    if (!newCallObject) {
      newCallObject = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: '0',
          borderRadius: '0.5rem',
        },
        showLeaveButton: false,
        theme: {
          colors: {
            accent: '#4DAFFF',
            accentText: '#ffffff',
            background: '#FEFFFE',
            backgroundAccent: '#F9F9F8',
            baseText: '#222222',
            border: '#F5F5F5',
            mainAreaBg: '#FEFFFE',
            mainAreaBgAccent: '#F9F9F8',
            mainAreaText: '#222222',
            supportiveText: '#999999',
          },
        },
      });
    }

    setCallObject(newCallObject);

    return () => {
      newCallObject?.destroy();
    };
  }, [roomUrl]);

  const joinCall = async () => {
    if (!callObject || !roomUrl) return;
    try {
      await callObject.join({ url: roomUrl });
      setHasJoined(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to join remote room.');
    }
  };

  const leaveCall = async () => {
    if (!callObject) return;
    await callObject.leave();
    setHasJoined(false);
  };

  if (!roomUrl) {
    return (
      <div className="bg-muted/20 border-muted-foreground/30 text-muted-foreground flex h-full items-center justify-center rounded-[calc(var(--radius)*0.8)] border border-dashed p-8 text-center">
        <p>No video room linked to this session yet.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* The Daily iframe container */}
      <div
        ref={containerRef}
        className="relative w-full flex-1 overflow-hidden rounded-[calc(var(--radius)*0.8)] bg-black"
      >
        {!hasJoined && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
            <Button onClick={joinCall} size="lg" className="gap-2">
              <HugeiconsIcon icon={Video01Icon} className="size-5"  />
              Join Patient Video Call
            </Button>
          </div>
        )}
      </div>

      {hasJoined && (
        <div className="bg-muted/30 flex justify-center gap-4 rounded-[calc(var(--radius)*0.8)] border p-2">
          {/* Native controls shown via Daily frame, but you can build custom wrappers if needed. */}
          <Button variant="destructive" onClick={leaveCall}>
            End Call
          </Button>
        </div>
      )}
    </div>
  );
}
