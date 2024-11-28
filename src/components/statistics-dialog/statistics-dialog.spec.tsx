import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ReactNode } from 'react';

import { StatisticsProvider } from '@/contexts/statistics';

import { StatisticsDialog } from './statistics-dialog';

function wrapper({ children }: { children: ReactNode }) {
  return <StatisticsProvider>{children}</StatisticsProvider>;
}

describe('StatisticsDialog', () => {
  it('renders statistics trigger button', () => {
    render(<StatisticsDialog />, { wrapper });
    expect(screen.getByText('Stats')).toBeInTheDocument();
  });

  it('shows dialog with statistics when clicked', async () => {
    render(<StatisticsDialog />, { wrapper });

    await userEvent.click(screen.getByText('Stats'));

    // Check if statistics sections are rendered
    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByTestId('Played')).toBeInTheDocument();
    expect(screen.getByTestId('Win %')).toBeInTheDocument();
    expect(screen.getByTestId('Current streak')).toBeInTheDocument();
    expect(screen.getByTestId('Best streak')).toBeInTheDocument();
    expect(screen.getByText('Guess Distribution')).toBeInTheDocument();
  });

  it.todo('displays correct statistics values');
  it.todo('shows guess distribution bars');
});
