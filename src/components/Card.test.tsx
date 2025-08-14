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
    const cardElement = screen.getByText('Test content').closest('div[class*="bg-white"]');
    expect(cardElement).toHaveClass('custom-class');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick}>
        <div>Test content</div>
      </Card>
    );
    
    const cardElement = screen.getByText('Test content').closest('div[class*="bg-white"]');
    fireEvent.click(cardElement!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('adds cursor-pointer class when onClick is provided', () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick}>
        <div>Test content</div>
      </Card>
    );
    
    const cardElement = screen.getByText('Test content').closest('div[class*="bg-white"]');
    expect(cardElement).toHaveClass('cursor-pointer');
  });

  it('does not add cursor-pointer class when onClick is not provided', () => {
    render(
      <Card>
        <div>Test content</div>
      </Card>
    );
    
    const cardElement = screen.getByText('Test content').closest('div[class*="bg-white"]');
    expect(cardElement).not.toHaveClass('cursor-pointer');
  });
});
