'use client';

import { useEffect, useState } from 'react';
import * as React from 'react';
import {
  checkColorContrast,
  checkTouchTarget,
  validateComponentAccessibility,
  TEXT_SIZING,
  ANIMATION_SETTINGS,
} from '@/lib/platform/utils/accessibility-utils';

export interface AccessibilityValidation {
  contrast: {
    ratio: number;
    passesAA: boolean;
    passesAAA: boolean;
    level: 'AA' | 'AAA' | 'fail';
  };
  touchTarget: {
    meetsMinimum: boolean;
    meetsRecommended: boolean;
    size: 'small' | 'medium' | 'large';
  };
  focusStates: boolean;
  labels: boolean;
  overallScore: number;
  issues: string[];
}

/**
 * Hook to validate component accessibility
 */
export function useAccessibilityValidation(
  ref: React.RefObject<HTMLElement>,
  dependencies: any[] = []
): AccessibilityValidation | null {
  const [validation, setValidation] = useState<AccessibilityValidation | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    // Validate touch target
    const touchTarget = checkTouchTarget(rect.width, rect.height);

    // Check for focus states
    const hasFocusStates =
      computedStyle.outline !== 'none' ||
      computedStyle.boxShadow.includes('focus') ||
      element.matches(':focus-visible');

    // Check for labels
    const hasLabels =
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.getAttribute('role') === 'button' ||
      element.tagName === 'BUTTON';

    // Simulate contrast check (would need proper color parsing in production)
    const contrast = checkColorContrast('#000000', '#ffffff');

    const issues: string[] = [];
    if (!touchTarget.meetsMinimum) {
      issues.push(`Touch target too small: ${Math.round(rect.width)}x${Math.round(rect.height)}px`);
    }
    if (!hasFocusStates) {
      issues.push('Missing focus states');
    }
    if (!hasLabels) {
      issues.push('Missing accessible labels');
    }

    const overallScore = Math.max(0, 100 - issues.length * 25);

    setValidation({
      contrast,
      touchTarget,
      focusStates: hasFocusStates,
      labels: hasLabels,
      overallScore,
      issues,
    });
  }, [ref, ...dependencies]);

  return validation;
}

/**
 * Hook to handle reduced motion preferences
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(ANIMATION_SETTINGS.reducedMotion);
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to validate text sizing
 */
export function useTextSizingValidation(ref: React.RefObject<HTMLElement>): {
  isReadable: boolean;
  fontSize: number;
  lineHeight: number;
  issues: string[];
} | null {
  const [textValidation, setTextValidation] = useState<{
    isReadable: boolean;
    fontSize: number;
    lineHeight: number;
    issues: string[];
  } | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const computedStyle = window.getComputedStyle(element);
    const fontSize = parseFloat(computedStyle.fontSize);
    const lineHeight = parseFloat(computedStyle.lineHeight);

    const issues: string[] = [];
    if (fontSize < parseFloat(TEXT_SIZING.minimum)) {
      issues.push(`Font size too small: ${fontSize}px (minimum: ${TEXT_SIZING.minimum})`);
    }
    if (lineHeight < TEXT_SIZING.lineHeight) {
      issues.push(`Line height too tight: ${lineHeight} (recommended: ${TEXT_SIZING.lineHeight})`);
    }

    setTextValidation({
      isReadable: issues.length === 0,
      fontSize,
      lineHeight,
      issues,
    });
  }, [ref]);

  return textValidation;
}

/**
 * Component to display accessibility validation results
 */
export function AccessibilityIndicator({
  validation,
}: {
  validation: AccessibilityValidation | null;
}) {
  if (!validation) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-foreground';
    if (score >= 70) return 'text-muted-foreground';
    return 'text-destructive-foreground';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return '✅';
    if (score >= 70) return '⚠️';
    return '❌';
  };

  return React.createElement(
    'div',
    {
      className:
        'fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm z-50',
    },
    [
      React.createElement(
        'div',
        {
          key: 'header',
          className: 'flex items-center gap-2 mb-2',
        },
        [
          React.createElement(
            'span',
            {
              key: 'icon',
              className: 'text-lg',
            },
            getScoreIcon(validation.overallScore)
          ),
          React.createElement(
            'span',
            {
              key: 'score',
              className: `font-semibold ${getScoreColor(validation.overallScore)}`,
            },
            `Accessibility Score: ${validation.overallScore}%`
          ),
        ]
      ),
      validation.issues.length > 0 &&
        React.createElement(
          'div',
          {
            key: 'issues',
            className: 'space-y-1',
          },
          [
            React.createElement(
              'p',
              {
                key: 'issues-title',
                className: 'text-sm font-medium text-foreground',
              },
              'Issues:'
            ),
            React.createElement(
              'ul',
              {
                key: 'issues-list',
                className: 'text-xs text-muted-foreground space-y-1',
              },
              validation.issues.map((issue, index) =>
                React.createElement('li', { key: index }, `• ${issue}`)
              )
            ),
          ]
        ),
      React.createElement(
        'div',
        {
          key: 'details',
          className: 'mt-3 text-xs text-muted-foreground',
        },
        [
          React.createElement(
            'p',
            { key: 'contrast' },
            `Contrast: ${validation.contrast.ratio}:1 (${validation.contrast.level})`
          ),
          React.createElement(
            'p',
            { key: 'touch' },
            `Touch target: ${validation.touchTarget.size}`
          ),
          React.createElement(
            'p',
            { key: 'focus' },
            `Focus states: ${validation.focusStates ? '✅' : '❌'}`
          ),
          React.createElement('p', { key: 'labels' }, `Labels: ${validation.labels ? '✅' : '❌'}`),
        ]
      ),
    ]
  );
}
