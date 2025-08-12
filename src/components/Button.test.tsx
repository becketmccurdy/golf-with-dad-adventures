import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Click me')).not.toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toHaveClass('bg-emerald-500');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-stone-200');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toHaveClass('bg-white');
  });

  it('applies fullWidth class when specified', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByText('Full Width')).toHaveClass('w-full');
  });

  it('is disabled when loading', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
