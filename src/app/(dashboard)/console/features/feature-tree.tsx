'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createFeature, updateFeature, deleteFeature } from './actions';

interface Feature {
  id: string;
  key: string;
  description: string | null;
  default_enabled: boolean;
  parent_feature_id: string | null;
}

function FeatureNode({
  feature,
  childrenMap,
  level = 0,
  onEdit,
  onDelete,
  isPending,
}: {
  feature: Feature;
  childrenMap: Map<string, Feature[]>;
  level?: number;
  onEdit: (f: Feature) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="group/node">
      <div
        style={{ marginLeft: level * 24 + 'px' }}
        className="border-border/50 hover:bg-muted/30 flex items-center gap-4 rounded-sm border-b py-3 pr-2 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-mono text-sm font-semibold tracking-tight">
              {feature.key}
            </span>
            {feature.default_enabled ? (
              <Badge variant="default" className="h-5 px-1.5 text-[10px]">
                Default On
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground h-5 px-1.5 text-[10px]">
                Default Off
              </Badge>
            )}
          </div>
          {feature.description && (
            <p className="text-muted-foreground mt-0.5 truncate text-xs">{feature.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/node:opacity-100">
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onEdit(feature)}>
            <Pencil className="mr-1 h-3 w-3" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive h-7 w-7"
            onClick={() => onDelete(feature.id)}
            disabled={isPending}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {childrenMap.get(feature.id)?.map((child) => (
        <FeatureNode
          key={child.id}
          feature={child}
          childrenMap={childrenMap}
          level={level + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          isPending={isPending}
        />
      ))}
    </div>
  );
}

export function FeatureTree({ features }: { features: Feature[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isPending, startTransition] = useTransition();

  const childrenMap = new Map<string, Feature[]>();
  const rootNodes: Feature[] = [];

  features.forEach((f) => {
    if (f.parent_feature_id) {
      if (!childrenMap.has(f.parent_feature_id)) childrenMap.set(f.parent_feature_id, []);
      childrenMap.get(f.parent_feature_id)!.push(f);
    } else {
      rootNodes.push(f);
    }
  });

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingFeature(null);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteFeature(id);
    });
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      if (editingFeature) {
        await updateFeature(formData);
      } else {
        await createFeature(formData);
      }
      setDialogOpen(false);
      setEditingFeature(null);
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            Manage system-wide capabilities and hierarchical flags.
          </p>
        </div>
        <Button onClick={handleAdd}>Add Feature</Button>
      </div>

      <div className="bg-card ring-border rounded-2xl ring-1">
        <div className="bg-muted/20 border-b px-6 py-3">
          <h3 className="text-base font-semibold">Feature Tree</h3>
        </div>
        <div className="p-4">
          {rootNodes.map((node) => (
            <FeatureNode
              key={node.id}
              feature={node}
              childrenMap={childrenMap}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isPending={isPending}
            />
          ))}
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingFeature(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFeature ? 'Edit Feature' : 'Add Feature'}</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="grid gap-4">
            {editingFeature && <input type="hidden" name="id" value={editingFeature.id} />}
            <div className="grid gap-2">
              <Label htmlFor="key">Feature Key</Label>
              <Input
                id="key"
                name="key"
                placeholder="dashboard.analytics"
                defaultValue={editingFeature?.key || ''}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Optional description"
                defaultValue={editingFeature?.description || ''}
              />
            </div>
            {!editingFeature && (
              <div className="grid gap-2">
                <Label htmlFor="parent_feature_id">Parent Feature ID (optional)</Label>
                <Input
                  id="parent_feature_id"
                  name="parent_feature_id"
                  placeholder="Leave empty for root"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Switch
                id="default_enabled"
                name="default_enabled"
                defaultChecked={editingFeature?.default_enabled ?? true}
              />
              <Label htmlFor="default_enabled">Enabled by default</Label>
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : editingFeature ? 'Update' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
