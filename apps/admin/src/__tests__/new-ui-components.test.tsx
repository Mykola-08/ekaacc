import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { AnimatedGradientText } from '../components/ui/animated-gradient-text';
import { BlurIn } from '../components/ui/blur-in';
import { NumberTicker } from '../components/ui/number-ticker';
import { ShimmerButton } from '../components/ui/shimmer-button';

describe('New UI Components', () => {
  describe('AnimatedGradientText', () => {
    it('should render children correctly', () => {
      render(<AnimatedGradientText>Test Text</AnimatedGradientText>);
      expect(screen.getByText('Test Text')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <AnimatedGradientText className="custom-class">Test</AnimatedGradientText>
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should apply gradient animation classes', () => {
      const { container } = render(<AnimatedGradientText>Test</AnimatedGradientText>);
      expect(container.firstChild).toHaveClass('animate-gradient');
    });
  });

  describe('BlurIn', () => {
    it('should render children correctly', () => {
      render(<BlurIn>Test Content</BlurIn>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply blur animation class', () => {
      const { container } = render(<BlurIn>Test</BlurIn>);
      expect(container.firstChild).toHaveClass('animate-blur-in');
    });

    it('should accept delay and duration props', () => {
      const { container } = render(
        <BlurIn delay={0.5} duration={1}>Test</BlurIn>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.animationDelay).toBe('0.5s');
      expect(element.style.animationDuration).toBe('1s');
    });
  });

  describe('NumberTicker', () => {
    it('should render initial value', () => {
      const { container } = render(<NumberTicker value={100} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should format value with decimal places', () => {
      const { container } = render(<NumberTicker value={100.5} decimalPlaces={2} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <NumberTicker value={100} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
      expect(container.firstChild).toHaveClass('tabular-nums');
    });
  });

  describe('ShimmerButton', () => {
    it('should render children correctly', () => {
      render(<ShimmerButton>Click Me</ShimmerButton>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should be a button element', () => {
      render(<ShimmerButton>Click Me</ShimmerButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should accept onClick handler', () => {
      const handleClick = jest.fn();
      render(<ShimmerButton onClick={handleClick}>Click Me</ShimmerButton>);
      screen.getByRole('button').click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ShimmerButton className="custom-class">Click Me</ShimmerButton>
      );
      expect(container.querySelector('button')).toHaveClass('custom-class');
    });

    it('should have shimmer effect element', () => {
      const { container } = render(<ShimmerButton>Click Me</ShimmerButton>);
      const shimmerElement = container.querySelector('.animate-shimmer');
      expect(shimmerElement).toBeInTheDocument();
    });
  });
});
