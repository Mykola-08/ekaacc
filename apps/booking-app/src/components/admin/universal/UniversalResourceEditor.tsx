'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Unlock, Save, Database, AlertTriangle } from "lucide-react";

export function UniversalResourceEditor({ table, id }: { table: string, id: string }) {
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
            toast.success("Record updated successfully");
        }
        setSaving(false);
    };

    const toggleLock = async () => {
        const newLockState = !data.is_locked;
        // Optimization: Use the RPC for locking to ensure it works even if triggers block normal updates (though triggers usually check role)
        const { error } = await supabase.rpc('admin_toggle_lock', {
            p_table_name: table,
            p_record_id: id,
            p_lock_status: newLockState
        });

        if (error) {
            toast.error("Failed to toggle lock: " + error.message);
        } else {
            setData({ ...data, is_locked: newLockState });
            toast.success(newLockState ? "Record LOCKED" : "Record UNLOCKED");
        }
    };

    const handleFieldChange = (key: string, value: any) => {
        setData({ ...data, [key]: value });
    };

    if (loading) return <div>Loading superadmin view...</div>;
    if (!data) return <div>Record not found.</div>;

    return (
        <Card className="p-6 border-red-200 bg-red-50/10 dark:border-red-900/50">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-red-500" />
                    <div>
                        <h2 className="text-xl font-bold font-mono text-red-700 dark:text-red-400">GOD MODE_</h2>
                        <p className="text-xs text-muted-foreground font-mono uppercase">Editing {table} :: {id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border">
                        <span className="text-sm font-bold">{data.is_locked ? "LOCKED" : "UNLOCKED"}</span>
                        <Switch
                            checked={data.is_locked}
                            onCheckedChange={toggleLock}
                            className="data-[state=checked]:bg-red-500"
                        />
                        {data.is_locked ? <Lock className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white gap-2">
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Force Update"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(data).map(key => {
                    const value = data[key];
                    const type = typeof value;
                    const isSystem = ['id', 'created_at', 'updated_at'].includes(key);

                    return (
                        <div key={key} className={`space-y-1 ${isSystem ? 'opacity-50' : ''}`}>
                            <label className="text-xs font-mono font-semibold text-muted-foreground uppercase flex items-center justify-between">
                                {key}
                                {isSystem && <span className="text-[10px] bg-secondary px-1 rounded">SYS</span>}
                            </label>

                            {type === 'boolean' ? (
                                <Switch checked={value} onCheckedChange={(c) => handleFieldChange(key, c)} disabled={isSystem} />
                            ) : key === 'metadata' || key === 'raw_user_meta_data' || type === 'object' ? (
                                <Textarea
                                    value={JSON.stringify(value, null, 2)}
                                    className="font-mono text-xs h-24 bg-background"
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

            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                    <strong>Warning:</strong> You are editing raw database records. This bypasses application validation logic.
                    Ensure you know what you are doing. Locking a record will prevent users from modifying it.
                </div>
            </div>
        </Card>
    );
}
