import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('increments the counter when clicked', () => {
    render(<App />);

    const button = screen.getByRole('button', { name: /count is 0/i });
    fireEvent.click(button);

    expect(button).toHaveTextContent('count is 1');
  });
});
