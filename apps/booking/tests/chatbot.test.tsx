import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ChatBot from '../components/ChatBot';

// Mock @ai-sdk/react
vi.mock('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: [],
    input: '',
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
  }),
}));

describe('ChatBot', () => {
  it('renders closed state initially', () => {
    render(<ChatBot />);
    // Check for the chat icon button (svg)
    // We can find it by role button since it's the only button initially
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(1);
  });

  it('opens chat window on click', () => {
    render(<ChatBot />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Eka Assistant')).toBeDefined();
  });

  it('closes chat window on close button click', () => {
    render(<ChatBot />);
    // Open it
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Eka Assistant')).toBeDefined();

    // Close it - the close button is inside the header
    // There are two buttons now (submit and close)
    // The close button has an SVG inside.
    // We can find by role button and pick the one in the header or just click the one that is not the submit button.
    // Or we can look for the close icon SVG.
    
    // Let's try to find the close button by its SVG path or just by being the second button?
    // Actually, when open, there is the close button in header and submit button in form.
    // The trigger button is hidden when open.
    
    const closeButton = screen.getAllByRole('button')[0]; // Assuming close button is first in DOM order (header)
    fireEvent.click(closeButton);
    
    // Should be closed
    expect(screen.queryByText('Eka Assistant')).toBeNull();
  });
});
