import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { BehavioralTrackingService } from '@/services/behavioral-tracking-service';

export interface AdaptiveSettings {
  theme: 'light' | 'dark' | 'auto';
  colorScheme: 'calming' | 'energizing' | 'neutral';
  fontSize: 'small' | 'medium' | 'large';
  contrast: 'normal' | 'high' | 'low';
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  highContrastMode: boolean;
  notificationFrequency: 'minimal' | 'balanced' | 'frequent';
  dashboardLayout: 'compact' | 'standard' | 'detailed';
  contentDensity: 'minimal' | 'balanced' | 'comprehensive';
  aiRecommendations: boolean;
  moodBasedAdaptation: boolean;
  timeBasedAdaptation: boolean;
  behavioralAdaptation: boolean;
  therapyStyle: 'directive' | 'supportive' | 'collaborative';
  communicationTone: 'formal' | 'friendly' | 'casual';
  preferredContent: string[];
}

export interface AdaptiveState {
  currentTheme: string;
  currentColorScheme: string;
  currentLayout: string;
  currentContentDensity: string;
  recommendedActions: string[];
  adaptiveMessages: string[];
  uiModifications: Record<string, any>;
  isAdaptiveMode: boolean;
}

export const useAdaptiveInterface = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const behavioralService = useMemo(() => BehavioralTrackingService.getInstance(), []);

  // Define default settings and state
  const getDefaultSettings = useCallback((): AdaptiveSettings => ({
    theme: 'auto',
    colorScheme: 'calming',
    fontSize: 'medium',
    contrast: 'normal',
    reducedMotion: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
    highContrastMode: false,
    notificationFrequency: 'balanced',
    dashboardLayout: 'standard',
    contentDensity: 'balanced',
    aiRecommendations: true,
    moodBasedAdaptation: true,
    timeBasedAdaptation: true,
    behavioralAdaptation: true,
    therapyStyle: 'supportive',
    communicationTone: 'friendly',
    preferredContent: ['mindfulness', 'exercises', 'education']
  }), []);

  const getDefaultAdaptiveState = useCallback((): AdaptiveState => ({
    currentTheme: 'light',
    currentColorScheme: 'calming',
    currentLayout: 'standard',
    currentContentDensity: 'balanced',
    recommendedActions: [],
    adaptiveMessages: [],
    uiModifications: {},
    isAdaptiveMode: false
  }), []);

  const [settings, setSettings] = useState<AdaptiveSettings>(getDefaultSettings());
  const [adaptiveState, setAdaptiveState] = useState<AdaptiveState>(getDefaultAdaptiveState());

  // Define all functions before they are used
  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load from localStorage
      const savedSettings = localStorage.getItem('personalization-settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Error parsing saved settings:', error);
        }
      }

      // Load from user profile if authenticated
      if (user) {
        // This would typically call an API to get user settings
        // For now, we'll use localStorage as the primary source
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveSettings = useCallback(async (newSettings: Partial<AdaptiveSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      
      // Save to localStorage
      localStorage.setItem('personalization-settings', JSON.stringify(updatedSettings));
      
      // Save to user profile if authenticated
      if (user) {
        // This would typically call an API to save user settings
        console.log('Saving adaptive settings to user profile:', updatedSettings);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings, user]);

  const applyMoodBasedAdaptations = useCallback(async () => {
    if (!user) return;

    try {
      // Get recent mood data
      const behavioralData = await behavioralService.getUserBehavioralInsights(user.id);
      const recentMoodInteractions = behavioralData.recentInteractions
        .filter(i => i.interaction_type === 'mood_logged')
        .slice(0, 7); // Last 7 mood logs

      if (recentMoodInteractions.length === 0) return;

      // Analyze mood patterns
      const moodCounts: Record<string, number> = {};
      recentMoodInteractions.forEach(interaction => {
        const mood = interaction.metadata?.mood || 'neutral';
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      });

      const dominantMood = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0][0];

      // Adapt based on dominant mood
      let newColorScheme = settings.colorScheme;
      let newLayout = settings.dashboardLayout;
      const messages: string[] = [];

      switch (dominantMood) {
        case 'sad':
        case 'depressed':
          newColorScheme = 'calming';
          newLayout = 'compact';
          messages.push('We\'ve switched to a calming interface to help you feel more comfortable.');
          break;
        case 'anxious':
        case 'stressed':
          newColorScheme = 'calming';
          newLayout = 'compact';
          messages.push('Your interface has been simplified to reduce visual stress.');
          break;
        case 'happy':
        case 'content':
          newColorScheme = 'energizing';
          newLayout = 'detailed';
          messages.push('Great mood! We\'ve enabled more features for you to explore.');
          break;
        case 'excited':
        case 'motivated':
          newColorScheme = 'energizing';
          newLayout = 'detailed';
          messages.push('Your energy is high! We\'ve added more interactive elements.');
          break;
        default:
          newColorScheme = 'neutral';
          newLayout = 'standard';
      }

      setAdaptiveState(prev => ({
        ...prev,
        currentColorScheme: newColorScheme,
        currentLayout: newLayout,
        adaptiveMessages: messages
      }));
    } catch (error) {
      console.error('Error applying mood-based adaptations:', error);
    }
  }, [user, settings.colorScheme, settings.dashboardLayout, behavioralService]);

  const applyTimeBasedAdaptations = useCallback(async () => {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    let newTheme = settings.theme;
    let newContentDensity = settings.contentDensity;
    const messages: string[] = [];

    // Time of day adaptations
    if (hour < 6 || hour > 22) {
      // Night time
      newTheme = 'dark';
      newContentDensity = 'minimal';
      messages.push('Night mode activated for comfortable viewing.');
    } else if (hour < 9) {
      // Morning
      newTheme = settings.theme === 'auto' ? 'light' : settings.theme;
      newContentDensity = 'balanced';
      messages.push('Good morning! Your dashboard is ready for the day.');
    } else if (hour > 17) {
      // Evening
      newTheme = 'dark';
      newContentDensity = 'balanced';
      messages.push('Evening mode: easier on the eyes for nighttime use.');
    }

    // Weekend adaptations
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      messages.push('Weekend mode: more time for self-care activities.');
    }

    setAdaptiveState(prev => ({
      ...prev,
      currentTheme: newTheme,
      currentContentDensity: newContentDensity,
      adaptiveMessages: [...prev.adaptiveMessages, ...messages]
    }));
  }, [settings.theme, settings.contentDensity]);

  const applyBehavioralAdaptations = useCallback(async () => {
    if (!user) return;

    try {
      const behavioralData = await behavioralService.getUserBehavioralInsights(user.id);
      
      // Analyze engagement patterns
      const recentInteractions = behavioralData.recentInteractions.slice(0, 30);
      const sessionFrequency = behavioralData.patterns.filter(p => 
        p.pattern_type === 'session_frequency_drop'
      ).length;
      
      const engagementDecline = behavioralData.patterns.filter(p => 
        p.pattern_type === 'engagement_decline'
      ).length;

      const messages: string[] = [];
      const actions: string[] = [];

      if (sessionFrequency > 0) {
        messages.push('We noticed you haven\'t had sessions recently. Everything okay?');
        actions.push('Schedule a check-in session');
      }

      if (engagementDecline > 0) {
        messages.push('Your engagement has decreased. Let\'s make things more interesting.');
        actions.push('Try a new activity or exercise');
      }

      // Check for positive patterns
      const positiveProgress = behavioralData.patterns.filter(p => 
        p.pattern_type === 'positive_progress'
      ).length;

      if (positiveProgress > 0) {
        messages.push('You\'re making great progress! Keep it up! 🎉');
        actions.push('Celebrate your achievements');
      }

      setAdaptiveState(prev => ({
        ...prev,
        recommendedActions: actions,
        adaptiveMessages: [...prev.adaptiveMessages, ...messages]
      }));
    } catch (error) {
      console.error('Error applying behavioral adaptations:', error);
    }
  }, [user, behavioralService]);

  const applyVisualAdaptations = useCallback(() => {
    // Apply theme
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    if (adaptiveState.currentTheme === 'dark' || 
        (adaptiveState.currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
    if (settings.highContrastMode) {
      document.documentElement.classList.add('high-contrast');
    }

    // Apply font size
    const fontSizeScale = settings.fontSize === 'small' ? '0.875' : 
                         settings.fontSize === 'large' ? '1.125' : '1';
    document.documentElement.style.setProperty('--font-size-scale', fontSizeScale);

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.style.setProperty('--motion-duration', '0.1s');
      document.documentElement.style.setProperty('--motion-easing', 'linear');
    } else {
      document.documentElement.style.removeProperty('--motion-duration');
      document.documentElement.style.removeProperty('--motion-easing');
    }

    // Apply color scheme
    document.documentElement.setAttribute('data-color-scheme', adaptiveState.currentColorScheme);
  }, [adaptiveState.currentTheme, adaptiveState.currentColorScheme, settings]);

  const applyAdaptiveFeatures = useCallback(async () => {
    if (!settings.aiRecommendations && !settings.moodBasedAdaptation && 
        !settings.timeBasedAdaptation && !settings.behavioralAdaptation) {
      setAdaptiveState(prev => ({ ...prev, isAdaptiveMode: false }));
      return;
    }

    setAdaptiveState(prev => ({ ...prev, isAdaptiveMode: true }));

    // Apply mood-based adaptations
    if (settings.moodBasedAdaptation && user) {
      await applyMoodBasedAdaptations();
    }

    // Apply time-based adaptations
    if (settings.timeBasedAdaptation) {
      await applyTimeBasedAdaptations();
    }

    // Apply behavioral adaptations
    if (settings.behavioralAdaptation && user) {
      await applyBehavioralAdaptations();
    }

    // Apply theme and visual adaptations
    applyVisualAdaptations();
  }, [settings, user, applyMoodBasedAdaptations, applyTimeBasedAdaptations, applyBehavioralAdaptations, applyVisualAdaptations]);

  const getAdaptiveMessage = useCallback(() => {
    if (adaptiveState.adaptiveMessages.length === 0) return null;
    return adaptiveState.adaptiveMessages[adaptiveState.adaptiveMessages.length - 1];
  }, [adaptiveState.adaptiveMessages]);

  const dismissAdaptiveMessage = useCallback((index: number) => {
    setAdaptiveState(prev => ({
      ...prev,
      adaptiveMessages: prev.adaptiveMessages.filter((_, i) => i !== index)
    }));
  }, []);

  const getRecommendedActions = useCallback(() => {
    return adaptiveState.recommendedActions;
  }, [adaptiveState.recommendedActions]);

  const isFeatureRecommended = useCallback((featureId: string) => {
    return adaptiveState.recommendedActions.some(action => 
      action.toLowerCase().includes(featureId.toLowerCase())
    );
  }, [adaptiveState.recommendedActions]);

  const getUIModifications = useCallback(() => {
    return {
      theme: adaptiveState.currentTheme,
      colorScheme: adaptiveState.currentColorScheme,
      layout: adaptiveState.currentLayout,
      contentDensity: adaptiveState.currentContentDensity,
      fontSize: settings.fontSize,
      reducedMotion: settings.reducedMotion,
      highContrast: settings.highContrastMode,
      ...adaptiveState.uiModifications
    };
  }, [adaptiveState, settings]);

  // Load settings from localStorage and user profile
  useEffect(() => {
    loadSettings();
  }, [user, loadSettings]);

  // Apply adaptive features based on current context
  useEffect(() => {
    applyAdaptiveFeatures();
  }, [settings, user, applyAdaptiveFeatures]);

  return {
    settings,
    adaptiveState,
    isLoading,
    isAdaptiveMode: adaptiveState.isAdaptiveMode,
    
    // Methods
    saveSettings,
    loadSettings,
    getAdaptiveMessage,
    dismissAdaptiveMessage,
    getRecommendedActions,
    isFeatureRecommended,
    getUIModifications,
    applyAdaptiveFeatures
  };
};

export default useAdaptiveInterface;