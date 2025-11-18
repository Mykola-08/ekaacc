/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

export interface ColorContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  level: 'AA' | 'AAA' | 'fail';
}

/**
 * Calculate relative luminance of a color
 */
export function getLuminance(hex: string): number {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const sRGB = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928
      ? val / 12.92
      : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG standards
 */
export function checkColorContrast(
  foreground: string,
  background: string
): ColorContrastResult {
  const ratio = getContrastRatio(foreground, background);
  const passesAA = ratio >= 4.5;
  const passesAAA = ratio >= 7;

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA,
    passesAAA,
    level: passesAAA ? 'AAA' : passesAA ? 'AA' : 'fail'
  };
}

/**
 * Get accessible color combinations
 */
export function getAccessibleColors(
  background: string,
  minRatio: number = 4.5
): {
  text: string;
  muted: string;
  subtle: string;
} {
  const whiteContrast = getContrastRatio('#ffffff', background);
  const blackContrast = getContrastRatio('#000000', background);

  const useDarkText = whiteContrast >= minRatio;
  const baseText = useDarkText ? '#ffffff' : '#000000';

  // Generate muted and subtle variants
  const muted = useDarkText
    ? `rgba(255, 255, 255, ${0.7})`
    : `rgba(0, 0, 0, ${0.6})`;

  const subtle = useDarkText
    ? `rgba(255, 255, 255, ${0.5})`
    : `rgba(0, 0, 0, ${0.4})`;

  return {
    text: baseText,
    muted,
    subtle
  };
}

/**
 * Touch target utilities
 */
export const TOUCH_TARGETS = {
  minimum: 44, // WCAG 2.1 AA minimum
  recommended: 48, // Recommended for better usability
  icon: 24, // Standard icon size
  iconPadding: 10 // Padding around icons to reach minimum
};

/**
 * Check if element meets touch target requirements
 */
export function checkTouchTarget(
  width: number,
  height: number
): {
  meetsMinimum: boolean;
  meetsRecommended: boolean;
  size: 'small' | 'medium' | 'large';
} {
  const minDimension = Math.min(width, height);
  const maxDimension = Math.max(width, height);

  return {
    meetsMinimum: minDimension >= TOUCH_TARGETS.minimum,
    meetsRecommended: minDimension >= TOUCH_TARGETS.recommended,
    size: minDimension < 36 ? 'small' : minDimension < 44 ? 'medium' : 'large'
  };
}

/**
 * Focus state utilities
 */
export const FOCUS_STATES = {
  width: 3,
  offset: 2,
  color: 'hsl(var(--primary))',
  style: 'solid'
};

/**
 * Animation preferences
 */
export const ANIMATION_SETTINGS = {
  duration: 200, // ms
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  reducedMotion: '(prefers-reduced-motion: reduce)'
};

/**
 * Screen reader utilities
 */
export const SCREEN_READER_ONLY = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0'
};

/**
 * Keyboard navigation utilities
 */
export const KEYBOARD_NAVIGATION = {
  tabIndex: 0,
  role: 'button',
  ariaLabel: (label: string) => label,
  ariaPressed: (pressed: boolean) => pressed,
  ariaExpanded: (expanded: boolean) => expanded
};

/**
 * Color blindness utilities
 */
export const COLOR_BLINDNESS = {
  patterns: {
    error: '🔴',
    warning: '🟡',
    success: '🟢',
    info: '🔵'
  },
  alternatives: {
    red: ['#dc2626', '#b91c1c', '#991b1b'],
    green: ['#16a34a', '#15803d', '#166534'],
    blue: ['#2563eb', '#1d4ed8', '#1e40af']
  }
};

/**
 * Responsive design breakpoints with accessibility considerations
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: '320px', // Minimum mobile width
  tablet: '768px', // Tablet breakpoint
  desktop: '1024px', // Desktop breakpoint
  large: '1440px', // Large desktop
  maxContent: '80rem' // Maximum content width for readability
};

/**
 * Text sizing for readability
 */
export const TEXT_SIZING = {
  minimum: '12px', // Absolute minimum
  base: '16px', // Base size
  large: '18px', // Large text
  lineHeight: 1.6, // Recommended line height
  maxLineLength: '65ch' // Maximum line length for readability
};



/**
 * Parse color from computed style
 */
function parseColor(color: string): string {
  // Handle various color formats
  if (color.startsWith('#') || color.startsWith('rgb')) {
    return color;
  }
  
  // Handle named colors by creating a temporary element
  const tempDiv = document.createElement('div');
  tempDiv.style.color = color;
  document.body.appendChild(tempDiv);
  const computedColor = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);
  
  return computedColor;
}

/**
 * Validate entire component for accessibility
 */
export function validateComponentAccessibility(
  element: HTMLElement
): {
  hasProperContrast: boolean;
  hasTouchTargets: boolean;
  hasFocusStates: boolean;
  hasLabels: boolean;
  score: number;
  issues: string[];
} {
  const issues: string[] = [];

  // Check contrast
  const computedStyle = window.getComputedStyle(element);
  const color = parseColor(computedStyle.color);
  const backgroundColor = parseColor(computedStyle.backgroundColor);
  
  let hasProperContrast = true;
  try {
    const contrastRatio = getContrastRatio(color, backgroundColor);
    if (contrastRatio < 4.5) {
      issues.push(`Low contrast ratio: ${contrastRatio.toFixed(2)}:1 (minimum 4.5:1 required)`);
      hasProperContrast = false;
    }
  } catch (error) {
    issues.push('Unable to calculate contrast ratio');
    hasProperContrast = false;
  }
  
  // Check touch targets
  const rect = element.getBoundingClientRect();
  const touchTarget = checkTouchTarget(rect.width, rect.height);
  
  // Check focus states
  const hasFocus = computedStyle.outline !== 'none' || computedStyle.boxShadow.includes('focus');
  
  // Check labels
  const hasLabel = Boolean(
    element.hasAttribute('aria-label') || 
    element.hasAttribute('aria-labelledby') ||
    (element.tagName === 'BUTTON' && element.textContent?.trim())
  );

  if (!touchTarget.meetsMinimum) {
    issues.push(`Touch target too small: ${rect.width}x${rect.height}px`);
  }

  if (!hasFocus) {
    issues.push('Missing focus states');
  }

  if (!hasLabel) {
    issues.push('Missing accessible label');
  }

  const score = Math.max(0, 100 - (issues.length * 25));

  return {
    hasProperContrast,
    hasTouchTargets: touchTarget.meetsMinimum,
    hasFocusStates: hasFocus,
    hasLabels: hasLabel,
    score,
    issues
  };
}