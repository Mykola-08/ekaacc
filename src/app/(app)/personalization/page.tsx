'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowLeft, Sparkles, User, Settings, Heart, Brain, Palette, Bell, Shield, Zap, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { useAdaptiveInterface } from '@/hooks/use-adaptive-interface';
import PersonalizationEngine from '@/components/eka/personalization-engine';
import { InView } from '@/components/motion-primitives/in-view';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const floatingVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-gradient-to-br from-purple-100/20 via-blue-100/10 to-pink-100/20 rounded-full blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 w-80 h-80 bg-gradient-to-br from-indigo-100/20 via-purple-100/10 to-violet-100/20 rounded-full blur-3xl"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-100/15 via-purple-100/10 to-pink-100/15 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20 hover:bg-white transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </motion.button>
              <div>
                <motion.h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent mb-2">
                  Personalization Center
                </motion.h1>
                <p className="text-lg text-slate-600">Customize your therapy platform experience</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-purple-200 text-purple-700">
                AI Powered
              </Badge>
            </div>
          </motion.div>

          {/* Progress Overview */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl shadow-purple-500/10 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Personalization Progress</h2>
                  <p className="text-slate-600">Your personalization journey is {Math.round(overallProgress)}% complete</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">Overall Completion</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {Math.round(overallProgress)}%
                    </span>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
                </div>
                
                <Progress value={overallProgress} className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  {personalizationSections.map((section) => (
                    <div key={section.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          <span className="font-medium text-slate-900">{section.name}</span>
                        </div>
                        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                          {section.progress}%
                        </Badge>
                      </div>
                      <Progress value={section.progress} className="h-2 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 bg-white/60 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="visual" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Visual</TabsTrigger>
            <TabsTrigger value="behavioral" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Behavioral</TabsTrigger>
            <TabsTrigger value="accessibility" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Accessibility</TabsTrigger>
            <TabsTrigger value="wellness" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Wellness</TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">AI Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={itemVariants}>
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Welcome to Your Personalization Journey</h2>
                  </div>
                  <div className="space-y-6">
                    <p className="text-lg text-slate-600 leading-relaxed">
                      This personalization center helps you customize every aspect of your therapy platform experience. 
                      Our AI system learns from your preferences and behavior to create a truly personalized environment.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="group bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-2xl p-6 border border-blue-200/50"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-900">Smart Adaptation</h4>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          The platform adapts to your mood, time of day, and usage patterns automatically.
                        </p>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="group bg-gradient-to-br from-green-50/50 to-green-100/30 rounded-2xl p-6 border border-green-200/50"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-900">Privacy First</h4>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          All personalization data is encrypted and stored securely. You control everything.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizationSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <motion.div
                      key={section.id}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      onClick={() => setActiveTab(section.id)}
                      className="group cursor-pointer bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{section.name}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{section.description}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={section.status === 'configured' ? 'default' : 'secondary'}
                          className="bg-white/80 backdrop-blur-sm"
                        >
                          {section.status}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">Progress</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {section.progress}%
                            </span>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          </div>
                        </div>
                        <Progress value={section.progress} className="h-2 rounded-full" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="visual" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={itemVariants}>
                <PersonalizationEngine onSettingsChange={handleSaveSettings} />
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="behavioral" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={itemVariants}>
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Behavioral Preferences</h2>
                      <p className="text-slate-600">Customize how the platform adapts to your behavior and preferences</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 rounded-2xl p-6 border border-purple-200/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Adaptive Features</h4>
                      </div>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        Our AI system can adapt the interface based on your mood, time of day, and usage patterns.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                          <span className="text-slate-700">Mood-based color scheme adaptation</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                          <span className="text-slate-700">Time-based interface adjustments</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                          <span className="text-slate-700">Behavioral pattern recognition</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300">
                        Configure Behavioral Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={itemVariants}>
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Accessibility Settings</h2>
                      <p className="text-slate-600">Configure accessibility features to meet your needs</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-2xl p-6 border border-blue-200/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Available Features</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                          <span className="text-slate-700">Screen reader optimization</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                          <span className="text-slate-700">High contrast mode</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                          <span className="text-slate-700">Keyboard navigation enhancement</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                          <span className="text-slate-700">Reduced motion options</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300">
                        Open Accessibility Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={itemVariants}>
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Wellness Preferences</h2>
                      <p className="text-slate-600">Personalize your therapy and wellness experience</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50/50 to-green-100/30 rounded-2xl p-6 border border-green-200/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Therapy Style</h4>
                      </div>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        Choose how you prefer to work with your therapist:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                          <span className="text-slate-700">Directive: Structured guidance</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                          <span className="text-slate-700">Supportive: Empathetic listening</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                          <span className="text-slate-700">Collaborative: Working together</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300">
                        Configure Wellness Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={itemVariants}>
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">AI Features & Adaptation</h2>
                      <p className="text-slate-600">Control how AI personalizes your experience</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 rounded-2xl p-6 border border-purple-200/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">AI Adaptation Features</h4>
                      </div>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        Our AI system can adapt various aspects of your experience:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                          <span className="text-slate-700">Mood-based interface adjustments</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                          <span className="text-slate-700">Time-based content recommendations</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                          <span className="text-slate-700">Behavioral pattern recognition</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                          <span className="text-slate-700">Predictive wellness insights</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300">
                        Configure AI Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}