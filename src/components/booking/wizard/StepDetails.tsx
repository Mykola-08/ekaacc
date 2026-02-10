'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface StepDetailsProps {
  user: any;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createAccount: boolean;
  };
  serviceId: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: (data: any) => void;
}

export function StepDetails({
  user,
  formData,
  serviceId,
  handleInputChange,
  setFormData,
}: StepDetailsProps) {
  return (
    <div className="bg-card border-border rounded-[20px] border p-8 shadow-sm">
      <Tabs defaultValue="guest" value={user ? 'guest' : undefined} className="w-full">
        {!user && (
          <TabsList className="bg-secondary mb-8 grid h-12 w-full grid-cols-2 rounded-full p-1">
            <TabsTrigger
              value="guest"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full font-semibold data-[state=active]:shadow-sm"
            >
              Guest Checkout
            </TabsTrigger>
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full font-semibold data-[state=active]:shadow-sm"
            >
              Sign In
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="guest" className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground font-bold">
                First name
              </Label>
              <Input
                id="firstName"
                className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-12 border-transparent transition-all"
                placeholder="Jane"
                disabled={!!user}
                defaultValue={user?.user_metadata?.first_name}
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-foreground font-bold">
                Last name
              </Label>
              <Input
                id="lastName"
                className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-12 border-transparent transition-all"
                placeholder="Doe"
                disabled={!!user}
                defaultValue={user?.user_metadata?.last_name}
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-bold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-12 border-transparent transition-all"
              placeholder="jane@example.com"
              disabled={!!user}
              defaultValue={user?.email}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground font-bold">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-12 border-transparent transition-all"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          {!user && (
            <div className="border-border flex items-center space-x-3 border-t pt-6">
              <Checkbox
                id="createAccount"
                checked={formData.createAccount}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, createAccount: checked as boolean })
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="createAccount"
                  className="text-foreground cursor-pointer text-sm font-bold"
                >
                  Create an account for easier booking next time
                </Label>
                <p className="text-muted-foreground text-sm">
                  We'll email you a link to set your password.
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        {!user && (
          <TabsContent value="login">
            <div className="space-y-6 py-12 text-center">
              <p className="text-muted-foreground mx-auto max-w-xs">
                Already have an account? Sign in to use your saved details and points.
              </p>
              <Button
                variant="outline"
                asChild
                className="h-12 rounded-full border-2 px-8 font-bold hover:bg-transparent"
              >
                <Link href={`/login?returnTo=/book/${serviceId}`}>Sign In</Link>
              </Button>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
