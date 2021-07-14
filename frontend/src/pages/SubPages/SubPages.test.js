import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SubPages from './SubPages';

describe('<SubPages />', () => {
  test('it should mount', () => {
    render(<SubPages />);
    
    const subPages = screen.getByTestId('SubPages');

    expect(subPages).toBeInTheDocument();
  });
});