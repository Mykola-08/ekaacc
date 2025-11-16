'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, User, Settings, Heart, Brain, Palette, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { useAdaptiveInterface } from '@/hooks/use-adaptive-interface';
import PersonalizationEngine from '@/components/eka/personalization-engine';
import { InView } from '@/components/motion-primitives/in-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function PersonalizationPage() {
  const router = useRouter();
  const { settings, adaptiveState, saveSettings } = useAdaptiveInterface();
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async (newSettings: any) => {
    try {
      setSaving(true);
      await saveSettings(newSettings);
      // Show success message or notification
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
      description: 'Control how and when you receive updates',
      progress: 80,
      status: 'configured'
    },
    {
      id: 'privacy',
      name: 'Privacy & Security',
      icon: Shield,
      description: 'Manage your data and privacy settings',
      progress: 100,
      status: 'configured'
    }
  ];

  const overallProgress = personalizationSections.reduce((acc, section) => acc + section.progress, 0) / personalizationSections.length;

  return (
    <div className="apple-page">
      <div className="apple-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="apple-mb-12"
        >
          <div className="apple-flex-between">
            <div className="apple-flex apple-items-center apple-gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="apple-hover-lift"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="apple-title-section">
                  Personalization Center
                </h1>
                <p className="apple-text-body">
                  Customize your therapy platform experience
                </p>
              </div>
            </div>
            <div className="hidden sm:flex apple-items-center apple-gap-3">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="apple-card-icon apple-card-icon-blue"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <Badge variant="outline" className="apple-text-xs">
                AI Powered
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <InView>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="apple-mb-12"
          >
            <Card className="apple-card apple-card-blue">
              <CardHeader>
                <CardTitle className="apple-flex apple-items-center apple-gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Personalization Progress</span>
                </CardTitle>
                <CardDescription className="apple-text-body">
                  Your personalization journey is {Math.round(overallProgress)}% complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="apple-space-y-6">
                  <div className="apple-flex-between">
                    <span className="apple-text-sm apple-font-medium">Overall Completion</span>
                    <span className="apple-text-sm apple-font-semibold">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-3 apple-rounded-full" />
                  <div className="apple-grid-2 apple-mt-6">
                    {personalizationSections.map((section) => (
                      <div key={section.id} className="apple-space-y-3">
                        <div className="apple-flex-between">
                          <span className="apple-text-sm apple-font-medium">{section.name}</span>
                          <Badge variant="outline" className="apple-text-xs">
                            {section.progress}%
                          </Badge>
                        </div>
                        <Progress value={section.progress} className="h-2 apple-rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </InView>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="apple-space-y-8">
          <TabsList className="apple-grid apple-grid-cols-2 md:apple-grid-cols-4 lg:apple-grid-cols-6 apple-gap-2">
            <TabsTrigger value="overview" className="apple-text-xs md:apple-text-sm">Overview</TabsTrigger>
            <TabsTrigger value="visual" className="apple-text-xs md:apple-text-sm">Visual</TabsTrigger>
            <TabsTrigger value="behavioral" className="apple-text-xs md:apple-text-sm">Behavioral</TabsTrigger>
            <TabsTrigger value="accessibility" className="apple-text-xs md:apple-text-sm">Accessibility</TabsTrigger>
            <TabsTrigger value="wellness" className="apple-text-xs md:apple-text-sm">Wellness</TabsTrigger>
            <TabsTrigger value="ai" className="apple-text-xs md:apple-text-sm">AI Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="apple-space-y-8">
            <InView>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="apple-card apple-card-subtle">
                  <CardHeader>
                    <CardTitle className="apple-flex apple-items-center apple-gap-3">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span>Welcome to Your Personalization Journey</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="apple-space-y-6">
                    <p className="apple-text-body">
                      This personalization center helps you customize every aspect of your therapy platform experience. 
                      Our AI system learns from your preferences and behavior to create a truly personalized environment.
                    </p>
                    
                    <div className="apple-grid-2">
                      <div className="apple-card apple-card-blue apple-p-6">
                        <h4 className="apple-title-card apple-mb-3">Smart Adaptation</h4>
                        <p className="apple-text-caption">
                          The platform adapts to your mood, time of day, and usage patterns automatically.
                        </p>
                      </div>
                      
                      <div className="apple-card apple-card-green apple-p-6">
                        <h4 className="apple-title-card apple-mb-3">Privacy First</h4>
                        <p className="apple-text-caption">
                          All personalization data is encrypted and stored securely. You control everything.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </InView>

            <div className="apple-grid-3">
              {personalizationSections.map((section) => {
                const Icon = section.icon;
                return (
                  <InView key={section.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card 
                        className="apple-card apple-hover-lift apple-cursor-pointer"
                        onClick={() => setActiveTab(section.id)}
                      >
                        <CardHeader>
                          <div className="apple-flex-between">
                            <div className="apple-flex apple-items-center apple-gap-4">
                              <div className="apple-card-icon apple-card-icon-blue">
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <CardTitle className="apple-title-card">{section.name}</CardTitle>
                                <CardDescription className="apple-text-caption">{section.description}</CardDescription>
                              </div>
                            </div>
                            <Badge 
                              variant={section.status === 'configured' ? 'default' : 'secondary'}
                              className="apple-text-xs"
                            >
                              {section.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="apple-space-y-3">
                            <div className="apple-flex-between">
                              <span className="apple-text-sm apple-font-medium">Progress</span>
                              <span className="apple-text-sm apple-font-semibold">{section.progress}%</span>
                            </div>
                            <Progress value={section.progress} className="h-2 apple-rounded-full" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </InView>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="visual" className="space-y-6">
            <InView>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PersonalizationEngine onSettingsChange={handleSaveSettings} />
              </motion.div>
            </InView>
          </TabsContent>

          <TabsContent value="behavioral" className="space-y-6">
            <InView>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span>Behavioral Preferences</span>
                    </CardTitle>
                    <CardDescription>
                      Customize how the platform adapts to your behavior and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
                        <h4 className="font-semibold mb-2">Adaptive Features</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Our AI system can adapt the interface based on your mood, time of day, and usage patterns.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>Mood-based color scheme adaptation</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>Time-based interface adjustments</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            <span>Behavioral pattern recognition</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Button 
                          variant="outline" 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:from-purple-700 hover:to-pink-700"
                        >
                          Configure Behavioral Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </InView>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <InView>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <span>Accessibility Settings</span>
                    </CardTitle>
                    <CardDescription>
                      Configure accessibility features to meet your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
                        <h4 className="font-semibold mb-2">Available Features</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>Screen reader optimization</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>High contrast mode</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            <span>Keyboard navigation enhancement</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full" />
                            <span>Reduced motion options</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Button 
                          variant="outline" 
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:to-indigo-700"
                        >
                          Open Accessibility Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </InView>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <InView>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-green-600" />
                      <span>Wellness Preferences</span>
                    </CardTitle>
                    <CardDescription>
                      Personalize your therapy and wellness experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-teal-50 border border-green-200/50">
                        <h4 className="font-semibold mb-2">Therapy Style</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Choose how you prefer to work with your therapist:
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>Directive: Structured guidance</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full" />
                            <span>Supportive: Empathetic listening</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>Collaborative: Working together</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Button 
                          variant="outline" 
                          className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-0 hover:from-green-700 hover:to-teal-700"
                        >
                          Configure Wellness Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </InView>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <InView>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span>AI Features & Adaptation</span>
                    </CardTitle>
                    <CardDescription>
                      Control how AI personalizes your experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
                        <h4 className="font-semibold mb-2">AI Adaptation Features</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Our AI system can adapt various aspects of your experience:
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            <span>Mood-based interface adjustments</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-pink-500 rounded-full" />
                            <span>Time-based content recommendations</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                            <span>Behavioral pattern recognition</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>Predictive wellness insights</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Button 
                          variant="outline" 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:from-purple-700 hover:to-pink-700"
                        >
                          Configure AI Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </InView>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}