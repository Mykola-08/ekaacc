'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/morphing-toaster';
import { Lock, Unlock, Save, Database, AlertTriangle } from 'lucide-react';

export function UniversalResourceEditor({ table, id }: { table: string; id: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [table, id]);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) {
      toast.error(`Error loading ${table}: ${error.message}`);
    } else {
      setData(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Exclude system fields
    const { id: _, created_at, updated_at, ...updatePayload } = data;

    const { error } = await supabase.from(table).update(updatePayload).eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Record updated successfully');
    }
    setSaving(false);
  };

  const toggleLock = async () => {
    const newLockState = !data.is_locked;
    // Optimization: Use the RPC for locking to ensure it works even if triggers block normal updates (though triggers usually check role)
    const { error } = await supabase.rpc('admin_toggle_lock', {
      p_table_name: table,
      p_record_id: id,
      p_lock_status: newLockState,
    });

    if (error) {
      toast.error('Failed to toggle lock: ' + error.message);
    } else {
      setData({ ...data, is_locked: newLockState });
      toast.success(newLockState ? 'Record LOCKED' : 'Record UNLOCKED');
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setData({ ...data, [key]: value });
  };

  if (loading) return <div>Loading superadmin view...</div>;
  if (!data) return <div>Record not found.</div>;

  return (
    <Card className="border-red-200 bg-red-50/10 p-6 dark:border-red-900/50">
      <div className="border-border mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-red-500" />
          <div>
            <h2 className="font-mono text-xl font-semibold text-red-700 dark:text-red-400">
              GOD MODE_
            </h2>
            <p className="text-muted-foreground font-mono text-xs uppercase">
              Editing {table} :: {id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-background border-border flex items-center gap-2 rounded-full border px-4 py-2">
            <span className="text-sm font-semibold">{data.is_locked ? 'LOCKED' : 'UNLOCKED'}</span>
            <Switch
              checked={data.is_locked}
              onCheckedChange={toggleLock}
              className="data-[state=checked]:bg-red-500"
            />
            {data.is_locked ? (
              <Lock className="h-4 w-4 text-red-500" />
            ) : (
              <Unlock className="h-4 w-4 text-emerald-500" />
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2 bg-red-600 text-white hover:bg-red-700"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Force Update'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.keys(data).map((key) => {
          const value = data[key];
          const type = typeof value;
          const isSystem = ['id', 'created_at', 'updated_at'].includes(key);

          return (
            <div key={key} className={`space-y-1 ${isSystem ? 'opacity-50' : ''}`}>
              <label className="text-muted-foreground flex items-center justify-between font-mono text-xs font-semibold uppercase">
                {key}
                {isSystem && <span className="bg-secondary rounded px-1 text-xs">SYS</span>}
              </label>

              {type === 'boolean' ? (
                <Switch
                  checked={value}
                  onCheckedChange={(c) => handleFieldChange(key, c)}
                  disabled={isSystem}
                />
              ) : key === 'metadata' || key === 'raw_user_meta_data' || type === 'object' ? (
                <Textarea
                  value={JSON.stringify(value, null, 2)}
                  className="bg-background h-24 font-mono text-xs"
                  onChange={(e) => {
                    try {
                      handleFieldChange(key, JSON.parse(e.target.value));
                    } catch (err) {
                      // invalid json, maybe just dont update state yet or show error
                    }
                  }}
                  disabled={isSystem}
                />
              ) : (
                <Input
                  value={value || ''}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="font-mono"
                  disabled={isSystem}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
        <div className="text-sm text-yellow-600 dark:text-yellow-400">
          <strong>Warning:</strong> You are editing raw database records. This bypasses application
          validation logic. Ensure you know what you are doing. Locking a record will prevent users
          from modifying it.
        </div>
      </div>
    </Card>
  );
}
