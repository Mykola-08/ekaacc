'use client';

import { useMemo, useState, type MouseEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  ArrowReloadHorizontalIcon,
  Download02Icon,
  EyeIcon,
  Link03Icon,
  Message01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';

type RoleNode = {
  id: string;
  name: string;
  position: { x: number; y: number };
  notes: string;
  isResolved: boolean;
};

type Relationship = {
  id: string;
  fromId: string;
  toId: string;
  label: string;
  intensity: 'low' | 'medium' | 'high';
};

type ConstellationTemplate = {
  id: string;
  label: string;
  roles: RoleNode[];
  relationships: Relationship[];
};

const TEMPLATES: ConstellationTemplate[] = [
  {
    id: 'family-core',
    label: 'Family Core',
    roles: [
      { id: 'client', name: 'Client', position: { x: 50, y: 70 }, notes: '', isResolved: false },
      { id: 'mother', name: 'Mother', position: { x: 35, y: 35 }, notes: '', isResolved: false },
      { id: 'father', name: 'Father', position: { x: 65, y: 35 }, notes: '', isResolved: false },
    ],
    relationships: [
      { id: 'r1', fromId: 'client', toId: 'mother', label: 'Attachment', intensity: 'medium' },
      { id: 'r2', fromId: 'client', toId: 'father', label: 'Distance', intensity: 'medium' },
    ],
  },
  {
    id: 'symptom-map',
    label: 'Symptom-Focused',
    roles: [
      { id: 'client', name: 'Client', position: { x: 50, y: 72 }, notes: '', isResolved: false },
      { id: 'symptom', name: 'Symptom', position: { x: 50, y: 30 }, notes: '', isResolved: false },
      {
        id: 'resource',
        name: 'Resource',
        position: { x: 25, y: 48 },
        notes: '',
        isResolved: false,
      },
      {
        id: 'excluded',
        name: 'Excluded Member',
        position: { x: 75, y: 48 },
        notes: '',
        isResolved: false,
      },
    ],
    relationships: [
      { id: 'r3', fromId: 'client', toId: 'symptom', label: 'Pressure', intensity: 'high' },
      { id: 'r4', fromId: 'resource', toId: 'client', label: 'Support', intensity: 'medium' },
    ],
  },
];

const PHRASE_BANK: Record<string, string[]> = {
  mother: [
    'Dear mother, I take life from you as it came through you.',
    'I leave with you what belongs to you, and I keep what is mine.',
  ],
  father: [
    'Dear father, please look kindly on me when I follow my own path.',
    'I honor your place and keep my own place as the child.',
  ],
  symptom: [
    'I see what you are trying to show me.',
    'Thank you for your message; I now choose a healthier path.',
  ],
  default: ['I see you and I acknowledge your place in the system.', 'You belong, and I belong.'],
};

function templateById(id: string) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}

function edgeColor(intensity: Relationship['intensity']) {
  if (intensity === 'high') return 'stroke-destructive';
  if (intensity === 'medium') return 'stroke-warning';
  return 'stroke-muted-foreground';
}

