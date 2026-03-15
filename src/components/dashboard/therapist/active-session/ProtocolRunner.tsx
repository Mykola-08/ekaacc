'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { ListChecks } from 'lucide-react';

interface ProtocolProps {
  protocols: any[];
}

export function ProtocolRunner({ protocols }: ProtocolProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [protocolNotes, setProtocolNotes] = useState('');

  const selectedProtocol = protocols?.find((p) => p.id === selectedId);
  const steps = selectedProtocol?.content_json?.steps || [];
  const rawText = selectedProtocol?.content_json?.rawText;

  const toggleStep = (idx: number) => {
    const newChecked = new Set(checkedSteps);
    if (newChecked.has(idx)) {
      newChecked.delete(idx);
    } else {
      newChecked.add(idx);
    }
    setCheckedSteps(newChecked);
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center gap-4">
        <ListChecks className="text-primary h-5 w-5" />
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a Clinical Protocol..." />
          </SelectTrigger>
          <SelectContent>
            {protocols?.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedProtocol ? (
        <div className="text-muted-foreground flex flex-1 items-center justify-center rounded-2xl border border-dashed">
          Select a protocol from the list to begin tracking steps.
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <ScrollArea className="bg-card flex-1 overflow-y-auto rounded-2xl border">
            {steps.length > 0 ? (
              <div className="space-y-4 p-4">
                {steps.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 rounded-2xl border p-3 transition-colors ${checkedSteps.has(idx) ? 'bg-muted/50 border-primary/50' : 'bg-background hover:bg-muted/20'}`}
                  >
                    <Checkbox
                      id={`step-${idx}`}
                      checked={checkedSteps.has(idx)}
                      onCheckedChange={() => toggleStep(idx)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={`step-${idx}`}
                        className={`text-base font-medium ${checkedSteps.has(idx) ? 'text-muted-foreground decoration-primary/50 line-through' : ''}`}
                      >
                        {step.title}
                      </Label>
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4">
                {rawText ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="font-sans text-sm whitespace-pre-wrap">{rawText}</pre>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    No formatted steps found for this protocol.
                  </p>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="h-32 flex-none">
            <Label className="mb-2 block text-sm font-medium">Protocol Observations</Label>
            <Textarea
              placeholder="Notes specific to the execution of this protocol..."
              className="bg-background h-full resize-none"
              value={protocolNotes}
              onChange={(e) => setProtocolNotes(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
