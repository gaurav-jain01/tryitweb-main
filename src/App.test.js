import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page', () => {
  render(<App />);
  const loginElement = screen.getByText(/Welcome Back/i);
  expect(loginElement).toBeInTheDocument();
});
