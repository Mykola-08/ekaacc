// Magic UI Components Export Index

// Import all components first
import { AnimatedGradientText } from './animated-gradient-text';
import { AnimatedList, AnimatedListItem } from './animated-list';
import { BlurIn } from './blur-in';
import { RainbowButton } from './rainbow-button';
import { ShimmerButton } from './shimmer-button';
import { NumberTicker } from './number-ticker';
import { TextShimmer } from './text-shimmer';

// Export individual components
export { AnimatedGradientText } from './animated-gradient-text';
export { AnimatedList, AnimatedListItem } from './animated-list';
export { BlurIn } from './blur-in';
export { RainbowButton } from './rainbow-button';
export { ShimmerButton } from './shimmer-button';
export { NumberTicker } from './number-ticker';
export { TextShimmer } from './text-shimmer';

// Export all components as a components object for easy importing
export const MagicComponents = {
  AnimatedGradientText,
  AnimatedList,
  AnimatedListItem,
  BlurIn,
  RainbowButton,
  ShimmerButton,
  NumberTicker,
  TextShimmer,
} as const;

// Type export for the components object
export type MagicComponentsType = typeof MagicComponents;