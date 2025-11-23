/**
 * @file Input Component Tests
 * @description Tests for the Input UI component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../components/ui/input';

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('should accept and display user input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    
    await user.type(input, 'Hello World');
    expect(input.value).toBe('Hello World');
  });

  it('should apply custom className', () => {
    const customClass = 'custom-input-class';
    render(<Input className={customClass} placeholder="Test" />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass(customClass);
  });

  it('should support different input types', () => {
    const { rerender } = render(<Input type="text" data-testid="input" />);
    let input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'text');

    rerender(<Input type="password" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type="email" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByPlaceholderText('Disabled');
    expect(input).toBeDisabled();
  });

  it('should support placeholder text', () => {
    const placeholder = 'Enter your name';
    render(<Input placeholder={placeholder} />);
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('should support default value', () => {
    render(<Input defaultValue="Default Text" data-testid="input" />);
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input.value).toBe('Default Text');
  });

  it('should support controlled input', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = React.useState('');
      return (
        <Input 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Controlled"
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByPlaceholderText('Controlled') as HTMLInputElement;
    
    await user.type(input, 'Test');
    expect(input.value).toBe('Test');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
