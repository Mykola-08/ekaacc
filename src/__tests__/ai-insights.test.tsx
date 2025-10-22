import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AIInsightsPage from '../app/(app)/ai-insights/page';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock heavy UI pieces that require browser layout or Next app router
vi.mock('@/components/eka/ai-therapy-recommendations', () => ({ AITherapyRecommendations: () => <div /> }));
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

// Mock fxService used by the page
vi.mock('@/lib/fx-service', () => ({
  default: {
    getAIAnalysis: async () => ({
      keyTrends: [
        { title: 'Mood', value: 'Improving', change: 5.2, type: 'improvement' },
      ],
      moodChart: [{ name: 'Mon', value: 3 }, { name: 'Tue', value: 4 }],
      painChart: [{ name: 'Mon', value: 2 }, { name: 'Tue', value: 1 }],
      recommendations: [],
    }),
  },
}));

describe('AI Insights page', () => {
  it('renders and shows key trends', async () => {
    render(<AIInsightsPage />);
    await waitFor(() => expect(screen.getByText(/AI Insights/i)).toBeInTheDocument());
    // Ensure the recommendation card content is present
    expect(screen.getByText(/Improving/i)).toBeInTheDocument();
  });
});
