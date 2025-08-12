import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Test content</div>
      </Card>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        <div>Test content</div>
      </Card>
    );
    expect(screen.getByText('Test content').parentElement).toHaveClass('custom-class');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick}>
        <div>Test content</div>
      </Card>
    );
    
    fireEvent.click(screen.getByText('Test content'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('adds cursor-pointer class when onClick is provided', () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick}>
        <div>Test content</div>
      </Card>
    );
    
    expect(screen.getByText('Test content').parentElement).toHaveClass('cursor-pointer');
  });

  it('does not add cursor-pointer class when onClick is not provided', () => {
    render(
      <Card>
        <div>Test content</div>
      </Card>
    );
    
    expect(screen.getByText('Test content').parentElement).not.toHaveClass('cursor-pointer');
  });
});
