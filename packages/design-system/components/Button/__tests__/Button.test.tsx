import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../index.web';

describe('Button Component (Web)', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle onPress correctly', () => {
    const mockOnPress = jest.fn();
    render(<Button onPress={mockOnPress}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should apply correct variant classes for destructive', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    
    // Verificar que tiene las clases de destructive
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-white'); // destructive usa text-white, no text-destructive-foreground
  });

  it('should apply correct size classes for small', () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByText('Small Button');
    
    // Verificar que tiene las clases de size small
    expect(button).toHaveClass('h-8'); // sm usa h-8, no h-9
    expect(button).toHaveClass('px-3');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    
    expect(button).toBeDisabled();
  });

  it('should handle loading state correctly', () => {
    render(<Button disabled>Loading Button</Button>);
    
    // Button should be disabled
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should pass through additional props', () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom button">
        Custom Button
      </Button>
    );
    
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom button');
  });

  it('should apply extra variant classes correctly', () => {
    render(<Button variant="success">Success Button</Button>);
    const button = screen.getByText('Success Button');
    
    // Verificar que tiene las clases de success
    expect(button).toHaveClass('bg-[hsl(var(--success))]');
    expect(button).toHaveClass('text-[hsl(var(--success-foreground))]');
  });

  it('should apply extra size classes correctly', () => {
    render(<Button size="xl">XL Button</Button>);
    const button = screen.getByText('XL Button');
    
    // Verificar que tiene las clases de size xl
    expect(button).toHaveClass('h-10'); // xl mapea a lg que usa h-10
    expect(button).toHaveClass('px-6');
  });
});
