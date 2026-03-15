import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, User, Bell, Shield, Users, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 animate-fade-in max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary/60" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground text-balance">
          Manage your account settings, notification preferences, and security.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full flex flex-col lg:flex-row gap-8 items-start">
        <TabsList className="flex flex-row lg:flex-col lg:w-48 h-auto bg-transparent p-0 space-y-0 lg:space-y-1 space-x-1 lg:space-x-0 overflow-x-auto justify-start border-b lg:border-b-0 pb-2 lg:pb-0 hide-scrollbar w-full">
          <TabsTrigger 
            value="profile" 
            className="justify-start px-3 py-2 text-left rounded-md data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="justify-start px-3 py-2 text-left rounded-md data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="justify-start px-3 py-2 text-left rounded-md data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger 
            value="family" 
            className="justify-start px-3 py-2 text-left rounded-md data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            <span>Family</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 w-full min-w-0">
          <TabsContent value="profile" className="m-0 animate-in fade-in-50 duration-500 space-y-6">
            
            {/* Avatar Section */}
            <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/60 shadow-sm transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Profile Picture</CardTitle>
                <CardDescription>Update your personal avatar to be recognizable by your therapist.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-border/60 shadow-sm">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2 shadow-xs">
                    <Upload className="h-4 w-4" /> Upload
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Info Section */}
            <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/60 shadow-sm transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>Update your name and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">First Name</label>
                    <Input className="bg-background shadow-xs transition-colors focus-visible:border-primary/50" placeholder="John" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-foreground">Last Name</label>
                    <Input className="bg-background shadow-xs transition-colors focus-visible:border-primary/50" placeholder="Doe" defaultValue="Doe" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium leading-none text-foreground">Email Address</label>
                    <Input type="email" className="bg-background shadow-xs transition-colors focus-visible:border-primary/50" placeholder="john.doe@example.com" defaultValue="john.doe@example.com" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/40 bg-muted/10 px-6 py-4 justify-end">
                <Button className="shadow-xs active:scale-95 transition-transform" size="sm">Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="m-0 animate-in fade-in-50 duration-500">
            <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>Choose what alerts you want to receive.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-md border border-dashed border-border/60 text-center">
                  Notification settings are currently managed inside the mobile app.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="m-0"></TabsContent>
          <TabsContent value="family" className="m-0"></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
