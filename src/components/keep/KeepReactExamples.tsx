/**
 * Keep React Simple Examples
 * 
 * Working examples of Keep React components that you can copy and use.
 * All examples are verified to work with the current Keep React version.
 */

'use client';

import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Avatar,
  Input,
  Label,
  Checkbox,
  Switch,
  Textarea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsItem,
  TabsList,
  Divider,
  Spinner,
  Skeleton,
  SkeletonLine,
} from '@/components/keep';
import { Heart, User, Calendar, CreditCard } from 'phosphor-react';

export default function KeepReactExamples() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="container mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Keep React Examples</h1>
        <p className="text-muted-foreground">
          Ready-to-use component examples for EKA Account
        </p>
      </div>

      <Divider />

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="softBg">Soft Background</Button>
          <Button disabled>Disabled Button</Button>
        </div>

        <div className="flex gap-4">
          <Button>
            <Heart size={20} weight="fill" className="mr-2" />
            With Icon
          </Button>
          <Button variant="outline">
            <Calendar size={20} className="mr-2" />
            Schedule
          </Button>
        </div>

        <ButtonGroup>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </section>

      <Divider />

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Next Session</CardTitle>
              <CardDescription>Upcoming appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Dr. Sarah Smith</p>
                <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                <Badge>Confirmed</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
              <CardDescription>Available funds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-3xl font-bold">€125.00</p>
                <Button className="w-full">
                  <CreditCard size={20} className="mr-2" />
                  Add Funds
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <User size={24} />
                </Avatar>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">Client</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Divider />

      {/* Form Inputs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Inputs</h2>
        <Card>
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
            <CardDescription>Send us a message</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Your message..."
                rows={4}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox 
                id="terms" 
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <Label htmlFor="terms">I agree to the terms and conditions</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch 
                id="notifications"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
              />
              <Label htmlFor="notifications">
                Enable email notifications
              </Label>
            </div>

            <Button className="w-full">Submit Form</Button>
          </CardContent>
        </Card>
      </section>

      <Divider />

      {/* Table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Data Table</h2>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your therapy session history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Jan 15, 2024</TableCell>
                  <TableCell>Dr. Smith</TableCell>
                  <TableCell>Individual</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500 text-white">Completed</Badge>
                  </TableCell>
                  <TableCell className="text-right">€50.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jan 12, 2024</TableCell>
                  <TableCell>Dr. Johnson</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500 text-white">Completed</Badge>
                  </TableCell>
                  <TableCell className="text-right">€30.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jan 18, 2024</TableCell>
                  <TableCell>Dr. Williams</TableCell>
                  <TableCell>Individual</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-500 text-white">Scheduled</Badge>
                  </TableCell>
                  <TableCell className="text-right">€50.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Divider />

      {/* Tabs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tabs</h2>
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsItem value="overview">Overview</TabsItem>
                <TabsItem value="sessions">Sessions</TabsItem>
                <TabsItem value="billing">Billing</TabsItem>
                <TabsItem value="settings">Settings</TabsItem>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Dashboard Overview</h3>
                  <p className="text-muted-foreground">
                    View your therapy journey summary and upcoming appointments.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="sessions">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Session Management</h3>
                  <p className="text-muted-foreground">
                    View, schedule, and manage your therapy sessions here.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="billing">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Billing & Payments</h3>
                  <p className="text-muted-foreground">
                    Manage your wallet, subscriptions, and payment history.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
                  <p className="text-muted-foreground">
                    Update your profile, preferences, and notification settings.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      <Divider />

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Spinner</CardTitle>
              <CardDescription>Loading indicator</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Spinner />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton</CardTitle>
              <CardDescription>Content placeholder</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton>
                <SkeletonLine className="h-4 w-3/4" />
              </Skeleton>
              <Skeleton>
                <SkeletonLine className="h-4 w-1/2" />
              </Skeleton>
              <Skeleton>
                <SkeletonLine className="h-4 w-5/6" />
              </Skeleton>
            </CardContent>
          </Card>
        </div>
      </section>

      <Divider />

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Badges & Avatars</h2>
        <Card>
          <CardHeader>
            <CardTitle>Status Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge className="bg-green-500 text-white">Success</Badge>
              <Badge className="bg-yellow-500 text-white">Warning</Badge>
              <Badge className="bg-red-500 text-white">Error</Badge>
              <Badge className="bg-blue-500 text-white">Info</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Avatars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <Avatar>
                <User size={24} />
              </Avatar>
              <Avatar>
                <Heart size={24} weight="fill" />
              </Avatar>
              <Avatar>
                <Calendar size={24} />
              </Avatar>
              <Avatar>
                <span className="text-lg font-semibold">AB</span>
              </Avatar>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
