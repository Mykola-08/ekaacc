'use client';

import React, { useState, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationSwitchProps {
  id?: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  defaultChecked?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onToggle?: (checked: boolean) => Promise<void> | void;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function NotificationSwitch({
  id,
  label,
  description,
  icon,
  defaultChecked = false,
  checked: controlledChecked,
  disabled = false,
  onToggle,
  onCheckedChange,
  className,
}: NotificationSwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [saving, setSaving] = useState(false);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleChange = useCallback(
    async (value: boolean) => {
      if (!isControlled) {
        setInternalChecked(value);
      }
      if (onCheckedChange) {
        onCheckedChange(value);
      }
      if (onToggle) {
        setSaving(true);
        try {
          await onToggle(value);
        } catch {
          if (!isControlled) {
            setInternalChecked(!value);
          }
        } finally {
          setSaving(false);
        }
      }
    },
    [onToggle, onCheckedChange, isControlled]
  );

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl p-4 transition-colors',
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <div>
          <Label htmlFor={id} className="text-sm font-semibold text-foreground">{label}</Label>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {saving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={handleChange}
          disabled={disabled || saving}
        />
      </div>
    </div>
  );
}
