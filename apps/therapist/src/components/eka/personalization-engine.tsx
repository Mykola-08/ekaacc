'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Sun, 
  Moon, 
  Heart, 
  Brain, 
  Sparkles,
  Settings,
  User,
  Bell,
  Eye,
  Volume2,
  Hand,
  Accessibility,
  Target,
  Zap,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/supabase-auth';
import { InView } from '@/components/motion-primitives/in-view';
import { AnimatedGroup } from '@/components/motion-primitives/animated-group';
import { TextLoop } from '@/components/motion-primitives/text-loop';

interface PersonalizationSettings {
  // Visual preferences
  theme: 'light' | 'dark' | 'auto';
  colorScheme: 'calming' | 'energizing' | 'neutral';
  fontSize: 'small' | 'medium' | 'large';
  contrast: 'normal' | 'high' | 'low';
  
  // Behavioral preferences
  notificationFrequency: 'minimal' | 'balanced' | 'frequent';
  dashboardLayout: 'compact' | 'standard' | 'detailed';
  contentDensity: 'minimal' | 'balanced' | 'comprehensive';
  
  // Accessibility preferences
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  highContrastMode: boolean;
  
  // Wellness preferences
  preferredContent: string[];
  therapyStyle: 'directive' | 'supportive' | 'collaborative';
  communicationTone: 'formal' | 'friendly' | 'casual';
  
  // Adaptive features
  aiRecommendations: boolean;
  moodBasedAdaptation: boolean;
  timeBasedAdaptation: boolean;
  behavioralAdaptation: boolean;
}

interface PersonalizationEngineProps {
  className?: string;
  onSettingsChange?: (settings: PersonalizationSettings) => void;
}

const colorSchemes = {
  calming: {
    name: 'Calming',
    description: 'Soft blues and greens for relaxation',
    colors: ['bg-blue-100', 'bg-green-100', 'bg-teal-100'],
    accent: 'text-blue-600',
    icon: Heart
  },
  energizing: {
    name: 'Energizing',
    description: 'Bright colors for motivation',
    colors: ['bg-orange-100', 'bg-yellow-100', 'bg-red-100'],
    accent: 'text-orange-600',
    icon: Zap
  },
  neutral: {
    name: 'Neutral',
    description: 'Balanced tones for focus',
    colors: ['bg-gray-100', 'bg-slate-100', 'bg-zinc-100'],
    accent: 'text-gray-600',
    icon: Target
  }
};

const therapyStyles = {
  directive: {
    name: 'Directive',
    description: 'Structured guidance and clear action steps',
    icon: Target
  },
  supportive: {
    name: 'Supportive',
    description: 'Empathetic listening and emotional validation',
    icon: Heart
  },
  collaborative: {
    name: 'Collaborative',
    description: 'Working together to find solutions',
    icon: Hand
  }
};

const communicationTones = {
  formal: {
    name: 'Formal',
    description: 'Professional and structured communication',
    examples: ['Good morning', 'How may I assist you today?', 'Your session is scheduled for...']
  },
  friendly: {
    name: 'Friendly',
    description: 'Warm and approachable communication',
    examples: ['Hey there!', 'How are you feeling today?', 'Ready for your session?']
  },
  casual: {
    name: 'Casual',
    description: 'Relaxed and conversational communication',
    examples: ['Hi!', 'What\'s up?', 'Let\'s chat!']
  }
};

