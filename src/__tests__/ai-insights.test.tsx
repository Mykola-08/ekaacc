import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AIInsightsPage from '../app/(app)/ai-insights/page';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Production test with real service integration
// Note: This test now requires a running Supabase instance and proper test data setup
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe('AI Insights page', () => {
  it('renders the AI Insights page', async () => {
    // Note: This test now requires proper test environment setup
    // Consider using test utilities to set up test data in Supabase before running
    render(<AIInsightsPage />);
    
    // Basic render test - adjust expectations based on actual page content
    await waitFor(() => expect(screen.getByText(/AI Insights/i)).toBeInTheDocument());
  });
});
