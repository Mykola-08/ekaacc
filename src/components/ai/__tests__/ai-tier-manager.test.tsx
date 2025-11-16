// Jest imports are global, no need to import describe, it, expect, beforeEach, afterEach
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AITierManager } from '../ai-tier-manager';
import { tieredAI } from '../../../ai/tiered-ai-service';

// Mock the tiered AI service
jest.mock('../../../ai/tiered-ai-service', () => ({
  tieredAI: {
    getUsageMetrics: jest.fn(),
    getTierConfig: jest.fn()
  }
}));

describe('AITierManager', () => {
  let mockConsoleError: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Setup default mock values
    (tieredAI.getUsageMetrics as any).mockReturnValue({
      totalRequests: 100,
      totalCost: 25.0,
      averageLatency: 400,
      cacheHitRate: 0.75,
      batchEfficiency: 0.85,
      requestsByTier: { basic: 80, premium: 20, enterprise: 0 },
      requestsByProvider: { gemini: 60, openai: 30, anthropic: 10, openrouter: 0 },
      costByTier: { basic: 20.0, premium: 5.0, enterprise: 0 }
    });

    (tieredAI.getTierConfig as any).mockImplementation((tier: string) => {
      const configs = {
        basic: {
          maxRequestsPerDay: 1000,
          maxRequestsPerHour: 100,
          costLimit: 50.0,
          features: ['basic-response', 'simple-caching', 'cost-tracking']
        },
        premium: {
          maxRequestsPerDay: 5000,
          maxRequestsPerHour: 500,
          costLimit: 200.0,
          features: ['advanced-response', 'smart-caching', 'batch-processing', 'priority-support']
        },
        enterprise: {
          maxRequestsPerDay: 20000,
          maxRequestsPerHour: 2000,
          costLimit: 1000.0,
          features: ['enterprise-response', 'advanced-caching', 'batch-processing', 'priority-support', 'custom-models']
        }
      };
      return configs[tier as keyof typeof configs];
    });
  });

  afterEach(() => {
    mockConsoleError.mockRestore();
  });

  describe('Component Rendering', () => {
    it('should render tier manager with all sections', () => {
      render(<AITierManager />);
      
      expect(screen.getByText('AI Tier Management')).toBeInTheDocument();
      expect(screen.getByText('Manage your AI service tiers and optimize costs')).toBeInTheDocument();
      expect(screen.getByText('Available Tiers')).toBeInTheDocument();
    });

    it('should display current tier with correct styling', () => {
      render(<AITierManager />);
      
      const tierBadge = screen.getByText('basic');
      expect(tierBadge).toBeInTheDocument();
      expect(tierBadge.closest('.bg-blue-50')).toBeInTheDocument();
    });

    it('should show tier comparison cards', () => {
      render(<AITierManager />);
      
      expect(screen.getByText('Basic')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
      
      // Check basic tier features (formatted with spaces instead of hyphens)
      expect(screen.getByText('basic response')).toBeInTheDocument();
      expect(screen.getByText('simple caching')).toBeInTheDocument();
      expect(screen.getByText('cost tracking')).toBeInTheDocument();
    });

    it('should display usage analytics when enabled', () => {
      render(<AITierManager />);
      
      expect(screen.getByText('Usage Analytics')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument(); // Total requests
      expect(screen.getByText('$25.00')).toBeInTheDocument(); // Total cost
      expect(screen.getByText('75.0%')).toBeInTheDocument(); // Cache efficiency
      expect(screen.getByText('0.40s')).toBeInTheDocument(); // Avg response time
    });
  });

  describe('Tier Upgrade/Downgrade', () => {
    it('should show upgrade button when on basic tier', () => {
      render(<AITierManager />);
      
      expect(screen.getByText('Upgrade to Premium')).toBeInTheDocument();
      expect(screen.queryByText('Downgrade to Basic')).not.toBeInTheDocument();
    });

    it('should show both upgrade and downgrade buttons when on premium tier', () => {
      render(<AITierManager currentTier="premium" />);
      
      expect(screen.getByText('Upgrade to Enterprise')).toBeInTheDocument();
      expect(screen.getByText('Downgrade to Basic')).toBeInTheDocument();
    });

    it('should show downgrade button when on enterprise tier', () => {
      render(<AITierManager currentTier="enterprise" />);
      
      expect(screen.queryByText('Upgrade to Enterprise')).not.toBeInTheDocument();
      expect(screen.getByText('Downgrade to Premium')).toBeInTheDocument();
    });

    it('should handle tier upgrade with confirmation dialog', async () => {
      const user = userEvent.setup();
      const onTierChange = jest.fn();
      render(<AITierManager currentTier="basic" onTierChange={onTierChange} />);
      
      await user.click(screen.getByText('Upgrade to Premium'));
      
      expect(screen.getByText('Upgrade AI Service Tier')).toBeInTheDocument();
      
      await user.click(screen.getByText('Upgrade'));
      
      expect(onTierChange).toHaveBeenCalledWith('premium');
    });

    it('should handle tier downgrade with confirmation dialog', async () => {
      const user = userEvent.setup();
      const onTierChange = jest.fn();
      render(<AITierManager currentTier="premium" onTierChange={onTierChange} />);
      
      await user.click(screen.getByText('Downgrade to Basic'));
      
      expect(screen.getByText('Downgrade AI Service Tier')).toBeInTheDocument();
      
      await user.click(screen.getByText('Downgrade'));
      
      expect(onTierChange).toHaveBeenCalledWith('basic');
    });

    it('should cancel tier change when user clicks cancel', async () => {
      const user = userEvent.setup();
      const onTierChange = jest.fn();
      render(<AITierManager currentTier="basic" onTierChange={onTierChange} />);
      
      await user.click(screen.getByText('Upgrade to Premium'));
      await user.click(screen.getByText('Cancel'));
      
      expect(onTierChange).not.toHaveBeenCalled();
    });
  });

  describe('Current Tier Display', () => {
    it('should highlight current tier features', () => {
      render(<AITierManager />);
      
      expect(screen.getByText('Current')).toBeInTheDocument();
      expect(screen.getByText('Daily Requests')).toBeInTheDocument();
      expect(screen.getByText('Daily Cost')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument(); // basic requests
      expect(screen.getByText('$20.00')).toBeInTheDocument(); // basic cost
    });

    it('should show upgrade recommendations when utilization is high', () => {
      // Mock high utilization
      (tieredAI.getUsageMetrics as any).mockReturnValue({
        totalRequests: 100,
        totalCost: 25.0,
        averageLatency: 400,
        cacheHitRate: 0.75,
        batchEfficiency: 0.85,
        requestsByTier: { basic: 850, premium: 150, enterprise: 0 }, // 85% utilization
        requestsByProvider: { gemini: 60, openai: 30, anthropic: 10, openrouter: 0 },
        costByTier: { basic: 20.0, premium: 5.0, enterprise: 0 }
      });
      
      render(<AITierManager />);
      
      expect(screen.getByText('Recommended: upgrade')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', () => {
      (tieredAI.getUsageMetrics as any).mockImplementation(() => {
        throw new Error('Service unavailable');
      });
      
      render(<AITierManager />);
      
      // Should not crash and should show loading state
      expect(screen.getByText('AI Tier Management')).toBeInTheDocument();
    });

    it('should handle missing tier config', () => {
      (tieredAI.getTierConfig as any).mockReturnValue(null);
      
      render(<AITierManager />);
      
      // Should not crash when tier config is missing
      expect(screen.getByText('AI Tier Management')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state initially', async () => {
      // Mock a delay in getUsageMetrics
      let resolvePromise: any;
      const loadingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      (tieredAI.getUsageMetrics as any).mockImplementation(() => {
        return loadingPromise;
      });
      
      render(<AITierManager />);
      
      // Should show loading state initially
      expect(screen.getByText('Loading tier information...')).toBeInTheDocument();
      
      // Resolve the promise to clean up
      resolvePromise({
        totalRequests: 0,
        totalCost: 0,
        averageLatency: 0,
        cacheHitRate: 0,
        batchEfficiency: 0,
        requestsByTier: { basic: 0, premium: 0, enterprise: 0 },
        requestsByProvider: { gemini: 0, openai: 0, anthropic: 0, openrouter: 0 },
        costByTier: { basic: 0, premium: 0, enterprise: 0 }
      });
      
      await waitFor(() => {
        expect(screen.queryByText('Loading tier information...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero usage data', () => {
      (tieredAI.getUsageMetrics as any).mockReturnValue({
        totalRequests: 0,
        totalCost: 0,
        averageLatency: 0,
        cacheHitRate: 0,
        batchEfficiency: 0,
        requestsByTier: { basic: 0, premium: 0, enterprise: 0 },
        requestsByProvider: { gemini: 0, openai: 0, anthropic: 0, openrouter: 0 },
        costByTier: { basic: 0, premium: 0, enterprise: 0 }
      });
      
      render(<AITierManager />);
      
      // Check for zero values - use getAllByText since there are multiple 0s
      expect(screen.getAllByText('0').length).toBeGreaterThan(0);
      expect(screen.getAllByText('$0.00').length).toBeGreaterThan(0);
      expect(screen.getByText('0.0%')).toBeInTheDocument(); // Cache efficiency
      expect(screen.getByText('0.0s')).toBeInTheDocument(); // Avg response time
    });

    it('should handle very high usage numbers', () => {
      (tieredAI.getUsageMetrics as any).mockReturnValue({
        totalRequests: 1000000,
        totalCost: 25000.0,
        averageLatency: 400,
        cacheHitRate: 0.75,
        batchEfficiency: 0.85,
        requestsByTier: { basic: 800000, premium: 200000, enterprise: 0 },
        requestsByProvider: { gemini: 600000, openai: 300000, anthropic: 100000, openrouter: 0 },
        costByTier: { basic: 20000.0, premium: 5000.0, enterprise: 0 }
      });
      
      render(<AITierManager />);
      
      // Check for large numbers in the usage analytics section
      expect(screen.getByText('1,000,000')).toBeInTheDocument();
      // The cost is shown in the usage analytics section, not the current tier section
      expect(screen.getByText('$20,000.00')).toBeInTheDocument(); // Basic tier cost (appears in usage analytics)
      expect(screen.getByText('75.0%')).toBeInTheDocument(); // Cache efficiency
      expect(screen.getByText('0.4s')).toBeInTheDocument(); // Avg response time
    });

    it('should handle missing usage analytics', () => {
      render(<AITierManager showUsageAnalytics={false} />);
      
      expect(screen.queryByText('Usage Analytics')).not.toBeInTheDocument();
    });
  });
});