import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Alert } from './alert';

describe('Alert', () => {
  it('renders children content', () => {
    render(<Alert>Test message</Alert>);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('applies error variant styling by default', () => {
    render(<Alert>Error message</Alert>);
    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('bg-red-500', 'text-white');
  });

  it('applies custom className', () => {
    render(<Alert className="absolute">Custom styled alert</Alert>);
    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('absolute');
  });

  it('forwards additional HTML attributes', () => {
    render(
      <Alert data-custom="test" aria-label="Alert message">
        HTML attributes test
      </Alert>,
    );
    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('data-custom', 'test');
    expect(alert).toHaveAttribute('aria-label', 'Alert message');
  });
});
