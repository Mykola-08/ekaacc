'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Users, Move, Eye, MessageCircle, Mic, Plus } from 'lucide-react';

interface ConstellationRole {
  id: string;
  name: string; // e.g. "Father", "Client", "Symptoms"
  position: { x: number; y: number };
  facing: number; // degrees
  notes: string;
  isResolved: boolean;
}

export function ConstellationManager() {
  const [roles, setRoles] = useState<ConstellationRole[]>([
    {
      id: '1',
      name: 'Client',
      position: { x: 50, y: 70 },
      facing: 0,
      notes: '',
      isResolved: false,
    },
    {
      id: '2',
      name: 'Mother',
      position: { x: 40, y: 30 },
      facing: 180,
      notes: 'Feeling distant',
      isResolved: false,
    },
  ]);

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>('1');
  const [environmentNotes, setEnvironmentNotes] = useState('');

  const addRole = () => {
    const newRole = {
      id: Date.now().toString(),
      name: 'New Element',
      position: { x: 50, y: 50 },
      facing: 0,
      notes: '',
      isResolved: false,
    };
    setRoles([...roles, newRole]);
    setSelectedRoleId(newRole.id);
  };

  const updateSelectedRole = (updates: Partial<ConstellationRole>) => {
    setRoles(roles.map((r) => (r.id === selectedRoleId ? { ...r, ...updates } : r)));
  };

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  // Suggestions mock based on who is selected (AI would normally feed this)
  const suggestedPhrases = selectedRole?.name.toLowerCase().includes('mother')
    ? [
        'I take my life from you, all of it with its full price.',
        'I leave the burden with you.',
        'You are the big one and I am the small one.',
      ]
    : ['I honor your place in the system.', 'I see you now.', 'I acknowledge what happened.'];

  return (
    <div className="flex h-full gap-4">
      {/* Visual Canvas (mocked with simple grid) */}
      <div className="bg-muted/10 relative flex flex-1 flex-col overflow-hidden rounded-xl border">
        <div className="bg-background flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users className="text-primary h-4 w-4" />
            System Map
          </div>
          <Button variant="outline" size="sm" onClick={addRole}>
            <Plus className="mr-1 h-4 w-4" /> Add Role
          </Button>
        </div>
        <div className="relative flex-1 p-4">
          {/* Constellation Nodes */}
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`absolute -mt-8 -ml-8 flex h-16 w-16 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all ${role.id === selectedRoleId ? 'bg-primary text-primary-foreground border-primary z-10 scale-110' : 'bg-background hover:bg-muted border-muted-foreground/30'} ${role.isResolved ? 'ring-2 ring-green-500 ring-offset-2' : ''} `}
              style={{ left: `${role.position.x}%`, top: `${role.position.y}%` }}
            >
              <div
                className="absolute top-1 h-3 w-1 rounded-full bg-current opacity-50"
                style={{ transform: `rotate(${role.facing}deg)`, transformOrigin: 'bottom center' }}
              />
              <span className="w-full truncate px-1 text-center">{role.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="flex w-80 flex-col gap-4">
        {selectedRole ? (
          <Card className="flex flex-1 flex-col">
            <CardContent className="flex-1 space-y-4 overflow-auto p-4">
              <div>
                <Label>Role Identity</Label>
                <Input
                  value={selectedRole.name}
                  onChange={(e) => updateSelectedRole({ name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Dynamics / Notes</Label>
                <Textarea
                  value={selectedRole.notes}
                  onChange={(e) => updateSelectedRole({ notes: e.target.value })}
                  placeholder="Observations about posture, emotions, resistances..."
                  className="mt-1 h-24 resize-none"
                />
              </div>
              <div className="pt-2">
                <Button
                  variant={selectedRole.isResolved ? 'outline' : 'secondary'}
                  className={`w-full ${selectedRole.isResolved ? 'border-green-500 text-green-600' : ''}`}
                  onClick={() => updateSelectedRole({ isResolved: !selectedRole.isResolved })}
                >
                  {selectedRole.isResolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                </Button>
              </div>

              <div className="mt-4 border-t pt-4">
                <h4 className="text-primary mb-2 flex items-center gap-2 text-sm font-semibold">
                  <MessageCircle className="h-4 w-4" /> Recommended Phrases
                </h4>
                <div className="space-y-2">
                  {suggestedPhrases.map((phrase, i) => (
                    <div
                      key={i}
                      className="bg-muted/40 hover:bg-muted cursor-pointer rounded border p-2 text-xs transition-colors"
                    >
                      "{phrase}"
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-muted-foreground flex flex-1 items-center justify-center rounded-xl border p-4 text-center text-sm">
            Select a role from the map to edit.
          </div>
        )}

        {/* Global Env Notes */}
        <Card className="flex h-48 flex-col">
          <CardContent className="flex h-full flex-col p-4">
            <Label className="mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4" /> Systemic Environment
            </Label>
            <Textarea
              value={environmentNotes}
              onChange={(e) => setEnvironmentNotes(e.target.value)}
              placeholder="Overall energy, tension in the room, global shifts..."
              className="bg-background flex-1 resize-none text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
