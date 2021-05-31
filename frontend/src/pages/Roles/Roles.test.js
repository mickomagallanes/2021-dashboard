import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Roles from './Roles';

describe('<Roles />', () => {
  test('it should mount', () => {
    render(<Roles />);
    
    const roles = screen.getByTestId('Roles');

    expect(roles).toBeInTheDocument();
  });
});