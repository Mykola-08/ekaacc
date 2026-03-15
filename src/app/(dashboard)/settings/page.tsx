import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, UserIcon, Notification01Icon, SecurityCheckIcon, UserGroupIcon, Upload01Icon } from "@hugeicons/core-free-icons";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="space-y-1 px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <HugeiconsIcon icon={Settings01Icon} className="size-6 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings, notification preferences, and security.
        </p>
      </div>

      <div className="px-4 lg:px-6">
        <Tabs defaultValue="profile" className="w-full flex flex-col lg:flex-row gap-6 items-start">
          <TabsList className="flex flex-row lg:flex-col lg:w-48 h-auto bg-transparent p-0 space-y-0 lg:space-y-1 space-x-1 lg:space-x-0 overflow-x-auto justify-start border-b lg:border-b-0 pb-2 lg:pb-0 w-full">
            <TabsTrigger 
              value="profile" 
              className="justify-start px-3 py-2 text-left rounded-md data-[state=active]:bg-muted data-[state=active]:shadow-none flex items-center gap-2"
            >
              <HugeiconsIcon icon={UserIcon} className="size-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="justify-start px-3 py-2 text-left rounded-md data-[state=active]:bg-muted data-[state=active]:shadow-none flex items-center gap-2"
            >
              <HugeiconsIcon icon={Notification01Icon} className="size-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="justify-start px-3 py-2 text-left rounded-md data-[state=active]:bg-muted data-[state=active]:shadow-none flex items-center gap-2"
            >
              <HugeiconsIcon icon={SecurityCheckIcon} className="size-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger 
              value="family" 
              className="justify-start px-3 py-2 text-left rounded-md data-[state=active]:bg-muted data-[state=active]:shadow-none flex items-center gap-2"
            >
              <HugeiconsIcon icon={UserGroupIcon} className="size-4" />
              <span>Family</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 w-full min-w-0">
            <TabsContent value="profile" className="m-0 space-y-4">
              
              {/* Avatar Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Picture</CardTitle>
                  <CardDescription>Update your personal avatar to be recognizable by your therapist.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                  <Avatar className="size-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <HugeiconsIcon icon={Upload01Icon} className="size-4" /> Upload
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Info Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <CardDescription>Update your name and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">First Name</label>
                      <Input placeholder="John" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Last Name</label>
                      <Input placeholder="Doe" defaultValue="Doe" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium leading-none">Email Address</label>
                      <Input type="email" placeholder="john.doe@example.com" defaultValue="john.doe@example.com" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 justify-end">
                  <Button size="sm">Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notification Preferences</CardTitle>
                  <CardDescription>Choose what alerts you want to receive.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground p-4 bg-muted rounded-md border border-dashed text-center">
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
    </div>
  );
}
