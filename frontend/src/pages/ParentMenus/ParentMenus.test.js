import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ParentMenus from './ParentMenus';

describe('<ParentMenus />', () => {
  test('it should mount', () => {
    render(<ParentMenus />);
    
    const parentMenus = screen.getByTestId('ParentMenus');

    expect(parentMenus).toBeInTheDocument();
  });
});