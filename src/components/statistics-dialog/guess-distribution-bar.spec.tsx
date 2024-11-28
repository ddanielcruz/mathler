import { render, screen } from '@testing-library/react';

import { GuessDistributionBar } from './guess-distribution-bar';

describe('GuessDistributionBar', () => {
  it('renders count number', () => {
    render(<GuessDistributionBar count={5} isMax={false} total={10} />);
    expect(screen.getAllByText('5')).toHaveLength(2); // One in label, one in bar
  });

  it('uses green background when isMax is true', () => {
    render(<GuessDistributionBar count={5} isMax={true} total={10} />);
    const bar = screen.getAllByText('5')[1]; // Get the bar element
    expect(bar).toHaveClass('bg-green-500');
  });

  it('uses gray background when isMax is false', () => {
    render(<GuessDistributionBar count={5} isMax={false} total={10} />);
    const bar = screen.getAllByText('5')[1]; // Get the bar element
    expect(bar).toHaveClass('bg-gray-500');
  });

  it('calculates correct width percentage', () => {
    render(<GuessDistributionBar count={5} isMax={false} total={10} />);
    const bar = screen.getAllByText('5')[1]; // Get the bar element
    expect(bar).toHaveStyle({ width: '50%' }); // 5/10 * 100 = 50%
  });

  it('uses minimum width when count is 0', () => {
    render(<GuessDistributionBar count={0} isMax={false} total={10} />);
    const bar = screen.getAllByText('0')[1]; // Get the bar element
    expect(bar).toHaveStyle({ width: '8%' }); // Minimum width
  });
});
