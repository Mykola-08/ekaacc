'use client';

import React, { useState } from 'react';
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Switch,
  Field,
  Label,
} from '@headlessui/react';
import { User as UserIcon, Bell, Lock, CreditCard, Shield, Globe, Moon, Save } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  initials?: string;
  user_metadata?: any;
  settings?: any;
}

interface SettingsContentProps {
  currentUser: User;
}

export function SettingsContentHeadless({ currentUser }: SettingsContentProps) {
  const [formData, setFormData] = useState({
    fullName: currentUser.name || '',
    email: currentUser.email || '',
    bio: currentUser.user_metadata?.bio || '',
    language: 'en',
    timezone: 'UTC',
    marketingEmails: true,
    securityEmails: true,
    activityEmails: false,
    publicProfile: false,
    darkMode: false,
  });

  const categories = [
    { name: 'Profile', icon: UserIcon },
    { name: 'Notifications', icon: Bell },
    { name: 'Security', icon: Lock },
    { name: 'Preferences', icon: Globe },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-7xl space-y-8 duration-500">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-4xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your account preferences and settings.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          <Save className="h-5 w-5" />
          <span>Save Changes</span>
        </button>
      </div>

      <TabGroup>
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar / Tab List */}
          <div className="col-span-12 md:col-span-3">
            <TabList className="flex flex-col space-y-2">
              {categories.map(({ name, icon: Icon }) => (
                <Tab
                  key={name}
                  className={({ selected }) =>
                    cn(
                      'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 outline-none',
                      selected
                        ? 'bg-primary/5 text-primary shadow-sm ring-1 ring-primary/10'
                        : 'text-muted-foreground hover:bg-card hover:text-foreground'
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {name}
                </Tab>
              ))}
            </TabList>
          </div>

          {/* Content / Tab Panels */}
          <div className="col-span-12 md:col-span-9">
            <TabPanels>
              {/* Profile Panel */}
              <TabPanel className="bg-card rounded-lg p-8 shadow-sm ring-1 ring-border outline-none">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-foreground text-xl font-semibold">Personal Information</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Update your photo and personal details.
                    </p>
                  </div>

                  <div className="flex items-center gap-6 border-b border-border pb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                      {currentUser.initials || 'U'}
                    </div>
                    <div className="space-y-2">
                      <button className="bg-card border-border text-foreground/90 hover:bg-muted/30 rounded-xl border px-4 py-2 text-sm font-medium transition-colors">
                        Change photo
                      </button>
                      <p className="text-muted-foreground/80 text-xs">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="fullName"
                        className="text-foreground/90 block text-sm font-medium"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="border-border bg-muted/30 text-foreground block w-full rounded-lg p-3 focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-foreground/90 block text-sm font-medium"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-border bg-muted/30 text-foreground block w-full rounded-lg p-3 focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label htmlFor="bio" className="text-foreground/90 block text-sm font-medium">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="border-border bg-muted/30 text-foreground block w-full rounded-lg p-3 focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="Write a few sentences about yourself."
                      />
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Notifications Panel */}
              <TabPanel className="bg-card rounded-lg p-8 shadow-sm ring-1 ring-border outline-none">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-foreground text-xl font-semibold">Notifications</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Manage how you want to be notified.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <Field className="flex items-center justify-between">
                      <span className="flex flex-col">
                        <Label className="text-foreground text-sm font-medium">
                          Marketing emails
                        </Label>
                        <span className="text-muted-foreground text-sm">
                          Receive emails about new products, features, and more.
                        </span>
                      </span>
                      <Switch
                        checked={formData.marketingEmails}
                        onChange={() => handleToggle('marketingEmails')}
                        className={cn(
                          formData.marketingEmails ? 'bg-primary' : 'bg-muted',
                          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            formData.marketingEmails ? 'translate-x-5' : 'translate-x-0',
                            'bg-card pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out'
                          )}
                        />
                      </Switch>
                    </Field>
                    <div className="border-t border-border" />
                    <Field className="flex items-center justify-between">
                      <span className="flex flex-col">
                        <Label className="text-foreground text-sm font-medium">
                          Security emails
                        </Label>
                        <span className="text-muted-foreground text-sm">
                          Receive emails about your account security.
                        </span>
                      </span>
                      <Switch
                        checked={formData.securityEmails}
                        onChange={() => handleToggle('securityEmails')}
                        className={cn(
                          formData.securityEmails ? 'bg-primary' : 'bg-muted',
                          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            formData.securityEmails ? 'translate-x-5' : 'translate-x-0',
                            'bg-card pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out'
                          )}
                        />
                      </Switch>
                    </Field>
                    <div className="border-t border-border" />
                    <Field className="flex items-center justify-between">
                      <span className="flex flex-col">
                        <Label className="text-foreground text-sm font-medium">
                          Activity emails
                        </Label>
                        <span className="text-muted-foreground text-sm">
                          Receive emails about your activity on the platform.
                        </span>
                      </span>
                      <Switch
                        checked={formData.activityEmails}
                        onChange={() => handleToggle('activityEmails')}
                        className={cn(
                          formData.activityEmails ? 'bg-primary' : 'bg-muted',
                          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            formData.activityEmails ? 'translate-x-5' : 'translate-x-0',
                            'bg-card pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out'
                          )}
                        />
                      </Switch>
                    </Field>
                  </div>
                </div>
              </TabPanel>

              {/* Security Panel */}
              <TabPanel className="bg-card rounded-lg p-8 shadow-sm ring-1 ring-border outline-none">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-foreground text-xl font-semibold">Security</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Update your password and security settings.
                    </p>
                  </div>

                  <div className="max-w-md space-y-6">
                    <div className="space-y-2">
                      <label className="text-foreground/90 block text-sm font-medium">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="border-border bg-muted/30 block w-full rounded-xl p-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-foreground/90 block text-sm font-medium">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="border-border bg-muted/30 block w-full rounded-xl p-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-foreground/90 block text-sm font-medium">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="border-border bg-muted/30 block w-full rounded-xl p-3"
                      />
                    </div>
                    <button className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
                      Update Password
                    </button>
                  </div>
                </div>
              </TabPanel>

              {/* Preferences Panel */}
              <TabPanel className="bg-card rounded-lg p-8 shadow-sm ring-1 ring-border outline-none">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-foreground text-xl font-semibold">Preferences</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Customize your experience.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="language"
                        className="text-foreground/90 block text-sm font-medium"
                      >
                        Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="border-border bg-muted/30 text-foreground block w-full rounded-lg p-3 focus:border-primary focus:ring-primary sm:text-sm"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="timezone"
                        className="text-foreground/90 block text-sm font-medium"
                      >
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="border-border bg-muted/30 text-foreground block w-full rounded-lg p-3 focus:border-primary focus:ring-primary sm:text-sm"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                      </select>
                    </div>
                    <div className="col-span-full border-t border-border pt-4">
                      <Field className="flex items-center justify-between">
                        <span className="flex flex-col">
                          <Label className="text-foreground text-sm font-medium">Dark Mode</Label>
                          <span className="text-muted-foreground text-sm">
                            Switch between light and dark themes.
                          </span>
                        </span>
                        <Switch
                          checked={formData.darkMode}
                          onChange={() => handleToggle('darkMode')}
                          className={cn(
                            formData.darkMode ? 'bg-primary' : 'bg-muted',
                            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              formData.darkMode ? 'translate-x-5' : 'translate-x-0',
                              'bg-card pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                      </Field>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </div>
        </div>
      </TabGroup>
    </div>
  );
}
