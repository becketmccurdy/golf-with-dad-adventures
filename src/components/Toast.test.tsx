import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders message correctly', () => {
    const message = 'Test message';
    render(<Toast message={message} type="success" onClose={() => {}} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('displays correct icon based on type', () => {
    const { rerender } = render(
      <Toast message="Test" type="success" onClose={() => {}} />
    );
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();

    rerender(<Toast message="Test" type="error" onClose={() => {}} />);
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();

    rerender(<Toast message="Test" type="warning" onClose={() => {}} />);
    expect(screen.getByTestId('warning-icon')).toBeInTheDocument();

    rerender(<Toast message="Test" type="info" onClose={() => {}} />);
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('calls onClose after timeout', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast message="Test" type="success" onClose={onClose} />);

    vi.advanceTimersByTime(5000);
    expect(onClose).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('applies correct background color based on type', () => {
    const { container } = render(
      <Toast message="Test" type="success" onClose={() => {}} />
    );
    expect(container.firstChild).toHaveClass('bg-green-50');
  });
});
