import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Employees from './Employees';

describe('<Employees />', () => {
  test('it should mount', () => {
    render(<Employees />);
    
    const employees = screen.getByTestId('Employees');

    expect(employees).toBeInTheDocument();
  });
});