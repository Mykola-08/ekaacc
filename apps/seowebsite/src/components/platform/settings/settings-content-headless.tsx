'use client';

import React, { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Switch, Field, Label } from '@headlessui/react';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your account preferences and settings.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
          <Save className="w-5 h-5" />
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
                      'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 outline-none',
                      selected
                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                        : 'text-muted-foreground hover:bg-card hover:text-foreground'
                    )
                  }
                >
                    <Icon className="w-5 h-5" />
                    {name}
                </Tab>
              ))}
            </TabList>
          </div>

          {/* Content / Tab Panels */}
          <div className="col-span-12 md:col-span-9">
            <TabPanels>
              {/* Profile Panel */}
              <TabPanel className="bg-card rounded-2xl p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 outline-none">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Personal Information</h2>
                    <p className="text-muted-foreground text-sm mt-1">Update your photo and personal details.</p>
                  </div>

                  <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                        {currentUser.initials || 'U'}
                    </div>
                    <div className="space-y-2">
                        <button className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium text-foreground/90 hover:bg-muted/30 transition-colors">
                            Change photo
                        </button>
                        <p className="text-xs text-muted-foreground/80">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="block text-sm font-medium text-foreground/90">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="block w-full rounded-xl border-border bg-muted/30 p-3 text-foreground focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-foreground/90">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full rounded-xl border-border bg-muted/30 p-3 text-foreground focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-foreground/90">Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="block w-full rounded-xl border-border bg-muted/30 p-3 text-foreground focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Write a few sentences about yourself."
                      />
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Notifications Panel */}
              <TabPanel className="bg-card rounded-2xl p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 outline-none">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Notifications</h2>
                    <p className="text-muted-foreground text-sm mt-1">Manage how you want to be notified.</p>
                  </div>

                  <div className="space-y-6">
                    <Field className="flex items-center justify-between">
                        <span className="flex flex-col">
                            <Label className="text-sm font-medium text-foreground">Marketing emails</Label>
                            <span className="text-sm text-muted-foreground">Receive emails about new products, features, and more.</span>
                        </span>
                        <Switch
                            checked={formData.marketingEmails}
                            onChange={() => handleToggle('marketingEmails')}
                            className={cn(
                                formData.marketingEmails ? 'bg-blue-600' : 'bg-gray-200',
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    formData.marketingEmails ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-card shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </Switch>
                    </Field>
                    <div className="border-t border-gray-100" />
                    <Field className="flex items-center justify-between">
                        <span className="flex flex-col">
                            <Label className="text-sm font-medium text-foreground">Security emails</Label>
                            <span className="text-sm text-muted-foreground">Receive emails about your account security.</span>
                        </span>
                        <Switch
                            checked={formData.securityEmails}
                            onChange={() => handleToggle('securityEmails')}
                            className={cn(
                                formData.securityEmails ? 'bg-blue-600' : 'bg-gray-200',
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    formData.securityEmails ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-card shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </Switch>
                    </Field>
                    <div className="border-t border-gray-100" />
                    <Field className="flex items-center justify-between">
                        <span className="flex flex-col">
                            <Label className="text-sm font-medium text-foreground">Activity emails</Label>
                            <span className="text-sm text-muted-foreground">Receive emails about your activity on the platform.</span>
                        </span>
                        <Switch
                            checked={formData.activityEmails}
                            onChange={() => handleToggle('activityEmails')}
                            className={cn(
                                formData.activityEmails ? 'bg-blue-600' : 'bg-gray-200',
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    formData.activityEmails ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-card shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </Switch>
                    </Field>
                  </div>
                </div>
              </TabPanel>

              {/* Security Panel */}
              <TabPanel className="bg-card rounded-2xl p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 outline-none">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Security</h2>
                    <p className="text-muted-foreground text-sm mt-1">Update your password and security settings.</p>
                  </div>

                  <div className="max-w-md space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground/90">Current Password</label>
                        <input type="password" className="block w-full rounded-xl border-border bg-muted/30 p-3" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground/90">New Password</label>
                        <input type="password" className="block w-full rounded-xl border-border bg-muted/30 p-3" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground/90">Confirm Password</label>
                        <input type="password" className="block w-full rounded-xl border-border bg-muted/30 p-3" />
                      </div>
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                        Update Password
                      </button>
                  </div>
                </div>
              </TabPanel>

              {/* Preferences Panel */}
              <TabPanel className="bg-card rounded-2xl p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 outline-none">
                 <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Preferences</h2>
                    <p className="text-muted-foreground text-sm mt-1">Customize your experience.</p>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label htmlFor="language" className="block text-sm font-medium text-foreground/90">Language</label>
                        <select
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            className="block w-full rounded-xl border-border bg-muted/30 p-3 text-foreground focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label htmlFor="timezone" className="block text-sm font-medium text-foreground/90">Timezone</label>
                        <select
                            id="timezone"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            className="block w-full rounded-xl border-border bg-muted/30 p-3 text-foreground focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="UTC">UTC</option>
                            <option value="EST">Eastern Time</option>
                            <option value="PST">Pacific Time</option>
                        </select>
                     </div>
                     <div className="col-span-full pt-4 border-t border-gray-100">
                        <Field className="flex items-center justify-between">
                            <span className="flex flex-col">
                                <Label className="text-sm font-medium text-foreground">Dark Mode</Label>
                                <span className="text-sm text-muted-foreground">Switch between light and dark themes.</span>
                            </span>
                            <Switch
                                checked={formData.darkMode}
                                onChange={() => handleToggle('darkMode')}
                                className={cn(
                                    formData.darkMode ? 'bg-blue-600' : 'bg-gray-200',
                                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        formData.darkMode ? 'translate-x-5' : 'translate-x-0',
                                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-card shadow ring-0 transition duration-200 ease-in-out'
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
