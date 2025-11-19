import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  TierBadge,
  TierBadgeGradient,
  TierBadgeMinimal,
  TierBadgeWithProgress,
  TierBadgeGroup
} from '../components/tiers/tier-badge';

describe('TierBadge Components', () => {
  describe('TierBadge', () => {
    it('should render VIP Silver badge correctly', () => {
      render(<TierBadge tierType="vip" tierName="silver" />);
      
      const badge = screen.getByText('VIP Silver');
      expect(badge).toBeInTheDocument();
      expect(badge.closest('div')).toHaveClass('bg-muted', 'border-border', 'text-muted-foreground');
    });

    it('should render VIP Gold badge correctly', () => {
      render(<TierBadge tierType="vip" tierName="gold" />);
      
      const badge = screen.getByText('VIP Gold');
      expect(badge).toBeInTheDocument();
      expect(badge.closest('div')).toHaveClass('bg-secondary', 'border-primary/20', 'text-foreground');
    });

    it('should render VIP Platinum badge correctly', () => {
      render(<TierBadge tierType="vip" tierName="platinum" />);
      
      const badge = screen.getByText('VIP Platinum');
      expect(badge).toBeInTheDocument();
      expect(badge.closest('div')).toHaveClass('bg-primary', 'border-primary', 'text-primary-foreground');
    });

    it('should render Loyalty Member badge correctly', () => {
      render(<TierBadge tierType="loyalty" tierName="member" />);
      
      const badge = screen.getByText('Loyalty Member');
      expect(badge).toBeInTheDocument();
      expect(badge.closest('div')).toHaveClass('bg-background', 'border-border', 'text-muted-foreground');
    });

    it('should render Loyalty Elite badge correctly', () => {
      render(<TierBadge tierType="loyalty" tierName="elite" />);
      
      const badge = screen.getByText('Loyalty Elite');
      expect(badge).toBeInTheDocument();
      expect(badge.closest('div')).toHaveClass('bg-muted', 'border-foreground', 'text-foreground');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<TierBadge tierType="vip" tierName="silver" size="sm" />);
      expect(screen.getByText('VIP Silver').closest('div')).toHaveClass('px-2', 'py-1', 'text-xs');

      rerender(<TierBadge tierType="vip" tierName="silver" size="md" />);
      expect(screen.getByText('VIP Silver').closest('div')).toHaveClass('px-3', 'py-1.5', 'text-sm');

      rerender(<TierBadge tierType="vip" tierName="silver" size="lg" />);
      expect(screen.getByText('VIP Silver').closest('div')).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('should render without icon when showIcon is false', () => {
      render(<TierBadge tierType="vip" tierName="silver" showIcon={false} />);
      
      // Check that there's no SVG element in the badge
      const badge = screen.getByText('VIP Silver').closest('div');
      const svgElements = badge?.querySelectorAll('svg');
      expect(svgElements?.length).toBe(0);
    });

    it('should apply custom className', () => {
      render(<TierBadge tierType="vip" tierName="silver" className="custom-class" />);
      
      const badge = screen.getByText('VIP Silver').closest('div');
      expect(badge).toHaveClass('custom-class');
    });

    it('should apply animation classes when animated is true', () => {
      render(<TierBadge tierType="vip" tierName="silver" animated={true} />);
      
      const badge = screen.getByText('VIP Silver').closest('div');
      expect(badge).toHaveClass('hover:scale-105', 'hover:shadow-md');
    });
  });

  describe('TierBadgeGradient', () => {
    it('should render gradient VIP Silver badge correctly', () => {
      render(<TierBadgeGradient tierType="vip" tierName="silver" />);
      
      const badge = screen.getByText('VIP Silver');
      expect(badge).toBeInTheDocument();
      expect(badge.closest('div')).toHaveClass('bg-gradient-to-r', 'from-muted', 'to-muted/80', 'text-white');
    });

    it('should render gradient VIP Gold badge correctly', () => {
      render(<TierBadgeGradient tierType="vip" tierName="gold" />);
      
      const badge = screen.getByText('VIP Gold');
      expect(badge).toBeInTheDocument();
      expect(badge.closest('div')).toHaveClass('bg-gradient-to-r', 'from-secondary', 'to-secondary/80', 'text-white');
    });

    it('should render gradient Loyalty Elite badge correctly', () => {
      render(<TierBadgeGradient tierType="loyalty" tierName="elite" />);
      
      const badge = screen.getByText('Loyalty Elite');
      expect(badge).toBeInTheDocument();
      expect(badge.closest('div')).toHaveClass('bg-gradient-to-r', 'from-muted', 'to-muted/80', 'text-white');
    });

    it('should apply gradient animation classes by default', () => {
      render(<TierBadgeGradient tierType="vip" tierName="silver" />);
      
      const badge = screen.getByText('VIP Silver').closest('div');
      expect(badge).toHaveClass('hover:scale-105', 'hover:shadow-xl', 'animate-pulse');
    });

    it('should not apply animation classes when animated is false', () => {
      render(<TierBadgeGradient tierType="vip" tierName="silver" animated={false} />);
      
      const badge = screen.getByText('VIP Silver').closest('div');
      expect(badge).not.toHaveClass('animate-pulse');
    });
  });

  describe('TierBadgeMinimal', () => {
    it('should render minimal VIP Silver badge correctly', () => {
      render(<TierBadgeMinimal tierType="vip" tierName="silver" />);
      
      const badge = screen.getByText('Silver');
      expect(badge).toBeInTheDocument();
      expect(badge.closest('div')).toHaveClass('bg-muted', 'border-border', 'text-muted-foreground');
    });

    it('should render minimal Loyalty Elite badge correctly', () => {
      render(<TierBadgeMinimal tierType="loyalty" tierName="elite" />);
      
      const badge = screen.getByText('Elite');
      expect(badge).toBeInTheDocument();
      expect(badge.closest('div')).toHaveClass('bg-muted', 'border-foreground', 'text-foreground');
    });

    it('should capitalize tier name correctly', () => {
      render(<TierBadgeMinimal tierType="vip" tierName="platinum" />);
      
      expect(screen.getByText('Platinum')).toBeInTheDocument();
    });

    it('should apply animation classes when animated is true', () => {
      render(<TierBadgeMinimal tierType="vip" tierName="silver" animated={true} />);
      
      const badge = screen.getByText('Silver').closest('div');
      expect(badge).toHaveClass('hover:scale-105', 'transition-transform', 'duration-200');
    });
  });

  describe('TierBadgeWithProgress', () => {
    it('should render badge with progress indicator', () => {
      render(
        <TierBadgeWithProgress 
          tierType="vip" 
          tierName="silver" 
          progress={75} 
        />
      );
      
      expect(screen.getByText('VIP Silver')).toBeInTheDocument();
      
      // Check for progress bar
      const progressBar = screen.getByText('VIP Silver').closest('div')?.parentElement?.querySelector('div[style*="width"]');
      expect(progressBar).toHaveStyle('width: 75%');
    });

    it('should render with 0% progress', () => {
      render(
        <TierBadgeWithProgress 
          tierType="vip" 
          tierName="silver" 
          progress={0} 
        />
      );
      
      const progressBar = screen.getByText('VIP Silver').closest('div')?.parentElement?.querySelector('div[style*="width"]');
      expect(progressBar).toHaveStyle('width: 0%');
    });

    it('should render with 100% progress', () => {
      render(
        <TierBadgeWithProgress 
          tierType="vip" 
          tierName="silver" 
          progress={100} 
        />
      );
      
      const progressBar = screen.getByText('VIP Silver').closest('div')?.parentElement?.querySelector('div[style*="width"]');
      expect(progressBar).toHaveStyle('width: 100%');
    });

    it('should clamp progress values above 100%', () => {
      render(
        <TierBadgeWithProgress 
          tierType="vip" 
          tierName="silver" 
          progress={150} 
        />
      );
      
      const progressBar = screen.getByText('VIP Silver').closest('div')?.parentElement?.querySelector('div[style*="width"]');
      expect(progressBar).toHaveStyle('width: 100%');
    });

    it('should clamp progress values below 0%', () => {
      render(
        <TierBadgeWithProgress 
          tierType="vip" 
          tierName="silver" 
          progress={-25} 
        />
      );
      
      const progressBar = screen.getByText('VIP Silver').closest('div')?.parentElement?.querySelector('div[style*="width"]');
      expect(progressBar).toHaveStyle('width: 0%');
    });
  });

  describe('TierBadgeGroup', () => {
    it('should render multiple badges', () => {
      const tiers = [
        { tierType: 'vip' as const, tierName: 'silver' as const },
        { tierType: 'loyalty' as const, tierName: 'member' as const },
      ];

      render(<TierBadgeGroup tiers={tiers} />);
      
      expect(screen.getByText('VIP Silver')).toBeInTheDocument();
      expect(screen.getByText('Loyalty Member')).toBeInTheDocument();
    });

    it('should apply gap between badges', () => {
      const tiers = [
        { tierType: 'vip' as const, tierName: 'silver' as const },
        { tierType: 'vip' as const, tierName: 'gold' as const },
      ];

      render(<TierBadgeGroup tiers={tiers} />);
      
      const element = screen.getByText('VIP Silver').closest('div');
      expect(element).toBeInTheDocument();
      const container = element!.parentElement;
      expect(container).toHaveClass('gap-2');
    });

    it('should not render when tiers array is empty', () => {
      render(<TierBadgeGroup tiers={[]} />);
      
      expect(screen.queryByText('VIP')).not.toBeInTheDocument();
      expect(screen.queryByText('Loyalty')).not.toBeInTheDocument();
    });

    it('should not render when tiers is undefined', () => {
      render(<TierBadgeGroup tiers={undefined as any} />);
      
      expect(screen.queryByText('VIP')).not.toBeInTheDocument();
      expect(screen.queryByText('Loyalty')).not.toBeInTheDocument();
    });

    it('should apply custom className to container', () => {
      const tiers = [
        { tierType: 'vip' as const, tierName: 'silver' as const },
      ];

      render(<TierBadgeGroup tiers={tiers} className="custom-container" />);
      
      const element = screen.getByText('VIP Silver').closest('div');
      expect(element).toBeInTheDocument();
      const container = element!.parentElement;
      expect(container).toHaveClass('custom-container');
    });

    it('should use specified size for all badges', () => {
      const tiers = [
        { tierType: 'vip' as const, tierName: 'silver' as const },
        { tierType: 'loyalty' as const, tierName: 'member' as const },
      ];

      render(<TierBadgeGroup tiers={tiers} size="lg" />);
      
      // Find all badges by their text content and check their classes
      const vipBadge = screen.getByText('VIP Silver').closest('div');
      const loyaltyBadge = screen.getByText('Loyalty Member').closest('div');
      
      expect(vipBadge).toHaveClass('px-4', 'py-2', 'text-base');
      expect(loyaltyBadge).toHaveClass('px-4', 'py-2', 'text-base');
    });
  });

  describe('Accessibility', () => {
    it('should have proper contrast ratios for VIP badges', () => {
      const { rerender } = render(<TierBadge tierType="vip" tierName="silver" />);
      const silverBadge = screen.getByText('VIP Silver').closest('div');
      expect(silverBadge).toHaveClass('text-muted-foreground');

      rerender(<TierBadge tierType="vip" tierName="gold" />);
      const goldBadge = screen.getByText('VIP Gold').closest('div');
      expect(goldBadge).toHaveClass('text-foreground');

      rerender(<TierBadge tierType="vip" tierName="platinum" />);
      const platinumBadge = screen.getByText('VIP Platinum').closest('div');
      expect(platinumBadge).toHaveClass('text-primary-foreground');
    });

    it('should have proper contrast ratios for Loyalty badges', () => {
      const { rerender } = render(<TierBadge tierType="loyalty" tierName="member" />);
      const memberBadge = screen.getByText('Loyalty Member').closest('div');
      expect(memberBadge).toHaveClass('text-muted-foreground');

      rerender(<TierBadge tierType="loyalty" tierName="elite" />);
      const eliteBadge = screen.getByText('Loyalty Elite').closest('div');
      expect(eliteBadge).toHaveClass('text-foreground');
    });
  });
});