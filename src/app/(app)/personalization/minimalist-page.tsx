'use client';

import React, { useState } from 'react';
import { Sparkles, User, Settings, Heart, Brain, Palette, Bell, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useAdaptiveInterface } from '@/hooks/use-adaptive-interface';
import PersonalizationEngine from '@/components/eka/personalization-engine';

export default function PersonalizationPage() {
  const router = useRouter();
  const { settings, adaptiveState, saveSettings } = useAdaptiveInterface();
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async (newSettings: any) => {
    try {
      setSaving(true);
      await saveSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const personalizationSections = [
    {
      id: 'visual',
      name: 'Visual Preferences',
      icon: Palette,
      description: 'Customize colors, themes, and visual elements',
      progress: 75,
      status: 'configured'
    },
    {
      id: 'behavioral',
      name: 'Behavioral Preferences',
      icon: Brain,
      description: 'Adapt content and interactions to your style',
      progress: 60,
      status: 'partial'
    },
    {
      id: 'accessibility',
      name: 'Accessibility',
      icon: Settings,
      description: 'Configure accessibility features and accommodations',
      progress: 90,
      status: 'configured'
    },
    {
      id: 'wellness',
      name: 'Wellness Preferences',
      icon: Heart,
      description: 'Personalize your therapy and wellness experience',
      progress: 45,
      status: 'partial'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Manage notification preferences',
      progress: 85,
      status: 'configured'
    },
    {
      id: 'privacy',
      name: 'Privacy & Security',
      icon: Shield,
      description: 'Control your data and privacy settings',
      progress: 95,
      status: 'configured'
    }
  ];

  const overallProgress = personalizationSections.reduce((acc, section) => acc + section.progress, 0) / personalizationSections.length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Personalization Center</h1>
            <p className="text-muted-foreground">Customize your therapy platform experience</p>
          </div>
          <Badge variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>

        <Separator />

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Personalization Progress</CardTitle>
                <CardDescription>Your personalization journey is {Math.round(overallProgress)}% complete</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Completion</span>
              <span className="text-2xl font-bold">{Math.round(overallProgress)}%</span>
            </div>
            
            <Progress value={overallProgress} className="h-3" />
            
            <div className="grid md:grid-cols-2 gap-4 pt-4">
              {personalizationSections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{section.name}</span>
                    <Badge variant="outline">
                      {section.progress}%
                    </Badge>
                  </div>
                  <Progress value={section.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle>Welcome to Your Personalization Journey</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  This personalization center helps you customize every aspect of your therapy platform experience. 
                  Our AI system learns from your preferences and behavior to create a truly personalized environment.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  {personalizationSections.map((section) => (
                    <Card key={section.id}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <section.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{section.name}</CardTitle>
                            <CardDescription className="text-sm">{section.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Progress value={section.progress} className="h-2 flex-1 mr-4" />
                          <span className="text-sm font-medium">{section.progress}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-primary" />
                  <CardTitle>Visual Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <PersonalizationEngine onSettingsChange={handleSaveSettings} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavioral" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-primary" />
                  <CardTitle>Behavioral Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <PersonalizationEngine onSettingsChange={handleSaveSettings} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary" />
                  <CardTitle>Accessibility</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <PersonalizationEngine onSettingsChange={handleSaveSettings} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-primary" />
                  <CardTitle>Wellness Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <PersonalizationEngine onSettingsChange={handleSaveSettings} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <CardTitle>AI Features</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <PersonalizationEngine onSettingsChange={handleSaveSettings} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
