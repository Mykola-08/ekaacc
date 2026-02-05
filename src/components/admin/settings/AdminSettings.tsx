"use client";

import { cn } from "@/lib/utils";
import { User, Lock, Bell, Globe, Save, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AdminSettings() {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'booking', label: 'Booking Rules', icon: Calendar },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'integrations', label: 'Integrations', icon: Lock },
    ];

    return (
        <div className="w-full h-full p-6 md:p-12 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-foreground">System Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage global configurations and preferences.</p>
                </div>
                <Button className="rounded-full px-6 shadow-lg">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
                {tabs.map(tab => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        onClick={() => setActiveTab(tab.id)}
                        className="rounded-full gap-2"
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Content */}
            <Card className="p-6 md:p-8 min-h-100">
                {activeTab === 'general' && <GeneralSettings />}
                {activeTab === 'booking' && <BookingSettings />}
                {activeTab === 'notifications' && <NotificationSettings />}
                {activeTab === 'integrations' && <IntegrationSettings />}
            </Card>
        </div>
    );
}

function GeneralSettings() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Business Information</h2>
                <p className="text-sm text-muted-foreground">This information is displayed on emails and the booking page.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input defaultValue="EKA Acc" />
                </div>
                <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input defaultValue="contact@eka.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Input defaultValue="123 Wellness Blvd, Health City" />
                </div>
            </div>

            <div className="border-t border-border pt-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Localization</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Input defaultValue="America/Los_Angeles" disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label>Currency</Label>
                        <Input defaultValue="USD" disabled className="bg-muted" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function BookingSettings() {
    return (
        <div className="space-y-8 animate-fade-in">
             <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Booking Configuration</h2>
                <p className="text-sm text-muted-foreground">Control how and when clients can book.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Booking Lead Time (Hours)</Label>
                    <Input type="number" defaultValue="24" />
                    <p className="text-xs text-muted-foreground">Minimum notice required before a session.</p>
                </div>
                <div className="space-y-2">
                    <Label>Max Advance Booking (Days)</Label>
                    <Input type="number" defaultValue="60" />
                </div>
            </div>

            <div className="border-t border-border pt-8 space-y-6">
                <div className="flex items-center space-x-3">
                    <Checkbox id="require-approval" />
                    <Label htmlFor="require-approval" className="font-medium">Require Manual Approval for New Clients</Label>
                </div>
                <div className="flex items-center space-x-3">
                    <Checkbox id="allow-cancellation" defaultChecked />
                    <Label htmlFor="allow-cancellation" className="font-medium">Allow Self-Service Cancellation</Label>
                </div>
            </div>
        </div>
    );
}

function NotificationSettings() {
    return (
        <div className="space-y-8 animate-fade-in">
             <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Email Notifications</h2>
                <p className="text-sm text-muted-foreground">Manage automated email triggers.</p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                    <Label className="font-medium">Booking Confirmation</Label>
                    <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                    <Label className="font-medium">Reminder Emails (24h before)</Label>
                    <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                    <Label className="font-medium">Feedback Request (After session)</Label>
                    <Checkbox />
                </div>
            </div>
        </div>
    );
}

function IntegrationSettings() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Coming Soon</h3>
            <p className="text-muted-foreground max-w-sm mt-2">Integration settings (Stripe, etc.) will be available in the next update.</p>
        </div>
    );
}
