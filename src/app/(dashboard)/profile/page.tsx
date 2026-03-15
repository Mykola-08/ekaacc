import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon } from "@hugeicons/core-free-icons";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Public Profile</h1>
        <p className="text-sm text-muted-foreground">Manage how others see you on the platform.</p>
      </div>

      <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-3">
        <div className="space-y-4 @xl/main:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
              <CardDescription>A brief introduction about yourself.</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" 
                placeholder="Write something about yourself..."
              />
              <div className="mt-4 flex justify-end">
                <Button size="sm">Save Bio</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specialties & Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Anxiety</Badge>
                <Badge variant="secondary">Depression</Badge>
                <Button variant="outline" size="sm" className="h-6 border-dashed px-2.5 text-xs">+</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="size-24 rounded-lg bg-muted flex items-center justify-center">
                  <HugeiconsIcon icon={UserIcon} className="size-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Jane Doe</h3>
                  <p className="text-sm text-muted-foreground">Member since 2024</p>
                </div>
                <Button className="w-full" variant="outline" size="sm">Change Avatar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
