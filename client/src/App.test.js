import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('Renders hello world text', () => {
  render(<App />);
  const linkElement = screen.getByText(/hello world!/i);
  expect(linkElement).toBeInTheDocument();
});
