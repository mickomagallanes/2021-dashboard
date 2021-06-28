import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Menus from './Menus';

describe('<Menus />', () => {
  test('it should mount', () => {
    render(<Menus />);
    
    const menus = screen.getByTestId('Menus');

    expect(menus).toBeInTheDocument();
  });
});