// Jest imports are global, no need to import describe, it, expect, beforeEach, afterEach
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIUsageDashboard } from '../ai-usage-dashboard';
import { tieredAI } from '../../../ai/tiered-ai-service';

// Mock the tiered AI service
jest.mock('../../../ai/tiered-ai-service', () => ({
  tieredAI: {
    getUsageMetrics: jest.fn(),
    getTierConfig: jest.fn(),
    resetMetrics: jest.fn()
  }
}));

describe('AIUsageDashboard', () => {
  let mockConsoleError: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Setup default mock values
    (tieredAI.getUsageMetrics as any).mockReturnValue({
      totalRequests: 150,
      totalCost: 45.5,
      averageLatency: 450,
      cacheHitRate: 0.75,
      batchEfficiency: 0.85,
      requestsByTier: { basic: 100, premium: 50, enterprise: 0 },
      requestsByProvider: { gemini: 80, openai: 50, anthropic: 20, openrouter: 0 },
      costByTier: { basic: 15.0, premium: 30.5, enterprise: 0 }
    });

    (tieredAI.getTierConfig as any).mockImplementation((tier: string) => {
      const configs = {
        basic: {
          maxRequestsPerDay: 1000,
          maxRequestsPerHour: 100,
          costLimit: 50.0,
          features: ['basic-response', 'simple-caching']
        },
        premium: {
          maxRequestsPerDay: 5000,
          maxRequestsPerHour: 500,
          costLimit: 200.0,
          features: ['advanced-response', 'smart-caching', 'batch-processing']
        },
        enterprise: {
          maxRequestsPerDay: 20000,
          maxRequestsPerHour: 2000,
          costLimit: 1000.0,
          features: ['enterprise-response', 'advanced-caching', 'batch-processing', 'priority-support']
        }
      };
      return configs[tier as keyof typeof configs];
    });
  });

  afterEach(() => {
    mockConsoleError.mockRestore();
  });

  describe('Component Rendering', () => {
    it('should render dashboard with all sections', () => {
      render(<AIUsageDashboard />);
      
      expect(screen.getByText('AI Usage Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Costs')).toBeInTheDocument();
      expect(screen.getByText('Tiers')).toBeInTheDocument();
      expect(screen.getByText('Performance')).toBeInTheDocument();
    });

    it('should show key metrics in overview', () => {
      render(<AIUsageDashboard />);
      
      expect(screen.getByText('150')).toBeInTheDocument(); // Total requests
      expect(screen.getByText('$45.50')).toBeInTheDocument(); // Total cost
      expect(screen.getByText('0.5s')).toBeInTheDocument(); // Avg latency
      expect(screen.getByText('75.0%')).toBeInTheDocument(); // Cache hit rate
      
      // Check for the correct text content, not just numbers
      expect(screen.getByText('Total AI Requests')).toBeInTheDocument();
      expect(screen.getByText('Total Cost')).toBeInTheDocument();
      expect(screen.getByText('Average Latency')).toBeInTheDocument();
      expect(screen.getByText('Cache Hit Rate')).toBeInTheDocument();
    });

    it('should display provider usage breakdown', () => {
      render(<AIUsageDashboard />);
      
      expect(screen.getByText('gemini')).toBeInTheDocument();
      expect(screen.getByText('openai')).toBeInTheDocument();
      expect(screen.getByText('anthropic')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should switch between tabs correctly', async () => {
      const user = userEvent.setup();
      render(<AIUsageDashboard />);
      
      // Click on Costs tab
      await user.click(screen.getByText('Costs'));
      
      expect(screen.getByText('Cost by Tier')).toBeInTheDocument();
      expect(screen.getByText('Cost Efficiency')).toBeInTheDocument();
      
      // Click on Tiers tab
      await user.click(screen.getByText('Tiers'));
      
      expect(screen.getByText('basic Tier')).toBeInTheDocument();
      expect(screen.getByText('premium Tier')).toBeInTheDocument();
      
      // Click on Performance tab
      await user.click(screen.getByText('Performance'));
      
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
      expect(screen.getByText('Optimization Recommendations')).toBeInTheDocument();
    });

    it('should maintain data consistency across tabs', async () => {
      const user = userEvent.setup();
      render(<AIUsageDashboard />);
      
      // Check overview data
      expect(screen.getByText('150')).toBeInTheDocument();
      
      // Switch to costs tab
      await user.click(screen.getByText('Costs'));
      expect(screen.getByText('$15.00')).toBeInTheDocument(); // basic cost
      
      // Switch to tiers tab
      await user.click(screen.getByText('Tiers'));
      expect(screen.getByText('basic')).toBeInTheDocument();
      expect(screen.getByText('premium')).toBeInTheDocument();
    });
  });

  describe('Cost Analysis', () => {
    it('should display cost breakdown by tier', async () => {
      const user = userEvent.setup();
      render(<AIUsageDashboard />);
      
      await user.click(screen.getByText('Costs'));
      
      expect(screen.getByText('$15.00')).toBeInTheDocument(); // Basic cost
      expect(screen.getByText('$30.50')).toBeInTheDocument(); // Premium cost
    });

    it('should show cost efficiency by provider', async () => {
      const user = userEvent.setup();
      render(<AIUsageDashboard />);
      
      await user.click(screen.getByText('Costs'));
      
      expect(screen.getByText('Gemini')).toBeInTheDocument();
      expect(screen.getByText('OpenAI')).toBeInTheDocument();
      expect(screen.getByText('Anthropic')).toBeInTheDocument();
    });
  });

  describe('Tier Usage', () => {
    it('should display tier usage cards', async () => {
      const user = userEvent.setup();
      render(<AIUsageDashboard />);
      
      await user.click(screen.getByRole('tab', { name: 'Tiers' }));
      
      expect(screen.getByText('basic Tier')).toBeInTheDocument();
      expect(screen.getByText('premium Tier')).toBeInTheDocument();
      expect(screen.getByText('Daily Requests')).toBeInTheDocument();
      expect(screen.getByText('Daily Cost')).toBeInTheDocument();
    });
  });

  describe('Performance Monitoring', () => {
    it('should display performance metrics', async () => {
      const user = userEvent.setup();
      render(<AIUsageDashboard />);
      
      await user.click(screen.getByText('Performance'));
      
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
      expect(screen.getByText('85.0%')).toBeInTheDocument(); // Batch efficiency
      expect(screen.getByText('75.0%')).toBeInTheDocument(); // Cache hit rate
      expect(screen.getByText('0.5s')).toBeInTheDocument(); // Average latency
    });

    it('should show optimization recommendations', async () => {
      const user = userEvent.setup();
      render(<AIUsageDashboard />);
      
      await user.click(screen.getByText('Performance'));
      
      expect(screen.getByText('Optimization Recommendations')).toBeInTheDocument();
    });
  });

  describe('Data Export', () => {
    it('should export usage data as JSON', async () => {
      const user = userEvent.setup();
      const mockCreateElement = jest.spyOn(document, 'createElement');
      const mockAppendChild = jest.spyOn(document.body, 'appendChild');
      const mockRemoveChild = jest.spyOn(document.body, 'removeChild');
      
      render(<AIUsageDashboard />);
      
      await user.click(screen.getByText('Export'));
      
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
    });
  });

  describe('Real-time Updates', () => {
    it('should refresh data when refresh button is clicked', async () => {
      const user = userEvent.setup();
      render(<AIUsageDashboard />);
      
      await user.click(screen.getByText('Refresh'));
      
      expect(tieredAI.getUsageMetrics).toHaveBeenCalledTimes(2);
    });

    it('should update metrics when data changes', async () => {
      const user = userEvent.setup();
      render(<AIUsageDashboard />);
      
      // Update mock data
      (tieredAI.getUsageMetrics as any).mockReturnValue({
        totalRequests: 200,
        totalCost: 60.0,
        averageLatency: 500,
        cacheHitRate: 0.80,
        batchEfficiency: 0.90,
        requestsByTier: { basic: 120, premium: 80, enterprise: 0 },
        requestsByProvider: { gemini: 100, openai: 70, anthropic: 30, openrouter: 0 },
        costByTier: { basic: 20.0, premium: 40.0, enterprise: 0 }
      });
      
      await user.click(screen.getByText('Refresh'));
      
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('$60.00')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing data gracefully', () => {
      (tieredAI.getUsageMetrics as any).mockReturnValue(null);
      
      render(<AIUsageDashboard />);
      
      expect(screen.getByText('AI Usage Dashboard')).toBeInTheDocument();
      expect(screen.getByText('No usage data available')).toBeInTheDocument();
    });

    it('should handle service errors', () => {
      (tieredAI.getUsageMetrics as any).mockImplementation(() => {
        throw new Error('Service unavailable');
      });
      
      render(<AIUsageDashboard />);
      
      expect(screen.getByText('Error loading data')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state initially', () => {
      // Mock a delay in getUsageMetrics by returning a promise that never resolves
      (tieredAI.getUsageMetrics as any).mockImplementation(() => {
        return new Promise(() => {}); // Never resolves
      });
      
      render(<AIUsageDashboard />);
      
      // Check for the loading spinner instead of text
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Alerts', () => {
    it('should show alerts when enabled', () => {
      // Mock high utilization data to trigger alerts
      (tieredAI.getUsageMetrics as any).mockReturnValue({
        totalRequests: 150,
        totalCost: 45.5,
        averageLatency: 5500, // High latency
        cacheHitRate: 0.05, // Low cache hit rate
        batchEfficiency: 0.85,
        requestsByTier: { basic: 850, premium: 150, enterprise: 0 }, // High utilization
        requestsByProvider: { gemini: 80, openai: 50, anthropic: 20, openrouter: 0 },
        costByTier: { basic: 40.0, premium: 5.5, enterprise: 0 } // Approaching cost limit
      });
      
      render(<AIUsageDashboard showAlerts={true} />);
      
      expect(screen.getByText('Basic tier is at 85.0% of daily request limit')).toBeInTheDocument();
      expect(screen.getByText('High average latency detected: 5.5s')).toBeInTheDocument();
      expect(screen.getByText('Low cache efficiency: 5.0% hit rate')).toBeInTheDocument();
    });

    it('should not show alerts when disabled', () => {
      render(<AIUsageDashboard showAlerts={false} />);
      
      expect(screen.queryByText('Basic tier is at')).not.toBeInTheDocument();
    });
  });
});