import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

test('Displays the number on the screen when clicking a numeric button', () => {
  const { getByText } = render(<App />);
  fireEvent.click(getByText('1'));
  expect(getByText('1')).toBeInTheDocument();
});


test('Displays the sum on the screen when clicking the sum button and then the equal button', () => {
    const { getByText } = render(<App />);
    fireEvent.click(getByText('1'));
    fireEvent.click(getByText('+'));
    fireEvent.click(getByText('2'));
    fireEvent.click(getByText('='));
    expect(getByText('3')).toBeInTheDocument();
  });

test('Clears the current number when clicking the clear button', () => {
  const { getByText } = render(<App />);
  fireEvent.click(getByText('1'));
  fireEvent.click(getByText('C'));
  expect(getByText('0')).toBeInTheDocument();
});
