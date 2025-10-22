import React from 'react';
import { render, screen } from '@testing-library/react';
import AppLayout from '../app/(app)/layout';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock the AIAssistant component to ensure it's rendered inside layout
vi.mock('@/components/eka/ai-assistant', () => ({
  AIAssistant: () => <div data-testid="ai-assistant">AI Assistant Mock</div>,
}));
// Mock header and sidebar to avoid router use
vi.mock('@/components/eka/app-header', () => ({ AppHeader: () => <div /> }));
vi.mock('@/components/eka/app-sidebar', () => ({ AppSidebar: () => <div /> }));

describe('App layout', () => {
  it('renders AI Assistant in the layout', () => {
    render(<AppLayout>{<div>child</div>}</AppLayout> as any);
    expect(screen.getByTestId('ai-assistant')).toBeInTheDocument();
  });
});
