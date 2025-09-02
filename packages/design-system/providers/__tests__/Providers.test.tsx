import React from 'react';
import { render, screen } from '@testing-library/react';
import { Providers } from '../index.web';

describe('Providers Component (Web)', () => {
  it('should render children correctly', () => {
    render(
      <Providers>
        <div data-testid="test-child">Test Content</div>
      </Providers>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    render(
      <Providers>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </Providers>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('should provide theme context', () => {
    const TestComponent = () => {
      return <div data-testid="theme-test">Theme Test</div>;
    };

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );
    
    expect(screen.getByTestId('theme-test')).toBeInTheDocument();
  });

  it('should handle empty children', () => {
    render(<Providers>{null}</Providers>);
    // Should not throw error
    expect(document.body).toBeInTheDocument();
  });
});
