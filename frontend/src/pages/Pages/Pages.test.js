import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Pages from './Pages';

describe('<Pages />', () => {
  test('it should mount', () => {
    render(<Pages />);
    
    const pages = screen.getByTestId('Pages');

    expect(pages).toBeInTheDocument();
  });
});