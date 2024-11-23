import { render, screen } from '@testing-library/react';

import { App } from './app';

describe('App', () => {
  it('renders hello world heading', () => {
    render(<App />);

    const heading = screen.getByRole('heading', {
      name: /hello world!/i,
      level: 1,
    });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-3xl font-bold underline');
  });
});
