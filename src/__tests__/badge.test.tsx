/**
 * @file Badge Component Tests
 * @description Tests for the Badge UI component
 */

import { render, screen } from '@testing-library/react';
import { Badge } from '../components/ui/badge';

describe('Badge Component', () => {
  it('should render badge with default variant', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
  });

  it('should render badge with text content', () => {
    const text = 'Test Badge';
    render(<Badge>{text}</Badge>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const customClass = 'custom-badge-class';
    render(<Badge className={customClass}>Badge</Badge>);
    const badge = screen.getByText('Badge');
    expect(badge).toHaveClass(customClass);
  });

  it('should render with secondary variant', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText('Secondary');
    expect(badge).toBeInTheDocument();
  });

  it('should render with destructive variant', () => {
    render(<Badge variant="destructive">Error</Badge>);
    const badge = screen.getByText('Error');
    expect(badge).toBeInTheDocument();
  });

  it('should render with outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText('Outline');
    expect(badge).toBeInTheDocument();
  });

  it('should support HTML attributes', () => {
    render(<Badge data-testid="test-badge">Badge</Badge>);
    const badge = screen.getByTestId('test-badge');
    expect(badge).toBeInTheDocument();
  });

  it('should render with children as React elements', () => {
    render(
      <Badge>
        <span>Icon</span> Text
      </Badge>
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText(/Text/)).toBeInTheDocument();
  });
});
