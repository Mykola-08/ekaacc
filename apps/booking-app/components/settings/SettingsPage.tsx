"use client";

import { updateProfile } from '@/server/settings/actions';
import { toast } from "sonner";
import { User, Mail, Phone, FileText, Save, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface SettingsPageProps {
  profile: any;
}

export function SettingsPage({ profile }: SettingsPageProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setLoading(true);
      const formData = new FormData(event.currentTarget);
      
      try {
        const result = await updateProfile(null, formData);
        
        if (result && result.success) {
            toast.success("Profile Updated", {
                description: "Your changes have been saved successfully."
            });
        } else {
            toast.error("Update Failed", {
                description: result?.message || "Something went wrong. Please try again."
            });
        }
      } catch (e) {
         toast.error("Error", { description: "An unexpected error occurred." });
      } finally {
        setLoading(false);
      }
  }

  return (
    <div className="flex flex-col gap-8 pb-24 pt-12 max-w-4xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
       {/* Header */}
        <div className="pb-8 text-center space-y-4">
            <h1 className="font-sans font-semibold tracking-tight text-3xl md:text-4xl text-foreground">Account Settings</h1>
            <p className="text-muted-foreground text-lg font-light">Manage your profile information and preferences.</p>
        </div>

       <div className="grid gap-8">
            
            {/* Profile Form */}
            <Card className="glass-panel overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="border-b border-black/5 pb-8 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#0d9488]/10 flex items-center justify-center text-[#0d9488]">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-sans font-medium tracking-tight">Personal Information</CardTitle>
                                <CardDescription className="text-muted-foreground font-light">Update your public profile details.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="full_name" className="flex items-center gap-2 font-medium">
                                <User className="w-4 h-4 text-[#0d9488]" />
                                Full Name
                            </Label>
                            <Input 
                                id="full_name" 
                                name="full_name" 
                                defaultValue={profile?.full_name || ''} 
                                required 
                                className="h-12 rounded-xl bg-white/50 border-black/5 focus:border-[#0d9488]/50 focus:ring-[#0d9488]/20"
                            />
                        </div>

                        {/* Email (Read Only) */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 font-medium">
                                <Mail className="w-4 h-4 text-[#0d9488]" />
                                Email Address
                            </Label>
                            <div className="relative">
                                <Input 
                                    id="email" 
                                    name="email" 
                                    defaultValue={profile?.email || 'Managed by Auth Provider'} 
                                    disabled 
                                    className="h-12 pr-10 bg-black/5 border-transparent cursor-not-allowed opacity-75 rounded-xl"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Shield className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground px-1 font-light">
                                Email is managed by your authentication provider and cannot be changed here.
                            </p>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2 font-medium">
                                <Phone className="w-4 h-4 text-[#0d9488]" />
                                Phone Number
                            </Label>
                            <Input 
                                id="phone" 
                                name="phone" 
                                defaultValue={profile?.metadata?.phone || profile?.phone || ''} 
                                placeholder="+1 (555) 000-0000"
                                className="h-12 rounded-xl bg-white/50 border-black/5 focus:border-[#0d9488]/50 focus:ring-[#0d9488]/20"
                            />
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="bio" className="flex items-center gap-2 font-medium">
                                <FileText className="w-4 h-4 text-[#0d9488]" />
                                Bio / Notes
                            </Label>
                            <Textarea 
                                id="bio" 
                                name="bio" 
                                defaultValue={profile?.metadata?.bio || profile?.bio || ''} 
                                placeholder="Tell us a bit about yourself..."
                                className="min-h-32 resize-y rounded-xl bg-white/50 border-black/5 focus:border-[#0d9488]/50 focus:ring-[#0d9488]/20"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="border-t border-black/5 pt-8 flex justify-end bg-black/1">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full sm:w-auto min-w-37.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-lg shadow-teal-500/20"
                        >
                            {loading ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </CardFooter>
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Notifications Placeholder */}
            <Card className="p-8 text-center bg-muted/30 border-dashed animate-fade-in" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-serif text-muted-foreground mb-1">Notifications</h3>
                <p className="text-sm text-muted-foreground">Additional preferences coming soon.</p>
            </Card>

       </div>
    </div>
  );
}
