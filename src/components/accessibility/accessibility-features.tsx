'use client';

import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Contrast, 
  ZoomIn, 
  ZoomOut,
  Settings,
  Accessibility,
  Keyboard,
  Palette,
  TextCursor,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Accessibility Context
interface AccessibilityContextType {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  colorBlindMode: string;
  fontSize: number;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleScreenReader: () => void;
  toggleKeyboardNavigation: () => void;
  toggleReducedMotion: () => void;
  setColorBlindMode: (mode: string) => void;
  setFontSize: (size: number) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState('normal');
  const [fontSize, setFontSize] = useState(16);

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accessibility-preferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        setHighContrast(prefs.highContrast || false);
        setLargeText(prefs.largeText || false);
        setScreenReader(prefs.screenReader || false);
        setKeyboardNavigation(prefs.keyboardNavigation || false);
        setReducedMotion(prefs.reducedMotion || false);
        setColorBlindMode(prefs.colorBlindMode || 'normal');
        setFontSize(prefs.fontSize || 16);
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefs = {
        highContrast,
        largeText,
        screenReader,
        keyboardNavigation,
        reducedMotion,
        colorBlindMode,
        fontSize
      };
      localStorage.setItem('accessibility-preferences', JSON.stringify(prefs));
    }
  }, [highContrast, largeText, screenReader, keyboardNavigation, reducedMotion, colorBlindMode, fontSize]);

  // Apply accessibility styles to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // High contrast mode
      if (highContrast) {
        root.classList.add('high-contrast');
        root.style.setProperty('--color-bg', '#000000');
        root.style.setProperty('--color-text', '#ffffff');
        root.style.setProperty('--color-border', '#ffffff');
        root.style.setProperty('--color-primary', '#ffff00');
      } else {
        root.classList.remove('high-contrast');
        root.style.removeProperty('--color-bg');
        root.style.removeProperty('--color-text');
        root.style.removeProperty('--color-border');
        root.style.removeProperty('--color-primary');
      }

      // Large text mode
      if (largeText) {
        root.classList.add('large-text');
        root.style.fontSize = `${fontSize * 1.25}px`;
      } else {
        root.classList.remove('large-text');
        root.style.fontSize = `${fontSize}px`;
      }

      // Reduced motion
      if (reducedMotion) {
        root.classList.add('reduced-motion');
      } else {
        root.classList.remove('reduced-motion');
      }

      // Color blind mode
      root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
      if (colorBlindMode !== 'normal') {
        root.classList.add(colorBlindMode);
      }
    }
  }, [highContrast, largeText, reducedMotion, colorBlindMode, fontSize]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleLargeText = () => setLargeText(!largeText);
  const toggleScreenReader = () => setScreenReader(!screenReader);
  const toggleKeyboardNavigation = () => setKeyboardNavigation(!keyboardNavigation);
  const toggleReducedMotion = () => setReducedMotion(!reducedMotion);

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      largeText,
      screenReader,
      keyboardNavigation,
      reducedMotion,
      colorBlindMode,
      fontSize,
      toggleHighContrast,
      toggleLargeText,
      toggleScreenReader,
      toggleKeyboardNavigation,
      toggleReducedMotion,
      setColorBlindMode,
      setFontSize
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Accessibility Toolbar Component
export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    highContrast,
    largeText,
    screenReader,
    keyboardNavigation,
    reducedMotion,
    colorBlindMode,
    fontSize,
    toggleHighContrast,
    toggleLargeText,
    toggleScreenReader,
    toggleKeyboardNavigation,
    toggleReducedMotion,
    setColorBlindMode,
    setFontSize
  } = useAccessibility();

  const accessibilityFeatures = [
    {
      id: 'high-contrast',
      title: 'High Contrast',
      description: 'Increase contrast for better visibility',
      icon: Contrast,
      enabled: highContrast,
      toggle: toggleHighContrast,
      color: 'yellow'
    },
    {
      id: 'large-text',
      title: 'Large Text',
      description: 'Increase text size for better readability',
      icon: TextCursor,
      enabled: largeText,
      toggle: toggleLargeText,
      color: 'blue'
    },
    {
      id: 'reduced-motion',
      title: 'Reduced Motion',
      description: 'Minimize animations and transitions',
      icon: Settings,
      enabled: reducedMotion,
      toggle: toggleReducedMotion,
      color: 'green'
    },
    {
      id: 'keyboard-nav',
      title: 'Keyboard Navigation',
      description: 'Enhanced keyboard navigation support',
      icon: Keyboard,
      enabled: keyboardNavigation,
      toggle: toggleKeyboardNavigation,
      color: 'purple'
    },
    {
      id: 'screen-reader',
      title: 'Screen Reader',
      description: 'Optimize for screen readers',
      icon: Volume2,
      enabled: screenReader,
      toggle: toggleScreenReader,
      color: 'red'
    }
  ];

  const colorBlindOptions = [
    { value: 'normal', label: 'Normal Vision', description: 'Default color display' },
    { value: 'protanopia', label: 'Protanopia', description: 'Red color blindness' },
    { value: 'deuteranopia', label: 'Deuteranopia', description: 'Green color blindness' },
    { value: 'tritanopia', label: 'Tritanopia', description: 'Blue color blindness' }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ y: -2, opacity: 0.95 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-primary text-primary-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Accessibility options"
        >
          <Accessibility className="w-6 h-6" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="fixed bottom-20 right-4 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Accessibility className="w-5 h-5" />
                      Accessibility Options
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close accessibility menu"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    Customize your experience for better accessibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Accessibility Features */}
                  <div className="space-y-3">
                    {accessibilityFeatures.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={feature.id}
                          whileHover={{ y: -2, opacity: 0.95 }}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200",
                            feature.enabled 
                              ? "bg-muted border-primary" 
                              : "bg-card border-border"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn(
                              "w-5 h-5",
                              feature.enabled ? "text-primary" : "text-muted-foreground"
                            )} />
                            <div>
                              <h4 className="font-medium text-sm">{feature.title}</h4>
                              <p className="text-xs text-muted-foreground">{feature.description}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={feature.enabled ? "default" : "outline"}
                            onClick={feature.toggle}
                            className={cn(
                              "text-xs",
                              feature.enabled && "bg-primary hover:bg-primary/90"
                            )}
                          >
                            {feature.enabled ? "On" : "Off"}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Font Size Control */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Font Size</h4>
                      <Badge variant="outline">{fontSize}px</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                        aria-label="Decrease font size"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${((fontSize - 12) / 8) * 100}%` }}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setFontSize(Math.min(20, fontSize + 2))}
                        aria-label="Increase font size"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Color Blind Mode */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Color Vision</h4>
                    <select
                      value={colorBlindMode}
                      onChange={(e) => setColorBlindMode(e.target.value)}
                      className="w-full p-2 text-sm border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      aria-label="Color vision mode"
                    >
                      {colorBlindOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} - {option.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Screen Reader Only Component
export function ScreenReaderOnly({ children }: { children: ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// Accessible Button Component
export function AccessibleButton({ 
  children, 
  ariaLabel,
  ariaPressed,
  ariaExpanded,
  ariaControls,
  className,
  ...props 
}: {
  children: ReactNode;
  ariaLabel: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;
  className?: string;
  [key: string]: any;
}) {
  return (
    <button
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "hover:opacity-80 transition-opacity duration-200",
        className
      )}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      {...props}
    >
      {children}
    </button>
  );
}

// Accessible Form Input Component
export function AccessibleInput({ 
  label,
  id,
  type = 'text',
  required = false,
  ariaDescribedBy,
  className,
  ...props 
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  ariaDescribedBy?: string;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "w-full px-3 py-2 border border-input rounded-md shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    </div>
  );
}

// Skip Link Component for Keyboard Navigation
export function SkipLink({ href, text }: { href: string; text: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg z-50"
    >
      {text}
    </a>
  );
}