import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-serif text-primary">System Settings</h1>
           <p className="text-muted-foreground">Manage global configurations and preferences.</p>
        </div>
        <Button>Save Changes</Button>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="booking">Booking Rules</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                This information is displayed on emails and the booking page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input defaultValue="EKA Acc" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input defaultValue="contact@eka.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue="123 Wellness Blvd, Health City" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
               <CardTitle>Localization</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input defaultValue="America/Los_Angeles" disabled className="bg-muted" />
               </div>
               <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input defaultValue="USD" disabled className="bg-muted" />
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="space-y-4">
           <Card>
             <CardHeader>
                <CardTitle>Booking Configuration</CardTitle>
                <CardDescription>Control how and when clients can book.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="space-y-2">
                   <Label>Booking Lead Time (Hours)</Label>
                   <Input type="number" defaultValue="24" />
                   <p className="text-xs text-muted-foreground">Minimum notice required before a session.</p>
                </div>
                <div className="space-y-2">
                   <Label>Max Advance Booking (Days)</Label>
                   <Input type="number" defaultValue="60" />
                </div>
                <Separator />
                <div className="flex items-center space-x-2">
                    <Checkbox id="require-approval" />
                    <Label htmlFor="require-approval">Require Manual Approval for New Clients</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="allow-cancellation" defaultChecked />
                    <Label htmlFor="allow-cancellation">Allow Self-Service Cancellation</Label>
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="notifications">
             <Card>
                <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between">
                         <Label>Booking Confirmation</Label>
                         <Checkbox defaultChecked />
                     </div>
                     <div className="flex items-center justify-between">
                         <Label>Reminder Emails (24h before)</Label>
                         <Checkbox defaultChecked />
                     </div>
                     <div className="flex items-center justify-between">
                         <Label>Feedback Request (After session)</Label>
                         <Checkbox />
                     </div>
                </CardContent>
             </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
            <div className="p-12 text-center text-muted-foreground border rounded-xl bg-muted/20">
                Integration settings (Stripe, Zoom, etc.) coming soon.
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
