/**
 * Keep React Components Demo
 * 
 * This file demonstrates how to use Keep React components in the EKA Account application.
 * Keep React is a modern, accessible component library built with React and Tailwind CSS.
 * 
 * Documentation: https://react.keepdesign.io/
 */

'use client';

import React from 'react';
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
  Radio,
  Textarea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  Tabs,
  TabsContent,
  TabsItem,
  TabsList,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Modal,
  ModalAction,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Notification,
  Progress,
  ProgressBar,
  Spinner,
  Skeleton,
  SkeletonLine,
  Accordion,
  AccordionContainer,
  AccordionContent,
  AccordionIcon,
  AccordionPanel,
  AccordionTitle,
  Breadcrumb,
  BreadcrumbItem,
  Divider,
  Toast,
  Tooltip,
  TooltipAction,
  TooltipContent,
} from '@/components/keep';

export default function KeepReactDemo() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Keep React Components Demo</h1>
        <p className="text-muted-foreground">
          Explore the modern, accessible components from Keep React integrated into EKA Account.
        </p>
      </div>

      <Divider />

      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button disabled>Disabled Button</Button>
        </div>
        
        <ButtonGroup>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </section>

      <Divider />

      {/* Cards Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Therapy Session</CardTitle>
              <CardDescription>Upcoming session details</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Your next therapy session is scheduled for tomorrow at 2:00 PM.</p>
              <div className="mt-4 flex gap-2">
                <Badge>Confirmed</Badge>
                <Badge variant="outline">Online</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
              <CardDescription>Current balance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">€125.00</p>
              <Button className="mt-4 w-full">Add Funds</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Progress</CardTitle>
              <CardDescription>Complete your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress>
                <ProgressBar value={75} />
              </Progress>
              <p className="mt-2 text-sm text-muted-foreground">75% complete</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Divider />

      {/* Form Inputs Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Inputs</h2>
        <Card>
          <CardHeader>
            <CardTitle>User Information Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectValue placeholder="Select a role" />
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="therapist">Therapist</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" placeholder="Tell us about yourself..." rows={4} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">I agree to the terms and conditions</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <Label htmlFor="notifications">Enable notifications</Label>
            </div>

            <Button className="w-full">Submit</Button>
          </CardContent>
        </Card>
      </section>

      <Divider />

      {/* Table Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tables</h2>
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
                  <TableCell>2024-01-15</TableCell>
                  <TableCell>Dr. Smith</TableCell>
                  <TableCell>Individual</TableCell>
                  <TableCell><Badge>Completed</Badge></TableCell>
                  <TableCell className="text-right">€50.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-01-12</TableCell>
                  <TableCell>Dr. Johnson</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell><Badge>Completed</Badge></TableCell>
                  <TableCell className="text-right">€30.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-01-16</TableCell>
                  <TableCell>Dr. Williams</TableCell>
                  <TableCell>Individual</TableCell>
                  <TableCell><Badge variant="outline">Scheduled</Badge></TableCell>
                  <TableCell className="text-right">€50.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Divider />

      {/* Tabs Section */}
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
                  <p>View your therapy journey summary and upcoming appointments.</p>
                </div>
              </TabsContent>
              <TabsContent value="sessions">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Session Management</h3>
                  <p>View, schedule, and manage your therapy sessions.</p>
                </div>
              </TabsContent>
              <TabsContent value="billing">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Billing & Payments</h3>
                  <p>Manage your wallet, subscriptions, and payment history.</p>
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
                  <p>Update your profile, preferences, and notification settings.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      <Divider />

      {/* Accordion Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Accordion</h2>
        <AccordionContainer>
          <Accordion>
            <AccordionPanel>
              <AccordionTitle>What is therapy?</AccordionTitle>
              <AccordionContent>
                Therapy is a collaborative treatment based on the relationship between an individual and a psychologist.
                Grounded in dialogue, it provides a supportive environment to talk openly with someone who is objective,
                neutral, and nonjudgmental.
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle>How does online therapy work?</AccordionTitle>
              <AccordionContent>
                Online therapy works similarly to in-person therapy but is conducted through video calls, phone calls,
                or messaging. You can connect with your therapist from the comfort of your own space.
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle>Is my information confidential?</AccordionTitle>
              <AccordionContent>
                Yes, all sessions and personal information are completely confidential and protected under HIPAA
                regulations. Your privacy is our top priority.
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </AccordionContainer>
      </section>

      <Divider />

      {/* Loading States Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Spinner</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Spinner />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loading</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
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

      {/* Badges Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge className="bg-green-500">Success</Badge>
          <Badge className="bg-yellow-500">Warning</Badge>
          <Badge className="bg-blue-500">Info</Badge>
        </div>
      </section>

      <Divider />

      {/* Avatar Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Avatars</h2>
        <div className="flex gap-4">
          <Avatar>
            <img src="https://i.pravatar.cc/150?img=1" alt="User 1" />
          </Avatar>
          <Avatar>
            <img src="https://i.pravatar.cc/150?img=2" alt="User 2" />
          </Avatar>
          <Avatar>
            <img src="https://i.pravatar.cc/150?img=3" alt="User 3" />
          </Avatar>
          <Avatar>
            <span className="text-lg font-semibold">AB</span>
          </Avatar>
        </div>
      </section>
    </div>
  );
}