const PersonalizationEngine: React.FC<PersonalizationEngineProps> = ({ className, onSettingsChange }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PersonalizationSettings>({
    theme: 'auto',
    colorScheme: 'calming',
    fontSize: 'medium',
    contrast: 'normal',
    notificationFrequency: 'balanced',
    dashboardLayout: 'standard',
    contentDensity: 'balanced',
    reducedMotion: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
    highContrastMode: false,
    preferredContent: ['mindfulness', 'exercises', 'education'],
    therapyStyle: 'supportive',
    communicationTone: 'friendly',
    aiRecommendations: true,
    moodBasedAdaptation: true,
    timeBasedAdaptation: true,
    behavioralAdaptation: true
  });

  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<string | null>(null);

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('personalization-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading personalization settings:', error);
      }
    }
  }, []);

  // Save settings
  const saveSettings = useCallback(async () => {
    try {
      setSaving(true);
      localStorage.setItem('personalization-settings', JSON.stringify(settings));
      
      // Apply settings immediately
      applySettings(settings);
      
      // Notify parent component
      onSettingsChange?.(settings);
      
      // Save to user profile if authenticated
      if (user) {
        // This would typically call an API to save to user profile
        console.log('Saving personalization settings to user profile:', settings);
      }
    } catch (error) {
      console.error('Error saving personalization settings:', error);
    } finally {
      setSaving(false);
    }
  }, [settings, user, onSettingsChange]);

  // Apply settings to the application
  const applySettings = (newSettings: PersonalizationSettings) => {
    // Apply theme
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    if (newSettings.theme === 'dark' || (newSettings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
    if (newSettings.highContrastMode) {
      document.documentElement.classList.add('high-contrast');
    }

    // Apply font size
    document.documentElement.style.setProperty('--font-size-scale', 
      newSettings.fontSize === 'small' ? '0.875' : 
      newSettings.fontSize === 'large' ? '1.125' : '1'
    );

    // Apply reduced motion
    if (newSettings.reducedMotion) {
      document.documentElement.style.setProperty('--motion-duration', '0.1s');
      document.documentElement.style.setProperty('--motion-easing', 'linear');
    } else {
      document.documentElement.style.removeProperty('--motion-duration');
      document.documentElement.style.removeProperty('--motion-easing');
    }

    // Apply color scheme
    document.documentElement.style.setProperty('--color-scheme', newSettings.colorScheme);
  };

  // Update individual setting
  const updateSetting = (key: keyof PersonalizationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Toggle array setting
  const toggleArraySetting = (key: keyof PersonalizationSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value)
        ? (prev[key] as string[]).filter(item => item !== value)
        : [...(prev[key] as string[]), value]
    }));
  };

  const SettingCard: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    children: React.ReactNode;
    preview?: string;
  }> = ({ title, description, icon: Icon, children, preview }) => (
    <InView>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, opacity: 0.95 }}
        className="relative group"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '200% 200%'
          }}
        />
        
        <Card className="relative bg-background/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 5, opacity: 0.9 }}
                  className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                >
                  <Icon className="w-5 h-5 text-blue-600" />
                </motion.div>
                <div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
              </div>
              {preview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(preview)}
                  className="hover:bg-white/20"
                >
                  Preview
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </motion.div>
    </InView>
  );

  const ColorSchemeSelector = () => (
    <SettingCard
      title="Color Scheme"
      description="Choose colors that match your mood and preferences"
      icon={Palette}
    >
      <div className="grid gap-3">
        {Object.entries(colorSchemes).map(([key, scheme]) => {
          const Icon = scheme.icon;
          return (
            <motion.button
              key={key}
              whileHover={{ y: -2, opacity: 0.95 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateSetting('colorScheme', key)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                settings.colorScheme === key
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-border hover:border-blue-300"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn("p-2 rounded-full", scheme.colors[0])}>
                  <Icon className={cn("w-4 h-4", scheme.accent)} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{scheme.name}</div>
                  <div className="text-sm text-muted-foreground">{scheme.description}</div>
                </div>
                {settings.colorScheme === key && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </SettingCard>
  );

  const AccessibilitySettings = () => (
    <SettingCard
      title="Accessibility"
      description="Customize the interface for your needs"
      icon={Accessibility}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Reduced Motion</div>
            <div className="text-sm text-muted-foreground">Minimize animations and transitions</div>
          </div>
          <Switch
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">High Contrast Mode</div>
            <div className="text-sm text-muted-foreground">Enhanced contrast for better visibility</div>
          </div>
          <Switch
            checked={settings.highContrastMode}
            onCheckedChange={(checked) => updateSetting('highContrastMode', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Screen Reader Optimized</div>
            <div className="text-sm text-muted-foreground">Enhanced compatibility with screen readers</div>
          </div>
          <Switch
            checked={settings.screenReaderOptimized}
            onCheckedChange={(checked) => updateSetting('screenReaderOptimized', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Keyboard Navigation</div>
            <div className="text-sm text-muted-foreground">Enhanced keyboard shortcuts and navigation</div>
          </div>
          <Switch
            checked={settings.keyboardNavigation}
            onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
          />
        </div>
      </div>
    </SettingCard>
  );

  const TherapyStyleSelector = () => (
    <SettingCard
      title="Therapy Style Preference"
      description="How do you prefer to work with your therapist?"
      icon={Brain}
    >
      <div className="grid gap-3">
        {Object.entries(therapyStyles).map(([key, style]) => {
          const Icon = style.icon;
          return (
            <motion.button
              key={key}
              whileHover={{ y: -2, opacity: 0.95 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateSetting('therapyStyle', key)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                settings.therapyStyle === key
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-border hover:border-blue-300"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Icon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{style.name}</div>
                  <div className="text-sm text-muted-foreground">{style.description}</div>
                </div>
                {settings.therapyStyle === key && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </SettingCard>
  );

  const AIAdaptationSettings = () => (
    <SettingCard
      title="AI Adaptation"
      description="Let AI personalize your experience based on your behavior"
      icon={Sparkles}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">AI Recommendations</div>
            <div className="text-sm text-muted-foreground">Personalized content and suggestions</div>
          </div>
          <Switch
            checked={settings.aiRecommendations}
            onCheckedChange={(checked) => updateSetting('aiRecommendations', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Mood-Based Adaptation</div>
            <div className="text-sm text-muted-foreground">Adjust interface based on your mood</div>
          </div>
          <Switch
            checked={settings.moodBasedAdaptation}
            onCheckedChange={(checked) => updateSetting('moodBasedAdaptation', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Time-Based Adaptation</div>
            <div className="text-sm text-muted-foreground">Adjust based on time of day and patterns</div>
          </div>
          <Switch
            checked={settings.timeBasedAdaptation}
            onCheckedChange={(checked) => updateSetting('timeBasedAdaptation', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Behavioral Adaptation</div>
            <div className="text-sm text-muted-foreground">Learn from your usage patterns</div>
          </div>
          <Switch
            checked={settings.behavioralAdaptation}
            onCheckedChange={(checked) => updateSetting('behavioralAdaptation', checked)}
          />
        </div>
      </div>
    </SettingCard>
  );

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <InView>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"
          >
            <Settings className="w-8 h-8 text-blue-600" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Personalization Engine
            </h2>
            <p className="text-muted-foreground mt-2">
              Customize your experience to match your unique needs and preferences
            </p>
          </div>
        </motion.div>
      </InView>

      {/* Settings Grid */}
      <AnimatedGroup className="grid gap-6 md:grid-cols-2">
        <ColorSchemeSelector />
        <AccessibilitySettings />
        <TherapyStyleSelector />
        <AIAdaptationSettings />
      </AnimatedGroup>

      {/* Save Button */}
      <InView>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={saveSettings}
            disabled={saving}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Save Personalization Settings
              </>
            )}
          </Button>
        </motion.div>
      </InView>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewMode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Preview: {previewMode}</h3>
              <p className="text-muted-foreground mb-4">
                This is how the {previewMode} setting would look in your interface.
              </p>
              <Button onClick={() => setPreviewMode(null)} className="w-full">
                Close Preview
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalizationEngine;