import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Sidebar from './Sidebar';

describe('<Sidebar />', () => {
  test('it should mount', () => {
    render(<Sidebar />);
    
    const sidebar = screen.getByTestId('Sidebar');

    expect(sidebar).toBeInTheDocument();
  });
});