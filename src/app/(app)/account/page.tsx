import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/data";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold">Account Settings</h1>
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>This is how others will see you on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={currentUser.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={currentUser.email} />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your billing information and subscription plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <div>
                        <p className="font-semibold">EKA {currentUser.role} Plan</p>
                        <p className="text-sm text-muted-foreground">Billed monthly. Next payment on Sep 1, 2024.</p>
                    </div>
                    <Button variant="outline">Manage Plan</Button>
                </div>
            </CardContent>
        </Card>
         <Button>Update Profile</Button>
    </div>
  );
}
