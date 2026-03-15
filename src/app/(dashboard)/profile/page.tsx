import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserIcon, MapPinIcon, BriefcaseIcon } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto py-8 w-full px-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Public Profile</h1>
        <p className="text-muted-foreground">Manage how others see you on the platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
              <CardDescription>A brief introduction about yourself.</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
                placeholder="Write something about yourself..."
              />
              <div className="mt-4 flex justify-end">
                <Button>Save Bio</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specialties & Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">Anxiety</span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">Depression</span>
                <Button variant="outline" size="sm" className="h-6 rounded-full border-dashed px-2.5 text-xs">+</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Jane Doe</h3>
                  <p className="text-sm text-muted-foreground">Member since 2024</p>
                </div>
                <Button className="w-full" variant="outline">Change Avatar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