export function ConstellationManager() {
  const [templateId, setTemplateId] = useState<string>(TEMPLATES[0].id);
  const [roles, setRoles] = useState<RoleNode[]>(templateById(TEMPLATES[0].id).roles);
  const [relationships, setRelationships] = useState<Relationship[]>(
    templateById(TEMPLATES[0].id).relationships
  );
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || '');
  const [environmentNotes, setEnvironmentNotes] = useState('');
  const [draggingRoleId, setDraggingRoleId] = useState<string | null>(null);

  const selectedRole = roles.find((role) => role.id === selectedRoleId) || null;

  const phrases = useMemo(() => {
    if (!selectedRole) return PHRASE_BANK.default;
    const key = selectedRole.name.toLowerCase();
    if (key.includes('mother')) return PHRASE_BANK.mother;
    if (key.includes('father')) return PHRASE_BANK.father;
    if (key.includes('symptom')) return PHRASE_BANK.symptom;
    return PHRASE_BANK.default;
  }, [selectedRole]);

  const applyTemplate = (id: string) => {
    const next = templateById(id);
    const suffix = Date.now().toString();
    const idMap = new Map<string, string>();
    const mappedRoles = next.roles.map((role) => {
      const mappedId = `${role.id}-${suffix}`;
      idMap.set(role.id, mappedId);
      return { ...role, id: mappedId };
    });

    const mappedRelations = next.relationships.map((relation) => ({
      ...relation,
      id: `${relation.id}-${suffix}`,
      fromId: idMap.get(relation.fromId) || relation.fromId,
      toId: idMap.get(relation.toId) || relation.toId,
    }));

    setTemplateId(next.id);
    setRoles(mappedRoles);
    setRelationships(mappedRelations);
    setSelectedRoleId(mappedRoles[0]?.id || '');
  };

  const addRole = () => {
    const id = `role-${Date.now()}`;
    const nextRole: RoleNode = {
      id,
      name: `Element ${roles.length + 1}`,
      position: { x: 50, y: 50 },
      notes: '',
      isResolved: false,
    };
    setRoles((prev) => [...prev, nextRole]);
    setSelectedRoleId(id);
  };

  const updateSelectedRole = (updates: Partial<RoleNode>) => {
    setRoles((prev) =>
      prev.map((role) => (role.id === selectedRoleId ? { ...role, ...updates } : role))
    );
  };

  const onCanvasMove: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!draggingRoleId) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setRoles((prev) =>
      prev.map((role) =>
        role.id === draggingRoleId
          ? {
              ...role,
              position: {
                x: Math.max(5, Math.min(95, x)),
                y: Math.max(8, Math.min(92, y)),
              },
            }
          : role
      )
    );
  };

  const exportConstellation = () => {
    const payload = JSON.stringify({ templateId, roles, relationships, environmentNotes }, null, 2);
    navigator.clipboard.writeText(payload);
  };

  return (
    <div className="flex h-full gap-4">
      <div className="bg-muted/10 relative flex flex-1 flex-col overflow-hidden rounded-[var(--radius)] border">
        <div className="bg-background flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <HugeiconsIcon icon={UserIcon} className="text-primary size-4" />
            System Map
          </div>
          <div className="flex gap-2">
            <Select value={templateId} onValueChange={applyTemplate}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={addRole}>
              <HugeiconsIcon icon={Add01Icon} className="mr-1 size-4" /> Add Role
            </Button>
          </div>
        </div>

        <div
          className="relative flex-1 p-4 select-none"
          onMouseMove={onCanvasMove}
          onMouseUp={() => setDraggingRoleId(null)}
          onMouseLeave={() => setDraggingRoleId(null)}
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            {relationships.map((rel) => {
              const from = roles.find((role) => role.id === rel.fromId);
              const to = roles.find((role) => role.id === rel.toId);
              if (!from || !to) return null;
              return (
                <g key={rel.id}>
                  <line
                    x1={`${from.position.x}%`}
                    y1={`${from.position.y}%`}
                    x2={`${to.position.x}%`}
                    y2={`${to.position.y}%`}
                    className={`${edgeColor(rel.intensity)} stroke-2 opacity-80`}
                  />
                </g>
              );
            })}
          </svg>

          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              onMouseDown={() => setDraggingRoleId(role.id)}
              className={`absolute -mt-8 -ml-8 flex h-16 w-16 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all ${
                role.id === selectedRoleId
                  ? 'border-primary bg-primary text-primary-foreground z-10 scale-110'
                  : 'bg-background border-muted-foreground/30 hover:bg-muted'
              } ${role.isResolved ? 'ring-success ring-2 ring-offset-2' : ''}`}
              style={{ left: `${role.position.x}%`, top: `${role.position.y}%` }}
            >
              <span className="w-full truncate px-1 text-center">{role.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex w-80 flex-col gap-4">
        {selectedRole ? (
          <Card className="flex flex-1 flex-col">
            <CardContent className="flex-1 space-y-4 overflow-auto p-4">
              <div>
                <Label>Role identity</Label>
                <Input
                  value={selectedRole.name}
                  onChange={(event) => updateSelectedRole({ name: event.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Dynamics / notes</Label>
                <Textarea
                  value={selectedRole.notes}
                  onChange={(event) => updateSelectedRole({ notes: event.target.value })}
                  placeholder="Observe body sensation, emotion, movement impulses..."
                  className="mt-1 h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedRole.isResolved ? 'outline' : 'secondary'}
                  onClick={() => updateSelectedRole({ isResolved: !selectedRole.isResolved })}
                >
                  {selectedRole.isResolved ? 'Unresolve' : 'Resolve'}
                </Button>
                <Button variant="outline" onClick={exportConstellation}>
                  <HugeiconsIcon icon={Download02Icon} className="mr-1 size-4" /> Copy JSON
                </Button>
              </div>

              <div className="mt-4 border-t pt-4">
                <h4 className="text-primary mb-2 flex items-center gap-2 text-sm font-semibold">
                  <HugeiconsIcon icon={Message01Icon} className="size-4" /> Suggested phrases
                </h4>
                <div className="space-y-2">
                  {phrases.map((phrase, index) => (
                    <div
                      key={index}
                      className="bg-muted/40 hover:bg-muted rounded border p-2 text-xs transition-colors"
                    >
                      “{phrase}”
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-muted-foreground mt-4 border-t pt-4 text-xs">
                <p className="mb-1 flex items-center gap-1.5">
                  <HugeiconsIcon icon={Link03Icon} className="size-3.5" />
                  Tip: Drag circles on the map to physically model proximity and tension.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-muted-foreground flex flex-1 items-center justify-center rounded-[var(--radius)] border p-4 text-center text-sm">
            Select a role from the map to edit.
          </div>
        )}

        <Card className="flex h-56 flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2">
                <HugeiconsIcon icon={EyeIcon} className="size-4" /> Systemic Environment
              </span>
              <Badge variant="outline" className="text-xs">
                Session mode
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-full flex-col gap-2">
            <Textarea
              value={environmentNotes}
              onChange={(event) => setEnvironmentNotes(event.target.value)}
              placeholder="Room energy, turning points, intervention sequence..."
              className="bg-background flex-1 resize-none text-sm"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setEnvironmentNotes('')}
              >
                <HugeiconsIcon icon={ArrowReloadHorizontalIcon} className="mr-1 size-4" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
