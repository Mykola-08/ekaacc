'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useSimpleAuth, useUserPreferences } from '@/hooks/platform/auth/use-simple-auth'
import { Button } from '@/components/platform/ui/button'
import { Badge } from '@/components/platform/ui/badge'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/platform/ui/form'
import { Input } from '@/components/platform/ui/input'
import { Textarea } from '@/components/platform/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/platform/ui/avatar'
import { Switch } from '@/components/platform/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/platform/ui/select'
import { User, Mail, UserCircle, Settings, Bell, Palette, Globe } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().min(2, 'Language must be at least 2 characters'),
  timezone: z.string().min(3, 'Timezone must be at least 3 characters'),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
})

type PreferencesFormValues = z.infer<typeof preferencesSchema>

interface UserProfileProps {
  className?: string
}

export function UserProfile({ className }: UserProfileProps) {
  const { user, updateProfile, isLoading } = useSimpleAuth()
  const { preferences, updatePreferences } = useUserPreferences()

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.profile?.full_name || '',
      username: user?.profile?.username || '',
      bio: user?.profile?.bio || '',
    },
  })

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: preferences?.theme || 'system',
      language: preferences?.language || 'en',
      timezone: preferences?.timezone || 'UTC',
      emailNotifications: preferences?.email_notifications || true,
      pushNotifications: preferences?.push_notifications || false,
    },
  })

  async function onProfileSubmit(values: ProfileFormValues) {
    const { error } = await updateProfile({
      full_name: values.fullName,
      username: values.username,
      bio: values.bio,
    })

    if (error) {
      profileForm.setError('root', {
        message: error.message,
      })
    } else {
      profileForm.reset(values)
    }
  }

  async function onPreferencesSubmit(values: PreferencesFormValues) {
    const { error } = await updatePreferences({
      theme: values.theme,
      language: values.language,
      timezone: values.timezone,
      email_notifications: values.emailNotifications,
      push_notifications: values.pushNotifications,
    })

    if (error) {
      preferencesForm.setError('root', {
        message: error.message,
      })
    } else {
      preferencesForm.reset(values)
    }
  }

  if (!user) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Please sign in to view your profile</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          User Profile
        </CardTitle>
        <CardDescription>Manage your profile and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.profile?.avatar_url || undefined} />
                <AvatarFallback>
                  {user.profile?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user.profile?.full_name || 'Unknown User'}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="outline" className="mt-1">{user.role?.name}</Badge>
              </div>
            </div>

            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormDescription>This will be displayed on your profile</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose a username" {...field} />
                      </FormControl>
                      <FormDescription>Your unique username</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Brief description about yourself</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {profileForm.formState.errors.root && (
                  <FormMessage>{profileForm.formState.errors.root.message}</FormMessage>
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Form {...preferencesForm}>
              <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-4">
                <FormField
                  control={preferencesForm.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Theme
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose your preferred theme</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={preferencesForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Language
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your language" {...field} />
                      </FormControl>
                      <FormDescription>Your preferred language</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={preferencesForm.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your timezone" {...field} />
                      </FormControl>
                      <FormDescription>Your timezone for accurate timestamps</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {preferencesForm.formState.errors.root && (
                  <FormMessage>{preferencesForm.formState.errors.root.message}</FormMessage>
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Preferences'}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Form {...preferencesForm}>
              <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-4">
                <FormField
                  control={preferencesForm.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive notifications via email
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={preferencesForm.control}
                  name="pushNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Push Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive push notifications in your browser
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {preferencesForm.formState.errors.root && (
                  <FormMessage>{preferencesForm.formState.errors.root.message}</FormMessage>
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Notifications'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
