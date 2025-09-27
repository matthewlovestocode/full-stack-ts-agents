import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

function renderWithRouter(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  );
}

describe('App routing', () => {
  it('renders the home view on the index route', () => {
    renderWithRouter(['/']);

    expect(screen.getByRole('heading', { name: /full-stack ts agents/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('aria-current', 'page');
  });

  it('navigates to the docs view', () => {
    renderWithRouter(['/docs']);

    expect(screen.getByRole('heading', { name: /documentation hub/i })).toBeInTheDocument();
  });

  it('surfaces the not found view for unknown routes', () => {
    renderWithRouter(['/missing']);

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /return to the dashboard/i })).toHaveAttribute('href', '/');
  });
});
