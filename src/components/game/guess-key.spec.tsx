import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GuessKey } from './guess-key';

describe('GuessKey', () => {
  it('renders with the provided value and no data-state when state is null', () => {
    const key = render(<GuessKey value="A" state={null} active={false} />).getByText('A');
    expect(key).toBeInTheDocument();
    expect(key).not.toHaveAttribute('data-state');
  });

  it('applies default styling when inactive and no state', () => {
    const key = render(<GuessKey value="B" state={null} active={false} />).getByText('B');
    expect(key).toHaveClass('bg-white/25');
  });

  it('applies active styling when active is true', () => {
    const key = render(<GuessKey value="C" state={null} active={true} />).getByText('C');
    expect(key).toHaveClass('bg-white', 'text-blue-700');
  });

  describe('state styling and data attributes', () => {
    it('applies absent state styling and data-state attribute', () => {
      const key = render(<GuessKey value="D" state="absent" active={false} />).getByText('D');
      expect(key).toHaveClass('bg-gray-500');
      expect(key).toHaveAttribute('data-state', 'absent');
    });

    it('applies present state styling and data-state attribute', () => {
      const key = render(<GuessKey value="E" state="present" active={false} />).getByText('E');
      expect(key).toHaveClass('bg-yellow-500');
      expect(key).toHaveAttribute('data-state', 'present');
    });

    it('applies correct state styling and data-state attribute', () => {
      const key = render(<GuessKey value="F" state="correct" active={false} />).getByText('F');
      expect(key).toHaveClass('bg-green-500');
      expect(key).toHaveAttribute('data-state', 'correct');
    });
  });

  it('applies custom className when provided', () => {
    const key = render(
      <GuessKey value="G" state={null} active={false} className="text-purple-500" />,
    ).getByText('G');
    expect(key).toHaveClass('text-purple-500');
  });
});
