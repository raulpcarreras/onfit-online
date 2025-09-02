import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '../index.web';

describe('Badge Component (Web)', () => {
  it('should render with correct text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('should apply default variant classes', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    
    expect(badge).toHaveClass('bg-primary');
    expect(badge).toHaveClass('text-primary-foreground');
  });

  it('should apply secondary variant classes', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badge = screen.getByText('Secondary Badge');
    
    expect(badge).toHaveClass('bg-secondary');
    expect(badge).toHaveClass('text-secondary-foreground');
  });

  it('should apply destructive variant classes', () => {
    render(<Badge variant="destructive">Error Badge</Badge>);
    const badge = screen.getByText('Error Badge');
    
    expect(badge).toHaveClass('bg-destructive');
    expect(badge).toHaveClass('text-destructive-foreground');
  });

  it('should apply outline variant classes', () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    const badge = screen.getByText('Outline Badge');
    
    expect(badge).toHaveClass('text-foreground');
    expect(badge).toHaveClass('border');
  });

  it('should pass through additional props', () => {
    render(
      <Badge data-testid="custom-badge" aria-label="Custom badge">
        Custom Badge
      </Badge>
    );
    
    const badge = screen.getByTestId('custom-badge');
    expect(badge).toHaveAttribute('aria-label', 'Custom badge');
  });

  it('should render with custom className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    const badge = screen.getByText('Custom Badge');
    
    expect(badge).toHaveClass('custom-class');
  });
});
