import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIChatWidget } from '@/components/ai/vercel-ai-chat-widget';
import { vercelAIService } from '@/ai/vercel-ai-service';

// Mock the AI service
jest.mock('@/ai/vercel-ai-service', () => ({
  vercelAIService: {
    generateText: jest.fn().mockResolvedValue({
      content: 'This is a test AI response',
      model: 'gpt-4-turbo',
      timestamp: new Date().toISOString(),
      userId: 'test-user-123'
    })
  }
}));

// Mock the auth hook
jest.mock('@/lib/supabase-auth', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      userType: 'patient'
    }
  })
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn()
  })
}));

describe('AIChatWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the AI chat widget', () => {
    render(<AIChatWidget />);
    
    expect(screen.getByText('AI Wellness Assistant')).toBeInTheDocument();
    expect(screen.getByText('Here to support your mental health journey')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask me anything about your wellness journey...')).toBeInTheDocument();
  });

  it('displays welcome message when no messages', () => {
    render(<AIChatWidget />);
    
    expect(screen.getByText('Hi there! I\'m your AI wellness assistant. How can I support you today?')).toBeInTheDocument();
  });

  it('shows quick prompts', () => {
    render(<AIChatWidget />);
    
    expect(screen.getByText('Quick prompts:')).toBeInTheDocument();
    expect(screen.getByText('I\'m feeling anxious today, what can I do?')).toBeInTheDocument();
  });

  it('allows user to type in the input field', async () => {
    const user = userEvent.setup();
    render(<AIChatWidget />);
    
    const input = screen.getByPlaceholderText('Ask me anything about your wellness journey...');
    await user.type(input, 'I am feeling anxious today');
    
    expect(input).toHaveValue('I am feeling anxious today');
  });

  it('submits a message and displays AI response', async () => {
    const user = userEvent.setup();
    render(<AIChatWidget />);
    
    const input = screen.getByPlaceholderText('Ask me anything about your wellness journey...');
    await user.type(input, 'I am feeling anxious today');
    
    const submitButton = screen.getByRole('button', { name: '' });
    await user.click(submitButton);
    
    // Wait for the AI response
    await waitFor(() => {
      expect(screen.getByText('I am feeling anxious today')).toBeInTheDocument();
      expect(screen.getByText('This is a test AI response')).toBeInTheDocument();
    });
    
    // Verify the AI service was called
    expect(vercelAIService.generateText).toHaveBeenCalledWith({
      prompt: 'I am feeling anxious today',
      context: expect.stringContaining('You are a supportive AI assistant for mental health and wellness'),
      userId: 'test-user-123',
      model: 'openai',
      maxTokens: 800,
      temperature: 0.7
    });
  });

  it('clears input after submitting message', async () => {
    const user = userEvent.setup();
    render(<AIChatWidget />);
    
    const input = screen.getByPlaceholderText('Ask me anything about your wellness journey...');
    await user.type(input, 'Test message');
    
    const submitButton = screen.getByRole('button', { name: '' });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('disables input and button while loading', async () => {
    const user = userEvent.setup();
    render(<AIChatWidget />);
    
    const input = screen.getByPlaceholderText('Ask me anything about your wellness journey...');
    await user.type(input, 'Test message');
    
    const submitButton = screen.getByRole('button', { name: '' });
    await user.click(submitButton);
    
    // Check that input is disabled during loading
    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('handles quick prompt clicks', async () => {
    const user = userEvent.setup();
    render(<AIChatWidget />);
    
    const quickPrompt = screen.getByText('I\'m feeling anxious today, what can I do?');
    await user.click(quickPrompt);
    
    const input = screen.getByPlaceholderText('Ask me anything about your wellness journey...');
    expect(input).toHaveValue('I\'m feeling anxious today, what can I do?');
  });

  it('handles errors gracefully', async () => {
    // Mock an error response
    (vercelAIService.generateText as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    const user = userEvent.setup();
    render(<AIChatWidget />);
    
    const input = screen.getByPlaceholderText('Ask me anything about your wellness journey...');
    await user.type(input, 'Test message');
    
    const submitButton = screen.getByRole('button', { name: '' });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('I apologize, but I\'m having trouble responding right now. Please try again in a moment.')).toBeInTheDocument();
    });
  });

  it('does not submit empty messages', async () => {
    const user = userEvent.setup();
    render(<AIChatWidget />);
    
    const submitButton = screen.getByRole('button', { name: '' });
    await user.click(submitButton);
    
    expect(vercelAIService.generateText).not.toHaveBeenCalled();
  });

  it('does not submit whitespace-only messages', async () => {
    const user = userEvent.setup();
    render(<AIChatWidget />);
    
    const input = screen.getByPlaceholderText('Ask me anything about your wellness journey...');
    await user.type(input, '   ');
    
    const submitButton = screen.getByRole('button', { name: '' });
    await user.click(submitButton);
    
    expect(vercelAIService.generateText).not.toHaveBeenCalled();
  });

  it('calls onResponse callback when provided', async () => {
    const onResponse = jest.fn();
    const user = userEvent.setup();
    
    render(<AIChatWidget onResponse={onResponse} />);
    
    const input = screen.getByPlaceholderText('Ask me anything about your wellness journey...');
    await user.type(input, 'Test message');
    
    const submitButton = screen.getByRole('button', { name: '' });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(onResponse).toHaveBeenCalledWith('This is a test AI response');
    });
  });

  it('uses custom placeholder when provided', () => {
    render(<AIChatWidget placeholder="Custom placeholder text" />);
    
    expect(screen.getByPlaceholderText('Custom placeholder text')).toBeInTheDocument();
  });

  it('uses custom context when provided', async () => {
    const user = userEvent.setup();
    const customContext = 'Custom context for testing';
    
    render(<AIChatWidget context={customContext} />);
    
    const input = screen.getByPlaceholderText('Ask me anything about your wellness journey...');
    await user.type(input, 'Test message');
    
    const submitButton = screen.getByRole('button', { name: '' });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(vercelAIService.generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.stringContaining(customContext)
        })
      );
    });
  });

  it('uses custom model when provided', async () => {
    const user = userEvent.setup();
    
    render(<AIChatWidget model="anthropic" />);
    
    const input = screen.getByPlaceholderText('Ask me anything about your wellness journey...');
    await user.type(input, 'Test message');
    
    const submitButton = screen.getByRole('button', { name: '' });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(vercelAIService.generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'anthropic'
        })
      );
    });
  });

  it('disables input when user is not available', () => {
    // Mock no user
    jest.mock('@/lib/supabase-auth', () => ({
      useUser: () => ({ user: null })
    }));
    
    render(<AIChatWidget />);
    
    const input = screen.getByPlaceholderText('Ask me anything about your wellness journey...');
    const submitButton = screen.getByRole('button', { name: '' });
    
    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});